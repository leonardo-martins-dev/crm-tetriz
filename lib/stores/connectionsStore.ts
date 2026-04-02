import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/authStore'

export type ConnectionProvider = 'meta' | 'evolution'
export type ConnectionType = 'whatsapp'

export interface Connection {
  id: string
  tenantId: string
  type: ConnectionType
  provider: ConnectionProvider
  name: string
  connected: boolean
  // Meta fields
  phoneNumberId?: string
  wabaId?: string
  // Evolution fields
  instanceName?: string
  instanceId?: string
  evolutionApiKey?: string
  // Common
  accountName?: string
  connectedAt?: string
  lastSync?: string
}

interface ConnectionsState {
  connections: Connection[]
  isLoading: boolean
  fetchConnections: () => Promise<void>
  updateConnection: (id: string, updates: Partial<Connection>) => Promise<void>
  getConnection: (id: string) => Connection | undefined
  getActiveConnection: () => Connection | undefined
  connectEvolution: (instanceName: string, evolutionApiKey: string) => Promise<void>
  disconnectProvider: (id: string) => Promise<void>
}

const mapConnectionFromDb = (row: any): Connection => ({
  id: row.id,
  tenantId: row.tenant_id,
  type: row.type as ConnectionType,
  provider: row.provider as ConnectionProvider,
  name: row.name,
  connected: row.connected,
  phoneNumberId: row.phone_number_id,
  wabaId: row.waba_id,
  instanceName: row.instance_name,
  instanceId: row.instance_id,
  evolutionApiKey: row.evolution_api_key,
  accountName: row.account_name,
  connectedAt: row.connected_at,
  lastSync: row.last_sync,
})

export const useConnectionsStore = create<ConnectionsState>((set, get) => ({
  connections: [],
  isLoading: false,

  fetchConnections: async () => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .eq('tenant_id', tenantId)

      if (error) throw error

      set({ connections: (data || []).map(mapConnectionFromDb), isLoading: false })
    } catch (err) {
      console.error('Erro ao buscar conexões:', err)
      set({ isLoading: false })
    }
  },

  updateConnection: async (id, updates) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    try {
      const rowUpdates: any = {}
      if (updates.name !== undefined) rowUpdates.name = updates.name
      if (updates.connected !== undefined) rowUpdates.connected = updates.connected
      if (updates.accountName !== undefined) rowUpdates.account_name = updates.accountName
      if (updates.instanceName !== undefined) rowUpdates.instance_name = updates.instanceName

      const { error } = await supabase
        .from('connections')
        .update(rowUpdates)
        .eq('id', id)
        .eq('tenant_id', tenantId)

      if (error) throw error

      set((state) => ({
        connections: state.connections.map((conn) =>
          conn.id === id ? { ...conn, ...updates } : conn
        ),
      }))
    } catch (err) {
      console.error('Erro ao atualizar conexão:', err)
    }
  },

  getConnection: (id) => {
    return get().connections.find((conn) => conn.id === id)
  },

  getActiveConnection: () => {
    return get().connections.find((conn) => conn.connected)
  },

  connectEvolution: async (instanceName, evolutionApiKey) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    const conn = get().connections.find(c => c.provider === 'evolution')
    if (!conn) return

    await get().updateConnection(conn.id, {
      connected: true,
      instanceName,
      evolutionApiKey,
      connectedAt: new Date().toISOString(),
      accountName: instanceName,
      lastSync: new Date().toISOString(),
    })
  },

  disconnectProvider: async (id) => {
    await get().updateConnection(id, {
      connected: false,
      accountName: undefined,
      instanceName: undefined,
      evolutionApiKey: undefined,
      phoneNumberId: undefined,
      wabaId: undefined,
    })
  },
}))

