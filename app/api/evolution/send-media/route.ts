import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createContainer } from '@/backend/infrastructure/container'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as 'image' | 'audio' | 'video' | 'document'
    const instanceName = formData.get('instanceName') as string
    const recipientPhone = formData.get('recipientPhone') as string
    const tenantId = formData.get('tenantId') as string
    const leadId = formData.get('leadId') as string
    const senderId = formData.get('senderId') as string
    const senderName = formData.get('senderName') as string

    if (!file || !instanceName || !recipientPhone || !tenantId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const container = createContainer(supabase)

    // 1. Upload para o Supabase Storage
    const buffer = Buffer.from(await file.arrayBuffer())
    const extension = file.name.split('.').pop() || 'bin'
    const storagePath = `${tenantId}/${leadId}/sent_${Date.now()}.${extension}`

    const { publicUrl } = await container.storageService.uploadFile({
      bucket: 'media-messages',
      path: storagePath,
      file: buffer,
      contentType: file.type
    })

    // 2. Enviar via Evolution API
    const evolutionApiKey = process.env.EVOLUTION_API_KEY || 'mude-me'
    
    const sendResult = await container.evolutionService.sendMediaMessage({
      instanceName,
      apiKey: evolutionApiKey,
      recipientPhone,
      media: publicUrl,
      mediaType: type,
      fileName: file.name
    })

    const wamid = sendResult.key?.id

    // 3. Salvar no Banco de Dados
    // Obter ou criar a conversa
    let { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('lead_id', leadId)
      .maybeSingle()

    if (!conversation) {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({ tenant_id: tenantId, lead_id: leadId })
        .select('id')
        .single()
      conversation = newConv
    }

    if (conversation) {
      await supabase.from('messages').insert({
        tenant_id: tenantId,
        conversation_id: conversation.id,
        lead_id: leadId,
        content: `[Mídia: ${type}]`,
        sender_id: senderId || 'user',
        sender_name: senderName || 'Atendente',
        sender_type: 'user',
        channel: 'whatsapp',
        read: true,
        wamid: wamid,
        status: wamid ? 'sent' : 'failed',
        media_url: publicUrl,
        media_type: type
      })

      // Atualizar last_message_at na conversa
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversation.id)
    }

    return NextResponse.json({ 
      success: true, 
      wamid, 
      mediaUrl: publicUrl 
    })

  } catch (error) {
    console.error('Erro na API de enviar mídia:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
