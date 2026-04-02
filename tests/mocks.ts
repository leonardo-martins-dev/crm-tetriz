import { vi } from 'vitest'

export const createMockSupabase = () => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    rangeGt: vi.fn().mockReturnThis(),
    rangeGte: vi.fn().mockReturnThis(),
    rangeLt: vi.fn().mockReturnThis(),
    rangeLte: vi.fn().mockReturnThis(),
    rangeAdjacent: vi.fn().mockReturnThis(),
    overlaps: vi.fn().mockReturnThis(),
    textSearch: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    abortSignal: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    throwOnError: vi.fn().mockReturnThis(),
    then: (onfulfilled: any) => Promise.resolve({ data: null, error: null }).then(onfulfilled),
  }

  return {
    from: vi.fn().mockReturnValue(chain),
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
    },
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      }),
    },
  }
}

export const mockLeadRepository = {
  findById: vi.fn(),
  findByPhone: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
  listByTenant: vi.fn(),
}

export const mockConversationRepository = {
  findById: vi.fn(),
  findByLeadId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  findAll: vi.fn(),
  findByTenantId: vi.fn(),
}

export const mockMessageRepository = {
  create: vi.fn(),
  findByConversationId: vi.fn(),
  findByWamid: vi.fn(),
  update: vi.fn(),
  listByTenant: vi.fn(),
}

export const mockProfileRepository = {
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

export const mockConnectionRepository = {
  findById: vi.fn(),
  findByInstanceName: vi.fn(),
  findByPhoneNumberId: vi.fn(),
  findByTenantId: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

export const mockAgentRepository = {
  findById: vi.fn(),
  findActiveByTrigger: vi.fn(),
  findByTenantId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

export const mockTagRepository = {
  findById: vi.fn(),
  findByTenantId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

export const mockBroadcastRepository = {
  findById: vi.fn(),
  findByTenantId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

export const mockAutomationRepository = {
  findById: vi.fn(),
  findByTenantId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

export const mockWhatsAppService = {
  sendTextMessage: vi.fn(),
  sendMediaMessage: vi.fn(),
}

export const mockEvolutionService = {
  sendTextMessage: vi.fn(),
  sendMediaMessage: vi.fn(),
}

export const mockAiOrchestrator = {
  generateResponse: vi.fn(),
}

export const mockStorageService = {
  uploadFile: vi.fn(),
}
