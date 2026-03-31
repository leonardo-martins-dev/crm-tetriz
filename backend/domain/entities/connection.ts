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

  status: ConnectionStatus
  createdAt: string
}
