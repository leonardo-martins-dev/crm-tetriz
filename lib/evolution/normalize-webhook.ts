/**
 * Evolution API envia nomes de evento em vários formatos:
 * Postman/docs: `MESSAGES_UPSERT`, `MESSAGES_UPDATE`
 * Algumas versões: `messages.upsert`, `messages.update`
 */
export function evolutionWebhookCanonicalEvent(event: unknown): string {
  return String(event ?? '')
    .trim()
    .toUpperCase()
    .replace(/\./g, '_')
    .replace(/-/g, '_')
}

export function isEvolutionMessagesUpsert(event: unknown): boolean {
  return evolutionWebhookCanonicalEvent(event) === 'MESSAGES_UPSERT'
}

export function isEvolutionMessagesUpdate(event: unknown): boolean {
  return evolutionWebhookCanonicalEvent(event) === 'MESSAGES_UPDATE'
}

export type EvolutionUpsertChunk = {
  /** Nome `crm-...` ou UUID da instância Evolution (webhook pode mandar qualquer um). */
  instanceName: string
  data: Record<string, unknown>
}

/** Extrai identificador da instância (string ou objeto aninhado da Evolution). */
export function resolveWebhookInstanceKey(body: Record<string, unknown>): string | undefined {
  const raw = body.instance ?? body.instanceName
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>
    if (typeof o.instanceName === 'string' && o.instanceName.trim()) return o.instanceName.trim()
    if (typeof o.instanceId === 'string' && o.instanceId.trim()) return o.instanceId.trim()
  }
  return undefined
}

/**
 * Um único POST pode trazer uma mensagem ou um lote em `data.messages`.
 */
export function splitEvolutionMessagesUpsert(body: Record<string, unknown>): EvolutionUpsertChunk[] {
  const instanceName = resolveWebhookInstanceKey(body)
  if (!instanceName) return []

  const raw = body.data as unknown
  if (raw == null) return []

  if (Array.isArray(raw)) {
    return raw
      .filter((x): x is Record<string, unknown> => Boolean(x) && typeof x === 'object')
      .map((data) => ({ instanceName, data }))
  }

  if (typeof raw !== 'object') return []

  const dataObj = raw as Record<string, unknown>
  if (Array.isArray(dataObj.messages)) {
    return dataObj.messages
      .filter((x): x is Record<string, unknown> => Boolean(x) && typeof x === 'object')
      .map((data) => ({ instanceName, data }))
  }

  if (dataObj.key) {
    return [{ instanceName, data: dataObj }]
  }

  return []
}
