import { Automation } from '../../domain/entities'

export interface AutomationRepository {
  findById(tenantId: string, id: string): Promise<Automation | null>
  findByTenantId(tenantId: string): Promise<Automation[]>
  create(data: Omit<Automation, 'id' | 'createdAt'>): Promise<Automation>
  update(tenantId: string, id: string, data: Partial<Automation>): Promise<Automation>
  delete(tenantId: string, id: string): Promise<void>
}
