import { BroadcastStatus } from '../enums'

export interface Broadcast {
  id: string
  tenantId: string
  name: string
  message: string
  targetTags?: string[]
  targetStatus?: string
  targetPipelineStage?: string
  status: BroadcastStatus
  totalRecipients: number
  sentCount: number
  failedCount: number
  scheduledAt?: string
  sentAt?: string
  createdAt: string
}
