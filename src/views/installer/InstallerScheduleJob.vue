<template>
  <div>
    <AppMenu />
    <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center mb-6">
          <button @click="router.back()" class="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Schedule Appointment</h1>
        </div>

        <div v-if="currentJob" class="bg-white shadow sm:rounded-lg p-6 mb-6">
          <div class="mb-4">
            <p class="text-sm text-gray-500">Customer</p>
            <p class="font-medium">{{ customer?.name || '-' }}</p>
          </div>
          <div class="mb-4">
            <p class="text-sm text-gray-500">Customer Phone</p>
            <p class="font-medium">{{ customer?.phone || '-' }}</p>
          </div>
          <div class="mb-4">
            <p class="text-sm text-gray-500">Address</p>
            <p class="font-medium">{{ customer?.address || '-' }}</p>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Appointment Date & Time</label>
            <input v-model="scheduledDateTime" type="datetime-local" class="block w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>

          <div class="mt-6 flex gap-4">
            <button @click="scheduleAppointment" :disabled="!scheduledDateTime" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              Schedule Appointment
            </button>
            <button @click="router.back()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Cancel
            </button>
          </div>
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
import { useCustomersStore } from '@/stores/customers'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const customersStore = useCustomersStore()
const toast = useToast()

const scheduledDateTime = ref('')

const currentJob = computed(() => jobsStore.currentJob)
const customer = computed(() => currentJob.value ? customersStore.getCustomerById_sync(currentJob.value.customerId) : null)

async function scheduleAppointment() {
  if (!currentJob.value || !scheduledDateTime.value) return

  const result = await jobsStore.scheduleJobAppointment(currentJob.value.id, new Date(scheduledDateTime.value))

  if (result) {
    toast.success('Appointment scheduled successfully!')
    router.push(`/installer/jobs/${currentJob.value.id}`)
  } else {
    toast.error('Failed to schedule appointment')
  }
}

onMounted(async () => {
  const jobId = parseInt(route.params.id as string)
  await jobsStore.fetchJobById(jobId)
  await customersStore.fetchCustomers()

  // Set default to tomorrow at 9 AM
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)
  scheduledDateTime.value = tomorrow.toISOString().slice(0, 16)
})
</script>
