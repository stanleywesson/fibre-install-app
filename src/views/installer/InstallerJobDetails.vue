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
            <div v-if="currentJob.enrouteAt">
              <p class="text-sm text-gray-500">Enroute Status</p>
              <p class="font-medium text-green-600">
                ✓ On the way ({{ new Date(currentJob.enrouteAt).toLocaleTimeString() }})
              </p>
            </div>
          </div>

          <!-- Quick Actions: Call & Navigate -->
          <div v-if="customer" class="mt-6 pt-6 border-t border-gray-200">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
            <div class="flex flex-col sm:flex-row gap-3">
              <a
                :href="`tel:${customer.phone}`"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="font-medium">Call Customer</span>
              </a>
              <a
                :href="getDirectionsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span class="font-medium">Get Directions</span>
              </a>
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

        <!-- Timeline -->
        <JobTimeline v-if="currentJob" :job="currentJob" :installation="installation" />

        <!-- Actions -->
        <div class="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium mb-4">Actions</h2>
          <div class="flex flex-col sm:flex-row gap-4">
            <RouterLink v-if="currentJob?.status === 'Assigned' || (currentJob?.status === 'Scheduled' && !currentJob.scheduledDate)" :to="`/installer/jobs/${currentJob.id}/schedule`" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center">
              Schedule Appointment
            </RouterLink>

            <button
              v-if="currentJob?.status === 'Scheduled' && !currentJob.enrouteAt"
              @click="handleMarkEnroute"
              :disabled="markingEnroute"
              class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="!markingEnroute" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{{ markingEnroute ? 'Updating...' : "I'm on my way" }}</span>
            </button>

            <RouterLink
              v-if="currentJob?.status === 'Scheduled' || currentJob?.status === 'Installation in Progress'"
              :to="canStartInstallation ? `/installer/jobs/${currentJob.id}/install` : '#'"
              @click="checkOtpBeforeInstall"
              :class="[
                'px-4 py-2 rounded-md text-center',
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
import JobTimeline from '@/components/JobTimeline.vue'
import { useJobsStore } from '@/stores/jobs'
import { useCustomersStore } from '@/stores/customers'
import { useInstallationsStore } from '@/stores/installations'
import type { JobStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const customersStore = useCustomersStore()
const installationsStore = useInstallationsStore()

const otpInput = ref('')
const verifyingOtp = ref(false)
const otpError = ref('')
const otpSuccess = ref('')
const markingEnroute = ref(false)

const currentJob = computed(() => jobsStore.currentJob)
const customer = computed(() => currentJob.value ? customersStore.getCustomerById_sync(currentJob.value.customerId) : null)
const installation = computed(() => installationsStore.currentInstallation)

const canStartInstallation = computed(() => {
  if (!currentJob.value) return false
  if (!currentJob.value.customerOtp) return true
  return currentJob.value.otpVerified === true
})

const getDirectionsUrl = computed(() => {
  if (!customer.value?.address) return '#'
  const encodedAddress = encodeURIComponent(customer.value.address)
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
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

async function handleMarkEnroute() {
  if (!currentJob.value) return

  markingEnroute.value = true

  const result = await jobsStore.markEnroute(currentJob.value.id)

  if (result) {
    // Success - the UI will automatically update via the reactive currentJob
  }

  markingEnroute.value = false
}

onMounted(async () => {
  const jobId = parseInt(route.params.id as string)
  await jobsStore.fetchJobById(jobId)
  await customersStore.fetchCustomers()
  await installationsStore.fetchInstallationByJobId(jobId)
})
</script>
