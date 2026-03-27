import { Client } from '@/types'

export type FeatureFlagKey = 'automations' | 'broadcasts' | 'advancedMetrics'

type FeatureFlagMap = Record<FeatureFlagKey, boolean>

const defaultFlags: FeatureFlagMap = {
  automations: true,
  broadcasts: true,
  advancedMetrics: true,
}

const tenantOverrides: Record<string, Partial<FeatureFlagMap>> = {}

export function getFeatureFlagsForClient(client: Client | null | undefined): FeatureFlagMap {
  if (!client) return defaultFlags
  return {
    ...defaultFlags,
    ...tenantOverrides[client.id],
  }
}
