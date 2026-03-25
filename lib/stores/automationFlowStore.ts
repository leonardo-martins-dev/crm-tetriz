import { create } from 'zustand'

export type NodeType = 'trigger' | 'action' | 'condition' | 'delay' | 'webhook'

export interface Node {
  id: string
  type: NodeType
  label: string
  position: { x: number; y: number }
  data: Record<string, any>
  connections: string[] // IDs dos nós conectados
}

export interface AutomationFlow {
  id: string
  name: string
  nodes: Node[]
  active: boolean
}

interface AutomationFlowState {
  flows: AutomationFlow[]
  currentFlow: AutomationFlow | null
  selectedNodeId: string | null
  setCurrentFlow: (flowId: string) => void
  createFlow: (name: string) => void
  addNode: (type: NodeType, position: { x: number; y: number }) => void
  updateNode: (nodeId: string, updates: Partial<Node>) => void
  deleteNode: (nodeId: string) => void
  connectNodes: (fromNodeId: string, toNodeId: string) => void
  disconnectNodes: (fromNodeId: string, toNodeId: string) => void
  setSelectedNode: (nodeId: string | null) => void
  updateFlow: (updates: Partial<AutomationFlow>) => void
}

const nodeTemplates: Record<NodeType, { label: string; color: string; icon: string }> = {
  trigger: {
    label: 'Trigger',
    color: 'bg-green-500',
    icon: '⚡',
  },
  action: {
    label: 'Ação',
    color: 'bg-blue-500',
    icon: '▶',
  },
  condition: {
    label: 'Condição',
    color: 'bg-yellow-500',
    icon: '❓',
  },
  delay: {
    label: 'Atraso',
    color: 'bg-purple-500',
    icon: '⏱',
  },
  webhook: {
    label: 'Webhook',
    color: 'bg-orange-500',
    icon: '🔗',
  },
}

const initialFlows: AutomationFlow[] = [
  {
    id: 'flow-1',
    name: 'Boas-vindas Automáticas',
    active: true,
    nodes: [],
  },
]

export const useAutomationFlowStore = create<AutomationFlowState>((set, get) => ({
  flows: initialFlows,
  currentFlow: null,
  selectedNodeId: null,

  setCurrentFlow: (flowId: string) => {
    const flow = get().flows.find((f) => f.id === flowId)
    if (flow) {
      set({ currentFlow: flow })
    }
  },

  createFlow: (name: string) => {
    const newFlow: AutomationFlow = {
      id: `flow-${Date.now()}`,
      name,
      nodes: [],
      active: false,
    }
    set((state) => ({
      flows: [...state.flows, newFlow],
      currentFlow: newFlow,
    }))
  },

  addNode: (type: NodeType, position: { x: number; y: number }) => {
    const currentFlow = get().currentFlow
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

    set((state) => ({
      flows: state.flows.map((flow) =>
        flow.id === currentFlow.id
          ? { ...flow, nodes: [...flow.nodes, newNode] }
          : flow
      ),
      currentFlow: {
        ...currentFlow,
        nodes: [...currentFlow.nodes, newNode],
      },
    }))
  },

  updateNode: (nodeId: string, updates: Partial<Node>) => {
    const currentFlow = get().currentFlow
    if (!currentFlow) return

    set((state) => ({
      flows: state.flows.map((flow) =>
        flow.id === currentFlow.id
          ? {
              ...flow,
              nodes: flow.nodes.map((node) =>
                node.id === nodeId ? { ...node, ...updates } : node
              ),
            }
          : flow
      ),
      currentFlow: {
        ...currentFlow,
        nodes: currentFlow.nodes.map((node) =>
          node.id === nodeId ? { ...node, ...updates } : node
        ),
      },
    }))
  },

  deleteNode: (nodeId: string) => {
    const currentFlow = get().currentFlow
    if (!currentFlow) return

    set((state) => ({
      flows: state.flows.map((flow) =>
        flow.id === currentFlow.id
          ? {
              ...flow,
              nodes: flow.nodes
                .filter((node) => node.id !== nodeId)
                .map((node) => ({
                  ...node,
                  connections: node.connections.filter((id) => id !== nodeId),
                })),
            }
          : flow
      ),
      currentFlow: {
        ...currentFlow,
        nodes: currentFlow.nodes
          .filter((node) => node.id !== nodeId)
          .map((node) => ({
            ...node,
            connections: node.connections.filter((id) => id !== nodeId),
          })),
      },
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }))
  },

  connectNodes: (fromNodeId: string, toNodeId: string) => {
    const currentFlow = get().currentFlow
    if (!currentFlow) return

    set((state) => ({
      flows: state.flows.map((flow) =>
        flow.id === currentFlow.id
          ? {
              ...flow,
              nodes: flow.nodes.map((node) =>
                node.id === fromNodeId
                  ? { ...node, connections: [...node.connections, toNodeId] }
                  : node
              ),
            }
          : flow
      ),
      currentFlow: {
        ...currentFlow,
        nodes: currentFlow.nodes.map((node) =>
          node.id === fromNodeId
            ? { ...node, connections: [...node.connections, toNodeId] }
            : node
        ),
      },
    }))
  },

  disconnectNodes: (fromNodeId: string, toNodeId: string) => {
    const currentFlow = get().currentFlow
    if (!currentFlow) return

    set((state) => ({
      flows: state.flows.map((flow) =>
        flow.id === currentFlow.id
          ? {
              ...flow,
              nodes: flow.nodes.map((node) =>
                node.id === fromNodeId
                  ? { ...node, connections: node.connections.filter((id) => id !== toNodeId) }
                  : node
              ),
            }
          : flow
      ),
      currentFlow: {
        ...currentFlow,
        nodes: currentFlow.nodes.map((node) =>
          node.id === fromNodeId
            ? { ...node, connections: node.connections.filter((id) => id !== toNodeId) }
            : node
        ),
      },
    }))
  },

  setSelectedNode: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId })
  },

  updateFlow: (updates: Partial<AutomationFlow>) => {
    const currentFlow = get().currentFlow
    if (!currentFlow) return

    set((state) => ({
      flows: state.flows.map((flow) =>
        flow.id === currentFlow.id ? { ...flow, ...updates } : flow
      ),
      currentFlow: { ...currentFlow, ...updates },
    }))
  },
}))

export { nodeTemplates }

