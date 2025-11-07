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
            <div v-if="currentJob.customerOtp">
              <p class="text-sm text-gray-500">Customer Verification</p>
              <p class="font-medium">
                <span v-if="currentJob.otpVerified" class="text-green-600">✓ Verified</span>
                <span v-else class="text-orange-600">⚠ Requires OTP</span>
              </p>
            </div>
          </div>
        </div>

        <!-- OTP Verification (for scheduled jobs) -->
        <div v-if="currentJob?.customerOtp && !currentJob.otpVerified && (currentJob.status === 'Scheduled' || currentJob.status === 'Installation in Progress')" class="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <h3 class="text-sm font-medium text-blue-800">Customer Verification Required</h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>Ask the customer for their One-Time Password (OTP) to verify their identity before starting the installation.</p>
              </div>
              <form @submit.prevent="handleVerifyOtp" class="mt-4">
                <div class="flex gap-2">
                  <input
                    v-model="otpInput"
                    type="text"
                    inputmode="numeric"
                    maxlength="6"
                    placeholder="Enter OTP"
                    class="flex-1 max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    :disabled="verifyingOtp"
                  />
                  <button
                    type="submit"
                    :disabled="!otpInput || verifyingOtp"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ verifyingOtp ? 'Verifying...' : 'Verify' }}
                  </button>
                </div>
                <p v-if="otpError" class="mt-2 text-sm text-red-600">{{ otpError }}</p>
                <p v-if="otpSuccess" class="mt-2 text-sm text-green-600">{{ otpSuccess }}</p>
              </form>
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
            <RouterLink
              v-if="currentJob?.status === 'Scheduled' || currentJob?.status === 'Installation in Progress'"
              :to="canStartInstallation ? `/installer/jobs/${currentJob.id}/install` : '#'"
              @click="checkOtpBeforeInstall"
              :class="[
                'px-4 py-2 rounded-md',
                canStartInstallation
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              {{ currentJob.status === 'Installation in Progress' ? 'Continue Installation' : 'Start Installation' }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import AppMenu from '@/components/AppMenu.vue'
import { useJobsStore } from '@/stores/jobs'
import { useCustomersStore } from '@/stores/customers'
import type { JobStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const customersStore = useCustomersStore()

const otpInput = ref('')
const verifyingOtp = ref(false)
const otpError = ref('')
const otpSuccess = ref('')

const currentJob = computed(() => jobsStore.currentJob)
const customer = computed(() => currentJob.value ? customersStore.getCustomerById_sync(currentJob.value.customerId) : null)

const canStartInstallation = computed(() => {
  if (!currentJob.value) return false
  if (!currentJob.value.customerOtp) return true
  return currentJob.value.otpVerified === true
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

async function handleVerifyOtp() {
  if (!currentJob.value || !otpInput.value) return

  otpError.value = ''
  otpSuccess.value = ''
  verifyingOtp.value = true

  const result = await jobsStore.verifyOtp(currentJob.value.id, otpInput.value.trim())

  if (result) {
    otpSuccess.value = 'OTP verified successfully! You can now start the installation.'
    otpInput.value = ''
    setTimeout(() => {
      otpSuccess.value = ''
    }, 3000)
  } else {
    otpError.value = jobsStore.error || 'Invalid OTP. Please try again.'
  }

  verifyingOtp.value = false
}

function checkOtpBeforeInstall(event: Event) {
  if (!canStartInstallation.value) {
    event.preventDefault()
    otpError.value = 'Please verify the customer OTP before starting installation.'
  }
}

onMounted(async () => {
  const jobId = parseInt(route.params.id as string)
  await jobsStore.fetchJobById(jobId)
  await customersStore.fetchCustomers()
})
</script>
