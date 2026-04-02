import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleIncomingMessage, WebhookMessagePayload } from './handle-incoming-message'
import { 
  mockLeadRepository, 
  mockConversationRepository, 
  mockMessageRepository, 
  mockConnectionRepository, 
  mockAgentRepository,
  mockWhatsAppService,
  mockAiOrchestrator,
  mockStorageService,
  mockEvolutionService
} from '../../../../tests/mocks'
import { MessageSenderType } from '../../../domain/enums'

describe('handleIncomingMessage', () => {
  const mockDeps = {
    leadRepo: mockLeadRepository as any,
    conversationRepo: mockConversationRepository as any,
    messageRepo: mockMessageRepository as any,
    connectionRepo: mockConnectionRepository as any,
    agentRepo: mockAgentRepository as any,
    whatsappService: mockWhatsAppService as any,
    evolutionService: mockEvolutionService as any,
    aiOrchestrator: mockAiOrchestrator as any,
    storageService: mockStorageService as any,
  }

  const payload: WebhookMessagePayload = {
    instanceName: 'test-instance',
    from: '5511999999999',
    messageId: 'msg-123',
    text: 'Olá',
    timestamp: Date.now().toString(),
    senderName: 'João Silva'
  }

  const mockConnection = {
    id: 'conn-1',
    tenantId: 'tenant-123',
    provider: 'evolution',
    instanceName: 'test-instance',
    status: 'active'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockConnectionRepository.findByInstanceName.mockResolvedValue(mockConnection)
    mockLeadRepository.findByPhone.mockResolvedValue(null)
    mockLeadRepository.create.mockResolvedValue({ id: 'lead-1', name: 'João Silva', phone: '5511999999999' })
    mockConversationRepository.findByLeadId.mockResolvedValue(null)
    mockConversationRepository.create.mockResolvedValue({ id: 'conv-1' })
    mockAgentRepository.findActiveByTrigger.mockResolvedValue([])
    mockMessageRepository.findByConversationId.mockResolvedValue([])
  })

  it('deve criar um novo lead se ele não existir', async () => {
    await handleIncomingMessage(payload, mockDeps)

    expect(mockLeadRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      phone: payload.from,
      tenantId: mockConnection.tenantId
    }))
  })

  it('deve atualizar a janela de 24h de um lead existente', async () => {
    mockLeadRepository.findByPhone.mockResolvedValue({ id: 'lead-1', phone: '5511999999999' })

    await handleIncomingMessage(payload, mockDeps)

    expect(mockLeadRepository.update).toHaveBeenCalledWith(
      mockConnection.tenantId,
      'lead-1',
      expect.objectContaining({ window24hOpen: true })
    )
  })

  it('deve salvar a mensagem recebida no repositório', async () => {
    await handleIncomingMessage(payload, mockDeps)

    expect(mockMessageRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      content: payload.text,
      senderType: MessageSenderType.LEAD,
      wamid: payload.messageId
    }))
  })

  it('deve disparar o agente de IA se houver um trigger correspondente', async () => {
    const mockAgent = {
      id: 'agent-1',
      name: 'Bot',
      model: 'gpt-4o',
      prompt: 'Responda oi',
      active: true
    }
    
    // Configura os mocks necessários para o fluxo da IA
    mockAgentRepository.findActiveByTrigger.mockResolvedValue([mockAgent])
    mockAiOrchestrator.generateResponse.mockResolvedValue({ content: 'Olá, sou o Bot!' })
    mockConnectionRepository.findByTenantId.mockResolvedValue([mockConnection])
    mockEvolutionService.sendTextMessage.mockResolvedValue({ key: { id: 'ai-msg-1' } })
    mockMessageRepository.create.mockResolvedValue({ id: 'msg-rec-1' })
    mockLeadRepository.update.mockResolvedValue({ id: 'lead-1' })

    await handleIncomingMessage(payload, mockDeps)

    expect(mockAiOrchestrator.generateResponse).toHaveBeenCalled()
    expect(mockEvolutionService.sendTextMessage).toHaveBeenCalled()
    
    // Verifica se salvou tanto a mensagem do lead quanto a da IA
    expect(mockMessageRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ senderType: MessageSenderType.LEAD })
    )
    expect(mockMessageRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ senderType: MessageSenderType.AI })
    )
  })

  it('deve processar e fazer upload de mídia se houver no payload', async () => {
    const mediaPayload: WebhookMessagePayload = {
      ...payload,
      media: {
        type: 'image',
        mimetype: 'image/jpeg',
        base64: 'base64data'
      }
    }
    mockStorageService.uploadFile.mockResolvedValue({ publicUrl: 'https://storage.com/media.jpg' })

    await handleIncomingMessage(mediaPayload, mockDeps)

    expect(mockStorageService.uploadFile).toHaveBeenCalled()
    expect(mockMessageRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      mediaUrl: 'https://storage.com/media.jpg',
      mediaType: 'image'
    }))
  })
})
