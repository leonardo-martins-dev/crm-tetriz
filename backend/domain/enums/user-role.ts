export const UserRole = {
  OWNER: 'owner',
  CLIENT: 'client',
  USER: 'user',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]
