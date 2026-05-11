import { LeadStatus } from '../enums'

export interface Lead {
  id: string
  tenantId: string
  name: string
  phone?: string
  email?: string
  /** URL da foto (ex.: WhatsApp / Evolution profilePicUrl) */
  avatar?: string
  channel: string
  status: LeadStatus
  pipelineStage: string
  assignedTo?: string
  tags: string[]
  notes: any[]
  score: number
  priority: 'low' | 'medium' | 'high'
  campaign?: string
  product?: string
  window24hOpen: boolean
  window24hExpiresAt?: string
  createdAt: string
  updatedAt: string
  lastContactAt?: string
}
