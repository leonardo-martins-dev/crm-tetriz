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
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toDomain(data)
  }

  async markAsRead(tenantId: string, conversationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('messages')
      .update({ read: true })
      .eq('tenant_id', tenantId)
      .eq('conversation_id', conversationId)
      .eq('read', false)

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
      createdAt: row.created_at,
    }
  }
}
