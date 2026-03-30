import { SupabaseClient } from '@supabase/supabase-js'
import { LeadRepository, LeadFilters } from '../../application/repositories'
import { Lead } from '../../domain/entities'
import { NotFoundError } from '../../domain/errors/domain-errors'

/**
 * Implementação concreta do LeadRepository usando Supabase.
 * O RLS filtra automaticamente por tenant_id via JWT.
 */
export class SupabaseLeadRepository implements LeadRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(tenantId: string, id: string): Promise<Lead | null> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async findByPhone(tenantId: string, phone: string): Promise<Lead | null> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('phone', phone)
      .single()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async list(tenantId: string, filters?: LeadFilters): Promise<Lead[]> {
    let query = this.supabase
      .from('leads')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.pipelineStage) {
      query = query.eq('pipeline_stage', filters.pipelineStage)
    }
    if (filters?.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo)
    }
    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    return (data || []).map(this.toDomain)
  }

  async create(input: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const { data, error } = await this.supabase
      .from('leads')
      .insert(this.toRow(input))
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toDomain(data)
  }

  async update(tenantId: string, id: string, updates: Partial<Lead>): Promise<Lead> {
    const { data, error } = await this.supabase
      .from('leads')
      .update(this.toRow(updates))
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    if (!data) throw new NotFoundError('Lead', id)
    return this.toDomain(data)
  }

  async delete(tenantId: string, id: string): Promise<void> {
    const { error } = await this.supabase
      .from('leads')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId)

    if (error) throw new Error(error.message)
  }

  async countByTenantId(tenantId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)

    if (error) throw new Error(error.message)
    return count || 0
  }

  // ─── Mappers ─────────────────────────────────────

  private toDomain(row: any): Lead {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      channel: row.channel,
      status: row.status,
      pipelineStage: row.pipeline_stage,
      assignedTo: row.assigned_to,
      score: row.score,
      priority: row.priority,
      campaign: row.campaign,
      product: row.product,
      window24hOpen: row.window_24h_open,
      window24hExpiresAt: row.window_24h_expires_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastContactAt: row.last_contact_at,
    }
  }

  private toRow(entity: Partial<Lead>): Record<string, any> {
    const row: Record<string, any> = {}
    if (entity.tenantId !== undefined) row.tenant_id = entity.tenantId
    if (entity.name !== undefined) row.name = entity.name
    if (entity.phone !== undefined) row.phone = entity.phone
    if (entity.email !== undefined) row.email = entity.email
    if (entity.channel !== undefined) row.channel = entity.channel
    if (entity.status !== undefined) row.status = entity.status
    if (entity.pipelineStage !== undefined) row.pipeline_stage = entity.pipelineStage
    if (entity.assignedTo !== undefined) row.assigned_to = entity.assignedTo
    if (entity.score !== undefined) row.score = entity.score
    if (entity.priority !== undefined) row.priority = entity.priority
    if (entity.campaign !== undefined) row.campaign = entity.campaign
    if (entity.product !== undefined) row.product = entity.product
    if (entity.window24hOpen !== undefined) row.window_24h_open = entity.window24hOpen
    if (entity.window24hExpiresAt !== undefined) row.window_24h_expires_at = entity.window24hExpiresAt
    if (entity.lastContactAt !== undefined) row.last_contact_at = entity.lastContactAt
    return row
  }
}
