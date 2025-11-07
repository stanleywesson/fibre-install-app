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
          <h1 class="text-3xl font-bold text-gray-900">Installation Process</h1>
        </div>

        <!-- Progress Summary -->
        <div v-if="installation" class="mb-6 bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-medium mb-4">Progress Overview</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-blue-600">{{ installation.devices.length }}</div>
              <div class="text-sm text-gray-600">Total Devices</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600">{{ devicesFullyComplete }}</div>
              <div class="text-sm text-gray-600">Devices Complete</div>
            </div>
            <div>
              <div class="text-2xl font-bold" :class="allDevicesComplete ? 'text-green-600' : 'text-orange-600'">
                {{ allDevicesComplete ? 'Ready' : 'In Progress' }}
              </div>
              <div class="text-sm text-gray-600">Status</div>
            </div>
          </div>
        </div>

        <!-- Device List -->
        <div v-if="installation" class="space-y-4">
          <div v-for="device in installation.devices" :key="device.deviceNumber" class="bg-white rounded-lg shadow">
            <!-- Device Header -->
            <div
              class="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              @click="toggleDevice(device.deviceNumber)"
            >
              <div class="flex items-center space-x-4">
                <div class="text-lg font-medium">Device {{ device.deviceNumber }}</div>
                <div v-if="device.installationComplete && device.serialComplete" class="text-green-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div v-else class="flex space-x-2 text-sm">
                  <span v-if="device.installationComplete" class="px-2 py-1 bg-green-100 text-green-800 rounded">Install ✓</span>
                  <span v-else class="px-2 py-1 bg-gray-100 text-gray-800 rounded">Install</span>
                  <span v-if="device.serialComplete" class="px-2 py-1 bg-green-100 text-green-800 rounded">Serial ✓</span>
                  <span v-else class="px-2 py-1 bg-gray-100 text-gray-800 rounded">Serial</span>
                </div>
              </div>
              <svg
                class="w-5 h-5 text-gray-400 transition-transform"
                :class="{ 'transform rotate-180': expandedDevices.has(device.deviceNumber) }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Device Details (Expandable) -->
            <div v-if="expandedDevices.has(device.deviceNumber)" class="border-t border-gray-200 px-6 py-4 space-y-6">
              <!-- Installation Step -->
              <div>
                <h3 class="text-md font-medium mb-2 flex items-center">
                  <span>1. Install Equipment</span>
                  <span v-if="device.installationComplete" class="ml-2 text-green-600">✓</span>
                </h3>
                <p class="text-sm text-gray-600 mb-3">Take photos of installed equipment</p>

                <div class="mb-3">
                  <p class="text-sm font-medium">Photos: {{ device.installationPhotos.length }}/10</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span v-for="(photo, idx) in device.installationPhotos" :key="idx" class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {{ photo }}
                    </span>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button
                    @click="takeInstallPhoto(device.deviceNumber)"
                    :disabled="device.installationComplete || device.installationPhotos.length >= 10"
                    class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    Take Photo
                  </button>
                  <button
                    @click="completeInstallation(device.deviceNumber)"
                    :disabled="device.installationComplete || !device.installationPhotos.length"
                    class="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    Complete Installation
                  </button>
                </div>
              </div>

              <!-- Serial Step -->
              <div>
                <h3 class="text-md font-medium mb-2 flex items-center">
                  <span>2. Scan Serial Number</span>
                  <span v-if="device.serialComplete" class="ml-2 text-green-600">✓</span>
                </h3>
                <p class="text-sm text-gray-600 mb-3">Take photos of serial number labels</p>

                <div class="mb-3">
                  <p class="text-sm font-medium">Photos: {{ device.serialPhotos.length }}/10</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span v-for="(photo, idx) in device.serialPhotos" :key="idx" class="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                      {{ photo }}
                    </span>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button
                    @click="takeSerialPhoto(device.deviceNumber)"
                    :disabled="!device.installationComplete || device.serialComplete || device.serialPhotos.length >= 10"
                    class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    Take Photo
                  </button>
                  <button
                    @click="completeSerial(device.deviceNumber)"
                    :disabled="!device.installationComplete || device.serialComplete || !device.serialPhotos.length"
                    class="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    Complete Serial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activation Step -->
        <div v-if="installation && allDevicesComplete && !installation.activationComplete" class="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-medium mb-4">3. Activate Equipment</h2>
          <p class="text-sm text-gray-600 mb-4">All devices ready! Put equipment in activation queue. This step may fail (10% chance in demo)</p>
          <button
            @click="activateEquipment"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Activate Equipment
          </button>
        </div>

        <!-- Hold-Over Button -->
        <div v-if="currentJob && currentJob.status !== 'Pending Activation'" class="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-medium mb-4">Flag as Hold-Over</h2>
          <p class="text-sm text-gray-600 mb-4">If you encounter issues, you can flag this job as Hold-Over</p>
          <div class="space-y-4">
            <textarea v-model="holdOverNotes" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter reason for hold-over..."></textarea>
            <button @click="flagHoldOver" :disabled="!holdOverNotes.trim()" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
              Flag as Hold-Over
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
import { useInstallationsStore } from '@/stores/installations'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const installationsStore = useInstallationsStore()
const authStore = useAuthStore()
const toast = useToast()

