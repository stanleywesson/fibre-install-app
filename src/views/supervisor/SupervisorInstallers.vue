<template>
  <div>
    <AppMenu />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">My Installers</h1>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Jobs</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="installer in myInstallers" :key="installer.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ installer.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ installer.email || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ jobsStore.jobs.filter(j => j.assignedInstallerId === installer.id && j.status !== 'Completed').length }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppMenu from '@/components/AppMenu.vue'
import { useUsersStore } from '@/stores/users'
import { useJobsStore } from '@/stores/jobs'
import { useAuthStore } from '@/stores/auth'

const usersStore = useUsersStore()
const jobsStore = useJobsStore()
const authStore = useAuthStore()

const myInstallers = computed(() => {
  return usersStore.users.filter(u => u.supervisorId === authStore.user?.id && u.role === 'Installer')
})

onMounted(async () => {
  await usersStore.fetchUsers()
  if (authStore.user?.companyId) {
    await jobsStore.fetchJobsByCompany(authStore.user.companyId)
  }
})
</script>
