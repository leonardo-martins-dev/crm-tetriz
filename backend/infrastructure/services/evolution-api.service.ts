import { CreateInstanceResponse, EvolutionApiService } from '../../application/services/evolution-api.service'
import { ExternalServiceError } from '../../domain/errors/domain-errors'

// Por hora assumimos localhost para dev, mas pode ser configurado via env.
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080'

export class EvolutionApiServiceImpl implements EvolutionApiService {
  async createInstance(params: {
    instanceName: string
    globalApiKey: string
  }): Promise<CreateInstanceResponse> {
    const url = `${EVOLUTION_API_URL}/instance/create`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: params.globalApiKey,
      },
      body: JSON.stringify({
        instanceName: params.instanceName,
        integration: 'WHATSAPP-BAILEYS',
        qrcode: true,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new ExternalServiceError('Evolution API Create', `Falha ao criar: ${response.status} - ${errorBody}`)
    }

    return response.json()
  }

  async connectInstance(
    instanceName: string,
    apiKey: string
  ): Promise<{ base64?: string; pairingCode?: string }> {
    const url = `${EVOLUTION_API_URL}/instance/connect/${instanceName}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: apiKey,
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new ExternalServiceError('Evolution API Connect', `Falha ao conectar: ${response.status} - ${errorBody}`)
    }

    return response.json()
  }

  async getConnectionState(
    instanceName: string,
    apiKey: string
  ): Promise<{ instance?: { state: 'open' | 'close' | 'connecting' } }> {
    const url = `${EVOLUTION_API_URL}/instance/connectionState/${instanceName}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: apiKey,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return { instance: { state: 'close' } } // Se não acha a instância
      }
      const errorBody = await response.text()
      throw new ExternalServiceError('Evolution API State', `Falha ao obter estado: ${response.status} - ${errorBody}`)
    }

    return response.json()
  }

  async deleteInstance(instanceName: string, apiKey: string): Promise<void> {
    const url = `${EVOLUTION_API_URL}/instance/delete/${instanceName}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        apikey: apiKey,
      },
    })

    if (!response.ok) {
      if (response.status === 404) return // Já não existe
      const errorBody = await response.text()
      throw new ExternalServiceError('Evolution API Delete', `Falha ao deletar: ${response.status} - ${errorBody}`)
    }
  }

  async sendTextMessage(params: {
    instanceName: string
    apiKey: string
    recipientPhone: string
    message: string
  }): Promise<{ key: { id: string } }> {
    const url = `${EVOLUTION_API_URL}/message/sendText/${params.instanceName}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: params.apiKey,
      },
      body: JSON.stringify({
        number: params.recipientPhone,
        text: params.message,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new ExternalServiceError('Evolution API Send Message', `Falha ao enviar: ${response.status} - ${errorBody}`)
    }

    return response.json()
  }

  async setWebhook(params: {
    instanceName: string
    apiKey: string
    url: string
    events: string[]
  }): Promise<void> {
    const apiUrl = `${EVOLUTION_API_URL}/webhook/set/${params.instanceName}`
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: params.apiKey,
      },
      body: JSON.stringify({
        url: params.url,
        webhook_by_events: true,
        webhook_base64: false,
        events: params.events,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new ExternalServiceError('Evolution API Set Webhook', `Falha ao setar webhook: ${response.status} - ${errorBody}`)
    }
  }
}
