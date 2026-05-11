import { NextResponse } from 'next/server'
import { parseFetchInstancesBody } from '@/lib/evolution/evolution-instances'

/**
 * Descobre o UUID da instância na Evolution quando o CRM só tem o nome (instance_id vazio no Supabase).
 */
async function resolveInstanceUuidFromEvolution(
  base: string,
  apikey: string,
  instanceName: string
): Promise<string | null> {
  const fetchList = async (withNameFilter: boolean): Promise<string | null> => {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 15_000)
    try {
      const url = new URL(`${base}/instance/fetchInstances`)
      if (withNameFilter) url.searchParams.set('instanceName', instanceName)
      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { apikey },
        signal: controller.signal,
      })
      if (!res.ok) return null
      const rows = parseFetchInstancesBody(await res.json())
      const lower = instanceName.toLowerCase()
      const row =
        rows.find((r) => r.instanceName === instanceName) ||
        rows.find((r) => r.instanceName.toLowerCase() === lower)
      const id = row?.instanceId
      return typeof id === 'string' && id.length > 0 ? id : null
    } catch (e) {
      console.error('[evolution/connect] fetchInstances:', withNameFilter, e)
      return null
    } finally {
      clearTimeout(t)
    }
  }

  let id = await fetchList(true)
  if (!id) id = await fetchList(false)
  return id
}

/**
 * GET /instance/connect/{instance} — doc Evolution v2.
 * Retry: nome → instanceId (query) → UUID via fetchInstances (auto).
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

    const tried: string[] = []
    let response = await callEvolution(instanceName)
    tried.push(instanceName)
    let connectKeyUsed = instanceName

    const adoptIfOk = (r: Response, key: string) => {
      if (r.ok) {
        response = r
        connectKeyUsed = key
      }
    }

    if (response.status === 404 && instanceId && instanceId !== instanceName) {
      const second = await callEvolution(instanceId)
      tried.push(instanceId)
      adoptIfOk(second, instanceId)
    }

    if (!response.ok && response.status === 404) {
      const resolved = await resolveInstanceUuidFromEvolution(base, GLOBAL_API_KEY, instanceName)
      if (resolved && !tried.includes(resolved)) {
        const third = await callEvolution(resolved)
        tried.push(resolved)
        adoptIfOk(third, resolved)
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
          tried,
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
      /** Chave que funcionou no path /instance/connect/ — pode ser UUID; gravar em connections.instance_id */
      evolutionConnectKeyUsed: connectKeyUsed,
    })
  } catch (error) {
    console.error('Erro na API de conectar instância:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
