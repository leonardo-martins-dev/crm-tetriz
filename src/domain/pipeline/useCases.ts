import { Lead, PipelineStage } from '@/types'

export interface LeadStageUpdate {
  leadId: string
  updates: Partial<Lead>
}

export function renameStageAndCollectLeadUpdates(
  leads: Lead[],
  previousStageName: string,
  nextStageName: string
): LeadStageUpdate[] {
  if (previousStageName === nextStageName) {
    return []
  }

  return leads
    .filter((lead) => lead.pipelineStage === previousStageName)
    .map((lead) => ({
      leadId: lead.id,
      updates: {
        pipelineStage: nextStageName,
        updatedAt: new Date().toISOString(),
      },
    }))
}

export function collectLeadFallbackStageUpdates(
  leads: Lead[],
  removedStageName: string,
  fallbackStageName: string
): LeadStageUpdate[] {
  return leads
    .filter((lead) => lead.pipelineStage === removedStageName)
    .map((lead) => ({
      leadId: lead.id,
      updates: {
        pipelineStage: fallbackStageName,
        updatedAt: new Date().toISOString(),
      },
    }))
}

export function findStageById(stages: PipelineStage[], stageId: string): PipelineStage | null {
  return stages.find((stage) => stage.id === stageId) ?? null
}
