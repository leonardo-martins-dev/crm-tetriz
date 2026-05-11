import { useConnectionsStore } from '@/lib/stores/connectionsStore'
import { useLeadsStore } from '@/lib/stores/leadsStore'
import { useConversationsStore } from '@/lib/stores/conversationsStore'

export type RefreshWorkspaceOptions = {
  /**
   * Sync pelo inbox: recarrega leads ordenados por `updated_at` (última atividade),
   * para que conversas recentes apareçam após reconstruir mensagens no store.
   */
  inboxSync?: boolean
}

/**
 * Atualiza conexões, leads e reconstrói conversas/mensagens a partir do Supabase.
 * Usar após "Sincronizar" ou quando o canal WhatsApp já está ligado mas a UI estava vazia.
 */
export async function refreshWorkspaceData(opts?: RefreshWorkspaceOptions): Promise<void> {
  await useConnectionsStore.getState().fetchConnections()

  if (opts?.inboxSync) {
    await useLeadsStore.getState().fetchLeads({ orderBy: 'updated_at' })
  } else {
    await useLeadsStore.getState().fetchLeads()
  }

  const leads = useLeadsStore.getState().leads
  await useConversationsStore.getState().initializeConversations(leads)
}
