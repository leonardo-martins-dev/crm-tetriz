import { LeadRepository } from '@/application/repositories/LeadRepository'
import { Lead } from '@/types'

export class MockLeadRepository implements LeadRepository {
  private leadsByTenant: Record<string, Lead[]>

  constructor(seed: Record<string, Lead[]> = {}) {
    this.leadsByTenant = seed
  }

  async listByTenant(tenantId: string): Promise<Lead[]> {
    return this.leadsByTenant[tenantId] || []
  }

  async updateLead(tenantId: string, leadId: string, updates: Partial<Lead>): Promise<Lead | null> {
    const leads = this.leadsByTenant[tenantId] || []
    const idx = leads.findIndex((lead) => lead.id === leadId)
    if (idx < 0) return null

    const updatedLead = { ...leads[idx], ...updates }
    this.leadsByTenant[tenantId] = leads.map((lead) => (lead.id === leadId ? updatedLead : lead))
    return updatedLead
  }
}
