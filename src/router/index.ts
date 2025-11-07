import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: () => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return '/login'

      if (authStore.isAdmin) return '/admin/dashboard'
      if (authStore.isSupervisor) return '/supervisor/dashboard'
      if (authStore.isInstaller) return '/installer/dashboard'

      return '/login'
    }
  },
  // Admin Routes
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'Admin' }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/AdminUsers.vue'),
    meta: { requiresAuth: true, role: 'Admin' }
  },
  {
    path: '/admin/users/create',
    name: 'AdminCreateUser',
    component: () => import('@/views/admin/AdminCreateUser.vue'),
    meta: { requiresAuth: true, role: 'Admin' }
  },
  {
    path: '/admin/users/:id',
    name: 'AdminUserDetails',
    component: () => import('@/views/admin/AdminUserDetails.vue'),
    meta: { requiresAuth: true, role: 'Admin' }
  },
  {
    path: '/admin/assignments',
    name: 'AdminAssignments',
    component: () => import('@/views/admin/AdminAssignments.vue'),
    meta: { requiresAuth: true, role: 'Admin' }
  },
  // Supervisor Routes
  {
    path: '/supervisor/dashboard',
    name: 'SupervisorDashboard',
    component: () => import('@/views/supervisor/SupervisorDashboard.vue'),
    meta: { requiresAuth: true, role: 'Supervisor' }
  },
  {
    path: '/supervisor/jobs',
    name: 'SupervisorJobs',
    component: () => import('@/views/supervisor/SupervisorJobs.vue'),
    meta: { requiresAuth: true, role: 'Supervisor' }
  },
  {
    path: '/supervisor/jobs/:id',
    name: 'SupervisorJobDetails',
    component: () => import('@/views/supervisor/SupervisorJobDetails.vue'),
    meta: { requiresAuth: true, role: 'Supervisor' }
  },
  {
    path: '/supervisor/installers',
    name: 'SupervisorInstallers',
    component: () => import('@/views/supervisor/SupervisorInstallers.vue'),
    meta: { requiresAuth: true, role: 'Supervisor' }
  },
  // Installer Routes
  {
    path: '/installer/dashboard',
    name: 'InstallerDashboard',
    component: () => import('@/views/installer/InstallerDashboard.vue'),
    meta: { requiresAuth: true, role: 'Installer' }
  },
  {
    path: '/installer/jobs',
    name: 'InstallerJobs',
    component: () => import('@/views/installer/InstallerJobs.vue'),
    meta: { requiresAuth: true, role: 'Installer' }
  },
  {
    path: '/installer/jobs/:id',
    name: 'InstallerJobDetails',
    component: () => import('@/views/installer/InstallerJobDetails.vue'),
    meta: { requiresAuth: true, role: 'Installer' }
  },
  {
    path: '/installer/jobs/:id/schedule',
    name: 'InstallerScheduleJob',
    component: () => import('@/views/installer/InstallerScheduleJob.vue'),
    meta: { requiresAuth: true, role: 'Installer' }
  },
  {
    path: '/installer/jobs/:id/install',
    name: 'InstallerInstallation',
    component: () => import('@/views/installer/InstallerInstallation.vue'),
    meta: { requiresAuth: true, role: 'Installer' }
  },
  {
    path: '/installer/activations',
    name: 'InstallerActivations',
    component: () => import('@/views/installer/InstallerActivations.vue'),
    meta: { requiresAuth: true, role: 'Installer' }
  },
  // Error Routes
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/Unauthorized.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // If not authenticated, check for stored token
    if (!authStore.isAuthenticated) {
      const authenticated = await authStore.checkAuth()

      if (!authenticated) {
        next('/login')
        return
      }
    }

    // Check role-based access
    if (to.meta.role) {
      if (authStore.userRole !== to.meta.role) {
        next('/unauthorized')
        return
      }
    }
  }

  // If authenticated and trying to access login, redirect to dashboard
  if (to.path === '/login' && authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      next('/admin/dashboard')
    } else if (authStore.isSupervisor) {
      next('/supervisor/dashboard')
    } else if (authStore.isInstaller) {
      next('/installer/dashboard')
    } else {
      next()
    }
    return
  }

  next()
})

export default router
