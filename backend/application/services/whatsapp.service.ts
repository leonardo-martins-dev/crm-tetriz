/**
 * Interface para comunicação com a WhatsApp Cloud API (Meta).
 * A camada de aplicação depende apenas desta interface.
 * A implementação concreta fica na camada de infraestrutura.
 */
export interface WhatsAppService {
  /**
   * Envia uma mensagem de texto via WhatsApp Cloud API.
   */
  sendTextMessage(params: {
    phoneNumberId: string
    accessToken: string
    recipientPhone: string
    message: string
  }): Promise<{ wamid: string }>

  /**
   * Valida a assinatura do webhook recebido do Meta.
   */
  verifyWebhookSignature(params: {
    signature: string
    body: string
    appSecret: string
  }): boolean

  /**
   * Marca uma mensagem como lida no WhatsApp.
   */
  markAsRead(params: {
    phoneNumberId: string
    accessToken: string
    messageId: string
  }): Promise<void>
}
