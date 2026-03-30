import { Conversation } from '../../domain/entities'

export interface ConversationRepository {
  findById(tenantId: string, id: string): Promise<Conversation | null>
  findByLeadId(tenantId: string, leadId: string): Promise<Conversation | null>
  list(tenantId: string): Promise<Conversation[]>
  create(data: Omit<Conversation, 'id' | 'createdAt'>): Promise<Conversation>
  update(tenantId: string, id: string, data: Partial<Conversation>): Promise<Conversation>
}
