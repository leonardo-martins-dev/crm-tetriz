export interface AgentTrigger {
  id: string
  type: 'tag' | 'pipeline_stage'
  value: string
}

export interface AgentPermissions {
  canAssignTags: boolean
  canMovePipeline: boolean
}

export interface Agent {
  id: string
  tenantId: string
  name: string
  prompt: string
  model: string
  apiKeyEncrypted: string
  triggers: AgentTrigger[]
  permissions: AgentPermissions
  active: boolean
  createdAt: string
}
