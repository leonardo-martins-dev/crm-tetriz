import { SupabaseClient } from '@supabase/supabase-js'
import { TagRepository } from '../../application/repositories/tag.repository'
import { Tag } from '../../domain/entities'

export class SupabaseTagRepository implements TagRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<Tag | null> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async findByTenantId(tenantId: string): Promise<Tag[]> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name', { ascending: true })

    if (error) throw new Error(error.message)
    return (data || []).map(this.toDomain)
  }

  async findByName(tenantId: string, name: string): Promise<Tag | null> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('name', name)
      .maybeSingle()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async create(input: Omit<Tag, 'id' | 'createdAt'>): Promise<Tag> {
    const { data, error } = await this.supabase
      .from('tags')
      .insert({
        tenant_id: input.tenantId,
        name: input.name,
        color: input.color,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toDomain(data)
  }

  async update(tenantId: string, id: string, input: Partial<Tag>): Promise<Tag> {
    const { data, error } = await this.supabase
      .from('tags')
      .update({
        name: input.name,
        color: input.color,
      })
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toDomain(data)
  }

  async delete(tenantId: string, id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tags')
      .delete()
      .eq('tenant_id', tenantId)
      .eq('id', id)

    if (error) throw new Error(error.message)
  }

  private toDomain(row: any): Tag {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      color: row.color,
      createdAt: row.created_at,
    }
  }
}
