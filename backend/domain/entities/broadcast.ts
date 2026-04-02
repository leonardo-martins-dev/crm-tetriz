import { BroadcastStatus } from '../enums'

export interface Broadcast {
  id: string
  tenantId: string
  name: string
  message: string
  channel: string
  tags: string[]
  broadcastStatus: 'scheduled' | 'sending' | 'sent' | 'failed' | any
  totalRecipients: number
  sentCount: number
  failedCount: number
  scheduledAt?: string
  sentAt?: string
  createdAt: string
}
