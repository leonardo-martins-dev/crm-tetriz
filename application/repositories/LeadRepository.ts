import { Lead } from '@/types'

export interface LeadRepository {
  listByTenant(tenantId: string): Promise<Lead[]>
  updateLead(tenantId: string, leadId: string, updates: Partial<Lead>): Promise<Lead | null>
}
