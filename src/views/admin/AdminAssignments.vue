<template>
  <div>
    <AppMenu />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Installer Assignments</h1>

        <div class="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Assign Installer to Supervisor</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Installer</label>
              <select
                v-model="selectedInstaller"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Installer</option>
                <option v-for="installer in installers" :key="installer.id" :value="installer.id">
                  {{ installer.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Supervisor</label>
              <select
                v-model="selectedSupervisor"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Supervisor</option>
                <option v-for="supervisor in supervisors" :key="supervisor.id" :value="supervisor.id">
                  {{ supervisor.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="mt-4">
            <button
              @click="assignInstaller"
              :disabled="!selectedInstaller || !selectedSupervisor"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Installer
            </button>
          </div>
        </div>

        <!-- Current Assignments -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Current Assignments</h3>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Installer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supervisor
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="installer in installers" :key="installer.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ installer.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ installer.supervisorId ? getSupervisorName(installer.supervisorId) : 'Unassigned' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ installer.supervisorId ? getCompanyName(installer.supervisorId) : '-' }}
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
import { ref, computed, onMounted } from 'vue'
import AppMenu from '@/components/AppMenu.vue'
import { useUsersStore } from '@/stores/users'
import { useCompaniesStore } from '@/stores/companies'
import { useToast } from 'vue-toastification'

const usersStore = useUsersStore()
const companiesStore = useCompaniesStore()
const toast = useToast()

const selectedInstaller = ref<number | ''>('')
const selectedSupervisor = ref<number | ''>('')

const installers = computed(() => {
  return usersStore.users.filter(u => u.role === 'Installer')
})

const supervisors = computed(() => {
  return usersStore.users.filter(u => u.role === 'Supervisor')
})

function getSupervisorName(supervisorId: number): string {
  const supervisor = usersStore.users.find(u => u.id === supervisorId)
  return supervisor?.name || '-'
}

function getCompanyName(supervisorId: number): string {
  const supervisor = usersStore.users.find(u => u.id === supervisorId)
  if (supervisor?.companyId) {
    const company = companiesStore.getCompanyById_sync(supervisor.companyId)
    return company?.name || '-'
  }
  return '-'
}

async function assignInstaller() {
  if (!selectedInstaller.value || !selectedSupervisor.value) {
    return
  }

  const result = await usersStore.modifyUser(selectedInstaller.value as number, {
    supervisorId: selectedSupervisor.value as number
  })

  if (result) {
    toast.success('Installer assigned successfully!')
    selectedInstaller.value = ''
    selectedSupervisor.value = ''
  } else {
    toast.error(usersStore.error || 'Failed to assign installer')
  }
}

onMounted(async () => {
  await Promise.all([
    usersStore.fetchUsers(),
    companiesStore.fetchCompanies()
  ])
})
</script>
