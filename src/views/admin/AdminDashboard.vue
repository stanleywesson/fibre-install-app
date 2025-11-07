<template>
  <div>
    <AppMenu />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        <!-- Date Filter -->
        <div class="mb-6 bg-white p-4 rounded-lg shadow">
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <div class="flex flex-col sm:flex-row gap-3">
            <input
              v-model="startDate"
              type="date"
              class="flex-1 border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              v-model="endDate"
              type="date"
              class="flex-1 border border-gray-300 rounded-md px-3 py-2"
            />
            <button
              @click="filterJobs"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
            >
              Apply Filter
            </button>
            <button
              @click="resetFilter"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </div>

        <!-- Job Counts -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="text-3xl font-bold text-blue-600">{{ activeJobsCount }}</div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="text-3xl font-bold text-green-600">{{ completedJobsCount }}</div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Completed Jobs</dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="text-3xl font-bold text-red-600">{{ holdOverJobsCount }}</div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Hold-Over Jobs</dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="text-3xl font-bold text-purple-600">{{ companiesStore.companies.length }}</div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Companies</dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="text-3xl font-bold text-orange-600">{{ supervisorsCount }}</div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Supervisors</dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="text-3xl font-bold text-teal-600">{{ installersCount }}</div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Installers</dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppMenu from '@/components/AppMenu.vue'
import { useJobsStore } from '@/stores/jobs'
import { useUsersStore } from '@/stores/users'
import { useCompaniesStore } from '@/stores/companies'

const jobsStore = useJobsStore()
const usersStore = useUsersStore()
const companiesStore = useCompaniesStore()

const startDate = ref('')
const endDate = ref('')
const filteredJobs = ref<any[]>([])

// Get current month dates
const now = new Date()
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

startDate.value = firstDay.toISOString().split('T')[0]
endDate.value = lastDay.toISOString().split('T')[0]

const activeJobsCount = computed(() => {
  const jobs = filteredJobs.value.length > 0 ? filteredJobs.value : jobsStore.jobs
  return jobs.filter(j => j.status !== 'Completed').length
})

const completedJobsCount = computed(() => {
  const jobs = filteredJobs.value.length > 0 ? filteredJobs.value : jobsStore.jobs
  return jobs.filter(j => j.status === 'Completed').length
})

const holdOverJobsCount = computed(() => {
  const jobs = filteredJobs.value.length > 0 ? filteredJobs.value : jobsStore.jobs
  return jobs.filter(j => j.status === 'Hold-Over').length
})

const supervisorsCount = computed(() => {
  return usersStore.users.filter(u => u.role === 'Supervisor').length
})

const installersCount = computed(() => {
  return usersStore.users.filter(u => u.role === 'Installer').length
})

function filterJobs() {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    filteredJobs.value = jobsStore.getJobsByDateRange(start, end)
  }
}

function resetFilter() {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  startDate.value = firstDay.toISOString().split('T')[0]
  endDate.value = lastDay.toISOString().split('T')[0]
  filteredJobs.value = []
}

onMounted(async () => {
  await Promise.all([
    jobsStore.fetchJobs(),
    usersStore.fetchUsers(),
    companiesStore.fetchCompanies()
  ])
  filterJobs()
})
</script>
