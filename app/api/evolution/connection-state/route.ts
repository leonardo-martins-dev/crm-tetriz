import { NextResponse } from 'next/server'
import { isEvolutionRawConnectionOpen } from '@/lib/evolution/evolution-instances'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const instanceName = searchParams.get('instance')

    if (!instanceName) {
      return NextResponse.json({ error: 'Instance name is required' }, { status: 400 })
    }

    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080'
    const GLOBAL_API_KEY = process.env.EVOLUTION_API_KEY || 'mude-me'

    const url = `${EVOLUTION_API_URL}/instance/connectionState/${instanceName}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: GLOBAL_API_KEY,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ instance: { state: 'close' } })
      }
      const errorBody = await response.text()
      return NextResponse.json(
        { error: 'Failed to get connection state', details: errorBody },
        { status: response.status }
      )
    }

    const data = await response.json()
    const open = isEvolutionRawConnectionOpen(data)

    const instanceBase =
      data?.instance && typeof data.instance === 'object' && data.instance !== null
        ? ({ ...(data.instance as Record<string, unknown>) } as Record<string, unknown>)
        : ({} as Record<string, unknown>)

    const preserved =
      typeof instanceBase.state === 'string'
        ? instanceBase.state
        : typeof instanceBase.status === 'string'
          ? instanceBase.status
          : 'close'

    return NextResponse.json({
      ...data,
      instance: {
        ...instanceBase,
        state: open ? 'open' : preserved,
      },
    })
  } catch (error) {
    console.error('Erro na API state:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  return NextResponse.json({ success: true, message: 'Status updated' })
}
