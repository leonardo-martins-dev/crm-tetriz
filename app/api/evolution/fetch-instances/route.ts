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

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25_000)

    let response: Response
    try {
      response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          apikey: GLOBAL_API_KEY,
        },
        signal: controller.signal,
      })
    } catch (e) {
      clearTimeout(timeoutId)
      const msg = e instanceof Error ? e.message : String(e)
      console.error('[fetch-instances] upstream unreachable:', base, msg)
      return NextResponse.json(
        {
          error: 'Evolution API unreachable from CRM server',
          hint: 'Check EVOLUTION_API_URL, firewall, and that the Evolution host accepts requests from this deployment.',
          details: msg,
          attemptedUrl: `${base}/instance/fetchInstances`,
        },
        { status: 502 }
      )
    }
    clearTimeout(timeoutId)

    const text = await response.text()
    if (!response.ok) {
      console.error('[fetch-instances]', response.status, text)
      return NextResponse.json(
        {
          error: 'Failed to fetch instances from Evolution',
          details: text,
          evolutionStatus: response.status,
        },
        { status: response.status >= 500 ? 502 : response.status }
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
