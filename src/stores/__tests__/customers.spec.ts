import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCustomersStore } from '../customers'
import * as mockApi from '@/api/mockApi'
import type { Customer } from '@/types'

vi.mock('@/api/mockApi')

describe('Customers Store', () => {
  const mockCustomer: Customer = {
    id: 1,
    name: 'John Smith',
    address: '123 Main St, Cape Town, 8001',
    phone: '+27 21 123 4567',
    email: 'john.smith@example.com',
    createdAt: new Date('2024-01-01')
  }

  const mockCustomers: Customer[] = [
    {
      id: 1,
      name: 'John Smith',
      address: '123 Main St, Cape Town, 8001',
      phone: '+27 21 123 4567',
      email: 'john.smith@example.com',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      address: '456 Oak Ave, Johannesburg, 2000',
      phone: '+27 11 456 7890',
      email: 'sarah.j@example.com',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 3,
      name: 'Mike Williams',
      address: '789 Pine Rd, Durban, 4000',
      phone: '+27 31 789 0123',
      email: 'mike.w@example.com',
      createdAt: new Date('2024-02-01')
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useCustomersStore()

      expect(store.customers).toEqual([])
      expect(store.currentCustomer).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('fetchCustomers', () => {
    it('should fetch customers successfully', async () => {
      const store = useCustomersStore()

      vi.mocked(mockApi.getCustomers).mockResolvedValue({
        success: true,
        data: mockCustomers
      })

      const result = await store.fetchCustomers()

      expect(result).toBe(true)
      expect(store.customers).toEqual(mockCustomers)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should handle fetch error', async () => {
      const store = useCustomersStore()

      vi.mocked(mockApi.getCustomers).mockResolvedValue({
        success: false,
        message: 'Failed to fetch customers'
      })

      const result = await store.fetchCustomers()

      expect(result).toBe(false)
      expect(store.customers).toEqual([])
      expect(store.error).toBe('Failed to fetch customers')
      expect(store.loading).toBe(false)
    })

    it('should set loading state during fetch', async () => {
      const store = useCustomersStore()

      vi.mocked(mockApi.getCustomers).mockImplementation(
        () =>
          new Promise(resolve => {
            expect(store.loading).toBe(true)
            resolve({ success: true, data: mockCustomers })
          })
      )

      await store.fetchCustomers()

      expect(store.loading).toBe(false)
    })

    it('should handle network errors gracefully', async () => {
      const store = useCustomersStore()

      vi.mocked(mockApi.getCustomers).mockRejectedValue(new Error('Network error'))

      const result = await store.fetchCustomers()

      expect(result).toBe(false)
      expect(store.error).toBe('An error occurred while fetching customers')
      expect(store.loading).toBe(false)
    })
  })

  describe('fetchCustomerById', () => {
    it('should fetch customer by id successfully', async () => {
      const store = useCustomersStore()

      vi.mocked(mockApi.getCustomerById).mockResolvedValue({
        success: true,
        data: mockCustomer
      })

      const result = await store.fetchCustomerById(1)

      expect(result).toBe(true)
      expect(store.currentCustomer).toEqual(mockCustomer)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should handle customer not found', async () => {
      const store = useCustomersStore()

      vi.mocked(mockApi.getCustomerById).mockResolvedValue({
        success: false,
        message: 'Customer not found'
      })

      const result = await store.fetchCustomerById(999)

      expect(result).toBe(false)
      expect(store.currentCustomer).toBeNull()
      expect(store.error).toBe('Customer not found')
      expect(store.loading).toBe(false)
    })

    it('should set loading state during fetch', async () => {
      const store = useCustomersStore()

      vi.mocked(mockApi.getCustomerById).mockImplementation(
        () =>
          new Promise(resolve => {
            expect(store.loading).toBe(true)
            resolve({ success: true, data: mockCustomer })
          })
      )

      await store.fetchCustomerById(1)

      expect(store.loading).toBe(false)
    })

    it('should handle API errors gracefully', async () => {
      const store = useCustomersStore()

      vi.mocked(mockApi.getCustomerById).mockRejectedValue(new Error('Network error'))

      const result = await store.fetchCustomerById(1)

      expect(result).toBe(false)
      expect(store.error).toBe('An error occurred while fetching customer')
      expect(store.loading).toBe(false)
    })
  })

  describe('getCustomerById_sync', () => {
    beforeEach(async () => {
      const store = useCustomersStore()
      vi.mocked(mockApi.getCustomers).mockResolvedValue({
        success: true,
        data: mockCustomers
      })
      await store.fetchCustomers()
    })

    it('should return customer when found', () => {
      const store = useCustomersStore()
      const customer = store.getCustomerById_sync(1)

      expect(customer).toEqual(mockCustomers[0])
    })

    it('should return null when customer not found', () => {
      const store = useCustomersStore()
      const customer = store.getCustomerById_sync(999)

      expect(customer).toBeNull()
    })

    it('should work with all customers in the list', () => {
      const store = useCustomersStore()

      mockCustomers.forEach(mockCustomer => {
        const customer = store.getCustomerById_sync(mockCustomer.id)
        expect(customer).toEqual(mockCustomer)
      })
    })
  })

  describe('clearError', () => {
    it('should clear error message', () => {
      const store = useCustomersStore()
      store.error = 'Some error'

      store.clearError()

      expect(store.error).toBeNull()
    })

    it('should work when error is already null', () => {
      const store = useCustomersStore()
      expect(store.error).toBeNull()

      store.clearError()

      expect(store.error).toBeNull()
    })
  })

  describe('Error State Management', () => {
    it('should clear previous error on successful fetch', async () => {
      const store = useCustomersStore()
      store.error = 'Previous error'

      vi.mocked(mockApi.getCustomers).mockResolvedValue({
        success: true,
        data: mockCustomers
      })

      await store.fetchCustomers()

      expect(store.error).toBeNull()
    })

    it('should clear previous error before new fetch attempt', async () => {
      const store = useCustomersStore()
      store.error = 'Previous error'

      vi.mocked(mockApi.getCustomerById).mockResolvedValue({
        success: true,
        data: mockCustomer
      })

      await store.fetchCustomerById(1)

      expect(store.error).toBeNull()
    })
  })
})
