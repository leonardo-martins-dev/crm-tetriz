import { MessageSenderType } from '../enums'

export interface Message {
  id: string
  tenantId: string
  conversationId: string
  leadId: string
  content: string
  senderId: string
  senderName: string
  senderType: MessageSenderType
  channel: string
  read: boolean
  wamid?: string // WhatsApp Message ID (Meta)
  createdAt: string
}
