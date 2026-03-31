import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const instanceName = searchParams.get('instance')

    if (!instanceName) {
      return NextResponse.json({ error: 'Instance name is required' }, { status: 400 })
    }

    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080'
    const GLOBAL_API_KEY = process.env.EVOLUTION_API_KEY || 'mude-me'

    const url = `${EVOLUTION_API_URL}/instance/connect/${instanceName}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: GLOBAL_API_KEY,
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      return NextResponse.json(
        { error: 'Failed to connect instance', details: errorBody },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API de conectar instância:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
