import { Tag } from '../../domain/entities'

export interface TagRepository {
  findById(id: string): Promise<Tag | null>
  findByTenantId(tenantId: string): Promise<Tag[]>
  findByName(tenantId: string, name: string): Promise<Tag | null>
  create(data: Omit<Tag, 'id' | 'createdAt'>): Promise<Tag>
  update(tenantId: string, id: string, data: Partial<Tag>): Promise<Tag>
  delete(tenantId: string, id: string): Promise<void>
}
