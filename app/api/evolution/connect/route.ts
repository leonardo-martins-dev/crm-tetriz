import { NextResponse } from 'next/server'

/**
 * GET /instance/connect/{instance} — doc Evolution v2.
 * Alguns servidores devolvem 404 pelo **nome** mas aceitam o **instanceId** (UUID) gravado no CRM.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const instanceName = searchParams.get('instance')
    const instanceId = searchParams.get('instanceId')

    if (!instanceName) {
      return NextResponse.json({ error: 'Instance name is required' }, { status: 400 })
    }

    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080'
    const GLOBAL_API_KEY = process.env.EVOLUTION_API_KEY || 'mude-me'
    const base = EVOLUTION_API_URL.replace(/\/$/, '')

    const callEvolution = (key: string) =>
      fetch(`${base}/instance/connect/${encodeURIComponent(key)}`, {
        method: 'GET',
        headers: {
          apikey: GLOBAL_API_KEY,
        },
      })

    let response = await callEvolution(instanceName)

    if (response.status === 404 && instanceId && instanceId !== instanceName) {
      const second = await callEvolution(instanceId)
      if (second.ok) {
        response = second
      }
    }

    const errorBody = await response.text()
    if (!response.ok) {
      console.error('[evolution/connect]', response.status, errorBody.slice(0, 500))
      let parsed: unknown = errorBody
      try {
        parsed = JSON.parse(errorBody)
      } catch {
        /* plain text */
      }
      return NextResponse.json(
        {
          error: 'Failed to connect instance',
          details: parsed,
          tried: instanceId && instanceId !== instanceName ? [instanceName, instanceId] : [instanceName],
        },
        { status: response.status }
      )
    }

    let data: Record<string, unknown>
    try {
      data = JSON.parse(errorBody) as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'Invalid JSON from Evolution', raw: errorBody.slice(0, 200) }, { status: 502 })
    }

    const rawBase64 =
      (typeof data.base64 === 'string' && data.base64) ||
      (typeof data.qrcode === 'object' &&
        data.qrcode !== null &&
        typeof (data.qrcode as { base64?: string }).base64 === 'string' &&
        (data.qrcode as { base64: string }).base64) ||
      ''

    const pairingCode =
      (typeof data.pairingCode === 'string' && data.pairingCode) ||
      (typeof data.pairing_code === 'string' && data.pairing_code) ||
      undefined

    return NextResponse.json({
      ...data,
      base64: rawBase64 || undefined,
      pairingCode: pairingCode || undefined,
    })
  } catch (error) {
    console.error('Erro na API de conectar instância:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
