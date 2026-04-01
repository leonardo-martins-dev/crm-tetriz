import { NextResponse } from 'next/server'
import { handleIncomingMessage } from '@/backend/application/use-cases/whatsapp/handle-incoming-message'
import { handleMessageStatusUpdate } from '@/backend/application/use-cases/whatsapp/handle-message-status-update'
import { createContainer } from '@/backend/infrastructure/container'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Webhook Evolution Evento:', body.event)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const container = createContainer(supabase)

    // 1. Evento de Nova Mensagem
    if (body.event === 'messages.upsert') {
      const { instance, data } = body
      
      // Ignorar mensagens enviadas por nos mesmos
      if (data.key?.fromMe) {
        return NextResponse.json({ success: true, reason: 'from_me' })
      }

      // Tratar numero
      let from = data.key?.remoteJid || ''
      if (from.includes('@')) {
        from = from.split('@')[0]
      }

      const msgData = data.message || {}
      
      // Extrair texto (pode estar em varios lugares)
      const text = msgData.conversation || 
                   msgData.extendedTextMessage?.text || 
                   msgData.imageMessage?.caption || 
                   msgData.videoMessage?.caption || 
                   msgData.documentMessage?.caption || 
                   ''

      // Extrair mídia se existir
      let media: any = undefined
      if (msgData.imageMessage) {
        media = { type: 'image', url: msgData.imageMessage.url, mimetype: msgData.imageMessage.mimetype, base64: msgData.base64 }
      } else if (msgData.audioMessage) {
        media = { type: 'audio', url: msgData.audioMessage.url, mimetype: msgData.audioMessage.mimetype, base64: msgData.base64 }
      } else if (msgData.videoMessage) {
        media = { type: 'video', url: msgData.videoMessage.url, mimetype: msgData.videoMessage.mimetype, base64: msgData.base64 }
      } else if (msgData.documentMessage) {
        media = { 
          type: 'document', 
          url: msgData.documentMessage.url, 
          mimetype: msgData.documentMessage.mimetype, 
          base64: msgData.base64,
          fileName: msgData.documentMessage.fileName || msgData.documentMessage.title
        }
      }

      const payload = {
        instanceName: instance, 
        from,
        messageId: data.key?.id || '',
        text,
        timestamp: String(data.messageTimestamp || Date.now()),
        senderName: data.pushName || from,
        media
      }

      try {
        await handleIncomingMessage(payload, container)
        return NextResponse.json({ success: true })
      } catch (err) {
        console.error('Erro ao processar mensagem Evolution:', err)
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
      }
    }

    // 2. Evento de Atualização de Mensagem (Status)
    if (body.event === 'messages.update') {
      const { instance, data } = body
      
      // Sincronizar status (entregue, lida, etc)
      // data.update pode conter status: 2 (enviado), 3 (entregue), 4 (lido)
      if (data.key?.id && data.update?.status) {
        try {
          // Precisamos do tenantId. Vamos buscar pela conexao vinculada a instancia.
          const connection = await container.connectionRepo.findByInstanceName(instance)
          if (connection) {
            await handleMessageStatusUpdate(connection.tenantId, {
              wamid: data.key.id,
              status: data.update.status
            }, container)
          }
        } catch (err) {
          console.error('Erro ao atualizar status Evolution:', err)
        }
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
