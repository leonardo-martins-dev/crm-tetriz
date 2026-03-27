import { Client } from '@/types'

export interface TenantBrandingConfig {
  appName: string
  companyName: string
  loginSubtitle: string
}

const defaultBranding: TenantBrandingConfig = {
  appName: 'BRENO CRM',
  companyName: 'BRENO',
  loginSubtitle: 'Faça login para acessar o sistema',
}

const tenantBrandingByClientId: Record<string, Partial<TenantBrandingConfig>> = {
  default: {},
}

export function getBrandingForClient(client: Client | null | undefined): TenantBrandingConfig {
  if (!client) return defaultBranding
  return {
    ...defaultBranding,
    appName: `${client.name} CRM`,
    companyName: client.name,
    ...tenantBrandingByClientId[client.id],
  }
}

export function getDefaultBranding(): TenantBrandingConfig {
  return defaultBranding
}
