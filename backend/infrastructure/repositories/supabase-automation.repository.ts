import { SupabaseClient } from '@supabase/supabase-js'
import { AutomationRepository } from '../../application/repositories/automation.repository'
import { Automation } from '../../domain/entities'

export class SupabaseAutomationRepository implements AutomationRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(tenantId: string, id: string): Promise<Automation | null> {
    const { data, error } = await this.supabase
      .from('automations')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .maybeSingle()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async findByTenantId(tenantId: string): Promise<Automation[]> {
    const { data, error } = await this.supabase
      .from('automations')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data || []).map(this.toDomain)
  }

  async create(input: Omit<Automation, 'id' | 'createdAt'>): Promise<Automation> {
    const { data, error } = await this.supabase
      .from('automations')
      .insert({
        tenant_id: input.tenantId,
        name: input.name,
        active: input.active,
        event: input.event,
        condition: input.condition,
        action: input.action,
        nodes: input.nodes,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toDomain(data)
  }

  async update(tenantId: string, id: string, input: Partial<Automation>): Promise<Automation> {
    const { data, error } = await this.supabase
      .from('automations')
      .update({
        name: input.name,
        active: input.active,
        event: input.event,
        condition: input.condition,
        action: input.action,
        nodes: input.nodes,
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
      .from('automations')
      .delete()
      .eq('tenant_id', tenantId)
      .eq('id', id)

    if (error) throw new Error(error.message)
  }

  private toDomain(row: any): Automation {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      active: row.active,
      event: row.event,
      condition: row.condition,
      action: row.action,
      nodes: row.nodes || [],
      createdAt: row.created_at,
    }
  }
}
