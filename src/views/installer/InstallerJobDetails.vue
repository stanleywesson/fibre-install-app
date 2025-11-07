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
              <p><span :class="getStatusClass(currentJob.status)" class="px-2 py-1 text-xs font-semibold rounded-full">{{ currentJob.status }}</span></p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Customer</p>
              <p class="font-medium">{{ customer?.name || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Customer Phone</p>
              <p class="font-medium">{{ customer?.phone || '-' }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-sm text-gray-500">Customer Address</p>
              <p class="font-medium">{{ customer?.address || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Scheduled Date</p>
              <p class="font-medium">{{ currentJob.scheduledDate ? new Date(currentJob.scheduledDate).toLocaleString() : 'Not scheduled' }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium mb-4">Actions</h2>
          <div class="flex gap-4">
            <RouterLink v-if="currentJob?.status === 'Assigned' || (currentJob?.status === 'Scheduled' && !currentJob.scheduledDate)" :to="`/installer/jobs/${currentJob.id}/schedule`" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Schedule Appointment
            </RouterLink>
            <RouterLink v-if="currentJob?.status === 'Scheduled' || currentJob?.status === 'Installation in Progress'" :to="`/installer/jobs/${currentJob.id}/install`" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              {{ currentJob.status === 'Installation in Progress' ? 'Continue Installation' : 'Start Installation' }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import AppMenu from '@/components/AppMenu.vue'
import { useJobsStore } from '@/stores/jobs'
import { useCustomersStore } from '@/stores/customers'
import type { JobStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const customersStore = useCustomersStore()

const currentJob = computed(() => jobsStore.currentJob)
const customer = computed(() => currentJob.value ? customersStore.getCustomerById_sync(currentJob.value.customerId) : null)

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
  const jobId = parseInt(route.params.id as string)
  await jobsStore.fetchJobById(jobId)
  await customersStore.fetchCustomers()
})
</script>
