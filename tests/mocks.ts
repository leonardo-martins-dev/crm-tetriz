import { vi } from 'vitest'

export const mockLeadRepository = {
  findById: vi.fn(),
  findByPhone: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
}

export const mockConversationRepository = {
  findById: vi.fn(),
  findByLeadId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  findAll: vi.fn(),
}

export const mockMessageRepository = {
  create: vi.fn(),
  findByConversationId: vi.fn(),
  findByWamid: vi.fn(),
  update: vi.fn(),
}

export const mockConnectionRepository = {
  findByInstanceName: vi.fn(),
  findByPhoneNumberId: vi.fn(),
  findByTenantId: vi.fn(),
}

export const mockAgentRepository = {
  findActiveByTrigger: vi.fn(),
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
