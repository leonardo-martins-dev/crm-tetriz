import { NextResponse } from 'next/server'

/**
 * Diagnóstico seguro (sem expor API keys): testa conectividade do **servidor do CRM**
 * até `EVOLUTION_API_URL`. Use quando `/api/evolution/fetch-instances` der 502.
 */
export async function GET() {
  const base = (process.env.EVOLUTION_API_URL || '').trim().replace(/\/$/, '')
  const apiKey = process.env.EVOLUTION_API_KEY?.trim()
  const hasBase = Boolean(base)
  const hasKey = Boolean(apiKey)

  let rootStatus: number | null = null
  let fetchInstancesStatus: number | null = null
  let rootError: string | undefined
  let instancesError: string | undefined

  const runFetch = async (path: string): Promise<{ status: number | null; err?: string }> => {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 15_000)
    try {
      const res = await fetch(`${base}${path}`, {
        method: 'GET',
        headers: hasKey && apiKey ? { apikey: apiKey } : {},
        signal: controller.signal,
      })
      return { status: res.status }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      return { status: null, err: msg }
    } finally {
      clearTimeout(t)
    }
  }

  if (hasBase && hasKey) {
    const r = await runFetch('/')
    rootStatus = r.status
    rootError = r.err

    const fi = await runFetch('/instance/fetchInstances')
    fetchInstancesStatus = fi.status
    instancesError = fi.err
  }

  let evolutionHost: string | null = null
  if (hasBase) {
    try {
      const u = new URL(base.startsWith('http') ? base : `https://${base}`)
      evolutionHost = u.host
    } catch {
      evolutionHost = null
    }
  }

  return NextResponse.json({
    nextRuntimeOk: true,
    evolutionBaseConfigured: hasBase,
    evolutionApiKeyConfigured: hasKey,
    evolutionHost,
    evolutionRootHttpStatus: rootStatus,
    evolutionRootError: rootError,
    fetchInstancesHttpStatus: fetchInstancesStatus,
    fetchInstancesError: instancesError,
    hints: [
      !hasBase && 'Defina EVOLUTION_API_URL no painel de deploy.',
      !hasKey && 'Defina EVOLUTION_API_KEY no painel de deploy.',
      rootError?.includes('abort') && 'Timeout ao contactar Evolution — rede ou firewall a partir do host do CRM.',
      fetchInstancesStatus === 401 && 'apikey rejeitada pela Evolution (401).',
      fetchInstancesStatus === 403 && 'Acesso negado pela Evolution (403).',
    ].filter(Boolean),
  })
}
