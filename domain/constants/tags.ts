export const DEFAULT_LEAD_TAGS = [
  'Quente',
  'Interessado',
  'Follow-up',
  'Novo',
  'VIP',
  'Recuperar',
  'Cliente',
] as const

export type DefaultLeadTag = (typeof DEFAULT_LEAD_TAGS)[number]
