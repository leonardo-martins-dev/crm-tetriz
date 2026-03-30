import { ClientPlan } from '../enums'

export interface Tenant {
  id: string
  name: string
  logoUrl?: string
  active: boolean
  plan: ClientPlan
  modules: string[]
  maxUsers: number
  createdAt: string
}
