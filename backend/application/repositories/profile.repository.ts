import { Profile } from '../../domain/entities/profile'

export interface ProfileRepository {
  findById(id: string): Promise<Profile | null>
  findByEmail(email: string): Promise<Profile | null>
  listByTenant(tenantId: string): Promise<Profile[]>
  create(profile: Profile): Promise<Profile>
  update(id: string, updates: Partial<Profile>): Promise<Profile>
  delete(id: string): Promise<void>
}
