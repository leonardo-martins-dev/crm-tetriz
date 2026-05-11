import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function jidToPhone(remoteJid: string): string | null {
  if (!remoteJid || remoteJid.endsWith('@g.us')) return null
  const base = remoteJid.split('@')[0] || ''
  const digits = base.replace(/\D/g, '')
  return digits.length ? digits : null
}

function textFromEvolutionLastMessage(lastMessage: Record<string, unknown>): string {
  const msg = lastMessage.message as Record<string, unknown> | undefined
  if (!msg || typeof msg !== 'object') return ''
  if (typeof msg.conversation === 'string') return msg.conversation
  const et = msg.extendedTextMessage as Record<string, unknown> | undefined
  if (et && typeof et.text === 'string') return et.text
  const mt = String(lastMessage.messageType || '')
  if (mt === 'imageMessage') return '[Imagem]'
  if (mt === 'audioMessage') return '[Áudio]'
  if (mt === 'videoMessage') return '[Vídeo]'
  if (mt === 'documentMessage') return '[Documento]'
  if (mt === 'stickerMessage') return '[Figurinha]'
  return '[Mensagem]'
}

/**
 * Importa chats da Evolution (WhatsApp) para leads + última mensagem no Supabase.
 * Necessário porque a inbox só lista conversas derivadas de leads gravados no CRM.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { tenantId?: string; instanceName?: string }
    const { tenantId, instanceName } = body
    if (!tenantId || !instanceName) {
      return NextResponse.json({ error: 'tenantId e instanceName são obrigatórios' }, { status: 400 })
    }

    const EVOLUTION_API_URL = (process.env.EVOLUTION_API_URL || 'http://localhost:8080').replace(/\/$/, '')
    const GLOBAL_API_KEY = process.env.EVOLUTION_API_KEY || ''
    if (!GLOBAL_API_KEY) {
      return NextResponse.json({ error: 'EVOLUTION_API_KEY não configurada' }, { status: 500 })
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
    }

    const url = `${EVOLUTION_API_URL}/chat/findChats/${encodeURIComponent(instanceName)}`
    const evRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: GLOBAL_API_KEY,
      },
      body: JSON.stringify({}),
    })

    if (!evRes.ok) {
      const detail = await evRes.text()
      return NextResponse.json(
        { error: 'Evolution findChats falhou', status: evRes.status, detail: detail.slice(0, 800) },
        { status: 502 }
      )
    }

    const chats = (await evRes.json()) as Record<string, unknown>[]
    if (!Array.isArray(chats)) {
      return NextResponse.json({ error: 'Resposta inválida da Evolution (esperado array)' }, { status: 502 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let leadsCreated = 0
    let leadsUpdated = 0
    let messagesInserted = 0
    let skipped = 0

    for (const chat of chats) {
      const phone = jidToPhone(String(chat.remoteJid || ''))
      if (!phone) {
        skipped++
        continue
      }

      const name =
        (typeof chat.pushName === 'string' && chat.pushName.trim()) ? chat.pushName.trim() : phone

      const windowActive = Boolean(chat.windowActive)
      const windowExpires =
        typeof chat.windowExpires === 'string' ? chat.windowExpires : null

      const lastContactAt =
        typeof chat.updatedAt === 'string' ? chat.updatedAt : new Date().toISOString()

      const { data: existing } = await supabase
        .from('leads')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('phone', phone)
        .maybeSingle()

      let leadId: string

      if (existing?.id) {
        leadId = existing.id
        const { error: upErr } = await supabase
          .from('leads')
          .update({
            name,
            window_24h_open: windowActive,
            window_24h_expires_at: windowExpires,
            last_contact_at: lastContactAt,
            updated_at: new Date().toISOString(),
          })
          .eq('id', leadId)
        if (upErr) {
          console.warn('[sync-chats] update lead', phone, upErr)
          skipped++
          continue
        }
        leadsUpdated++
      } else {
        const { data: created, error: insErr } = await supabase
          .from('leads')
          .insert({
            tenant_id: tenantId,
            name,
            phone,
            channel: 'whatsapp',
            status: 'new',
            pipeline_stage: 'Novo Lead',
            tags: [],
            notes: [],
            score: 0,
            priority: 'medium',
            window_24h_open: windowActive,
            window_24h_expires_at: windowExpires,
            last_contact_at: lastContactAt,
          })
          .select('id')
          .single()

        if (insErr || !created?.id) {
          console.warn('[sync-chats] insert lead', phone, insErr)
          skipped++
          continue
        }
        leadId = created.id
        leadsCreated++
      }

      let { data: conv } = await supabase
        .from('conversations')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('lead_id', leadId)
        .maybeSingle()

      if (!conv?.id) {
        const { data: newConv, error: convErr } = await supabase
          .from('conversations')
          .insert({
            tenant_id: tenantId,
            lead_id: leadId,
            unread_count: 0,
            last_message_at: lastContactAt,
          })
          .select('id')
          .single()
        if (convErr || !newConv?.id) {
          console.warn('[sync-chats] conversation', leadId, convErr)
          continue
        }
        conv = newConv
      } else {
        await supabase
          .from('conversations')
          .update({ last_message_at: lastContactAt })
          .eq('id', conv.id)
      }

      const lastMessage = chat.lastMessage as Record<string, unknown> | undefined
      const key = lastMessage?.key as Record<string, unknown> | undefined
      const wamid = key?.id != null ? String(key.id) : ''
      if (!conv?.id || !wamid) continue

      const { data: dup } = await supabase
        .from('messages')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('wamid', wamid)
        .maybeSingle()

      if (dup) continue

      const content = textFromEvolutionLastMessage(lastMessage || {})
      const fromMe = Boolean(key?.fromMe)
      const ts = lastMessage.messageTimestamp
      let createdAt = lastContactAt
      if (typeof ts === 'number') {
        createdAt = new Date(ts < 1e12 ? ts * 1000 : ts).toISOString()
      }

      const { error: msgErr } = await supabase.from('messages').insert({
        tenant_id: tenantId,
        conversation_id: conv.id,
        lead_id: leadId,
        content: content || '[Mensagem]',
        sender_id: fromMe ? 'agent' : phone,
        sender_name: fromMe ? 'Atendente' : name,
        sender_type: fromMe ? 'user' : 'lead',
        channel: 'whatsapp',
        read: fromMe,
        wamid,
        status: 'delivered',
        created_at: createdAt,
      })

      if (msgErr) {
        console.warn('[sync-chats] message', wamid, msgErr)
        continue
      }
      messagesInserted++

      await supabase
        .from('conversations')
        .update({ last_message_at: createdAt })
        .eq('id', conv.id)
    }

    return NextResponse.json({
      ok: true,
      chatsFromEvolution: chats.length,
      leadsCreated,
      leadsUpdated,
      messagesInserted,
      skipped,
    })
  } catch (e) {
    console.error('[sync-chats]', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
