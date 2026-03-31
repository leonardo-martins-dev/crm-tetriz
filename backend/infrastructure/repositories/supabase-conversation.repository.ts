import { SupabaseClient } from '@supabase/supabase-js'
import { ConversationRepository } from '../../application/repositories'
import { Conversation } from '../../domain/entities'
import { NotFoundError } from '../../domain/errors/domain-errors'

/**
 * Implementação do ConversationRepository usando Supabase.
 */
export class SupabaseConversationRepository implements ConversationRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(tenantId: string, id: string): Promise<Conversation | null> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async findByLeadId(tenantId: string, leadId: string): Promise<Conversation | null> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('lead_id', leadId)
      .eq('tenant_id', tenantId)
      .single()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async list(tenantId: string): Promise<Conversation[]> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('last_message_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data || []).map(this.toDomain)
  }

  async create(input: Omit<Conversation, 'id' | 'createdAt'>): Promise<Conversation> {
    const { data, error } = await this.supabase
      .from('conversations')
      .insert(this.toRow(input))
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toDomain(data)
  }

  async update(tenantId: string, id: string, updates: Partial<Conversation>): Promise<Conversation> {
    const { data, error } = await this.supabase
      .from('conversations')
      .update(this.toRow(updates))
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    if (!data) throw new NotFoundError('Conversation', id)
    return this.toDomain(data)
  }

  // ─── Mappers ─────────────────────────────────────

  private toDomain(row: any): Conversation {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      leadId: row.lead_id,
      assignedTo: row.assigned_to,
      unreadCount: row.unread_count,
      lastMessageAt: row.last_message_at,
      createdAt: row.created_at,
    }
  }

  private toRow(entity: Partial<Conversation>): Record<string, any> {
    const row: Record<string, any> = {}
    if (entity.tenantId !== undefined) row.tenant_id = entity.tenantId
    if (entity.leadId !== undefined) row.lead_id = entity.leadId
    if (entity.assignedTo !== undefined) row.assigned_to = entity.assignedTo
    if (entity.unreadCount !== undefined) row.unread_count = entity.unreadCount
    if (entity.lastMessageAt !== undefined) row.last_message_at = entity.lastMessageAt
    return row
  }
}