const holdOverNotes = ref('')
const expandedDevices = ref(new Set<number>())

const currentJob = computed(() => jobsStore.currentJob)
const installation = computed(() => installationsStore.currentInstallation)

const allDevicesComplete = computed(() => {
  if (!installation.value) return false
  return installation.value.devices.every(d => d.installationComplete && d.serialComplete)
})

const devicesFullyComplete = computed(() => {
  if (!installation.value) return 0
  return installation.value.devices.filter(d => d.installationComplete && d.serialComplete).length
})

function toggleDevice(deviceNumber: number) {
  if (expandedDevices.value.has(deviceNumber)) {
    expandedDevices.value.delete(deviceNumber)
  } else {
    expandedDevices.value.add(deviceNumber)
  }
}

async function takeInstallPhoto(deviceNumber: number) {
  if (!installation.value) return

  const photoName = `photo_job${currentJob.value?.id}_dev${deviceNumber}_install_${Date.now()}.jpg`
  const result = await installationsStore.addInstallPhoto(installation.value.id, deviceNumber, photoName)
  if (result) {
    toast.success('Photo taken successfully!')
  }
}

async function takeSerialPhoto(deviceNumber: number) {
  if (!installation.value) return

  const photoName = `photo_job${currentJob.value?.id}_dev${deviceNumber}_serial_${Date.now()}.jpg`
  const result = await installationsStore.addSerialPhoto(installation.value.id, deviceNumber, photoName)
  if (result) {
    toast.success('Photo taken successfully!')
  }
}

async function completeInstallation(deviceNumber: number) {
  if (!installation.value) return

  const result = await installationsStore.completeInstall(installation.value.id, deviceNumber)
  if (result) {
    toast.success(`Device ${deviceNumber} installation completed!`)
  } else {
    toast.error(installationsStore.error || 'Failed to complete installation')
  }
}

async function completeSerial(deviceNumber: number) {
  if (!installation.value) return

  const result = await installationsStore.completeSerial(installation.value.id, deviceNumber)
  if (result) {
    toast.success(`Device ${deviceNumber} serial completed!`)
  } else {
    toast.error(installationsStore.error || 'Failed to complete serial')
  }
}

async function activateEquipment() {
  if (!installation.value) return

  const result = await installationsStore.activate(installation.value.id)
  if (result) {
    if (currentJob.value) {
      await jobsStore.fetchJobById(currentJob.value.id)

      if (currentJob.value.status === 'Pending Activation') {
        toast.success('Activation successful! Job is pending activation.')
        router.push('/installer/activations')
      } else if (currentJob.value.status === 'Hold-Over') {
        toast.error('Activation failed - job moved to Hold-Over')
        router.push('/installer/jobs')
      }
    }
  } else {
    toast.error(installationsStore.error || 'Failed to activate equipment')
  }
}

async function flagHoldOver() {
  if (!currentJob.value || !holdOverNotes.value.trim()) return

  const result = await jobsStore.setJobToHoldOver(currentJob.value.id, holdOverNotes.value)

  if (result) {
    toast.success('Job flagged as Hold-Over')
    router.push('/installer/jobs')
  } else {
    toast.error('Failed to flag job as Hold-Over')
  }
}

onMounted(async () => {
  const jobId = parseInt(route.params.id as string)
  await jobsStore.fetchJobById(jobId)

  await installationsStore.fetchInstallationByJobId(jobId)

  if (!installationsStore.currentInstallation && authStore.user?.id) {
    await installationsStore.startInstallation(jobId, authStore.user.id)
  }

  // Expand first incomplete device
  if (installation.value) {
    const firstIncomplete = installation.value.devices.find(d => !d.installationComplete || !d.serialComplete)
    if (firstIncomplete) {
      expandedDevices.value.add(firstIncomplete.deviceNumber)
    } else {
      // All complete, expand first device
      expandedDevices.value.add(1)
    }
  }
})
</script>
