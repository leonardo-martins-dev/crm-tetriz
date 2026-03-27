import { PipelineStage } from '@/types'

export const DEFAULT_PIPELINE_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#10b981',
  '#22c55e',
  '#ef4444',
] as const

export const DEFAULT_PIPELINE_STAGE_NAMES = [
  'Novo Lead',
  'Em Atendimento',
  'Qualificado',
  'Proposta Enviada',
  'Ganhou',
  'Perdido',
] as const

export const createDefaultPipeline = (): PipelineStage[] =>
  DEFAULT_PIPELINE_STAGE_NAMES.map((name, index) => ({
    id: `stage-${index + 1}`,
    name,
    order: index,
    color: DEFAULT_PIPELINE_COLORS[index],
    leadIds: [],
  }))
