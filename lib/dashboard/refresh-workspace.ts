import { useConnectionsStore } from '@/lib/stores/connectionsStore'
import { useLeadsStore } from '@/lib/stores/leadsStore'
import { useConversationsStore } from '@/lib/stores/conversationsStore'
import { useAuthStore } from '@/lib/stores/authStore'

export type RefreshWorkspaceOptions = {
  /**
   * Sync pelo inbox: recarrega leads ordenados por `updated_at` (última atividade),
   * para que conversas recentes apareçam após reconstruir mensagens no store.
   */
  inboxSync?: boolean
}

export type RefreshWorkspaceResult = {
  /** Importação Evolution→Supabase (só quando `inboxSync: true`). */
  evolutionSync?: {
    skipped: boolean
    ok?: boolean
    status?: number
    detail?: string
    leadsCreated?: number
    leadsUpdated?: number
    messagesInserted?: number
  }
}

/**
 * Atualiza conexões, leads e reconstrói conversas/mensagens a partir do Supabase.
 * Usar após "Sincronizar" ou quando o canal WhatsApp já está ligado mas a UI estava vazia.
 */
export async function refreshWorkspaceData(opts?: RefreshWorkspaceOptions): Promise<RefreshWorkspaceResult> {
  const out: RefreshWorkspaceResult = {}
  await useConnectionsStore.getState().fetchConnections()

  /** Inbox: importar chats da Evolution → leads/mensagens no Supabase (a UI só lê o banco). */
  if (opts?.inboxSync) {
    const tenantId = useAuthStore.getState().user?.tenantId
    const evolutionConn = useConnectionsStore
      .getState()
      .connections.find((c) => c.provider === 'evolution' && c.connected && c.instanceName)
    if (!tenantId || !evolutionConn?.instanceName) {
      out.evolutionSync = { skipped: true }
    } else {
      try {
        const res = await fetch('/api/evolution/sync-chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantId, instanceName: evolutionConn.instanceName }),
        })
        const raw = await res.text()
        let parsed: Record<string, unknown> | null = null
        try {
          parsed = JSON.parse(raw) as Record<string, unknown>
        } catch {
          /* not JSON */
        }
        if (!res.ok) {
          const detail =
            (parsed?.error as string) ||
            (parsed?.detail as string) ||
            raw.slice(0, 500)
          console.warn('[refreshWorkspace] sync-chats', res.status, detail)
          out.evolutionSync = { skipped: false, ok: false, status: res.status, detail }
        } else {
          out.evolutionSync = {
            skipped: false,
            ok: true,
            leadsCreated: typeof parsed?.leadsCreated === 'number' ? parsed.leadsCreated : undefined,
            leadsUpdated: typeof parsed?.leadsUpdated === 'number' ? parsed.leadsUpdated : undefined,
            messagesInserted: typeof parsed?.messagesInserted === 'number' ? parsed.messagesInserted : undefined,
          }
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        console.warn('[refreshWorkspace] sync-chats', e)
        out.evolutionSync = { skipped: false, ok: false, detail: msg }
      }
    }
  }

  if (opts?.inboxSync) {
    await useLeadsStore.getState().fetchLeads({ orderBy: 'updated_at' })
  } else {
    await useLeadsStore.getState().fetchLeads()
  }

  const leads = useLeadsStore.getState().leads
  await useConversationsStore.getState().initializeConversations(leads)
  return out
}
