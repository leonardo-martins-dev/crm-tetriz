import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { instanceName, recipientPhone, message, tenantId, senderId, senderName, leadId } = body

    if (!instanceName || !recipientPhone || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080'
    const GLOBAL_API_KEY = process.env.EVOLUTION_API_KEY || 'mude-me'

    const url = `${EVOLUTION_API_URL}/message/sendText/${instanceName}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: GLOBAL_API_KEY,
      },
      body: JSON.stringify({
        number: recipientPhone,
        text: message,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      return NextResponse.json(
        { error: 'Failed to send message via Evolution API', details: errorBody },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Persistir no Supabase para historico e Realtime
    if (tenantId && leadId) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, 
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      // Obter ou criar a conversa
      let { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('lead_id', leadId)
        .single()

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
          content: message,
          sender_id: senderId || 'user',
          sender_name: senderName || 'Atendente',
          sender_type: 'user',
          channel: 'whatsapp',
          read: true
        })

        // Atualizar last_message_at na conversa
        await supabase
          .from('conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', conversation.id)
      }
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API de enviar msg:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
