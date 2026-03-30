import { Profile } from '../../domain/entities'

export interface ProfileRepository {
  findById(id: string): Promise<Profile | null>
  findByTenantId(tenantId: string): Promise<Profile[]>
  create(data: Omit<Profile, 'id' | 'createdAt'>): Promise<Profile>
  update(id: string, data: Partial<Omit<Profile, 'id' | 'createdAt'>>): Promise<Profile>
  toggleActive(id: string): Promise<Profile>
  delete(id: string): Promise<void>
  countByTenantId(tenantId: string): Promise<number>
}
