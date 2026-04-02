import { SupabaseClient } from '@supabase/supabase-js'
import { TenantRepository } from '../../application/repositories'
import { Tenant } from '../../domain/entities'
import { NotFoundError } from '../../domain/errors/domain-errors'

export class SupabaseTenantRepository implements TenantRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<Tenant | null> {
    const { data, error } = await this.supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async listAll(): Promise<Tenant[]> {
    const { data, error } = await this.supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data || []).map(this.toDomain)
  }

  async create(input: Omit<Tenant, 'id' | 'createdAt'>): Promise<Tenant> {
    const { data, error } = await this.supabase
      .from('tenants')
      .insert(this.toRow(input))
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toDomain(data)
  }

  async update(id: string, updates: Partial<Omit<Tenant, 'id' | 'createdAt'>>): Promise<Tenant> {
    const { data, error } = await this.supabase
      .from('tenants')
      .update(this.toRow(updates as any))
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    if (!data) throw new NotFoundError('Tenant', id)
    return this.toDomain(data)
  }

  async toggleActive(id: string): Promise<Tenant> {
    const tenant = await this.findById(id)
    if (!tenant) throw new NotFoundError('Tenant', id)
    return this.update(id, { active: !tenant.active })
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tenants')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  }

  private toDomain(row: any): Tenant {
    return {
      id: row.id,
      name: row.name,
      logoUrl: row.logo_url,
      active: row.active,
      plan: row.plan,
      modules: row.modules || [],
      maxUsers: row.max_users,
      createdAt: row.created_at,
    }
  }

  private toRow(entity: Partial<Tenant>): Record<string, any> {
    const row: Record<string, any> = {}
    if (entity.name !== undefined) row.name = entity.name
    if (entity.logoUrl !== undefined) row.logo_url = entity.logoUrl
    if (entity.active !== undefined) row.active = entity.active
    if (entity.plan !== undefined) row.plan = entity.plan
    if (entity.modules !== undefined) row.modules = entity.modules
    if (entity.maxUsers !== undefined) row.max_users = entity.maxUsers
    return row
  }
}
