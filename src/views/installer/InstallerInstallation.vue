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

        <!-- Progress Indicator -->
        <div class="mb-8 bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between mb-4">
            <div :class="['flex-1 text-center', step1Status === 'complete' ? 'text-green-600' : currentStep === 1 ? 'text-blue-600' : 'text-gray-400']">
              <div class="text-lg font-medium">Step 1</div>
              <div class="text-sm">Install Equipment</div>
              <div class="mt-2">{{ step1Status === 'complete' ? '✓' : currentStep === 1 ? '○' : '○' }}</div>
            </div>
            <div class="flex-1 border-t-2 border-gray-300"></div>
            <div :class="['flex-1 text-center', step2Status === 'complete' ? 'text-green-600' : currentStep === 2 ? 'text-blue-600' : 'text-gray-400']">
              <div class="text-lg font-medium">Step 2</div>
              <div class="text-sm">Scan Serial</div>
              <div class="mt-2">{{ step2Status === 'complete' ? '✓' : currentStep === 2 ? '○' : '○' }}</div>
            </div>
            <div class="flex-1 border-t-2 border-gray-300"></div>
            <div :class="['flex-1 text-center', step3Status === 'complete' ? 'text-green-600' : currentStep === 3 ? 'text-blue-600' : 'text-gray-400']">
              <div class="text-lg font-medium">Step 3</div>
              <div class="text-sm">Activate</div>
              <div class="mt-2">{{ step3Status === 'complete' ? '✓' : currentStep === 3 ? '○' : '○' }}</div>
            </div>
          </div>
        </div>

        <!-- Step 1: Install Equipment -->
        <div v-if="currentStep === 1" class="bg-white p-6 rounded-lg shadow mb-6">
          <h2 class="text-xl font-medium mb-4">Step 1: Install Equipment</h2>
          <p class="text-sm text-gray-600 mb-4">Take photos of installed equipment (max 10, typically 2 per device)</p>

          <div class="mb-4">
            <p class="text-sm font-medium">Photos Taken: {{ installation?.step1Photos.length || 0 }}/10</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <span v-for="(photo, idx) in installation?.step1Photos" :key="idx" class="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
                {{ photo }}
              </span>
            </div>
          </div>

          <div class="flex gap-4">
            <button @click="takePhoto(1)" :disabled="(installation?.step1Photos.length || 0) >= 10" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              Take Photo
            </button>
            <button @click="completeStep(1)" :disabled="!installation?.step1Photos.length" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
              Complete Step 1
            </button>
          </div>
        </div>

        <!-- Step 2: Scan Serial Number -->
        <div v-if="currentStep === 2" class="bg-white p-6 rounded-lg shadow mb-6">
          <h2 class="text-xl font-medium mb-4">Step 2: Scan Serial Number</h2>
          <p class="text-sm text-gray-600 mb-4">Take photos of serial number labels (max 10, typically 2 devices)</p>

          <div class="mb-4">
            <p class="text-sm font-medium">Photos Taken: {{ installation?.step2Photos.length || 0 }}/10</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <span v-for="(photo, idx) in installation?.step2Photos" :key="idx" class="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
                {{ photo }}
              </span>
            </div>
          </div>

          <div class="flex gap-4">
            <button @click="takePhoto(2)" :disabled="(installation?.step2Photos.length || 0) >= 10" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              Take Photo
            </button>
            <button @click="completeStep(2)" :disabled="!installation?.step2Photos.length" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
              Complete Step 2
            </button>
          </div>
        </div>

        <!-- Step 3: Activate -->
        <div v-if="currentStep === 3" class="bg-white p-6 rounded-lg shadow mb-6">
          <h2 class="text-xl font-medium mb-4">Step 3: Activate</h2>
          <p class="text-sm text-gray-600 mb-4">Put equipment in activation queue. This step may fail (10% chance in demo)</p>

          <div class="flex gap-4">
            <button @click="completeStep(3)" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Activate Equipment
            </button>
          </div>
        </div>

        <!-- Hold-Over Button -->
        <div v-if="currentJob && currentJob.status !== 'Pending Activation'" class="bg-white p-6 rounded-lg shadow mb-6">
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

const currentJob = computed(() => jobsStore.currentJob)
const installation = computed(() => installationsStore.currentInstallation)

const step1Status = computed(() => installation.value?.step1Complete ? 'complete' : 'incomplete')
const step2Status = computed(() => installation.value?.step2Complete ? 'complete' : 'incomplete')
const step3Status = computed(() => installation.value?.step3Complete ? 'complete' : 'incomplete')

const currentStep = computed(() => {
  if (!installation.value?.step1Complete) return 1
  if (!installation.value?.step2Complete) return 2
  if (!installation.value?.step3Complete) return 3
  return 3
})

async function takePhoto(step: 1 | 2) {
  if (!installation.value) return

  const photoName = `photo_job${currentJob.value?.id}_step${step}_${Date.now()}.jpg`
  await installationsStore.addPhoto(installation.value.id, step, photoName)
  toast.success('Photo taken successfully!')
}

async function completeStep(step: 1 | 2 | 3) {
  if (!installation.value) return

  const photos = step === 1 ? installation.value.step1Photos : step === 2 ? installation.value.step2Photos : []
  const result = await installationsStore.completeStep(installation.value.id, step, photos)

  if (result) {
    toast.success(`Step ${step} completed successfully!`)

    if (step === 3) {
      // Fetch updated job status
      if (currentJob.value) {
        await jobsStore.fetchJobById(currentJob.value.id)

        if (currentJob.value.status === 'Pending Activation') {
          toast.success('Installation complete! Job is pending activation.')
          router.push('/installer/activations')
        } else if (currentJob.value.status === 'Hold-Over') {
          toast.error('Activation failed - job moved to Hold-Over')
          router.push('/installer/jobs')
        }
      }
    }
  } else {
    toast.error(installationsStore.error || `Failed to complete step ${step}`)
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

  // Check if installation exists, if not create one
  await installationsStore.fetchInstallationByJobId(jobId)

  if (!installationsStore.currentInstallation && authStore.user?.id) {
    await installationsStore.startInstallation(jobId, authStore.user.id)
  }
})
</script>
