import { TenantRepository } from '../../repositories'
import { ValidationError } from '../../../domain/errors/domain-errors'
import { Tenant } from '../../../domain/entities'
import { ClientPlan } from '../../../domain/enums'

interface CreateTenantInput {
  name: string
  plan: ClientPlan
  modules: string[]
  maxUsers: number
}

interface CreateTenantDeps {
  tenantRepo: TenantRepository
}

export async function createTenant(
  input: CreateTenantInput,
  deps: CreateTenantDeps
): Promise<Tenant> {
  if (!input.name.trim()) {
    throw new ValidationError('Nome do tenant é obrigatório', { name: 'Campo obrigatório' })
  }

  if (input.maxUsers < 1) {
    throw new ValidationError('Limite de usuários deve ser ao menos 1', { maxUsers: 'Mínimo 1' })
  }

  return deps.tenantRepo.create({
    name: input.name.trim(),
    active: true,
    plan: input.plan,
    modules: input.modules,
    maxUsers: input.maxUsers,
  })
}
