import { Lead } from '@/types'

export interface LeadRepository {
  updateLead(leadId: string, updates: Partial<Lead>): void
}
