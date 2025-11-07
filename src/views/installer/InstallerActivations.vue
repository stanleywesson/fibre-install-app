<template>
  <div>
    <AppMenu />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Pending Activations</h1>
        <p class="text-gray-600 mb-6">Jobs awaiting activation by external system</p>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="job in pendingActivationJobs" :key="job.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ job.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ customersStore.getCustomerById_sync(job.customerId)?.name || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ job.completedDate ? new Date(job.completedDate).toLocaleDateString() : '-' }}
                </td>
              </tr>
              <tr v-if="!pendingActivationJobs.length">
                <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
                  No jobs pending activation
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
import { useJobsStore } from '@/stores/jobs'
import { useCustomersStore } from '@/stores/customers'
import { useAuthStore } from '@/stores/auth'

const jobsStore = useJobsStore()
const customersStore = useCustomersStore()
const authStore = useAuthStore()

const pendingActivationJobs = computed(() => {
  return jobsStore.jobs.filter(j => j.status === 'Pending Activation')
})

onMounted(async () => {
  if (authStore.user?.id) {
    await jobsStore.fetchJobsByInstaller(authStore.user.id)
  }
  await customersStore.fetchCustomers()
})
</script>
