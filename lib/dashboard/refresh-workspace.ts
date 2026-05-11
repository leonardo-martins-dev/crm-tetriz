import { useConnectionsStore } from '@/lib/stores/connectionsStore'
import { useLeadsStore } from '@/lib/stores/leadsStore'
import { useConversationsStore } from '@/lib/stores/conversationsStore'

/**
 * Atualiza conexões, leads e reconstrói conversas/mensagens a partir do Supabase.
 * Usar após "Sincronizar" ou quando o canal WhatsApp já está ligado mas a UI estava vazia.
 */
export async function refreshWorkspaceData(): Promise<void> {
  await useConnectionsStore.getState().fetchConnections()
  await useLeadsStore.getState().fetchLeads()
  const leads = useLeadsStore.getState().leads
  await useConversationsStore.getState().initializeConversations(leads)
}
