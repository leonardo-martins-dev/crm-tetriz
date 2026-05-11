import { NextResponse } from 'next/server'
import { handleIncomingMessage } from '@/backend/application/use-cases/whatsapp/handle-incoming-message'
import { handleMessageStatusUpdate } from '@/backend/application/use-cases/whatsapp/handle-message-status-update'
import { createContainer } from '@/backend/infrastructure/container'
import { createClient } from '@supabase/supabase-js'
import {
  isEvolutionMessagesUpdate,
  isEvolutionMessagesUpsert,
  resolveWebhookInstanceKey,
  splitEvolutionMessagesUpsert,
} from '@/lib/evolution/normalize-webhook'
import { evolutionGetBase64FromMediaMessage } from '@/lib/evolution/fetch-media-from-evolution'

function extractLegacyUpsertPayload(body: Record<string, unknown>) {
  const instanceName = resolveWebhookInstanceKey(body)
  const data = body.data as Record<string, unknown> | undefined
  if (!instanceName || !data || typeof data !== 'object') return null
  return { instanceName, data }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>
    const rawEvent = body.event
    console.log('[Evolution webhook] event=', rawEvent)

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const container = createContainer(supabase)

    // ─── Nova mensagem (vários formatos de nome + payload único ou em lote) ───
    if (isEvolutionMessagesUpsert(rawEvent)) {
      let chunks = splitEvolutionMessagesUpsert(body)
      if (chunks.length === 0) {
        const legacy = extractLegacyUpsertPayload(body)
        if (legacy) chunks = [{ instanceName: legacy.instanceName, data: legacy.data }]
      }

      if (chunks.length === 0) {
        console.warn('[Evolution webhook] MESSAGES_UPSERT sem dados reconhecíveis', JSON.stringify(body).slice(0, 500))
        return NextResponse.json({ success: false, reason: 'upsert_no_payload' }, { status: 400 })
      }

      const results: string[] = []
      for (const { instanceName, data } of chunks) {
        const key = data.key as Record<string, unknown> | undefined
        if (key?.fromMe) {
          results.push('from_me')
          continue
        }

        let from = String(key?.remoteJid ?? '')
        if (from.endsWith('@g.us')) {
          results.push('group_skipped')
          continue
        }
        if (from.includes('@')) {
          from = from.split('@')[0] || ''
        }

        const msgData = (data.message || {}) as Record<string, unknown>

        const text =
          String(msgData.conversation ?? '') ||
          String((msgData.extendedTextMessage as Record<string, unknown> | undefined)?.text ?? '') ||
          String((msgData.imageMessage as Record<string, unknown> | undefined)?.caption ?? '') ||
          String((msgData.videoMessage as Record<string, unknown> | undefined)?.caption ?? '') ||
          String((msgData.documentMessage as Record<string, unknown> | undefined)?.caption ?? '') ||
          ''

        let media: any = undefined
        if (msgData.imageMessage) {
          const im = msgData.imageMessage as Record<string, unknown>
          media = {
            type: 'image',
            url: im.url,
            mimetype: im.mimetype,
            base64: msgData.base64,
          }
        } else if (msgData.audioMessage) {
          const am = msgData.audioMessage as Record<string, unknown>
          let audioB64 =
            typeof msgData.base64 === 'string' && msgData.base64.length > 0
              ? msgData.base64
              : undefined
          let audioMime = String(am.mimetype || 'audio/ogg')
          if (!audioB64) {
            const webPayload = data as Record<string, unknown>
            const fetched = await evolutionGetBase64FromMediaMessage(instanceName, webPayload)
            if (fetched) {
              audioB64 = fetched.base64
              audioMime = fetched.mimetype
            }
          }
          media = {
            type: 'audio',
            url: am.url,
            mimetype: audioMime,
            base64: audioB64,
          }
        } else if (msgData.videoMessage) {
          const vm = msgData.videoMessage as Record<string, unknown>
          media = {
            type: 'video',
            url: vm.url,
            mimetype: vm.mimetype,
            base64: msgData.base64,
          }
        } else if (msgData.documentMessage) {
          const dm = msgData.documentMessage as Record<string, unknown>
          media = {
            type: 'document',
            url: dm.url,
            mimetype: dm.mimetype,
            base64: msgData.base64,
            fileName: dm.fileName || dm.title,
          }
        }

        const payload = {
          instanceName,
          from,
          messageId: String(key?.id ?? ''),
          text,
          timestamp: String(data.messageTimestamp ?? Date.now()),
          senderName: String(data.pushName ?? from),
          media,
        }

        try {
          await handleIncomingMessage(payload, container)
          results.push('ok')
        } catch (err) {
          console.error('[Evolution webhook] Erro ao processar mensagem:', err)
          results.push(`err:${String(err)}`)
        }
      }

      const failed = results.some((r) => r.startsWith('err:'))
      return NextResponse.json({ success: !failed, results })
    }

    // ─── Atualização de status ───
    if (isEvolutionMessagesUpdate(rawEvent)) {
      const instance = resolveWebhookInstanceKey(body)
      const data = body.data as Record<string, unknown> | undefined
      const key = data?.key as Record<string, unknown> | undefined
      const update = data?.update as Record<string, unknown> | undefined

      if (instance && key?.id && update?.status != null) {
        try {
          let connection = await container.connectionRepo.findByInstanceName(instance)
          if (!connection) {
            connection = await container.connectionRepo.findByInstanceId(instance)
          }
          if (connection) {
            await handleMessageStatusUpdate(
              connection.tenantId,
              {
                wamid: String(key.id),
                status: update.status as any,
              },
              container
            )
          }
        } catch (err) {
          console.error('[Evolution webhook] Erro ao atualizar status:', err)
        }
      }
      return NextResponse.json({ success: true })
    }

    console.warn('[Evolution webhook] Evento não tratado:', rawEvent)
    return NextResponse.json({ success: true, ignored: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
