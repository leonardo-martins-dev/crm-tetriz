import { TenantFeatureConfig } from '@/config/tenant'

export type FeatureKey = keyof TenantFeatureConfig

export const isFeatureEnabled = (features: TenantFeatureConfig, feature: FeatureKey): boolean =>
  Boolean(features[feature])
