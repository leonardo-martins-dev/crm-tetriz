import { create } from 'zustand'
import { useAuthStore } from '@/lib/stores/authStore'
import { getConnectionRepository } from '@/infrastructure/repositories'
import { ConnectionStatus } from '@/backend/domain/enums'

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
  connectEvolution: (instanceName: string, evolutionApiKey?: string) => Promise<void>
  ensureConnectionSlot: (provider: ConnectionProvider) => Promise<Connection | null>
  disconnectProvider: (id: string) => Promise<void>
}

const connectionRepo = getConnectionRepository()

export const useConnectionsStore = create<ConnectionsState>((set, get) => ({
  connections: [],
  isLoading: false,

  fetchConnections: async () => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    set({ isLoading: true })
    try {
      const connections = await connectionRepo.findByTenantId(tenantId)

      set({ 
        connections: connections.map((row: any) => ({
          id: row.id,
          tenantId: row.tenantId,
          type: 'whatsapp',
          provider: row.provider as any,
          name: row.provider === 'evolution' ? 'WhatsApp (Evolution)' : 'Meta WhatsApp',
          connected: row.status === 'active' || row.status === 'connected',
          phoneNumberId: row.phoneNumberId,
          wabaId: row.wabaId,
          instanceName: row.instanceName,
          instanceId: row.instanceId,
          evolutionApiKey: row.evolutionApiKey,
          accountName: row.instanceName,
          connectedAt: row.createdAt,
          lastSync: new Date().toISOString(),
        })), 
        isLoading: false 
      })
    } catch (err) {
      console.error('Erro ao buscar conexões:', err)
      set({ isLoading: false })
    }
  },

  updateConnection: async (id, updates) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    try {
      await connectionRepo.update(tenantId, id, {
        status: updates.connected ? 'active' : 'inactive',
        instanceName: updates.instanceName,
        instanceId: updates.instanceId,
        evolutionApiKey: updates.evolutionApiKey,
        phoneNumberId: updates.phoneNumberId,
        wabaId: updates.wabaId,
      } as any)

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
      ...(evolutionApiKey !== undefined ? { evolutionApiKey } : {}),
      connectedAt: new Date().toISOString(),
      accountName: instanceName,
      lastSync: new Date().toISOString(),
    })
  },

  ensureConnectionSlot: async (provider) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return null

    await get().fetchConnections()
    const existing = get().connections.find((c) => c.provider === provider)
    if (existing) return existing

    try {
      await connectionRepo.create({
        tenantId,
        provider,
        status: ConnectionStatus.INACTIVE,
        phoneNumberId: `pending-${provider}-${tenantId}`,
        wabaId: '',
        accessTokenEncrypted: 'pending',
        verifyToken: '',
      })
    } catch (err) {
      console.error('ensureConnectionSlot create:', err)
      await get().fetchConnections()
      const retry = get().connections.find((c) => c.provider === provider)
      return retry ?? null
    }

    await get().fetchConnections()
    return get().connections.find((c) => c.provider === provider) ?? null
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

