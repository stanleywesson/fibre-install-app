import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCompaniesStore } from '../companies'
import * as mockApi from '@/api/mockApi'
import type { Company } from '@/types'

vi.mock('@/api/mockApi')

describe('Companies Store', () => {
  const mockCompany: Company = {
    id: 1,
    name: 'Vumatel',
    contactPerson: 'John Doe',
    contactEmail: 'john@vumatel.com',
    contactPhone: '+27 11 123 4567',
    createdAt: new Date('2024-01-01')
  }

  const mockCompanies: Company[] = [
    {
      id: 1,
      name: 'Vumatel',
      contactPerson: 'John Doe',
      contactEmail: 'john@vumatel.com',
      contactPhone: '+27 11 123 4567',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      name: 'Octotel',
      contactPerson: 'Jane Smith',
      contactEmail: 'jane@octotel.com',
      contactPhone: '+27 21 456 7890',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 3,
      name: 'Frogfoot',
      contactPerson: 'Mike Johnson',
      contactEmail: 'mike@frogfoot.com',
      contactPhone: '+27 31 789 0123',
      createdAt: new Date('2024-02-01')
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useCompaniesStore()

      expect(store.companies).toEqual([])
      expect(store.currentCompany).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('fetchCompanies', () => {
    it('should fetch companies successfully', async () => {
      const store = useCompaniesStore()

      vi.mocked(mockApi.getCompanies).mockResolvedValue({
        success: true,
        data: mockCompanies
      })

      const result = await store.fetchCompanies()

      expect(result).toBe(true)
      expect(store.companies).toEqual(mockCompanies)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should handle fetch error', async () => {
      const store = useCompaniesStore()

      vi.mocked(mockApi.getCompanies).mockResolvedValue({
        success: false,
        message: 'Failed to fetch companies'
      })

      const result = await store.fetchCompanies()

      expect(result).toBe(false)
      expect(store.companies).toEqual([])
      expect(store.error).toBe('Failed to fetch companies')
      expect(store.loading).toBe(false)
    })

    it('should set loading state during fetch', async () => {
      const store = useCompaniesStore()

      vi.mocked(mockApi.getCompanies).mockImplementation(
        () =>
          new Promise(resolve => {
            expect(store.loading).toBe(true)
            resolve({ success: true, data: mockCompanies })
          })
      )

      await store.fetchCompanies()

      expect(store.loading).toBe(false)
    })

    it('should handle network errors gracefully', async () => {
      const store = useCompaniesStore()

      vi.mocked(mockApi.getCompanies).mockRejectedValue(new Error('Network error'))

      const result = await store.fetchCompanies()

      expect(result).toBe(false)
      expect(store.error).toBe('An error occurred while fetching companies')
      expect(store.loading).toBe(false)
    })
  })

  describe('fetchCompanyById', () => {
    it('should fetch company by id successfully', async () => {
      const store = useCompaniesStore()

      vi.mocked(mockApi.getCompanyById).mockResolvedValue({
        success: true,
        data: mockCompany
      })

      const result = await store.fetchCompanyById(1)

      expect(result).toBe(true)
      expect(store.currentCompany).toEqual(mockCompany)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should handle company not found', async () => {
      const store = useCompaniesStore()

      vi.mocked(mockApi.getCompanyById).mockResolvedValue({
        success: false,
        message: 'Company not found'
      })

      const result = await store.fetchCompanyById(999)

      expect(result).toBe(false)
      expect(store.currentCompany).toBeNull()
      expect(store.error).toBe('Company not found')
      expect(store.loading).toBe(false)
    })

    it('should set loading state during fetch', async () => {
      const store = useCompaniesStore()

      vi.mocked(mockApi.getCompanyById).mockImplementation(
        () =>
          new Promise(resolve => {
            expect(store.loading).toBe(true)
            resolve({ success: true, data: mockCompany })
          })
      )

      await store.fetchCompanyById(1)

      expect(store.loading).toBe(false)
    })

    it('should handle API errors gracefully', async () => {
      const store = useCompaniesStore()

      vi.mocked(mockApi.getCompanyById).mockRejectedValue(new Error('Network error'))

      const result = await store.fetchCompanyById(1)

      expect(result).toBe(false)
      expect(store.error).toBe('An error occurred while fetching company')
      expect(store.loading).toBe(false)
    })
  })

  describe('getCompanyById_sync', () => {
    beforeEach(async () => {
      const store = useCompaniesStore()
      vi.mocked(mockApi.getCompanies).mockResolvedValue({
        success: true,
        data: mockCompanies
      })
      await store.fetchCompanies()
    })

    it('should return company when found', () => {
      const store = useCompaniesStore()
      const company = store.getCompanyById_sync(1)

      expect(company).toEqual(mockCompanies[0])
    })

    it('should return null when company not found', () => {
      const store = useCompaniesStore()
      const company = store.getCompanyById_sync(999)

      expect(company).toBeNull()
    })

    it('should work with all companies in the list', () => {
      const store = useCompaniesStore()

      mockCompanies.forEach(mockCompany => {
        const company = store.getCompanyById_sync(mockCompany.id)
        expect(company).toEqual(mockCompany)
      })
    })
  })

  describe('clearError', () => {
    it('should clear error message', () => {
      const store = useCompaniesStore()
      store.error = 'Some error'

      store.clearError()

      expect(store.error).toBeNull()
    })

    it('should work when error is already null', () => {
      const store = useCompaniesStore()
      expect(store.error).toBeNull()

      store.clearError()

      expect(store.error).toBeNull()
    })
  })

  describe('Error State Management', () => {
    it('should clear previous error on successful fetch', async () => {
      const store = useCompaniesStore()
      store.error = 'Previous error'

      vi.mocked(mockApi.getCompanies).mockResolvedValue({
        success: true,
        data: mockCompanies
      })

      await store.fetchCompanies()

      expect(store.error).toBeNull()
    })

    it('should clear previous error before new fetch attempt', async () => {
      const store = useCompaniesStore()
      store.error = 'Previous error'

      vi.mocked(mockApi.getCompanyById).mockResolvedValue({
        success: true,
        data: mockCompany
      })

      await store.fetchCompanyById(1)

      expect(store.error).toBeNull()
    })
  })
})
