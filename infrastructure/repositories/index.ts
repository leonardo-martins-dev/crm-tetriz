import { LeadRepository } from '@/application/repositories/LeadRepository'
import { MockLeadRepository } from '@/infrastructure/repositories/mock/MockLeadRepository'

let leadRepositorySingleton: LeadRepository | null = null

export const getLeadRepository = (): LeadRepository => {
  if (!leadRepositorySingleton) {
    leadRepositorySingleton = new MockLeadRepository()
  }

  return leadRepositorySingleton
}
