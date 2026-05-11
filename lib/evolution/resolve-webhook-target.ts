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

/** Alinhado ao Postman v2 (`webhook/set`) — inclui mensagens e status */
export const EVOLUTION_WEBHOOK_EVENTS = [
  'MESSAGES_UPSERT',
  'MESSAGES_UPDATE',
  'CONNECTION_UPDATE',
  'QRCODE_UPDATED',
] as const
