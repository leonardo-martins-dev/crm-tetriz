export const ClientPlan = {
  BASIC: 'basic',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
} as const

export type ClientPlan = (typeof ClientPlan)[keyof typeof ClientPlan]
