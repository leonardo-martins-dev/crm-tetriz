import { Lead } from '@/types'

interface RenamePipelineStageInput {
  leads: Lead[]
  previousStageName: string
  nextStageName: string
}

export const renamePipelineStageForLeads = ({
  leads,
  previousStageName,
  nextStageName,
}: RenamePipelineStageInput): Array<{ leadId: string; updates: Partial<Lead> }> => {
  if (!previousStageName || !nextStageName || previousStageName === nextStageName) {
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
