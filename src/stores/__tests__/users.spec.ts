import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUsersStore } from '../users'
import * as mockApi from '@/api/mockApi'
import type { User } from '@/types'

vi.mock('@/api/mockApi')

describe('Users Store', () => {
  const mockUser: User = {
    id: 1,
    username: 'testuser',
    password: 'password123',
    role: 'Installer',
    name: 'Test User',
    email: 'test@example.com',
    supervisorId: 2,
    createdAt: new Date('2024-01-01')
  }

  const mockUsers: User[] = [
    { id: 1, username: 'admin', password: '123', role: 'Admin', name: 'Faizal', email: 'admin@fibreinstall.com', createdAt: new Date('2024-01-01') },
    { id: 2, username: 'super1', password: '123', role: 'Supervisor', name: 'Stan', email: 'stan@company.com', companyId: 1, createdAt: new Date('2024-01-15') },
    { id: 3, username: 'install1', password: '123', role: 'Installer', name: 'Ben', email: 'ben@installer.com', supervisorId: 2, createdAt: new Date('2024-02-01') }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useUsersStore()

      expect(store.users).toEqual([])
      expect(store.currentUser).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('fetchUsers', () => {
    it('should fetch users successfully', async () => {
      const store = useUsersStore()

      vi.mocked(mockApi.getUsers).mockResolvedValue({
        success: true,
        data: mockUsers
      })

      const result = await store.fetchUsers()

      expect(result).toBe(true)
      expect(store.users).toEqual(mockUsers)
      expect(store.error).toBeNull()
    })

    it('should handle fetch error', async () => {
      const store = useUsersStore()

      vi.mocked(mockApi.getUsers).mockResolvedValue({
        success: false,
        message: 'Failed to fetch users'
      })

      const result = await store.fetchUsers()

      expect(result).toBe(false)
      expect(store.error).toBe('Failed to fetch users')
    })
  })

  describe('fetchUserById', () => {
    it('should fetch user by id', async () => {
      const store = useUsersStore()

      vi.mocked(mockApi.getUserById).mockResolvedValue({
        success: true,
        data: mockUser
      })

      const result = await store.fetchUserById(1)

      expect(result).toBe(true)
      expect(store.currentUser).toEqual(mockUser)
    })

    it('should handle user not found', async () => {
      const store = useUsersStore()

      vi.mocked(mockApi.getUserById).mockResolvedValue({
        success: false,
        message: 'User not found'
      })

      const result = await store.fetchUserById(999)

      expect(result).toBe(false)
      expect(store.error).toBe('User not found')
    })
  })

  describe('addUser', () => {
    it('should add user successfully', async () => {
      const store = useUsersStore()
      const newUserData = {
        username: 'newuser',
        password: 'password',
        role: 'Installer' as const,
        name: 'New User',
        email: 'new@example.com',
        supervisorId: 2
      }
      const createdUser = { ...newUserData, id: 4, createdAt: new Date() }

      vi.mocked(mockApi.createUser).mockResolvedValue({
        success: true,
        data: createdUser
      })

      const result = await store.addUser(newUserData)

      expect(result).toEqual(createdUser)
      expect(store.users).toContainEqual(createdUser)
    })

    it('should handle username already exists', async () => {
      const store = useUsersStore()
      const newUserData = {
        username: 'existinguser',
        password: 'password',
        role: 'Installer' as const,
        name: 'New User'
      }

      vi.mocked(mockApi.createUser).mockResolvedValue({
        success: false,
        message: 'Username already exists'
      })

      const result = await store.addUser(newUserData)

      expect(result).toBeNull()
      expect(store.error).toBe('Username already exists')
    })
  })

  describe('modifyUser', () => {
    it('should update user successfully', async () => {
      const store = useUsersStore()
      store.users = [...mockUsers]
      const updatedUser = { ...mockUser, name: 'Updated Name' }

      vi.mocked(mockApi.updateUser).mockResolvedValue({
        success: true,
        data: updatedUser
      })

      const result = await store.modifyUser(1, { name: 'Updated Name' })

      expect(result).toEqual(updatedUser)
      const userInStore = store.users.find(u => u.id === 1)
      expect(userInStore?.name).toBe('Updated Name')
    })

    it('should handle update error', async () => {
      const store = useUsersStore()

      vi.mocked(mockApi.updateUser).mockResolvedValue({
        success: false,
        message: 'Failed to update user'
      })

      const result = await store.modifyUser(999, { name: 'New Name' })

      expect(result).toBeNull()
      expect(store.error).toBe('Failed to update user')
    })
  })

  describe('removeUser', () => {
    it('should delete user successfully', async () => {
      const store = useUsersStore()
      store.users = [...mockUsers]

      vi.mocked(mockApi.deleteUser).mockResolvedValue({
        success: true
      })

      const result = await store.removeUser(1)

      expect(result).toBe(true)
      expect(store.users.find(u => u.id === 1)).toBeUndefined()
    })

    it('should handle delete error', async () => {
      const store = useUsersStore()

      vi.mocked(mockApi.deleteUser).mockResolvedValue({
        success: false,
        message: 'User not found'
      })

      const result = await store.removeUser(999)

      expect(result).toBe(false)
      expect(store.error).toBe('User not found')
    })
  })

  describe('fetchInstallersBySupervisor', () => {
    it('should fetch installers for a supervisor', async () => {
      const store = useUsersStore()
      const installers = [mockUsers[2]]

      vi.mocked(mockApi.getInstallersBySupervisorId).mockResolvedValue({
        success: true,
        data: installers
      })

      const result = await store.fetchInstallersBySupervisor(2)

      expect(result).toEqual(installers)
    })

    it('should return empty array on error', async () => {
      const store = useUsersStore()

      vi.mocked(mockApi.getInstallersBySupervisorId).mockResolvedValue({
        success: false,
        message: 'Failed to fetch installers'
      })

      const result = await store.fetchInstallersBySupervisor(999)

      expect(result).toEqual([])
    })
  })

  describe('Helper Methods', () => {
    beforeEach(async () => {
      const store = useUsersStore()
      vi.mocked(mockApi.getUsers).mockResolvedValue({
        success: true,
        data: mockUsers
      })
      await store.fetchUsers()
    })

    it('getInstallers should return only installers', () => {
      const store = useUsersStore()
      const installers = store.getInstallers()

      expect(installers).toHaveLength(1)
      expect(installers.every(u => u.role === 'Installer')).toBe(true)
    })

    it('getSupervisors should return only supervisors', () => {
      const store = useUsersStore()
      const supervisors = store.getSupervisors()

      expect(supervisors).toHaveLength(1)
      expect(supervisors.every(u => u.role === 'Supervisor')).toBe(true)
    })
  })

  describe('clearError', () => {
    it('should clear error message', () => {
      const store = useUsersStore()
      store.error = 'Some error'

      store.clearError()

      expect(store.error).toBeNull()
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const store = useUsersStore()

      vi.mocked(mockApi.getUsers).mockRejectedValue(new Error('Network error'))

      const result = await store.fetchUsers()

      expect(result).toBe(false)
      expect(store.error).toBe('An error occurred while fetching users')
    })
  })
})
