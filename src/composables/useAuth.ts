import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

/**
 * Auth composable - Provides convenient access to auth store functionality
 *
 * @example
 * const { user, isAdmin, login, logout } = useAuth()
 * if (isAdmin.value) {
 *   // Show admin features
 * }
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isAdmin = computed(() => authStore.isAdmin)
  const isSupervisor = computed(() => authStore.isSupervisor)
  const isInstaller = computed(() => authStore.isInstaller)
  const userRole = computed(() => authStore.userRole)
  const loading = computed(() => authStore.loading)
  const error = computed(() => authStore.error)

  const login = async (username: string, password: string) => {
    return await authStore.login({ username, password })
  }

  const logout = async () => {
    await authStore.logout()
    router.push('/login')
  }

  const checkAuth = async () => {
    return await authStore.checkAuth()
  }

  return {
    // State
    user,
    isAuthenticated,
    isAdmin,
    isSupervisor,
    isInstaller,
    userRole,
    loading,
    error,

    // Actions
    login,
    logout,
    checkAuth
  }
}
