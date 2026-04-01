import { Message } from '../../domain/entities'

export interface MessageRepository {
  findByConversationId(tenantId: string, conversationId: string): Promise<Message[]>
  findByWamid(tenantId: string, wamid: string): Promise<Message | null>
  create(data: Omit<Message, 'id' | 'createdAt'>): Promise<Message>
  update(tenantId: string, id: string, data: Partial<Message>): Promise<Message>
  markAsRead(tenantId: string, conversationId: string): Promise<void>
}
