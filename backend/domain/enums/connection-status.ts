export const ConnectionStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const

export type ConnectionStatus = (typeof ConnectionStatus)[keyof typeof ConnectionStatus]
