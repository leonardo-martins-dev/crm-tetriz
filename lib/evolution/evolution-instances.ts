/** Normaliza número a partir do JID Evolution (ex.: 5519982893861@s.whatsapp.net) */
export function normalizePhoneFromJid(jid: string | null | undefined): string {
  if (!jid || typeof jid !== 'string') return ''
  const user = jid.split('@')[0] || ''
  return user.replace(/\D/g, '')
}

export function formatWhatsAppPhoneFromJid(jid: string | null | undefined): string {
  const d = normalizePhoneFromJid(jid)
  if (!d) return ''
  if (d.length >= 12 && d.startsWith('55')) {
    return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9)}`
  }
  return `+${d}`
}

/** Primeiros 8 caracteres do tenant (UUID), sempre minúsculos — igual aos nomes gerados na Evolution. */
export function tenantEvolutionPrefix(tenantId: string): string {
  const head = tenantId.slice(0, 8).toLowerCase()
  return `crm-${head}-`
}

export type EvolutionInstanceRow = {
  instanceName: string
  owner?: string | null
  profileName?: string | null
  profilePictureUrl?: string | null
  status?: string | null
  instanceId?: string | null
}

function pickInstanceStatus(inner: Record<string, unknown>): string | null {
  const candidates = [
    inner.status,
    inner.state,
    inner.connectionStatus,
    inner.connectionState,
    inner.connection,
    inner.connectionstate,
  ]
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c
  }
  return null
}

function normalizeOne(raw: unknown): EvolutionInstanceRow | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const inner = o.instance && typeof o.instance === 'object' ? (o.instance as Record<string, unknown>) : o

  const rawName = inner.instanceName ?? inner.name
  if (typeof rawName !== 'string' || !rawName.trim()) return null
  const instanceName = rawName.trim()

  const status = pickInstanceStatus(inner)

  return {
    instanceName,
    owner: typeof inner.owner === 'string' ? inner.owner : null,
    profileName: typeof inner.profileName === 'string' ? inner.profileName : null,
    profilePictureUrl:
      typeof inner.profilePictureUrl === 'string' ? inner.profilePictureUrl : null,
    status,
    instanceId: typeof inner.instanceId === 'string' ? inner.instanceId : null,
  }
}

/**
 * Aceita vários formatos retornados pela Evolution em GET /instance/fetchInstances.
 * Faz uma busca em profundidade porque o payload pode vir como array na raiz, em `response`,
 * objetos aninhados, ou misturas documentadas na OpenAPI v2.
 */
export function parseFetchInstancesBody(body: unknown): EvolutionInstanceRow[] {
  if (body == null) return []

  const seen = new Set<string>()
  const out: EvolutionInstanceRow[] = []

  const walk = (node: unknown): void => {
    if (node == null) return
    if (Array.isArray(node)) {
      for (const item of node) walk(item)
      return
    }
    if (typeof node !== 'object') return

    const row = normalizeOne(node)
    if (row) {
      if (!seen.has(row.instanceName)) {
        seen.add(row.instanceName)
        out.push(row)
      }
      return
    }

    for (const v of Object.values(node as Record<string, unknown>)) walk(v)
  }

  walk(body)
  return out
}

export function isEvolutionInstanceConnected(status: string | null | undefined): boolean {
  const s = (status || '').toLowerCase().trim()
  if (!s) return false
  if (['connecting', 'pairing', 'loading'].includes(s)) return false
  if (
    ['open', 'connected', 'online', 'ready', 'authenticated', 'working', 'success', 'logged_in'].includes(s)
  ) {
    return true
  }
  if (
    ['close', 'closed', 'disconnected', 'disconnect', 'offline', 'logout', 'unpaired', 'destroyed'].includes(s)
  ) {
    return false
  }
  return false
}

/** Resposta proxy connection-state ou objeto instance da Evolution */
export function isConnectionStateOpen(data: unknown): boolean {
  return isEvolutionRawConnectionOpen(data)
}

/**
 * Interpreta GET /instance/connectionState e formatos parecidos.
 * Variantes comuns: instance.state, instance.status, state numérico, objetos aninhados.
 */
export function isEvolutionRawConnectionOpen(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false
  const root = body as Record<string, unknown>

  if (root.connected === true) return true
  if (root.connected === false) return false

  const unwrap = (): Record<string, unknown> | null => {
    if (root.instance && typeof root.instance === 'object') {
      return root.instance as Record<string, unknown>
    }
    const data = root.data
    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>
      if (d.instance && typeof d.instance === 'object') return d.instance as Record<string, unknown>
      return d
    }
    return root
  }

  const inst = unwrap()
  const pickState = (): unknown => {
    if (!inst) return undefined
    return (
      inst.connected ??
      inst.state ??
      inst.connection ??
      inst.status ??
      inst.connectionStatus ??
      inst.connectionstate ??
      (inst as Record<string, unknown>).connectionState
    )
  }

  let raw: unknown = pickState()
  if (raw === undefined) raw = root.state ?? root.status ?? root.connectionState

  if (typeof raw === 'boolean') return raw

  if (typeof raw === 'number') {
    return raw === 1
  }

  if (typeof raw === 'string') {
    const s = raw.toLowerCase().trim()
    if (
      ['open', 'connected', 'online', 'ready', 'authenticated', 'working', 'success', 'logged_in'].includes(s)
    ) {
      return true
    }
    if (
      ['close', 'closed', 'disconnect', 'disconnected', 'offline', 'logout', 'unpaired', 'destroyed'].includes(s)
    ) {
      return false
    }
    return false
  }

  return false
}

export function extractInstanceTimeSuffix(instanceName: string): number {
  const m = instanceName.match(/-(\d{10,})$/)
  return m ? parseInt(m[1], 10) : 0
}

/**
 * Para cada instância, confere `status` da listagem e, se preciso, `connection-state`.
 * Útil para listar "ativas" no CRM e para adoção automática.
 */
export async function partitionInstancesByVerifiedOpen(
  rows: EvolutionInstanceRow[],
  fetchConnectionState: (instanceName: string) => Promise<unknown>
): Promise<{ verifiedOpen: EvolutionInstanceRow[]; notOpen: EvolutionInstanceRow[] }> {
  const verifiedOpen: EvolutionInstanceRow[] = []
  const notOpen: EvolutionInstanceRow[] = []

  for (const row of rows) {
    let open = isEvolutionInstanceConnected(row.status)
    if (!open) {
      try {
        const st = await fetchConnectionState(row.instanceName)
        open = isEvolutionRawConnectionOpen(st)
      } catch {
        notOpen.push(row)
        continue
      }
    }
    if (open) verifiedOpen.push(row)
    else notOpen.push(row)
  }

  return { verifiedOpen, notOpen }
}

/**
 * Mesmo número em várias instâncias abertas: escolhe uma canônica e lista redundantes para DELETE.
 */
export function pickCanonicalEvolutionInstance(args: {
  instances: EvolutionInstanceRow[]
  currentName: string
  ownerJid: string
  dbInstanceName?: string | null
}): { canonicalName: string; redundantNames: string[] } {
  const phone = normalizePhoneFromJid(args.ownerJid)
  if (!phone) {
    return { canonicalName: args.currentName, redundantNames: [] }
  }

  const openSame = args.instances.filter(
    (i) =>
      normalizePhoneFromJid(i.owner || '') === phone &&
      isEvolutionInstanceConnected(i.status)
  )

  if (openSame.length <= 1) {
    return { canonicalName: args.currentName, redundantNames: [] }
  }

  let canonical = args.currentName

  const dbRow =
    args.dbInstanceName &&
    openSame.find((x) => x.instanceName === args.dbInstanceName)
  if (dbRow && isEvolutionInstanceConnected(dbRow.status)) {
    canonical = args.dbInstanceName!
  } else {
    openSame.sort(
      (a, b) => extractInstanceTimeSuffix(a.instanceName) - extractInstanceTimeSuffix(b.instanceName)
    )
    canonical = openSame[0].instanceName
  }

  const redundantNames = openSame.map((i) => i.instanceName).filter((n) => n !== canonical)
  return { canonicalName: canonical, redundantNames }
}
