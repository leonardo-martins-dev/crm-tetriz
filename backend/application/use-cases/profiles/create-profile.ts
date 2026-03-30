import { ProfileRepository, TenantRepository } from '../../repositories'
import { ValidationError, NotFoundError, ForbiddenError } from '../../../domain/errors/domain-errors'
import { Profile } from '../../../domain/entities'
import { UserRole } from '../../../domain/enums'

interface CreateProfileInput {
  tenantId: string
  name: string
  email: string
  role: UserRole
  password: string
}

interface CreateProfileDeps {
  profileRepo: ProfileRepository
  tenantRepo: TenantRepository
  /**
   * Função de infraestrutura que cria o usuário no Supabase Auth.
   * Injeta via DI para manter o use case puro.
   */
  createAuthUser: (params: {
    email: string
    password: string
    tenantId: string
    role: UserRole
  }) => Promise<{ id: string }>
}

/**
 * Use case: Criar um perfil de usuário vinculado a um tenant.
 *
 * Responsabilidades:
 * 1. Valida dados de entrada
 * 2. Verifica limite de usuários do tenant
 * 3. Cria o usuário no Supabase Auth (com custom claims)
 * 4. Cria o perfil na tabela profiles
 */
export async function createProfile(
  input: CreateProfileInput,
  deps: CreateProfileDeps
): Promise<Profile> {
  const { profileRepo, tenantRepo, createAuthUser } = deps

  // 1. Validações
  if (!input.name.trim()) {
    throw new ValidationError('Nome obrigatório', { name: 'Campo obrigatório' })
  }
  if (!input.email.trim()) {
    throw new ValidationError('Email obrigatório', { email: 'Campo obrigatório' })
  }

  // 2. Verifica se o tenant existe e está ativo
  const tenant = await tenantRepo.findById(input.tenantId)
  if (!tenant) {
    throw new NotFoundError('Tenant', input.tenantId)
  }
  if (!tenant.active) {
    throw new ForbiddenError('Este tenant está inativo')
  }

  // 3. Verifica limite de usuários
  const currentCount = await profileRepo.countByTenantId(input.tenantId)
  if (currentCount >= tenant.maxUsers) {
    throw new ForbiddenError(
      `Limite de ${tenant.maxUsers} usuário(s) atingido para este tenant`
    )
  }

  // 4. Cria no Auth (service_role)
  const authUser = await createAuthUser({
    email: input.email,
    password: input.password,
    tenantId: input.tenantId,
    role: input.role,
  })

  // 5. Cria perfil na tabela profiles
  return profileRepo.create({
    id: authUser.id, // Mesmo ID do auth.users
    tenantId: input.tenantId,
    name: input.name.trim(),
    email: input.email.trim(),
    role: input.role,
    active: true,
  } as any)
}
