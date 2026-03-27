import { create } from 'zustand'
import { PipelineStage } from '@/types'
import { createDefaultPipeline } from '@/domain/constants/pipeline'

interface PipelineState {
  pipelines: Record<string, PipelineStage[]> // clientId -> stages
  getPipelineForClient: (clientId: string) => PipelineStage[]
  updatePipelineForClient: (clientId: string, stages: PipelineStage[]) => void
  addStage: (clientId: string, stage: Omit<PipelineStage, 'id' | 'order'>) => void
  updateStage: (clientId: string, stageId: string, updates: Partial<PipelineStage>) => void
  deleteStage: (clientId: string, stageId: string) => void
  reorderStages: (clientId: string, stageIds: string[]) => void
}

const createStageId = () =>
  `stage-${new Date().getTime()}-${Math.random().toString(36).slice(2, 8)}`

export const usePipelineStore = create<PipelineState>((set, get) => ({
  pipelines: {},

  getPipelineForClient: (clientId: string) => {
    const pipelines = get().pipelines
    if (pipelines[clientId]) {
      return pipelines[clientId]
    }
    // Retorna pipeline padrão se não existir
    const defaultPipeline = createDefaultPipeline()
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
      id: createStageId(),
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

