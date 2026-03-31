import { NextResponse } from 'next/server'
import { handleIncomingMessage } from '@/backend/application/use-cases/whatsapp/handle-incoming-message'
import { createContainer } from '@/backend/infrastructure/container'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Webhook da Evolution API v2 (Baileys)
    if (body.event === 'messages.upsert') {
      const { instance, data } = body
      
      // Ignorar mensagens enviadas por nos mesmos
      if (data.key?.fromMe) {
        return NextResponse.json({ success: true, reason: 'from_me' })
      }

      // Tratar numero (ex: 5511999999999@s.whatsapp.net -> 5511999999999)
      let from = data.key?.remoteJid || ''
      if (from.includes('@')) {
        from = from.split('@')[0]
      }

      // Obter texto da mensagem
      const msgData = data.message || {}
      const text = msgData.conversation || msgData.extendedTextMessage?.text || ''

      if (!text) {
         // Nao eh msg de texto
         return NextResponse.json({ success: true, reason: 'not_text_message' })
      }

      const payload = {
        phoneNumberId: '', // vazio pois para Evolution usaremos instanceName
        instanceName: instance, 
        from,
        messageId: data.key?.id || '',
        text,
        timestamp: String(data.messageTimestamp || Date.now()),
        senderName: data.pushName || from,
      }

      console.log('Recebido webhook Evolution:', payload)

      // === Fluxo real ===
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, 
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const container = createContainer(supabase)
      
      try {
        await handleIncomingMessage(payload, container)
        return NextResponse.json({ success: true })
      } catch (err) {
        console.error('Erro ao processar mensagem Evolution:', err)
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
