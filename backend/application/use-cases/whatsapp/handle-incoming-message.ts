import { LeadRepository } from '../../repositories'
import { ConversationRepository } from '../../repositories'
import { MessageRepository } from '../../repositories'
import { ConnectionRepository } from '../../repositories'
import { AgentRepository } from '../../repositories'
import { WhatsAppService, EvolutionApiService } from '../../services'
import { AiOrchestratorService } from '../../services'
import { MessageSenderType } from '../../../domain/enums'
import { NotFoundError } from '../../../domain/errors/domain-errors'
import { Lead } from '../../../domain/entities'

export interface WebhookMessagePayload {
  phoneNumberId?: string // Usado na Meta
  instanceName?: string  // Usado na Evolution
  from: string       // Número do remetente
  messageId: string  // wamid
  text: string
  timestamp: string
  senderName?: string
}

interface HandleIncomingMessageDeps {
  leadRepo: LeadRepository
  conversationRepo: ConversationRepository
  messageRepo: MessageRepository
  connectionRepo: ConnectionRepository
  agentRepo: AgentRepository
  whatsappService: WhatsAppService
  evolutionService?: EvolutionApiService
  aiOrchestrator: AiOrchestratorService
}

/**
 * Use case: Processa uma mensagem recebida via webhook do WhatsApp (Meta ou Evolution).
 */
export async function handleIncomingMessage(
  payload: WebhookMessagePayload,
  deps: HandleIncomingMessageDeps
): Promise<void> {
  const {
    leadRepo,
    conversationRepo,
    messageRepo,
    connectionRepo,
    agentRepo,
    whatsappService,
    evolutionService,
    aiOrchestrator,
  } = deps

  // 1. Encontra a conexão
  let connection;
  if (payload.instanceName) {
    connection = await connectionRepo.findByInstanceName(payload.instanceName)
  } else if (payload.phoneNumberId) {
    connection = await connectionRepo.findByPhoneNumberId(payload.phoneNumberId)
  }

  if (!connection) {
    throw new NotFoundError('Connection', payload.instanceName || payload.phoneNumberId || 'unknown')
  }

  const tenantId = connection.tenantId

  // 2. Upsert do lead pelo telefone
  let lead = await leadRepo.findByPhone(tenantId, payload.from)
  if (!lead) {
    lead = await leadRepo.create({
      tenantId,
      name: payload.senderName || payload.from,
      phone: payload.from,
      channel: 'whatsapp',
      status: 'new',
      pipelineStage: 'Novo Lead',
      score: 0,
      priority: 'medium',
      window24hOpen: true,
      window24hExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      lastContactAt: new Date().toISOString(),
    })
  } else {
    // Atualiza janela de 24h
    await leadRepo.update(tenantId, lead.id, {
      window24hOpen: true,
      window24hExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      lastContactAt: new Date().toISOString(),
    })
  }

  // 3. Busca/cria conversa
  let conversation = await conversationRepo.findByLeadId(tenantId, lead.id)
  if (!conversation) {
    conversation = await conversationRepo.create({
      tenantId,
      leadId: lead.id,
      assignedTo: lead.assignedTo,
      unreadCount: 1,
      lastMessageAt: new Date().toISOString(),
    })
  } else {
    conversation = await conversationRepo.update(tenantId, conversation.id, {
      unreadCount: conversation.unreadCount + 1,
      lastMessageAt: new Date().toISOString(),
    })
  }

  // 4. Salva a mensagem
  await messageRepo.create({
    tenantId,
    conversationId: conversation.id,
    leadId: lead.id,
    content: payload.text,
    senderId: lead.id,
    senderName: lead.name,
    senderType: MessageSenderType.LEAD,
    channel: 'whatsapp',
    read: false,
    wamid: payload.messageId,
  })

  // 5. Verifica triggers de agentes IA
  await checkAndTriggerAgents(lead, tenantId, conversation.id, payload.text, deps)
}

/**
 * Verifica se algum agente IA deve responder baseado nas condições do lead.
 */
async function checkAndTriggerAgents(
  lead: Lead,
  tenantId: string,
  conversationId: string,
  incomingText: string,
  deps: HandleIncomingMessageDeps
): Promise<void> {
  const { agentRepo, messageRepo, connectionRepo, whatsappService, aiOrchestrator } = deps

  // Busca agentes ativos com trigger matching pipeline stage
  const matchingAgents = await agentRepo.findActiveByTrigger(
    tenantId,
    'pipeline_stage',
    lead.pipelineStage
  )

  if (matchingAgents.length === 0) return

  const agent = matchingAgents[0] // Usa o primeiro que deu match

  // Busca histórico recente para contexto
  const recentMessages = await messageRepo.findByConversationId(tenantId, conversationId)
  const history = recentMessages.slice(-10).map((msg) => ({
    role: (msg.senderType === MessageSenderType.LEAD ? 'user' : 'assistant') as 'user' | 'assistant',
    content: msg.content,
  }))

  // Gera resposta via IA
  const aiResponse = await aiOrchestrator.generateResponse({
    model: agent.model,
    apiKey: agent.apiKeyEncrypted, // Na prática, será descriptografado antes
    systemPrompt: agent.prompt,
    conversationHistory: history,
  })

  if (!aiResponse.content) return

  // Busca a conexão do tenant para enviar via WhatsApp
  const connections = await connectionRepo.findByTenantId(tenantId)
  const activeConnection = connections.find((c) => c.status === 'active')
  if (!activeConnection || !lead.phone) return

  // Envia via WhatsApp
  let wamid = ''
  if (activeConnection.provider === 'evolution' && deps.evolutionService) {
    if (!activeConnection.instanceName) return
    const sendResult = await deps.evolutionService.sendTextMessage({
      instanceName: activeConnection.instanceName,
      apiKey: activeConnection.evolutionApiKey || process.env.EVOLUTION_API_KEY || 'mude-me',
      recipientPhone: lead.phone,
      message: aiResponse.content,
    })
    wamid = sendResult.key?.id || ''
  } else {
    // Caso seja Meta
    if (!activeConnection.phoneNumberId || !activeConnection.accessTokenEncrypted) return
    
    const sendResult = await deps.whatsappService.sendTextMessage({
      phoneNumberId: activeConnection.phoneNumberId,
      accessToken: activeConnection.accessTokenEncrypted, // Descriptografado na infra
      recipientPhone: lead.phone,
      message: aiResponse.content,
    })
    wamid = sendResult.wamid
  }

  // Salva a mensagem da IA no banco
  await messageRepo.create({
    tenantId,
    conversationId,
    leadId: lead.id,
    content: aiResponse.content,
    senderId: agent.id,
    senderName: agent.name,
    senderType: MessageSenderType.AI,
    channel: 'whatsapp',
    read: true,
    wamid: wamid,
  })
}

