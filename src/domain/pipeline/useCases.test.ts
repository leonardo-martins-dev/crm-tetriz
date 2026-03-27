import { describe, expect, it } from 'vitest'
import {
  collectLeadFallbackStageUpdates,
  renameStageAndCollectLeadUpdates,
} from '@/src/domain/pipeline/useCases'
import { Lead } from '@/types'

function leadFactory(overrides: Partial<Lead>): Lead {
  return {
    id: 'lead-1',
    name: 'Teste',
    channel: 'whatsapp',
    status: 'new',
    pipelineStage: 'Novo Lead',
    tags: [],
    score: 50,
    priority: 'medium',
    notes: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    window24hOpen: true,
    ...overrides,
  }
}

describe('pipeline use cases', () => {
  it('renames stage and returns only impacted leads', () => {
    const leads: Lead[] = [
      leadFactory({ id: '1', pipelineStage: 'Qualificado' }),
      leadFactory({ id: '2', pipelineStage: 'Perdido' }),
    ]

    const updates = renameStageAndCollectLeadUpdates(leads, 'Qualificado', 'Pré-venda')
    expect(updates).toHaveLength(1)
    expect(updates[0].leadId).toBe('1')
    expect(updates[0].updates.pipelineStage).toBe('Pré-venda')
  })

  it('moves leads from removed stage to fallback', () => {
    const leads: Lead[] = [
      leadFactory({ id: '1', pipelineStage: 'Em Atendimento' }),
      leadFactory({ id: '2', pipelineStage: 'Perdido' }),
    ]

    const updates = collectLeadFallbackStageUpdates(leads, 'Em Atendimento', 'Novo Lead')
    expect(updates).toHaveLength(1)
    expect(updates[0].leadId).toBe('1')
    expect(updates[0].updates.pipelineStage).toBe('Novo Lead')
  })
})
