import { Agent } from '../../domain/entities'

export interface AgentRepository {
  findById(tenantId: string, id: string): Promise<Agent | null>
  findByTenantId(tenantId: string): Promise<Agent[]>
  findActiveByTrigger(tenantId: string, triggerType: string, triggerValue: string): Promise<Agent[]>
  create(data: Omit<Agent, 'id' | 'createdAt'>): Promise<Agent>
  update(tenantId: string, id: string, data: Partial<Agent>): Promise<Agent>
  toggleActive(tenantId: string, id: string): Promise<Agent>
  delete(tenantId: string, id: string): Promise<void>
}
