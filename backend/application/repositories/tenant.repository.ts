import { Tenant } from '../../domain/entities'

export interface TenantRepository {
  findById(id: string): Promise<Tenant | null>
  listAll(): Promise<Tenant[]>
  create(data: Omit<Tenant, 'id' | 'createdAt'>): Promise<Tenant>
  update(id: string, data: Partial<Omit<Tenant, 'id' | 'createdAt'>>): Promise<Tenant>
  toggleActive(id: string): Promise<Tenant>
  delete(id: string): Promise<void>
}
