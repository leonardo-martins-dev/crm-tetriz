export interface Automation {
  id: string
  tenantId: string
  name: string
  event: string
  condition?: string
  action: string
  active: boolean
  createdAt: string
}
