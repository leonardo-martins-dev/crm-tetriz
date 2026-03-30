import { AiOrchestratorService } from '../../application/services'
import { ExternalServiceError } from '../../domain/errors/domain-errors'

/**
 * Implementação do AiOrchestratorService.
 * Suporta modelos OpenAI e Anthropic baseado no prefixo do model name.
 */
export class OpenAiOrchestratorService implements AiOrchestratorService {
  async generateResponse(params: {
    model: string
    apiKey: string
    systemPrompt: string
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  }): Promise<{ content: string }> {
    const isAnthropic = params.model.startsWith('claude')

    if (isAnthropic) {
      return this.callAnthropic(params)
    }

    return this.callOpenAi(params)
  }

  private async callOpenAi(params: {
    model: string
    apiKey: string
    systemPrompt: string
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  }): Promise<{ content: string }> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      },
      body: JSON.stringify({
        model: params.model,
        messages: [
          { role: 'system', content: params.systemPrompt },
          ...params.conversationHistory,
        ],
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new ExternalServiceError('OpenAI', `Status ${response.status}`)
    }

    const data = await response.json()
    return { content: data.choices?.[0]?.message?.content || '' }
  }

  private async callAnthropic(params: {
    model: string
    apiKey: string
    systemPrompt: string
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  }): Promise<{ content: string }> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': params.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: params.model,
        system: params.systemPrompt,
        messages: params.conversationHistory,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new ExternalServiceError('Anthropic', `Status ${response.status}`)
    }

    const data = await response.json()
    return { content: data.content?.[0]?.text || '' }
  }
}
