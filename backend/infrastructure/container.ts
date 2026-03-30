import { SupabaseClient } from '@supabase/supabase-js'
import { SupabaseLeadRepository } from './repositories/supabase-lead.repository'
import { SupabaseMessageRepository } from './repositories/supabase-message.repository'
import { MetaWhatsAppService } from './services/meta-whatsapp.service'
import { OpenAiOrchestratorService } from './services/openai-orchestrator.service'

/**
 * Container de Injeção de Dependência.
 * Factory que cria repositórios e serviços com o SupabaseClient injetado.
 *
 * Uso:
 * ```ts
 * const container = createContainer(supabaseClient)
 * const leads = await container.leadRepo.list(tenantId)
 * ```
 */
export function createContainer(supabase: SupabaseClient) {
  return {
    // Repositories
    leadRepo: new SupabaseLeadRepository(supabase),
    messageRepo: new SupabaseMessageRepository(supabase),
    // Adicionar os demais repositórios aqui conforme implementados:
    // conversationRepo: new SupabaseConversationRepository(supabase),
    // connectionRepo: new SupabaseConnectionRepository(supabase),
    // agentRepo: new SupabaseAgentRepository(supabase),
    // tenantRepo: new SupabaseTenantRepository(supabase),
    // profileRepo: new SupabaseProfileRepository(supabase),

    // Services (sem dependência de Supabase)
    whatsappService: new MetaWhatsAppService(),
    aiOrchestrator: new OpenAiOrchestratorService(),
  }
}

export type Container = ReturnType<typeof createContainer>
