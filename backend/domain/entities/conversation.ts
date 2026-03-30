export interface Conversation {
  id: string
  tenantId: string
  leadId: string
  assignedTo?: string
  unreadCount: number
  lastMessageAt?: string
  createdAt: string
}
