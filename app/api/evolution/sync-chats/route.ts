import { NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

/** Últimas N conversas com atividade no período. */
const SYNC_RECENT_CHATS = 20
/** Histórico de mensagens importado (dias). */
const SYNC_MESSAGE_DAYS = 3
const MESSAGE_PAGE_SIZE = 500
const MAX_MESSAGE_PAGES = 10

function isSupabaseAuthError(err: { message?: string } | null): boolean {
  const m = err?.message || ''
  return m.includes('Invalid API key') || m.includes('JWT') || m.includes('invalid claim')
}

function jidToPhone(remoteJid: string): string | null {
  if (!remoteJid || remoteJid.endsWith('@g.us')) return null
  const base = remoteJid.split('@')[0] || ''
  const digits = base.replace(/\D/g, '')
  return digits.length ? digits : null
}

function textFromEvolutionMessage(msgRow: Record<string, unknown>): string {
  const msg = msgRow.message as Record<string, unknown> | undefined
  if (!msg || typeof msg !== 'object') return ''
  if (typeof msg.conversation === 'string') return msg.conversation
  const et = msg.extendedTextMessage as Record<string, unknown> | undefined
  if (et && typeof et.text === 'string') return et.text
  const mt = String(msgRow.messageType || '')
  if (mt === 'imageMessage') return '[Imagem]'
  if (mt === 'audioMessage') return '[Áudio]'
  if (mt === 'videoMessage') return '[Vídeo]'
  if (mt === 'documentMessage') return '[Documento]'
  if (mt === 'stickerMessage') return '[Figurinha]'
  return '[Mensagem]'
}

function syncRangeIso(): { gte: string; lte: string } {
  const lte = new Date()
  const gte = new Date(lte.getTime() - SYNC_MESSAGE_DAYS * 24 * 60 * 60 * 1000)
  return { gte: gte.toISOString(), lte: lte.toISOString() }
}

async function evolutionFetchMessages(
  apiBase: string,
  apikey: string,
  instanceName: string,
  remoteJid: string,
  gteIso: string,
  lteIso: string
): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = []
  let page = 1
  for (;;) {
    const res = await fetch(`${apiBase}/chat/findMessages/${encodeURIComponent(instanceName)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey,
      },
      body: JSON.stringify({
        where: {
          key: { remoteJid },
          messageTimestamp: { gte: gteIso, lte: lteIso },
        },
        offset: MESSAGE_PAGE_SIZE,
        page,
      }),
    })
    if (!res.ok) {
      console.warn('[sync-chats] findMessages', remoteJid, res.status, (await res.text()).slice(0, 200))
      break
    }
    const data = (await res.json()) as {
      messages?: { records?: Record<string, unknown>[]; total?: number }
    }
    const records = data.messages?.records ?? []
    all.push(...records)
    const total = data.messages?.total ?? 0
    if (records.length === 0 || all.length >= total) break
    page++
    if (page > MAX_MESSAGE_PAGES) break
  }
  return all.sort((a, b) => {
    const ta = Number(a.messageTimestamp) || 0
    const tb = Number(b.messageTimestamp) || 0
    return ta - tb
  })
}

async function insertOneEvolutionMessage(
  supabase: SupabaseClient,
  args: {
    tenantId: string
    conversationId: string
    leadId: string
    phone: string
    contactName: string
    record: Record<string, unknown>
  }
): Promise<{ ok: boolean; createdAt: string | null }> {
  const key = args.record.key as Record<string, unknown> | undefined
  const wamid = key?.id != null ? String(key.id) : ''
  if (!wamid) return { ok: false, createdAt: null }

  const { data: dup } = await supabase
    .from('messages')
    .select('id')
    .eq('tenant_id', args.tenantId)
    .eq('wamid', wamid)
    .maybeSingle()

  if (dup) return { ok: false, createdAt: null }

  const fromMe = Boolean(key?.fromMe)
  const pushName =
    typeof args.record.pushName === 'string' && args.record.pushName.trim()
      ? args.record.pushName.trim()
      : ''
  const senderName = fromMe ? 'Atendente' : pushName || args.contactName

  const ts = args.record.messageTimestamp
  let createdAt = new Date().toISOString()
  if (typeof ts === 'number') {
    createdAt = new Date(ts < 1e12 ? ts * 1000 : ts).toISOString()
  }

  const content = textFromEvolutionMessage(args.record) || '[Mensagem]'

  const { error: msgErr } = await supabase.from('messages').insert({
    tenant_id: args.tenantId,
    conversation_id: args.conversationId,
    lead_id: args.leadId,
    content,
    sender_id: fromMe ? 'agent' : args.phone,
    sender_name: senderName,
    sender_type: fromMe ? 'user' : 'lead',
    channel: 'whatsapp',
    read: fromMe,
    wamid,
    status: 'delivered',
    created_at: createdAt,
  })

  if (msgErr) {
    console.warn('[sync-chats] message', wamid, msgErr)
    return { ok: false, createdAt: null }
  }
  return { ok: true, createdAt }
}

/**
 * Importa chats recentes da Evolution → leads + mensagens (últimos SYNC_MESSAGE_DAYS dias).
 * Inbox só lista o que está no Supabase.
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

    const { gte, lte } = syncRangeIso()

    const findChatsUrl = `${EVOLUTION_API_URL}/chat/findChats/${encodeURIComponent(instanceName)}`
    const evRes = await fetch(findChatsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: GLOBAL_API_KEY,
      },
      body: JSON.stringify({
        where: {
          messageTimestamp: { gte, lte },
        },
        take: SYNC_RECENT_CHATS,
      }),
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
      const remoteJidFull = String(chat.remoteJid || '')
      const phone = jidToPhone(remoteJidFull)
      if (!phone) {
        skipped++
        continue
      }

      const name =
        typeof chat.pushName === 'string' && chat.pushName.trim() ? chat.pushName.trim() : phone

      const avatarUrl =
        typeof chat.profilePicUrl === 'string' && chat.profilePicUrl.startsWith('http')
          ? chat.profilePicUrl
          : undefined

      const windowActive = Boolean(chat.windowActive)
      const windowExpires = typeof chat.windowExpires === 'string' ? chat.windowExpires : null

      const lastContactAt =
        typeof chat.updatedAt === 'string' ? chat.updatedAt : new Date().toISOString()

      const { data: existing } = await supabase
        .from('leads')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('phone', phone)
        .maybeSingle()

      let leadId: string

      const leadUpdateBase = {
        name,
        window_24h_open: windowActive,
        window_24h_expires_at: windowExpires,
        last_contact_at: lastContactAt,
        updated_at: new Date().toISOString(),
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      }

      const leadInsertBase = {
        tenant_id: tenantId,
        name,
        phone,
        channel: 'whatsapp',
        status: 'new',
        pipeline_stage: 'Novo Lead',
        score: 0,
        priority: 'medium',
        window_24h_open: windowActive,
        window_24h_expires_at: windowExpires,
        last_contact_at: lastContactAt,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      }

      if (existing?.id) {
        leadId = existing.id
        const { error: upErr } = await supabase.from('leads').update(leadUpdateBase).eq('id', leadId)
        if (upErr) {
          console.warn('[sync-chats] update lead', phone, upErr)
          if (isSupabaseAuthError(upErr)) {
            return NextResponse.json(
              {
                error:
                  'Supabase recusou a chave (service_role). Confira SUPABASE_SERVICE_ROLE_KEY no .env do servidor, copie de Project Settings → API no dashboard, e reinicie o PM2 (crm-frontend).',
                hint: upErr.message,
              },
              { status: 500 }
            )
          }
          skipped++
          continue
        }
        leadsUpdated++
      } else {
        const { data: created, error: insErr } = await supabase
          .from('leads')
          .insert(leadInsertBase)
          .select('id')
          .single()

        if (insErr || !created?.id) {
          console.warn('[sync-chats] insert lead', phone, insErr)
          if (isSupabaseAuthError(insErr)) {
            return NextResponse.json(
              {
                error:
                  'Supabase recusou a chave (service_role). Confira SUPABASE_SERVICE_ROLE_KEY no .env do servidor, copie de Project Settings → API no dashboard, e reinicie o PM2 (crm-frontend).',
                hint: insErr?.message,
              },
              { status: 500 }
            )
          }
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
      }

      if (!conv?.id) continue

      const evMessages = await evolutionFetchMessages(
        EVOLUTION_API_URL,
        GLOBAL_API_KEY,
        instanceName,
        remoteJidFull,
        gte,
        lte
      )

      let latestAt: string | null = null
      for (const record of evMessages) {
        const { ok, createdAt } = await insertOneEvolutionMessage(supabase, {
          tenantId,
          conversationId: conv.id,
          leadId,
          phone,
          contactName: name,
          record,
        })
        if (ok) {
          messagesInserted++
          if (createdAt) latestAt = createdAt
        }
      }

      const lastAt = latestAt || lastContactAt
      await supabase.from('conversations').update({ last_message_at: lastAt }).eq('id', conv.id)
    }

    return NextResponse.json({
      ok: true,
      chatsFromEvolution: chats.length,
      chatLimit: SYNC_RECENT_CHATS,
      messageDays: SYNC_MESSAGE_DAYS,
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
