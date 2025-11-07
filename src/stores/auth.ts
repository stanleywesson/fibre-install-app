import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '@/types'
import { login as apiLogin, verifyToken } from '@/api/mockApi'

const TOKEN_KEY = 'fibre_install_token'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'Admin')
  const isSupervisor = computed(() => user.value?.role === 'Supervisor')
  const isInstaller = computed(() => user.value?.role === 'Installer')
  const userRole = computed(() => user.value?.role)

  // Actions
  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null

    try {
      const response = await apiLogin(credentials)

      if (response.success && response.data) {
        user.value = response.data.user
        token.value = response.data.token

        // Persist token
        localStorage.setItem(TOKEN_KEY, response.data.token)

        return true
      } else {
        error.value = response.message || 'Login failed'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred during login'
      console.error('Login error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  async function checkAuth() {
    const storedToken = localStorage.getItem(TOKEN_KEY)

    if (!storedToken) {
      return false
    }

    loading.value = true

    try {
      const response = await verifyToken(storedToken)

      if (response.success && response.data) {
        user.value = response.data
        token.value = storedToken
        return true
      } else {
        // Invalid token, clear it
        localStorage.removeItem(TOKEN_KEY)
        return false
      }
    } catch (err) {
      console.error('Auth check error:', err)
      localStorage.removeItem(TOKEN_KEY)
      return false
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    isSupervisor,
    isInstaller,
    userRole,
    // Actions
    login,
    logout,
    checkAuth,
    clearError
  }
})
