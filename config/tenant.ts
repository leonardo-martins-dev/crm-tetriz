export interface TenantBrandingConfig {
  id: string
  companyName: string
  productName: string
  fullProductName: string
  appDescription: string
  supportEmail: string
}

export interface TenantFeatureConfig {
  inbox: boolean
  pipeline: boolean
  automations: boolean
  broadcast: boolean
  aiAssistant: boolean
}

export interface TenantConfig {
  branding: TenantBrandingConfig
  features: TenantFeatureConfig
}

export const defaultTenantConfig: TenantConfig = {
  branding: {
    id: 'default',
    companyName: 'BRENO',
    productName: 'CRM',
    fullProductName: 'BRENO CRM',
    appDescription: 'CRM Omnichannel white-label',
    supportEmail: 'suporte@breno.com',
  },
  features: {
    inbox: true,
    pipeline: true,
    automations: true,
    broadcast: true,
    aiAssistant: false,
  },
}

const tenantConfigById: Record<string, TenantConfig> = {
  default: defaultTenantConfig,
  'client-1': {
    ...defaultTenantConfig,
    branding: {
      ...defaultTenantConfig.branding,
      id: 'client-1',
      companyName: 'Cliente 1',
      productName: 'CRM',
      fullProductName: 'Cliente 1 CRM',
      supportEmail: 'suporte@cliente1.com',
    },
  },
}

export const getTenantConfig = (tenantId?: string): TenantConfig => {
  if (!tenantId) return defaultTenantConfig
  return tenantConfigById[tenantId] || defaultTenantConfig
}
