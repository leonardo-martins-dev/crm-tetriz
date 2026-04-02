import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleMessageStatusUpdate, MessageStatusUpdatePayload } from './handle-message-status-update'
import { mockMessageRepository } from '../../../../tests/mocks'

describe('handleMessageStatusUpdate', () => {
  const mockDeps = {
    messageRepo: mockMessageRepository as any,
  }

  const tenantId = 'tenant-123'
  const wamid = 'msg-123'

  const mockMessage = {
    id: 'msg-rec-1',
    status: 'sent',
    wamid: wamid,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockMessageRepository.findByWamid.mockResolvedValue(mockMessage)
  })

  it('deve atualizar o status para delivered', async () => {
    const payload: MessageStatusUpdatePayload = {
      wamid: wamid,
      status: 'delivered'
    }

    await handleMessageStatusUpdate(tenantId, payload, mockDeps)

    expect(mockMessageRepository.update).toHaveBeenCalledWith(
      tenantId,
      mockMessage.id,
      expect.objectContaining({ status: 'delivered' })
    )
  })

  it('deve atualizar o status para read', async () => {
    const payload: MessageStatusUpdatePayload = {
      wamid: wamid,
      status: 'read'
    }

    await handleMessageStatusUpdate(tenantId, payload, mockDeps)

    expect(mockMessageRepository.update).toHaveBeenCalledWith(
      tenantId,
      mockMessage.id,
      expect.objectContaining({ status: 'read', read: true })
    )
  })

  it('deve aceitar status numérico da Evolution API e converter corretamente', async () => {
    const payload: MessageStatusUpdatePayload = {
      wamid: wamid,
      status: 4 // read
    }

    await handleMessageStatusUpdate(tenantId, payload, mockDeps)

    expect(mockMessageRepository.update).toHaveBeenCalledWith(
      tenantId,
      mockMessage.id,
      expect.objectContaining({ status: 'read' })
    )
  })

  it('NÃO deve atualizar status se a nova prioridade for menor que a atual', async () => {
    mockMessageRepository.findByWamid.mockResolvedValue({ ...mockMessage, status: 'read' })

    const payload: MessageStatusUpdatePayload = {
      wamid: wamid,
      status: 'delivered' // Prioridade menor que read
    }

    await handleMessageStatusUpdate(tenantId, payload, mockDeps)

    expect(mockMessageRepository.update).not.toHaveBeenCalled()
  })

  it('deve ignorar silenciosamente se a mensagem não for encontrada', async () => {
    mockMessageRepository.findByWamid.mockResolvedValue(null)

    const payload: MessageStatusUpdatePayload = {
      wamid: 'unknown-id',
      status: 'read'
    }

    await handleMessageStatusUpdate(tenantId, payload, mockDeps)

    expect(mockMessageRepository.update).not.toHaveBeenCalled()
  })
})
