/**
 * URL única do webhook do app (todos os tenants): Evolution envia `instance` no corpo e o CRM resolve o tenant.
 *
 * Prioridade: WEBHOOK_URL (URL completa) → origem do browser + `/api/evolution/webhook` → NEXT_PUBLIC_APP_URL.
 */
export function resolveEvolutionWebhookTarget(webhookPublicUrl?: string | null): string {
  const fromEnv = process.env.WEBHOOK_URL?.trim()
  if (fromEnv) return fromEnv

  const pub = webhookPublicUrl?.trim()
  if (pub) return `${pub.replace(/\/$/, '')}/api/evolution/webhook`

  const nextPublic = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (nextPublic) return `${nextPublic.replace(/\/$/, '')}/api/evolution/webhook`

  return 'http://host.docker.internal:3000/api/evolution/webhook'
}

/** Eventos enviados ao nosso webhook — subset estável da Evolution API */
export const EVOLUTION_WEBHOOK_EVENTS = [
  'MESSAGES_UPSERT',
  'MESSAGES_UPDATE',
  'CONNECTION_UPDATE',
  'QRCODE_UPDATED',
] as const

/**
 * Bloco `webhook` para criação de instância (`instance/create`) — ver `InstanceDto.webhook` na Evolution API atual.
 */
export function buildEvolutionInstanceWebhookConfig(
  webhookUrl: string,
  events: readonly string[] = EVOLUTION_WEBHOOK_EVENTS
) {
  return {
    enabled: true,
    url: webhookUrl,
    byEvents: true,
    base64: false,
    events: [...events],
  }
}

/**
 * Corpo de POST `/webhook/set/{instance}` na Evolution 2.2+: schema exige `{ webhook: { enabled, url, ... } }`
 * (não o formato plano do Postman antigo).
 */
export function buildEvolutionSetWebhookRequestBody(
  webhookUrl: string,
  events: readonly string[] = EVOLUTION_WEBHOOK_EVENTS
) {
  return { webhook: buildEvolutionInstanceWebhookConfig(webhookUrl, events) }
}
