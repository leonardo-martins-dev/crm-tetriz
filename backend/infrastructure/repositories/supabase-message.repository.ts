import { SupabaseClient } from '@supabase/supabase-js'
import { MessageRepository } from '../../application/repositories'
import { Message } from '../../domain/entities'

export class SupabaseMessageRepository implements MessageRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findByConversationId(tenantId: string, conversationId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return (data || []).map(this.toDomain)
  }

  async listByTenant(tenantId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return (data || []).map(this.toDomain)
  }

  async findByWamid(tenantId: string, wamid: string): Promise<Message | null> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('wamid', wamid)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data ? this.toDomain(data) : null
  }

  async create(input: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
    const { data, error } = await this.supabase
      .from('messages')
      .insert({
        tenant_id: input.tenantId,
        conversation_id: input.conversationId,
        lead_id: input.leadId,
        content: input.content,
        sender_id: input.senderId,
        sender_name: input.senderName,
        sender_type: input.senderType,
        channel: input.channel,
        read: input.read,
        wamid: input.wamid,
        media_url: input.mediaUrl,
        media_type: input.mediaType,
        status: input.status,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toDomain(data)
  }

  async update(tenantId: string, id: string, input: Partial<Message>): Promise<Message> {
    const { data, error } = await this.supabase
      .from('messages')
      .update({
        content: input.content,
        read: input.read,
        status: input.status,
        media_url: input.mediaUrl,
        media_type: input.mediaType,
      })
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toDomain(data)
  }

  async markAsRead(tenantId: string, conversationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('messages')
      .update({ read: true, status: 'read' })
      .eq('tenant_id', tenantId)
      .eq('conversation_id', conversationId)
      .neq('status', 'read')

    if (error) throw new Error(error.message)
  }

  private toDomain(row: any): Message {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      conversationId: row.conversation_id,
      leadId: row.lead_id,
      content: row.content,
      senderId: row.sender_id,
      senderName: row.sender_name,
      senderType: row.sender_type,
      channel: row.channel,
      read: row.read,
      wamid: row.wamid,
      status: row.status,
      mediaUrl: row.media_url,
      mediaType: row.media_type,
      createdAt: row.created_at,
    }
  }
}
