import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getInstallersBySupervisorId
} from '@/api/mockApi'

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchUsers() {
    loading.value = true
    error.value = null

    try {
      const response = await getUsers()

      if (response.success && response.data) {
        users.value = response.data
        return true
      } else {
        error.value = response.message || 'Failed to fetch users'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while fetching users'
      console.error('Fetch users error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchUserById(id: number) {
    loading.value = true
    error.value = null

    try {
      const response = await getUserById(id)

      if (response.success && response.data) {
        currentUser.value = response.data
        return true
      } else {
        error.value = response.message || 'Failed to fetch user'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while fetching user'
      console.error('Fetch user error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchInstallersBySupervisor(supervisorId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await getInstallersBySupervisorId(supervisorId)

      if (response.success && response.data) {
        return response.data
      } else {
        error.value = response.message || 'Failed to fetch installers'
        return []
      }
    } catch (err) {
      error.value = 'An error occurred while fetching installers'
      console.error('Fetch installers error:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function addUser(userData: Omit<User, 'id' | 'createdAt'>) {
    loading.value = true
    error.value = null

    try {
      const response = await createUser(userData)

      if (response.success && response.data) {
        // Use immutable update to trigger reactivity and avoid duplicates
        users.value = [...users.value, response.data]
        return response.data
      } else {
        error.value = response.message || 'Failed to create user'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while creating user'
      console.error('Create user error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function modifyUser(id: number, userData: Partial<User>) {
    loading.value = true
    error.value = null

    try {
      const response = await updateUser(id, userData)

      if (response.success && response.data) {
        // Use immutable update to trigger reactivity
        users.value = users.value.map(u => u.id === id ? response.data! : u)
        return response.data
      } else {
        error.value = response.message || 'Failed to update user'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while updating user'
      console.error('Update user error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function removeUser(id: number) {
    loading.value = true
    error.value = null

    try {
      const response = await deleteUser(id)

      if (response.success) {
        users.value = users.value.filter(u => u.id !== id)
        return true
      } else {
        error.value = response.message || 'Failed to delete user'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while deleting user'
      console.error('Delete user error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  function getInstallers() {
    return users.value.filter(u => u.role === 'Installer')
  }

  function getSupervisors() {
    return users.value.filter(u => u.role === 'Supervisor')
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    users,
    currentUser,
    loading,
    error,
    // Actions
    fetchUsers,
    fetchUserById,
    fetchInstallersBySupervisor,
    addUser,
    modifyUser,
    removeUser,
    getInstallers,
    getSupervisors,
    clearError
  }
})
