import { UserRole } from '../enums'

export interface Profile {
  id: string
  tenantId: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
  active: boolean
  createdAt: string
}
