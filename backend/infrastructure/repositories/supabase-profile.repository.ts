import { SupabaseClient } from '@supabase/supabase-js'
import { ProfileRepository } from '../../application/repositories/profile.repository'
import { Profile } from '../../domain/entities/profile'
import { NotFoundError } from '../../domain/errors/domain-errors'

export class SupabaseProfileRepository implements ProfileRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async findByEmail(email: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async listByTenant(tenantId: string): Promise<Profile[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name', { ascending: true })

    if (error) throw new Error(error.message)
    return (data || []).map(this.toDomain)
  }

  async create(profile: Profile): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert(this.toRow(profile))
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toDomain(data)
  }

  async update(id: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(this.toRow(updates))
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    if (!data) throw new NotFoundError('Profile', id)
    return this.toDomain(data)
  }

  private toDomain(row: any): Profile {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      email: row.email,
      role: row.role,
      avatarUrl: row.avatar_url,
      active: row.active,
      createdAt: row.created_at,
    }
  }

  private toRow(entity: Partial<Profile>): Record<string, any> {
    const row: Record<string, any> = {}
    if (entity.tenantId !== undefined) row.tenant_id = entity.tenantId
    if (entity.name !== undefined) row.name = entity.name
    if (entity.email !== undefined) row.email = entity.email
    if (entity.role !== undefined) row.role = entity.role
    if (entity.avatarUrl !== undefined) row.avatar_url = entity.avatarUrl
    if (entity.active !== undefined) row.active = entity.active
    return row
  }
}
