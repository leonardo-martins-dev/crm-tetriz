import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { instanceName } = await req.json()

    if (!instanceName) {
      return NextResponse.json({ error: 'Instance name is required' }, { status: 400 })
    }

    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080'
    const GLOBAL_API_KEY = process.env.EVOLUTION_API_KEY || 'mude-me'

    // Determina a URL real do seu sistema para receber o webhook.
    // Em produção será algo como: https://meu-crm.com/api/evolution/webhook
    // Para dev local, host.docker.internal ou um ngrok.
    const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://host.docker.internal:3000/api/evolution/webhook'

    const url = `${EVOLUTION_API_URL}/webhook/set/${instanceName}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: GLOBAL_API_KEY,
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        webhook_by_events: true,
        webhook_base64: false,
        events: [
          "MESSAGES_UPSERT",
          "CONNECTION_UPDATE",
          "QRCODE_UPDATED"
        ],
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      return NextResponse.json(
        { error: 'Failed to configure Evolution Webhook', details: errorBody },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API de webhook config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
