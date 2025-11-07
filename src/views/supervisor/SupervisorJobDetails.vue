<template>
  <div>
    <AppMenu />
    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center mb-6">
          <button @click="router.back()" class="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Job Details</h1>
        </div>

        <div v-if="currentJob" class="bg-white shadow sm:rounded-lg p-6 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Job ID</p>
              <p class="font-medium">{{ currentJob.id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <p><span :class="getStatusClass(currentJob.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
                {{ currentJob.status }}
              </span></p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Customer</p>
              <p class="font-medium">{{ customer?.name || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Customer Phone</p>
              <p class="font-medium">{{ customer?.phone || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Customer Address</p>
              <p class="font-medium">{{ customer?.address || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Assigned Installer</p>
              <p class="font-medium">{{ installerName || 'Unassigned' }}</p>
            </div>
          </div>
        </div>

        <!-- Assign/Reassign Job -->
        <div v-if="currentJob?.status === 'New' || currentJob?.status === 'Assigned'" class="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium mb-4">{{ currentJob.assignedInstallerId ? 'Reassign Job' : 'Assign Job' }}</h2>
          <div class="flex gap-4">
            <select v-model="selectedInstallerId" class="flex-1 border border-gray-300 rounded-md px-3 py-2">
              <option value="">Select Installer</option>
              <option v-for="installer in myInstallers" :key="installer.id" :value="installer.id">
                {{ installer.name }}
              </option>
            </select>
            <button @click="assignJob" :disabled="!selectedInstallerId" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ currentJob.assignedInstallerId ? 'Reassign' : 'Assign' }}
            </button>
          </div>
        </div>

        <!-- Resolve Hold-Over -->
        <div v-if="currentJob?.status === 'Hold-Over'" class="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium mb-4">Resolve Hold-Over</h2>
          <p class="text-sm text-gray-600 mb-4">Notes: {{ currentJob.notes || 'No notes' }}</p>
          <button @click="resolveHoldOver" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Move to Assigned Status
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppMenu from '@/components/AppMenu.vue'
import { useJobsStore } from '@/stores/jobs'
import { useUsersStore } from '@/stores/users'
import { useCustomersStore } from '@/stores/customers'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import type { JobStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const usersStore = useUsersStore()
const customersStore = useCustomersStore()
const authStore = useAuthStore()
const toast = useToast()

const selectedInstallerId = ref<number | ''>('')

const currentJob = computed(() => jobsStore.currentJob)
const customer = computed(() => currentJob.value ? customersStore.getCustomerById_sync(currentJob.value.customerId) : null)
const installerName = computed(() => {
  if (currentJob.value?.assignedInstallerId) {
    return usersStore.users.find(u => u.id === currentJob.value?.assignedInstallerId)?.name || '-'
  }
  return null
})

const myInstallers = computed(() => {
  return usersStore.users.filter(u => u.supervisorId === authStore.user?.id && u.role === 'Installer')
})

function getStatusClass(status: JobStatus) {
  const classes = {
    'New': 'bg-gray-100 text-gray-800',
    'Assigned': 'bg-blue-100 text-blue-800',
    'Scheduled': 'bg-purple-100 text-purple-800',
    'Installation in Progress': 'bg-yellow-100 text-yellow-800',
    'Pending Activation': 'bg-orange-100 text-orange-800',
    'Completed': 'bg-green-100 text-green-800',
    'Hold-Over': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

async function assignJob() {
  if (!selectedInstallerId.value || !currentJob.value || !authStore.user?.id) return

  const result = await jobsStore.assignJobToInstaller(currentJob.value.id, selectedInstallerId.value as number, authStore.user.id)

  if (result) {
    toast.success('Job assigned successfully!')
    await jobsStore.fetchJobById(currentJob.value.id)
  } else {
    toast.error('Failed to assign job')
  }
}

async function resolveHoldOver() {
  if (!currentJob.value) return

  const result = await jobsStore.resolveJobHoldOver(currentJob.value.id)

  if (result) {
    toast.success('Hold-over resolved successfully!')
    await jobsStore.fetchJobById(currentJob.value.id)
  } else {
    toast.error('Failed to resolve hold-over')
  }
}

onMounted(async () => {
  const jobId = parseInt(route.params.id as string)
  await jobsStore.fetchJobById(jobId)
  await usersStore.fetchUsers()
  await customersStore.fetchCustomers()
})
</script>
