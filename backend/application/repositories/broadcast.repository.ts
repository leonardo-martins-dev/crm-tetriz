import { Broadcast } from '../../domain/entities'

export interface BroadcastRepository {
  findById(tenantId: string, id: string): Promise<Broadcast | null>
  findByTenantId(tenantId: string): Promise<Broadcast[]>
  create(data: Omit<Broadcast, 'id' | 'createdAt' | 'sentCount' | 'failedCount'>): Promise<Broadcast>
  update(tenantId: string, id: string, data: Partial<Broadcast>): Promise<Broadcast>
  delete(tenantId: string, id: string): Promise<void>
}
