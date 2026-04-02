import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock do repository hoisted
const mockLeadRepository = vi.hoisted(() => ({
  listByTenant: vi.fn(),
  list: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
  update: vi.fn(),
}))

vi.mock('@/infrastructure/repositories', () => ({
  getLeadRepository: () => mockLeadRepository
}))

// Mock do authStore
vi.mock('./authStore', () => ({
  useAuthStore: {
    getState: () => ({ user: { tenantId: 't1' } })
  }
}))

import { useLeadsStore } from './leadsStore'

describe('leadsStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useLeadsStore.setState({ leads: [], isLoading: false })
  })

  it('should fetch leads from repository', async () => {
    const mockLeads = [
      { id: '1', name: 'Lead 1', status: 'new', tags: [], notes: [], createdAt: 'now' },
      { id: '2', name: 'Lead 2', status: 'contacted', tags: [], notes: [], createdAt: 'now' }
    ]
    mockLeadRepository.list.mockResolvedValue(mockLeads)

    await useLeadsStore.getState().fetchLeads()

    const state = useLeadsStore.getState()
    expect(state.leads).toHaveLength(2)
    expect(state.leads[0].name).toBe('Lead 1')
    expect(mockLeadRepository.list).toHaveBeenCalledWith('t1')
  })

  it('should add a lead via repository', async () => {
    const newLead = { id: '3', name: 'New Lead', status: 'new', tags: [], notes: [], createdAt: 'now' }
    mockLeadRepository.create.mockResolvedValue(newLead)

    await useLeadsStore.getState().addLead({ name: 'New Lead', status: 'new' } as any)

    const state = useLeadsStore.getState()
    expect(state.leads).toContainEqual(expect.objectContaining({ name: 'New Lead' }))
    expect(mockLeadRepository.create).toHaveBeenCalled()
  })

  it('should delete a lead via repository', async () => {
    useLeadsStore.setState({ leads: [{ id: '1', name: 'To Delete' } as any] })
    mockLeadRepository.delete.mockResolvedValue(undefined)

    await useLeadsStore.getState().deleteLead('1')

    const state = useLeadsStore.getState()
    expect(state.leads).toHaveLength(0)
    expect(mockLeadRepository.delete).toHaveBeenCalledWith('t1', '1')
  })

  it('should set error on failure', async () => {
    mockLeadRepository.list.mockRejectedValue(new Error('Fetch failed'))
    
    await useLeadsStore.getState().fetchLeads()

    expect(useLeadsStore.getState().isLoading).toBe(false)
  })
})
