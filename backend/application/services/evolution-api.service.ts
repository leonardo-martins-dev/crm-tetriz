export interface CreateInstanceResponse {
  instance: {
    instanceName: string
    instanceId: string
    status: string
  }
  hash: {
    apikey: string
  }
  qrcode?: {
    code: string
    base64: string
  }
}

export interface EvolutionApiService {
  createInstance(params: {
    instanceName: string
    globalApiKey: string
  }): Promise<CreateInstanceResponse>

  connectInstance(
    instanceName: string,
    apiKey: string
  ): Promise<{ base64?: string; pairingCode?: string }>

  getConnectionState(
    instanceName: string,
    apiKey: string
  ): Promise<{ instance?: { state: 'open' | 'close' | 'connecting' } }>

  deleteInstance(instanceName: string, apiKey: string): Promise<void>

  sendTextMessage(params: {
    instanceName: string
    apiKey: string
    recipientPhone: string
    message: string
  }): Promise<{ key: { id: string } }>

  setWebhook(params: {
    instanceName: string
    apiKey: string
    url: string
    events: string[]
  }): Promise<void>
}
