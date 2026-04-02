import { create } from 'zustand'
import { JsonObject } from '@/domain/types/json'
import { useAuthStore } from './authStore'
import { getAutomationRepository } from '@/infrastructure/repositories'

export type NodeType = 'trigger' | 'action' | 'condition' | 'delay' | 'webhook'

export interface Node {
  id: string
  type: NodeType
  label: string
  position: { x: number; y: number }
  data: JsonObject
  connections: string[]
}

export interface AutomationFlow {
  id: string
  name: string
  nodes: Node[]
  active: boolean
}

interface AutomationFlowState {
  currentFlow: AutomationFlow | null
  selectedNodeId: string | null
  isLoading: boolean
  fetchFlow: (flowId: string) => Promise<void>
  saveFlow: () => Promise<void>
  addNode: (type: NodeType, position: { x: number; y: number }) => void
  updateNode: (nodeId: string, updates: Partial<Node>) => void
  deleteNode: (nodeId: string) => void
  connectNodes: (fromNodeId: string, toNodeId: string) => void
  disconnectNodes: (fromNodeId: string, toNodeId: string) => void
  setSelectedNode: (nodeId: string | null) => void
  updateFlow: (updates: Partial<AutomationFlow>) => void
}

const nodeTemplates: Record<NodeType, { label: string; color: string; icon: string }> = {
  trigger: { label: 'Trigger', color: 'bg-green-500', icon: '⚡' },
  action: { label: 'Ação', color: 'bg-blue-500', icon: '▶' },
  condition: { label: 'Condição', color: 'bg-yellow-500', icon: '❓' },
  delay: { label: 'Atraso', color: 'bg-purple-500', icon: '⏱' },
  webhook: { label: 'Webhook', color: 'bg-orange-500', icon: '🔗' },
}

const automationRepo = getAutomationRepository()

export const useAutomationFlowStore = create<AutomationFlowState>((set, get) => ({
  currentFlow: null,
  selectedNodeId: null,
  isLoading: false,

  fetchFlow: async (flowId: string) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    set({ isLoading: true })
    try {
      const data = await automationRepo.findById(tenantId, flowId)

      if (!data) throw new Error('Fluxo não encontrado')

      set({ 
        currentFlow: {
          id: data.id,
          name: data.name,
          nodes: (data.nodes as Node[]) || [],
          active: data.active
        }, 
        isLoading: false 
      })
    } catch (error) {
      console.error('Erro ao buscar fluxo:', error)
      set({ isLoading: false })
    }
  },

  saveFlow: async () => {
    const flow = get().currentFlow
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!flow || !tenantId) return

    try {
      await automationRepo.update(tenantId, flow.id, {
        name: flow.name,
        nodes: flow.nodes as any,
        active: flow.active
      })
    } catch (error) {
      console.error('Erro ao salvar fluxo:', error)
    }
  },

  addNode: (type, position) => {
    const { currentFlow } = get()
    if (!currentFlow) return

    const template = nodeTemplates[type]
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type,
      label: template.label,
      position,
      data: {},
      connections: [],
    }

    set({
      currentFlow: {
        ...currentFlow,
        nodes: [...currentFlow.nodes, newNode],
      },
    })
  },

  updateNode: (nodeId, updates) => {
    const { currentFlow } = get()
    if (!currentFlow) return

    set({
      currentFlow: {
        ...currentFlow,
        nodes: currentFlow.nodes.map((node) =>
          node.id === nodeId ? { ...node, ...updates } : node
        ),
      },
    })
  },

  deleteNode: (nodeId) => {
    const { currentFlow } = get()
    if (!currentFlow) return

    set({
      currentFlow: {
        ...currentFlow,
        nodes: currentFlow.nodes
          .filter((node) => node.id !== nodeId)
          .map((node) => ({
            ...node,
            connections: node.connections.filter((id) => id !== nodeId),
          })),
      },
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    })
  },

  connectNodes: (fromNodeId, toNodeId) => {
    const { currentFlow } = get()
    if (!currentFlow) return

    set({
      currentFlow: {
        ...currentFlow,
        nodes: currentFlow.nodes.map((node) =>
          node.id === fromNodeId
            ? { ...node, connections: [...node.connections, toNodeId] }
            : node
        ),
      },
    })
  },

  disconnectNodes: (fromNodeId, toNodeId) => {
    const { currentFlow } = get()
    if (!currentFlow) return

    set({
      currentFlow: {
        ...currentFlow,
        nodes: currentFlow.nodes.map((node) =>
          node.id === fromNodeId
            ? { ...node, connections: node.connections.filter((id) => id !== toNodeId) }
            : node
        ),
      },
    })
  },

  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),

  updateFlow: (updates) => {
    const { currentFlow } = get()
    if (!currentFlow) return
    set({ currentFlow: { ...currentFlow, ...updates } })
  },
}))

export { nodeTemplates }
