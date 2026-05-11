import { Connection } from '../../domain/entities'

export interface ConnectionRepository {
  findById(tenantId: string, id: string): Promise<Connection | null>
  findByPhoneNumberId(phoneNumberId: string): Promise<Connection | null>
  findByInstanceName(instanceName: string): Promise<Connection | null>
  /** Evolution pode enviar no webhook o UUID da instância em vez do nome `crm-...`. */
  findByInstanceId(instanceId: string): Promise<Connection | null>
  findByTenantId(tenantId: string): Promise<Connection[]>
  create(data: Omit<Connection, 'id' | 'createdAt'>): Promise<Connection>
  update(tenantId: string, id: string, data: Partial<Connection>): Promise<Connection>
  delete(tenantId: string, id: string): Promise<void>
}
