import { Lead } from '@/types'
import { LeadRepository } from '@/src/application/repositories/LeadRepository'

export class ZustandLeadRepository implements LeadRepository {
  constructor(private readonly updateLeadAction: (leadId: string, updates: Partial<Lead>) => void) {}

  updateLead(leadId: string, updates: Partial<Lead>): void {
    this.updateLeadAction(leadId, updates)
  }
}
