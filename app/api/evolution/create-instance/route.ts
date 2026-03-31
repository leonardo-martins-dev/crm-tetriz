import { NextResponse } from 'next/server'
import { createContainer } from '@/backend/infrastructure/container'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { instanceName } = await req.json()

    if (!instanceName) {
      return NextResponse.json({ error: 'Instance name is required' }, { status: 400 })
    }

    // TODO: Usar cliente Supabase autenticado quando tivermos sessão
    // const supabase = createClient(...)
    // const container = createContainer(supabase)

    // Simulando o EvolutionApiService
    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080'
    const GLOBAL_API_KEY = process.env.EVOLUTION_API_KEY || 'mude-me'

    const url = `${EVOLUTION_API_URL}/instance/create`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: GLOBAL_API_KEY,
      },
      body: JSON.stringify({
        instanceName,
        integration: 'WHATSAPP-BAILEYS',
        qrcode: true,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Evolution API erro:', errorBody)
      return NextResponse.json(
        { error: 'Failed to create instance in Evolution API', details: errorBody },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API de criar instância:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
