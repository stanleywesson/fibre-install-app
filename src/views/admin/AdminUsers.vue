<template>
  <div>
    <AppMenu />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
          <RouterLink
            to="/admin/users/create"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New User
          </RouterLink>
        </div>

        <!-- Users Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th class="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th class="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company/Supervisor
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in usersStore.users" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ user.name }}
                </td>
                <td class="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.username }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    :class="{
                      'bg-purple-100 text-purple-800': user.role === 'Admin',
                      'bg-blue-100 text-blue-800': user.role === 'Supervisor',
                      'bg-green-100 text-green-800': user.role === 'Installer'
                    }"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.email || '-' }}
                </td>
                <td class="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="user.companyId">
                    {{ companiesStore.getCompanyById_sync(user.companyId)?.name || '-' }}
                  </span>
                  <span v-else-if="user.supervisorId">
                    {{ usersStore.users.find(u => u.id === user.supervisorId)?.name || '-' }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <RouterLink
                    :to="`/admin/users/${user.id}`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </RouterLink>
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
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppMenu from '@/components/AppMenu.vue'
import { useUsersStore } from '@/stores/users'
import { useCompaniesStore } from '@/stores/companies'

const usersStore = useUsersStore()
const companiesStore = useCompaniesStore()

onMounted(async () => {
  await Promise.all([
    usersStore.fetchUsers(),
    companiesStore.fetchCompanies()
  ])
})
</script>
