import { SupabaseClient } from '@supabase/supabase-js'
import { AgentRepository } from '../../application/repositories'
import { Agent } from '../../domain/entities'
import { NotFoundError } from '../../domain/errors/domain-errors'

/**
 * Implementação do AgentRepository usando Supabase.
 */
export class SupabaseAgentRepository implements AgentRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(tenantId: string, id: string): Promise<Agent | null> {
    const { data, error } = await this.supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async findByTenantId(tenantId: string): Promise<Agent[]> {
    const { data, error } = await this.supabase
      .from('agents')
      .select('*')
      .eq('tenant_id', tenantId)

    if (error) throw new Error(error.message)
    return (data || []).map(this.toDomain)
  }

  async findActiveByTrigger(tenantId: string, triggerType: string, triggerValue: string): Promise<Agent[]> {
    // Triggers is JSONB array. We want to find agents where one trigger has matching type and value.
    // Querying JSONB arrays in Supabase JS:
    const { data, error } = await this.supabase
      .from('agents')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('active', true)
      .contains('triggers', [{ type: triggerType, value: triggerValue }])

    if (error) throw new Error(error.message)
    return (data || []).map(this.toDomain)
  }

  async create(input: Omit<Agent, 'id' | 'createdAt'>): Promise<Agent> {
    const { data, error } = await this.supabase
      .from('agents')
      .insert(this.toRow(input))
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toDomain(data)
  }

  async update(tenantId: string, id: string, updates: Partial<Agent>): Promise<Agent> {
    const { data, error } = await this.supabase
      .from('agents')
      .update(this.toRow(updates))
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    if (!data) throw new NotFoundError('Agent', id)
    return this.toDomain(data)
  }

  async toggleActive(tenantId: string, id: string): Promise<Agent> {
    const agent = await this.findById(tenantId, id)
    if (!agent) throw new NotFoundError('Agent', id)

    return this.update(tenantId, id, { active: !agent.active })
  }

  async delete(tenantId: string, id: string): Promise<void> {
    const { error } = await this.supabase
      .from('agents')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId)

    if (error) throw new Error(error.message)
  }

  // ─── Mappers ─────────────────────────────────────

  private toDomain(row: any): Agent {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      prompt: row.prompt,
      model: row.model,
      apiKeyEncrypted: row.api_key_encrypted,
      triggers: row.triggers,
      permissions: row.permissions,
      active: row.active,
      createdAt: row.created_at,
    }
  }

  private toRow(entity: Partial<Agent>): Record<string, any> {
    const row: Record<string, any> = {}
    if (entity.tenantId !== undefined) row.tenant_id = entity.tenantId
    if (entity.name !== undefined) row.name = entity.name
    if (entity.prompt !== undefined) row.prompt = entity.prompt
    if (entity.model !== undefined) row.model = entity.model
    if (entity.apiKeyEncrypted !== undefined) row.api_key_encrypted = entity.apiKeyEncrypted
    if (entity.triggers !== undefined) row.triggers = entity.triggers
    if (entity.permissions !== undefined) row.permissions = entity.permissions
    if (entity.active !== undefined) row.active = entity.active
    return row
  }
}
