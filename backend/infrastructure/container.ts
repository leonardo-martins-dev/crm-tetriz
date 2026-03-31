import { SupabaseClient } from '@supabase/supabase-js'
import { SupabaseLeadRepository } from './repositories/supabase-lead.repository'
import { SupabaseMessageRepository } from './repositories/supabase-message.repository'
import { SupabaseConnectionRepository } from './repositories/supabase-connection.repository'
import { SupabaseConversationRepository } from './repositories/supabase-conversation.repository'
import { SupabaseAgentRepository } from './repositories/supabase-agent.repository'

import { MetaWhatsAppService } from './services/meta-whatsapp.service'
import { EvolutionApiServiceImpl } from './services/evolution-api.service'
import { OpenAiOrchestratorService } from './services/openai-orchestrator.service'

/**
 * Injeção de Dependência rápida via factory.
 * Registra as implementações concretas (Infra) nos slots das interfaces (Application).
 */
export function createContainer(supabase: SupabaseClient) {
  // Repositories
  const leadRepo = new SupabaseLeadRepository(supabase)
  const messageRepo = new SupabaseMessageRepository(supabase)
  const connectionRepo = new SupabaseConnectionRepository(supabase)
  const conversationRepo = new SupabaseConversationRepository(supabase)
  const agentRepo = new SupabaseAgentRepository(supabase)

  // Services
  const whatsappService = new MetaWhatsAppService()
  const evolutionService = new EvolutionApiServiceImpl()
  const aiOrchestrator = new OpenAiOrchestratorService()

  return {
    leadRepo,
    messageRepo,
    connectionRepo,
    conversationRepo,
    agentRepo,
    whatsappService,
    evolutionService,
    aiOrchestrator,
  }
}

export type Container = ReturnType<typeof createContainer>
