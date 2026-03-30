import { Lead } from '../../domain/entities'

export interface LeadFilters {
  status?: string
  pipelineStage?: string
  assignedTo?: string
  search?: string
  tags?: string[]
}

export interface LeadRepository {
  findById(tenantId: string, id: string): Promise<Lead | null>
  findByPhone(tenantId: string, phone: string): Promise<Lead | null>
  list(tenantId: string, filters?: LeadFilters): Promise<Lead[]>
  create(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead>
  update(tenantId: string, id: string, data: Partial<Lead>): Promise<Lead>
  delete(tenantId: string, id: string): Promise<void>
  countByTenantId(tenantId: string): Promise<number>
}
