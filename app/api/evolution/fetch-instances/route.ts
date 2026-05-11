import { NextResponse } from 'next/server'

/**
 * Proxy GET /instance/fetchInstances — lista instâncias na Evolution (opcional ?instanceName=)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const instanceName = searchParams.get('instanceName')

    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080'
    const GLOBAL_API_KEY = process.env.EVOLUTION_API_KEY || 'mude-me'

    const base = EVOLUTION_API_URL.replace(/\/$/, '')
    const url = new URL(`${base}/instance/fetchInstances`)
    if (instanceName) url.searchParams.set('instanceName', instanceName)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        apikey: GLOBAL_API_KEY,
      },
    })

    const text = await response.text()
    if (!response.ok) {
      console.error('[fetch-instances]', response.status, text)
      return NextResponse.json(
        { error: 'Failed to fetch instances from Evolution', details: text },
        { status: response.status }
      )
    }

    try {
      return NextResponse.json(JSON.parse(text))
    } catch {
      return NextResponse.json({ raw: text })
    }
  } catch (e) {
    console.error('[fetch-instances]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
