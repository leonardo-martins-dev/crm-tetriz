import { ConnectionStatus } from '../enums'

export type ConnectionProvider = 'meta' | 'evolution'

export interface Connection {
  id: string
  tenantId: string
  provider: ConnectionProvider
  
  // Meta fields (legacy)
  phoneNumberId?: string
  wabaId?: string
  accessTokenEncrypted?: string
  verifyToken?: string

  // Evolution fields
  instanceName?: string
  instanceId?: string
  evolutionApiKey?: string
  /** Ex.: 5519982893861@s.whatsapp.net */
  evolutionOwnerJid?: string | null
  evolutionProfileName?: string | null
  /** Última URL enviada para Evolution em webhook/set (mesma base para todos os tenants). */
  evolutionWebhookUrl?: string | null
  evolutionWebhookSyncedAt?: string | null

  status: ConnectionStatus
  createdAt: string
}
