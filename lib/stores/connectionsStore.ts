import { create } from 'zustand'

export type ConnectionProvider = 'meta' | 'evolution'
export type ConnectionType = 'whatsapp'

export interface Connection {
  id: string
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
  updateConnection: (id: string, updates: Partial<Connection>) => void
  getConnection: (id: string) => Connection | undefined
  getActiveConnection: () => Connection | undefined
  connectEvolution: (instanceName: string, evolutionApiKey: string) => void
  disconnectProvider: (id: string) => void
}

const initialConnections: Connection[] = [
  {
    id: 'conn-meta',
    type: 'whatsapp',
    provider: 'meta',
    name: 'WhatsApp Oficial (Meta)',
    connected: false,
  },
  {
    id: 'conn-evolution',
    type: 'whatsapp',
    provider: 'evolution',
    name: 'WhatsApp (QR Code)',
    connected: false,
  },
]

export const useConnectionsStore = create<ConnectionsState>((set, get) => ({
  connections: initialConnections,

  updateConnection: (id: string, updates: Partial<Connection>) => {
    set((state) => ({
      connections: state.connections.map((conn) =>
        conn.id === id ? { ...conn, ...updates } : conn
      ),
    }))
  },

  getConnection: (id: string) => {
    return get().connections.find((conn) => conn.id === id)
  },

  getActiveConnection: () => {
    return get().connections.find((conn) => conn.connected)
  },

  connectEvolution: (instanceName: string, evolutionApiKey: string) => {
    set((state) => ({
      connections: state.connections.map((conn) => {
        if (conn.provider === 'evolution') {
          return {
            ...conn,
            connected: true,
            instanceName,
            evolutionApiKey,
            connectedAt: new Date().toISOString(),
            accountName: instanceName,
            lastSync: new Date().toISOString(),
          }
        }
        return conn
      }),
    }))
  },

  disconnectProvider: (id: string) => {
    set((state) => ({
      connections: state.connections.map((conn) =>
        conn.id === id
          ? {
              ...conn,
              connected: false,
              connectedAt: undefined,
              accountName: undefined,
              lastSync: undefined,
              instanceName: undefined,
              evolutionApiKey: undefined,
              phoneNumberId: undefined,
              wabaId: undefined,
            }
          : conn
      ),
    }))
  },
}))

