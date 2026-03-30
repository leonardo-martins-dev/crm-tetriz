import { WhatsAppService } from '../../application/services'
import { ExternalServiceError } from '../../domain/errors/domain-errors'
import { createHmac } from 'crypto'

const META_API_BASE = 'https://graph.facebook.com/v21.0'

/**
 * Implementação concreta do WhatsAppService usando a Meta Cloud API.
 */
export class MetaWhatsAppService implements WhatsAppService {
  async sendTextMessage(params: {
    phoneNumberId: string
    accessToken: string
    recipientPhone: string
    message: string
  }): Promise<{ wamid: string }> {
    const url = `${META_API_BASE}/${params.phoneNumberId}/messages`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: params.recipientPhone,
        type: 'text',
        text: { body: params.message },
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new ExternalServiceError('Meta WhatsApp', `Falha ao enviar: ${response.status} - ${errorBody}`)
    }

    const data = await response.json()
    const wamid = data?.messages?.[0]?.id || ''

    return { wamid }
  }

  verifyWebhookSignature(params: {
    signature: string
    body: string
    appSecret: string
  }): boolean {
    const expectedSignature = createHmac('sha256', params.appSecret)
      .update(params.body)
      .digest('hex')

    return `sha256=${expectedSignature}` === params.signature
  }

  async markAsRead(params: {
    phoneNumberId: string
    accessToken: string
    messageId: string
  }): Promise<void> {
    const url = `${META_API_BASE}/${params.phoneNumberId}/messages`

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: params.messageId,
      }),
    })
  }
}
