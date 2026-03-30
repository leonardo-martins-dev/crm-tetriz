/**
 * Interface para orquestração de chamadas a LLMs (OpenAI, Anthropic, etc).
 */
export interface AiOrchestratorService {
  /**
   * Gera uma resposta baseada no prompt do agente e no histórico de mensagens.
   */
  generateResponse(params: {
    model: string
    apiKey: string
    systemPrompt: string
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  }): Promise<{ content: string }>
}
