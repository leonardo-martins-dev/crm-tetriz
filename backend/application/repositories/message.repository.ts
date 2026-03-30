import { Message } from '../../domain/entities'

export interface MessageRepository {
  findByConversationId(tenantId: string, conversationId: string): Promise<Message[]>
  create(data: Omit<Message, 'id' | 'createdAt'>): Promise<Message>
  markAsRead(tenantId: string, conversationId: string): Promise<void>
}
