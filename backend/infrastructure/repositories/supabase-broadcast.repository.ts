import { SupabaseClient } from '@supabase/supabase-js'
import { BroadcastRepository } from '../../application/repositories/broadcast.repository'
import { Broadcast } from '../../domain/entities'

export class SupabaseBroadcastRepository implements BroadcastRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(tenantId: string, id: string): Promise<Broadcast | null> {
    const { data, error } = await this.supabase
      .from('broadcasts')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .maybeSingle()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async findByTenantId(tenantId: string): Promise<Broadcast[]> {
    const { data, error } = await this.supabase
      .from('broadcasts')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data || []).map(this.toDomain)
  }

  async create(input: Omit<Broadcast, 'id' | 'createdAt' | 'sentCount' | 'failedCount'>): Promise<Broadcast> {
    const { data, error } = await this.supabase
      .from('broadcasts')
      .insert({
        tenant_id: input.tenantId,
        name: input.name,
        message: input.message,
        channel: input.channel,
        tags: input.tags,
        status: input.broadcastStatus,
        total_recipients: input.totalRecipients,
        scheduled_at: input.scheduledAt,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toDomain(data)
  }

  async update(tenantId: string, id: string, input: Partial<Broadcast>): Promise<Broadcast> {
    const { data, error } = await this.supabase
      .from('broadcasts')
      .update({
        name: input.name,
        message: input.message,
        channel: input.channel,
        tags: input.tags,
        status: input.broadcastStatus,
        total_recipients: input.totalRecipients,
        sent_count: input.sentCount,
        failed_count: input.failedCount,
        sent_at: input.sentAt,
        scheduled_at: input.scheduledAt,
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
      .from('broadcasts')
      .delete()
      .eq('tenant_id', tenantId)
      .eq('id', id)

    if (error) throw new Error(error.message)
  }

  private toDomain(row: any): Broadcast {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      message: row.message,
      channel: row.channel,
      tags: row.tags || [],
      broadcastStatus: row.status,
      totalRecipients: row.total_recipients,
      sentCount: row.sent_count || 0,
      failedCount: row.failed_count || 0,
      sentAt: row.sent_at,
      scheduledAt: row.scheduled_at,
      createdAt: row.created_at,
    }
  }
}
