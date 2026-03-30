import { ConversationRepository, MessageRepository, ConnectionRepository, LeadRepository } from '../../repositories'
import { WhatsAppService } from '../../services'
import { MessageSenderType } from '../../../domain/enums'
import { NotFoundError } from '../../../domain/errors/domain-errors'

interface SendOutgoingMessageInput {
  tenantId: string
  conversationId: string
  content: string
  senderId: string
  senderName: string
}

interface SendOutgoingMessageDeps {
  leadRepo: LeadRepository
  conversationRepo: ConversationRepository
  messageRepo: MessageRepository
  connectionRepo: ConnectionRepository
  whatsappService: WhatsAppService
}

/**
 * Use case: Envia mensagem de um atendente humano para o lead via WhatsApp.
 *
 * Responsabilidades:
 * 1. Busca a conversa e o lead
 * 2. Envia via WhatsApp Cloud API
 * 3. Salva no banco
 * 4. Atualiza assigned_to do lead (humano assume)
 */
export async function sendOutgoingMessage(
  input: SendOutgoingMessageInput,
  deps: SendOutgoingMessageDeps
): Promise<void> {
  const { leadRepo, conversationRepo, messageRepo, connectionRepo, whatsappService } = deps

  // 1. Busca a conversa
  const conversation = await conversationRepo.findById(input.tenantId, input.conversationId)
  if (!conversation) {
    throw new NotFoundError('Conversation', input.conversationId)
  }

  // 2. Busca o lead para pegar o telefone
  const lead = await leadRepo.findById(input.tenantId, conversation.leadId)
  if (!lead || !lead.phone) {
    throw new NotFoundError('Lead')
  }

  // 3. Busca conexão ativa do tenant
  const connections = await connectionRepo.findByTenantId(input.tenantId)
  const activeConnection = connections.find((c) => c.status === 'active')
  if (!activeConnection) {
    throw new NotFoundError('Connection ativa')
  }

  // 4. Envia via WhatsApp Cloud API
  const sendResult = await whatsappService.sendTextMessage({
    phoneNumberId: activeConnection.phoneNumberId,
    accessToken: activeConnection.accessTokenEncrypted,
    recipientPhone: lead.phone,
    message: input.content,
  })

  // 5. Salva a mensagem no banco
  await messageRepo.create({
    tenantId: input.tenantId,
    conversationId: input.conversationId,
    leadId: lead.id,
    content: input.content,
    senderId: input.senderId,
    senderName: input.senderName,
    senderType: MessageSenderType.USER,
    channel: 'whatsapp',
    read: true,
    wamid: sendResult.wamid,
  })

  // 6. Atualiza conversa
  await conversationRepo.update(input.tenantId, input.conversationId, {
    lastMessageAt: new Date().toISOString(),
    assignedTo: input.senderId,
    unreadCount: 0,
  })

  // 7. Atendente humano assume o lead
  await leadRepo.update(input.tenantId, lead.id, {
    assignedTo: input.senderId,
    lastContactAt: new Date().toISOString(),
  })
}
