import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import * as mockApi from '@/api/mockApi'

// Mock the API
vi.mock('@/api/mockApi')

describe('Auth Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())
    // Clear localStorage
    localStorage.clear()
    // Reset all mocks
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useAuthStore()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const store = useAuthStore()
      const mockUser = {
        id: 1,
        username: 'admin',
        password: '123',
        role: 'Admin' as const,
        name: 'Faizal',
        email: 'admin@fibreinstall.com',
        createdAt: new Date('2024-01-01')
      }
      const mockToken = 'mock-jwt-token-1-123456'

      vi.mocked(mockApi.login).mockResolvedValue({
        success: true,
        data: { user: mockUser, token: mockToken }
      })

      const result = await store.login({ username: 'admin', password: '123' })

      expect(result).toBe(true)
      expect(store.user).toEqual(mockUser)
      expect(store.token).toBe(mockToken)
      expect(store.isAuthenticated).toBe(true)
      expect(store.error).toBeNull()
      expect(localStorage.getItem('fibre_install_token')).toBe(mockToken)
    })

    it('should fail login with invalid credentials', async () => {
      const store = useAuthStore()

      vi.mocked(mockApi.login).mockResolvedValue({
        success: false,
        message: 'Invalid username or password'
      })

      const result = await store.login({ username: 'wrong', password: 'wrong' })

      expect(result).toBe(false)
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.error).toBe('Invalid username or password')
      expect(localStorage.getItem('fibre_install_token')).toBeNull()
    })

    it('should set loading state during login', async () => {
      const store = useAuthStore()

      vi.mocked(mockApi.login).mockImplementation(
        () =>
          new Promise(resolve => {
            expect(store.loading).toBe(true)
            resolve({ success: true, data: { user: {} as any, token: 'token' } })
          })
      )

      await store.login({ username: 'admin', password: '123' })

      expect(store.loading).toBe(false)
    })

    it('should handle API errors gracefully', async () => {
      const store = useAuthStore()

      vi.mocked(mockApi.login).mockRejectedValue(new Error('Network error'))

      const result = await store.login({ username: 'admin', password: '123' })

      expect(result).toBe(false)
      expect(store.error).toBe('An error occurred during login')
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('should clear user data and token on logout', async () => {
      const store = useAuthStore()
      const mockUser = {
        id: 1,
        username: 'admin',
        password: '123',
        role: 'Admin' as const,
        name: 'Faizal',
        email: 'admin@fibreinstall.com',
        createdAt: new Date('2024-01-01')
      }

      // Set up authenticated state
      store.user = mockUser
      store.token = 'mock-token'
      localStorage.setItem('fibre_install_token', 'mock-token')

      await store.logout()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(localStorage.getItem('fibre_install_token')).toBeNull()
    })
  })

  describe('checkAuth', () => {
    it('should restore auth state from valid token', async () => {
      const store = useAuthStore()
      const mockUser = {
        id: 1,
        username: 'admin',
        password: '123',
        role: 'Admin' as const,
        name: 'Faizal',
        email: 'admin@fibreinstall.com',
        createdAt: new Date('2024-01-01')
      }
      const mockToken = 'valid-token'

      localStorage.setItem('fibre_install_token', mockToken)

      vi.mocked(mockApi.verifyToken).mockResolvedValue({
        success: true,
        data: mockUser
      })

      const result = await store.checkAuth()

      expect(result).toBe(true)
      expect(store.user).toEqual(mockUser)
      expect(store.token).toBe(mockToken)
      expect(store.isAuthenticated).toBe(true)
    })

    it('should return false when no token is stored', async () => {
      const store = useAuthStore()

      const result = await store.checkAuth()

      expect(result).toBe(false)
      expect(store.isAuthenticated).toBe(false)
    })

    it('should clear auth state when token is invalid', async () => {
      const store = useAuthStore()
      localStorage.setItem('fibre_install_token', 'invalid-token')

      vi.mocked(mockApi.verifyToken).mockResolvedValue({
        success: false,
        message: 'Invalid token'
      })

      const result = await store.checkAuth()

      expect(result).toBe(false)
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(localStorage.getItem('fibre_install_token')).toBeNull()
    })
  })

  describe('Role Computed Properties', () => {
    it('should correctly identify admin role', async () => {
      const store = useAuthStore()
      const mockUser = {
        id: 1,
        username: 'admin',
        password: '123',
        role: 'Admin' as const,
        name: 'Faizal',
        email: 'admin@fibreinstall.com',
        createdAt: new Date('2024-01-01')
      }

      vi.mocked(mockApi.login).mockResolvedValue({
        success: true,
        data: { user: mockUser, token: 'token' }
      })

      await store.login({ username: 'admin', password: '123' })

      expect(store.isAdmin).toBe(true)
      expect(store.isSupervisor).toBe(false)
      expect(store.isInstaller).toBe(false)
      expect(store.userRole).toBe('Admin')
    })

    it('should correctly identify supervisor role', async () => {
      const store = useAuthStore()
      const mockUser = {
        id: 2,
        username: 'super1',
        password: '123',
        role: 'Supervisor' as const,
        name: 'Stan',
        email: 'stan@company.com',
        companyId: 1,
        createdAt: new Date('2024-01-01')
      }

      vi.mocked(mockApi.login).mockResolvedValue({
        success: true,
        data: { user: mockUser, token: 'token' }
      })

      await store.login({ username: 'super1', password: '123' })

      expect(store.isAdmin).toBe(false)
      expect(store.isSupervisor).toBe(true)
      expect(store.isInstaller).toBe(false)
      expect(store.userRole).toBe('Supervisor')
    })

    it('should correctly identify installer role', async () => {
      const store = useAuthStore()
      const mockUser = {
        id: 3,
        username: 'install1',
        password: '123',
        role: 'Installer' as const,
        name: 'Ben',
        email: 'ben@installer.com',
        supervisorId: 2,
        createdAt: new Date('2024-01-01')
      }

      vi.mocked(mockApi.login).mockResolvedValue({
        success: true,
        data: { user: mockUser, token: 'token' }
      })

      await store.login({ username: 'install1', password: '123' })

      expect(store.isAdmin).toBe(false)
      expect(store.isSupervisor).toBe(false)
      expect(store.isInstaller).toBe(true)
      expect(store.userRole).toBe('Installer')
    })
  })

  describe('clearError', () => {
    it('should clear error message', () => {
      const store = useAuthStore()
      store.error = 'Some error'

      store.clearError()

      expect(store.error).toBeNull()
    })
  })
})
