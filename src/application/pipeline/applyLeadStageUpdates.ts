import { Lead } from '@/types'
import { LeadStageUpdate } from '@/src/domain/pipeline/useCases'

export type LeadUpdater = (leadId: string, updates: Partial<Lead>) => void

export function applyLeadStageUpdates(updates: LeadStageUpdate[], updateLead: LeadUpdater) {
  updates.forEach((item) => {
    updateLead(item.leadId, item.updates)
  })
}
