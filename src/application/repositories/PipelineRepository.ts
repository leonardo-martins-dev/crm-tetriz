import { PipelineStage } from '@/types'

export interface PipelineRepository {
  getPipelineForClient(clientId: string): PipelineStage[]
  updateStage(clientId: string, stageId: string, updates: Partial<PipelineStage>): void
  addStage(clientId: string, stage: Omit<PipelineStage, 'id' | 'order'>): void
  deleteStage(clientId: string, stageId: string): void
  reorderStages(clientId: string, stageIds: string[]): void
}
