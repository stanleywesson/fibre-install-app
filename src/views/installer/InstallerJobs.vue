<template>
  <div>
    <AppMenu />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">My Jobs</h1>

        <!-- Filter Tabs (Desktop) / Dropdown (Mobile) -->
        <div class="mb-6">
          <!-- Mobile Dropdown -->
          <div class="sm:hidden">
            <label for="job-filter" class="sr-only">Filter jobs</label>
            <select
              id="job-filter"
              v-model="activeFilter"
              class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 border"
            >
              <option v-for="filter in filters" :key="filter.value" :value="filter.value">
                {{ filter.label }} ({{ getFilterCount(filter.value) }})
              </option>
            </select>
          </div>

          <!-- Desktop Tabs -->
          <div class="hidden sm:block border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button v-for="filter in filters" :key="filter.value" @click="activeFilter = filter.value"
                :class="[activeFilter === filter.value ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
                {{ filter.label }} ({{ getFilterCount(filter.value) }})
              </button>
            </nav>
          </div>
        </div>

        <!-- Jobs Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="job in filteredJobs" :key="job.id">
                <td class="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ job.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ customersStore.getCustomerById_sync(job.customerId)?.name || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="getStatusClass(job.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ job.status }}
                  </span>
                </td>
                <td class="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <RouterLink :to="`/installer/jobs/${job.id}`" class="text-blue-600 hover:text-blue-900">
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
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppMenu from '@/components/AppMenu.vue'
import { useJobsStore } from '@/stores/jobs'
import { useCustomersStore } from '@/stores/customers'
import { useAuthStore } from '@/stores/auth'
import type { JobStatus } from '@/types'

const jobsStore = useJobsStore()
const customersStore = useCustomersStore()
const authStore = useAuthStore()

const activeFilter = ref('all')

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Assigned', value: 'Assigned' },
  { label: 'Scheduled', value: 'Scheduled' },
  { label: 'In Progress', value: 'Installation in Progress' },
  { label: 'Pending Activation', value: 'Pending Activation' },
  { label: 'Hold-Over', value: 'Hold-Over' }
]

const filteredJobs = computed(() => {
  if (activeFilter.value === 'all') {
    return jobsStore.jobs.filter(j => j.status !== 'Completed')
  }
  return jobsStore.jobs.filter(j => j.status === activeFilter.value)
})

function getFilterCount(filterValue: string) {
  if (filterValue === 'all') {
    return jobsStore.jobs.filter(j => j.status !== 'Completed').length
  }
  return jobsStore.jobs.filter(j => j.status === filterValue).length
}

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

onMounted(async () => {
  if (authStore.user?.id) {
    await jobsStore.fetchJobsByInstaller(authStore.user.id)
  }
  await customersStore.fetchCustomers()
})
</script>
