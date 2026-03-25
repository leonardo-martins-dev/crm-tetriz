import { create } from 'zustand'
import { PipelineStage } from '@/types'

interface PipelineState {
  pipelines: Record<string, PipelineStage[]> // clientId -> stages
  getPipelineForClient: (clientId: string) => PipelineStage[]
  updatePipelineForClient: (clientId: string, stages: PipelineStage[]) => void
  addStage: (clientId: string, stage: Omit<PipelineStage, 'id' | 'order'>) => void
  updateStage: (clientId: string, stageId: string, updates: Partial<PipelineStage>) => void
  deleteStage: (clientId: string, stageId: string) => void
  reorderStages: (clientId: string, stageIds: string[]) => void
}

// Cores padrão para as etapas
const defaultColors = [
  '#3b82f6', // azul
  '#8b5cf6', // roxo
  '#f59e0b', // laranja
  '#10b981', // verde
  '#22c55e', // verde claro
  '#ef4444', // vermelho
]

// Pipeline padrão
const getDefaultPipeline = (): PipelineStage[] => [
  { id: 'stage-1', name: 'Novo Lead', order: 0, color: defaultColors[0], leadIds: [] },
  { id: 'stage-2', name: 'Em Atendimento', order: 1, color: defaultColors[1], leadIds: [] },
  { id: 'stage-3', name: 'Qualificado', order: 2, color: defaultColors[2], leadIds: [] },
  { id: 'stage-4', name: 'Proposta Enviada', order: 3, color: defaultColors[3], leadIds: [] },
  { id: 'stage-5', name: 'Ganhou', order: 4, color: defaultColors[4], leadIds: [] },
  { id: 'stage-6', name: 'Perdido', order: 5, color: defaultColors[5], leadIds: [] },
]

export const usePipelineStore = create<PipelineState>((set, get) => ({
  pipelines: {},

  getPipelineForClient: (clientId: string) => {
    const pipelines = get().pipelines
    if (pipelines[clientId]) {
      return pipelines[clientId]
    }
    // Retorna pipeline padrão se não existir
    const defaultPipeline = getDefaultPipeline()
    set((state) => ({
      pipelines: {
        ...state.pipelines,
        [clientId]: defaultPipeline,
      },
    }))
    return defaultPipeline
  },

  updatePipelineForClient: (clientId: string, stages: PipelineStage[]) => {
    set((state) => ({
      pipelines: {
        ...state.pipelines,
        [clientId]: stages,
      },
    }))
  },

  addStage: (clientId: string, stageData: Omit<PipelineStage, 'id' | 'order'>) => {
    const currentPipeline = get().getPipelineForClient(clientId)
    const newOrder = currentPipeline.length
    const newStage: PipelineStage = {
      id: `stage-${Date.now()}`,
      order: newOrder,
      ...stageData,
    }
    
    set((state) => ({
      pipelines: {
        ...state.pipelines,
        [clientId]: [...currentPipeline, newStage],
      },
    }))
  },

  updateStage: (clientId: string, stageId: string, updates: Partial<PipelineStage>) => {
    const currentPipeline = get().getPipelineForClient(clientId)
    const updatedPipeline = currentPipeline.map((stage) =>
      stage.id === stageId ? { ...stage, ...updates } : stage
    )
    
    set((state) => ({
      pipelines: {
        ...state.pipelines,
        [clientId]: updatedPipeline,
      },
    }))
  },

  deleteStage: (clientId: string, stageId: string) => {
    const currentPipeline = get().getPipelineForClient(clientId)
    const filteredPipeline = currentPipeline
      .filter((stage) => stage.id !== stageId)
      .map((stage, index) => ({ ...stage, order: index }))
    
    set((state) => ({
      pipelines: {
        ...state.pipelines,
        [clientId]: filteredPipeline,
      },
    }))
  },

  reorderStages: (clientId: string, stageIds: string[]) => {
    const currentPipeline = get().getPipelineForClient(clientId)
    const reorderedPipeline = stageIds.map((stageId, index) => {
      const stage = currentPipeline.find((s) => s.id === stageId)
      if (stage) {
        return { ...stage, order: index }
      }
      return null
    }).filter((stage): stage is PipelineStage => stage !== null)
    
    set((state) => ({
      pipelines: {
        ...state.pipelines,
        [clientId]: reorderedPipeline,
      },
    }))
  },
}))

