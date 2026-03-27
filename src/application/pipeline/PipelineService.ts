import { Lead, PipelineStage } from '@/types'
import { LeadRepository } from '@/src/application/repositories/LeadRepository'
import { PipelineRepository } from '@/src/application/repositories/PipelineRepository'
import {
  collectLeadFallbackStageUpdates,
  findStageById,
  renameStageAndCollectLeadUpdates,
} from '@/src/domain/pipeline/useCases'
import { applyLeadStageUpdates } from '@/src/application/pipeline/applyLeadStageUpdates'

export class PipelineService {
  constructor(
    private readonly pipelineRepository: PipelineRepository,
    private readonly leadRepository: LeadRepository
  ) {}

  getStages(clientId: string): PipelineStage[] {
    return this.pipelineRepository.getPipelineForClient(clientId)
  }

  addStage(clientId: string, stage: Omit<PipelineStage, 'id' | 'order'>) {
    this.pipelineRepository.addStage(clientId, stage)
  }

  reorderStages(clientId: string, stageIds: string[]) {
    this.pipelineRepository.reorderStages(clientId, stageIds)
  }

  deleteStage(clientId: string, stageId: string, leads: Lead[], fallbackStageName: string | null) {
    const stages = this.getStages(clientId)
    const stage = findStageById(stages, stageId)
    if (!stage) return

    if (fallbackStageName) {
      const leadUpdates = collectLeadFallbackStageUpdates(leads, stage.name, fallbackStageName)
      applyLeadStageUpdates(leadUpdates, this.leadRepository.updateLead)
    }

    this.pipelineRepository.deleteStage(clientId, stageId)
  }

  updateStage(clientId: string, stageId: string, name: string, color: string, leads: Lead[]) {
    const stages = this.getStages(clientId)
    const currentStage = findStageById(stages, stageId)
    if (!currentStage) return

    this.pipelineRepository.updateStage(clientId, stageId, { name, color })
    const leadUpdates = renameStageAndCollectLeadUpdates(leads, currentStage.name, name)
    applyLeadStageUpdates(leadUpdates, this.leadRepository.updateLead)
  }
}
