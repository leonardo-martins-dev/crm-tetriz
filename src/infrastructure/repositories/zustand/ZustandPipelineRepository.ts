import { PipelineStage } from '@/types'
import { PipelineRepository } from '@/src/application/repositories/PipelineRepository'

interface PipelineActions {
  getPipelineForClient: (clientId: string) => PipelineStage[]
  updateStage: (clientId: string, stageId: string, updates: Partial<PipelineStage>) => void
  addStage: (clientId: string, stage: Omit<PipelineStage, 'id' | 'order'>) => void
  deleteStage: (clientId: string, stageId: string) => void
  reorderStages: (clientId: string, stageIds: string[]) => void
}

export class ZustandPipelineRepository implements PipelineRepository {
  constructor(private readonly actions: PipelineActions) {}

  getPipelineForClient(clientId: string): PipelineStage[] {
    return this.actions.getPipelineForClient(clientId)
  }

  updateStage(clientId: string, stageId: string, updates: Partial<PipelineStage>): void {
    this.actions.updateStage(clientId, stageId, updates)
  }

  addStage(clientId: string, stage: Omit<PipelineStage, 'id' | 'order'>): void {
    this.actions.addStage(clientId, stage)
  }

  deleteStage(clientId: string, stageId: string): void {
    this.actions.deleteStage(clientId, stageId)
  }

  reorderStages(clientId: string, stageIds: string[]): void {
    this.actions.reorderStages(clientId, stageIds)
  }
}
