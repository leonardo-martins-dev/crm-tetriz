import { MessageRepository } from '../../repositories'

export interface MessageStatusUpdatePayload {
  instanceName?: string
  wamid: string
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | number
}

interface HandleMessageStatusUpdateDeps {
  messageRepo: MessageRepository
}

/**
 * Use case: Atualiza o status de uma mensagem enviada.
 */
export async function handleMessageStatusUpdate(
  tenantId: string,
  payload: MessageStatusUpdatePayload,
  deps: HandleMessageStatusUpdateDeps
): Promise<void> {
  const { messageRepo } = deps

  // 1. Encontra a mensagem pelo wamid
  const message = await messageRepo.findByWamid(tenantId, payload.wamid)
  if (!message) {
    // Pode ser uma mensagem antiga ou enviada por outro sistema, ignoramos silenciosamente
    return
  }

  // 2. Mapeia o status numérico da Evolution se necessário
  let finalStatus: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  
  if (typeof payload.status === 'number') {
    switch (payload.status) {
      case 1: finalStatus = 'pending'; break
      case 2: finalStatus = 'sent'; break
      case 3: finalStatus = 'delivered'; break
      case 4: finalStatus = 'read'; break
      default: finalStatus = 'sent'
    }
  } else {
    finalStatus = payload.status
  }

  // 3. Atualiza se o status for "maior" que o atual (evita race conditions de webhooks atrasados)
  const statusPriority = {
    'failed': 0,
    'pending': 1,
    'sent': 2,
    'delivered': 3,
    'read': 4
  }

  const currentPriority = statusPriority[message.status || 'pending']
  const newPriority = statusPriority[finalStatus]

  if (newPriority > currentPriority) {
    await messageRepo.update(tenantId, message.id, {
      status: finalStatus,
      read: finalStatus === 'read'
    })
  }
}
