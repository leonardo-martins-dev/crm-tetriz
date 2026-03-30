import { ConnectionStatus } from '../enums'

export interface Connection {
  id: string
  tenantId: string
  provider: 'meta'
  phoneNumberId: string
  wabaId: string
  accessTokenEncrypted: string
  verifyToken: string
  status: ConnectionStatus
  createdAt: string
}
