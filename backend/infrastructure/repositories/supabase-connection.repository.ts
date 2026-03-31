import { SupabaseClient } from '@supabase/supabase-js'
import { ConnectionRepository } from '../../application/repositories'
import { Connection, ConnectionProvider } from '../../domain/entities'
import { ConnectionStatus } from '../../domain/enums'
import { NotFoundError } from '../../domain/errors/domain-errors'

/**
 * Implementação do ConnectionRepository usando Supabase.
 */
export class SupabaseConnectionRepository implements ConnectionRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(tenantId: string, id: string): Promise<Connection | null> {
    const { data, error } = await this.supabase
      .from('connections')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async findByPhoneNumberId(phoneNumberId: string): Promise<Connection | null> {
    const { data, error } = await this.supabase
      .from('connections')
      .select('*')
      .eq('phone_number_id', phoneNumberId)
      .single()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async findByInstanceName(instanceName: string): Promise<Connection | null> {
    const { data, error } = await this.supabase
      .from('connections')
      .select('*')
      .eq('instance_name', instanceName)
      .single()

    if (error || !data) return null
    return this.toDomain(data)
  }

  async findByTenantId(tenantId: string): Promise<Connection[]> {
    const { data, error } = await this.supabase
      .from('connections')
      .select('*')
      .eq('tenant_id', tenantId)

    if (error) throw new Error(error.message)
    return (data || []).map(this.toDomain)
  }

  async create(input: Omit<Connection, 'id' | 'createdAt'>): Promise<Connection> {
    const { data, error } = await this.supabase
      .from('connections')
      .insert(this.toRow(input))
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toDomain(data)
  }

  async update(tenantId: string, id: string, updates: Partial<Connection>): Promise<Connection> {
    const { data, error } = await this.supabase
      .from('connections')
      .update(this.toRow(updates))
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    if (!data) throw new NotFoundError('Connection', id)
    return this.toDomain(data)
  }

  async delete(tenantId: string, id: string): Promise<void> {
    const { error } = await this.supabase
      .from('connections')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId)

    if (error) throw new Error(error.message)
  }

  // ─── Mappers ─────────────────────────────────────

  private toDomain(row: any): Connection {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      provider: row.provider as ConnectionProvider,
      phoneNumberId: row.phone_number_id,
      wabaId: row.waba_id,
      accessTokenEncrypted: row.access_token_encrypted,
      verifyToken: row.verify_token,
      instanceName: row.instance_name,
      instanceId: row.instance_id,
      evolutionApiKey: row.evolution_api_key,
      status: row.status as ConnectionStatus,
      createdAt: row.created_at,
    }
  }

  private toRow(entity: Partial<Connection>): Record<string, any> {
    const row: Record<string, any> = {}
    if (entity.tenantId !== undefined) row.tenant_id = entity.tenantId
    if (entity.provider !== undefined) row.provider = entity.provider
    if (entity.phoneNumberId !== undefined) row.phone_number_id = entity.phoneNumberId
    if (entity.wabaId !== undefined) row.waba_id = entity.wabaId
    if (entity.accessTokenEncrypted !== undefined) row.access_token_encrypted = entity.accessTokenEncrypted
    if (entity.verifyToken !== undefined) row.verify_token = entity.verifyToken
    if (entity.instanceName !== undefined) row.instance_name = entity.instanceName
    if (entity.instanceId !== undefined) row.instance_id = entity.instanceId
    if (entity.evolutionApiKey !== undefined) row.evolution_api_key = entity.evolutionApiKey
    if (entity.status !== undefined) row.status = entity.status
    return row
  }
}
