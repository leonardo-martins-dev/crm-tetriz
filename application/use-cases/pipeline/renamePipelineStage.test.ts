import { describe, expect, it } from 'vitest'
import { renamePipelineStageForLeads } from '@/application/use-cases/pipeline/renamePipelineStage'
import { Lead } from '@/types'

const makeLead = (id: string, pipelineStage: string): Lead => ({
  id,
  name: `Lead ${id}`,
  channel: 'whatsapp',
  status: 'new',
  pipelineStage,
  tags: [],
  score: 0,
  priority: 'low',
  notes: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  window24hOpen: true,
})

describe('renamePipelineStageForLeads', () => {
  it('retorna atualizações apenas para leads na etapa antiga', () => {
    const leads = [makeLead('1', 'Novo Lead'), makeLead('2', 'Qualificado')]
    const result = renamePipelineStageForLeads({
      leads,
      previousStageName: 'Novo Lead',
      nextStageName: 'Entrada',
    })

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      leadId: '1',
      updates: { pipelineStage: 'Entrada' },
    })
  })

  it('não retorna updates quando a etapa não muda', () => {
    const leads = [makeLead('1', 'Novo Lead')]
    const result = renamePipelineStageForLeads({
      leads,
      previousStageName: 'Novo Lead',
      nextStageName: 'Novo Lead',
    })

    expect(result).toEqual([])
  })
})
