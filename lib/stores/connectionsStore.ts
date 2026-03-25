import { create } from 'zustand'

export type ConnectionType = 'whatsapp'

export interface Connection {
  id: string
  type: ConnectionType
  name: string
  connected: boolean
  accountName?: string
  accountId?: string
  connectedAt?: string
  lastSync?: string
}

interface ConnectionsState {
  connections: Connection[]
  toggleConnection: (type: ConnectionType) => void
  updateConnection: (type: ConnectionType, updates: Partial<Connection>) => void
  getConnectionByType: (type: ConnectionType) => Connection | undefined
}

const initialConnections: Connection[] = [
  {
    id: 'conn-1',
    type: 'whatsapp',
    name: 'WhatsApp',
    connected: false,
  },
]

export const useConnectionsStore = create<ConnectionsState>((set, get) => ({
  connections: initialConnections,

  toggleConnection: (type: ConnectionType) => {
    set((state) => ({
      connections: state.connections.map((conn) =>
        conn.type === type
          ? {
              ...conn,
              connected: !conn.connected,
              connectedAt: !conn.connected ? new Date().toISOString() : undefined,
              accountName: !conn.connected ? `${type} Account` : undefined,
              accountId: !conn.connected ? `acc-${type}-${Date.now()}` : undefined,
              lastSync: !conn.connected ? new Date().toISOString() : undefined,
            }
          : conn
      ),
    }))
  },

  updateConnection: (type: ConnectionType, updates: Partial<Connection>) => {
    set((state) => ({
      connections: state.connections.map((conn) =>
        conn.type === type ? { ...conn, ...updates } : conn
      ),
    }))
  },

  getConnectionByType: (type: ConnectionType) => {
    return get().connections.find((conn) => conn.type === type)
  },
}))

