<template>
  <div>
    <!-- Mobile menu -->
    <div class="md:hidden">
      <nav class="bg-blue-600 shadow-lg">
        <div class="px-4">
          <div class="flex items-center justify-between h-16">
            <span class="text-xl font-bold text-white">Fibre Install</span>
            <button
              @click="isOpen = true"
              type="button"
              class="p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span class="sr-only">Open menu</span>
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <!-- Backdrop -->
      <Transition name="fade">
        <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 bg-gray-900 bg-opacity-75 z-40"></div>
      </Transition>

      <!-- Slide-in menu -->
      <Transition name="slide">
        <div v-if="isOpen" class="fixed inset-y-0 right-0 w-64 bg-white z-50 shadow-xl">
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 class="font-bold text-lg text-gray-900">Menu</h2>
            <button @click="isOpen = false" class="p-2 rounded-md text-gray-400 hover:text-gray-600">
              <span class="sr-only">Close menu</span>
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-4 border-b border-gray-200">
            <p class="text-sm text-gray-600">Logged in as</p>
            <p class="font-medium text-gray-900">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-500">{{ authStore.user?.role }}</p>
          </div>

          <nav class="mt-2 px-2 space-y-1">
            <template v-if="authStore.isAdmin">
              <RouterLink v-for="item in adminNav" :key="item.name" :to="item.to" @click="isOpen = false"
                class="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                {{ item.name }}
              </RouterLink>
            </template>

            <template v-if="authStore.isSupervisor">
              <RouterLink v-for="item in supervisorNav" :key="item.name" :to="item.to" @click="isOpen = false"
                class="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                {{ item.name }}
              </RouterLink>
            </template>

            <template v-if="authStore.isInstaller">
              <RouterLink v-for="item in installerNav" :key="item.name" :to="item.to" @click="isOpen = false"
                class="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                {{ item.name }}
              </RouterLink>
            </template>
          </nav>

          <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <button @click="handleLogout"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Logout
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Desktop menu -->
    <nav class="hidden md:block bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <span class="text-2xl font-bold text-blue-600">Fibre Install</span>
            </div>
            <div class="ml-6 flex space-x-8">
              <template v-if="authStore.isAdmin">
                <RouterLink v-for="item in adminNav" :key="item.name" :to="item.to"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-blue-500 text-gray-900">
                  {{ item.name }}
                </RouterLink>
              </template>

              <template v-if="authStore.isSupervisor">
                <RouterLink v-for="item in supervisorNav" :key="item.name" :to="item.to"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-blue-500 text-gray-900">
                  {{ item.name }}
                </RouterLink>
              </template>

              <template v-if="authStore.isInstaller">
                <RouterLink v-for="item in installerNav" :key="item.name" :to="item.to"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-blue-500 text-gray-900">
                  {{ item.name }}
                </RouterLink>
              </template>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-sm text-gray-700 mr-4">{{ authStore.user?.name }}</span>
            <button @click="handleLogout"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isOpen = ref(false)

const adminNav = [
  { name: 'Dashboard', to: '/admin/dashboard' },
  { name: 'Users', to: '/admin/users' },
  { name: 'Assignments', to: '/admin/assignments' }
]

const supervisorNav = [
  { name: 'Dashboard', to: '/supervisor/dashboard' },
  { name: 'Jobs', to: '/supervisor/jobs' },
  { name: 'My Installers', to: '/supervisor/installers' }
]

const installerNav = [
  { name: 'Dashboard', to: '/installer/dashboard' },
  { name: 'My Jobs', to: '/installer/jobs' },
  { name: 'Activations', to: '/installer/activations' }
]

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
