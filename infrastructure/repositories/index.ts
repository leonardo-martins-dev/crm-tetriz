import { LeadRepository } from '@/backend/application/repositories/lead.repository'
import { TenantRepository } from '@/backend/application/repositories/tenant.repository'
import { ProfileRepository } from '@/backend/application/repositories/profile.repository'
import { ConversationRepository } from '@/backend/application/repositories/conversation.repository'
import { MessageRepository } from '@/backend/application/repositories/message.repository'
import { AgentRepository } from '@/backend/application/repositories/agent.repository'
import { ConnectionRepository } from '@/backend/application/repositories/connection.repository'
import { TagRepository } from '@/backend/application/repositories/tag.repository'
import { BroadcastRepository } from '@/backend/application/repositories/broadcast.repository'
import { AutomationRepository } from '@/backend/application/repositories/automation.repository'

import { SupabaseLeadRepository } from '@/backend/infrastructure/repositories/supabase-lead.repository'
import { SupabaseTenantRepository } from '@/backend/infrastructure/repositories/supabase-tenant.repository'
import { SupabaseProfileRepository } from '@/backend/infrastructure/repositories/supabase-profile.repository'
import { SupabaseConversationRepository } from '@/backend/infrastructure/repositories/supabase-conversation.repository'
import { SupabaseMessageRepository } from '@/backend/infrastructure/repositories/supabase-message.repository'
import { SupabaseAgentRepository } from '@/backend/infrastructure/repositories/supabase-agent.repository'
import { SupabaseConnectionRepository } from '@/backend/infrastructure/repositories/supabase-connection.repository'
import { SupabaseTagRepository } from '@/backend/infrastructure/repositories/supabase-tag.repository'
import { SupabaseBroadcastRepository } from '@/backend/infrastructure/repositories/supabase-broadcast.repository'
import { SupabaseAutomationRepository } from '@/backend/infrastructure/repositories/supabase-automation.repository'

import { supabase } from '@/lib/supabase'

// Singletons
let leadRepo: LeadRepository | null = null
let tenantRepo: TenantRepository | null = null
let profileRepo: ProfileRepository | null = null
let conversationRepo: ConversationRepository | null = null
let messageRepo: MessageRepository | null = null
let agentRepo: AgentRepository | null = null
let connectionRepo: ConnectionRepository | null = null
let tagRepo: TagRepository | null = null
let broadcastRepo: BroadcastRepository | null = null
let automationRepo: AutomationRepository | null = null

export const getLeadRepository = (): LeadRepository => {
  if (!leadRepo) leadRepo = new SupabaseLeadRepository(supabase)
  return leadRepo
}

export const getTenantRepository = (): TenantRepository => {
  if (!tenantRepo) tenantRepo = new SupabaseTenantRepository(supabase)
  return tenantRepo
}

export const getProfileRepository = (): ProfileRepository => {
  if (!profileRepo) profileRepo = new SupabaseProfileRepository(supabase)
  return profileRepo
}

export const getConversationRepository = (): ConversationRepository => {
  if (!conversationRepo) conversationRepo = new SupabaseConversationRepository(supabase)
  return conversationRepo
}

export const getMessageRepository = (): MessageRepository => {
  if (!messageRepo) messageRepo = new SupabaseMessageRepository(supabase)
  return messageRepo
}

export const getAgentRepository = (): AgentRepository => {
  if (!agentRepo) agentRepo = new SupabaseAgentRepository(supabase)
  return agentRepo
}

export const getConnectionRepository = (): ConnectionRepository => {
  if (!connectionRepo) connectionRepo = new SupabaseConnectionRepository(supabase)
  return connectionRepo
}

export const getTagRepository = (): TagRepository => {
  if (!tagRepo) tagRepo = new SupabaseTagRepository(supabase)
  return tagRepo
}

export const getBroadcastRepository = (): BroadcastRepository => {
  if (!broadcastRepo) broadcastRepo = new SupabaseBroadcastRepository(supabase)
  return broadcastRepo
}

export const getAutomationRepository = (): AutomationRepository => {
  if (!automationRepo) automationRepo = new SupabaseAutomationRepository(supabase)
  return automationRepo
}
