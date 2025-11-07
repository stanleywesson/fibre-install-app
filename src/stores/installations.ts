import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Installation } from '@/types'
import {
  getInstallations,
  getInstallationById,
  getInstallationByJobId,
  createInstallation,
  updateInstallation,
  completeInstallationStep,
  addInstallationPhoto
} from '@/api/mockApi'

export const useInstallationsStore = defineStore('installations', () => {
  // State
  const installations = ref<Installation[]>([])
  const currentInstallation = ref<Installation | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchInstallations() {
    loading.value = true
    error.value = null

    try {
      const response = await getInstallations()

      if (response.success && response.data) {
        installations.value = response.data
        return true
      } else {
        error.value = response.message || 'Failed to fetch installations'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while fetching installations'
      console.error('Fetch installations error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchInstallationById(id: number) {
    loading.value = true
    error.value = null

    try {
      const response = await getInstallationById(id)

      if (response.success && response.data) {
        currentInstallation.value = response.data
        return true
      } else {
        error.value = response.message || 'Failed to fetch installation'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while fetching installation'
      console.error('Fetch installation error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchInstallationByJobId(jobId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await getInstallationByJobId(jobId)

      if (response.success) {
        currentInstallation.value = response.data || null
        return true
      } else {
        error.value = response.message || 'Failed to fetch installation'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while fetching installation'
      console.error('Fetch installation error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function startInstallation(jobId: number, installerId: number) {
    loading.value = true
    error.value = null

    try {
      const newInstallation: Omit<Installation, 'id'> = {
        jobId,
        installerId,
        startedAt: new Date(),
        step1Complete: false,
        step1Photos: [],
        step2Complete: false,
        step2Photos: [],
        step3Complete: false
      }

      const response = await createInstallation(newInstallation)

      if (response.success && response.data) {
        installations.value.push(response.data)
        currentInstallation.value = response.data
        return response.data
      } else {
        error.value = response.message || 'Failed to start installation'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while starting installation'
      console.error('Start installation error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function modifyInstallation(id: number, installationData: Partial<Installation>) {
    loading.value = true
    error.value = null

    try {
      const response = await updateInstallation(id, installationData)

      if (response.success && response.data) {
        const index = installations.value.findIndex(i => i.id === id)
        if (index !== -1) {
          installations.value[index] = response.data
        }
        if (currentInstallation.value?.id === id) {
          currentInstallation.value = response.data
        }
        return response.data
      } else {
        error.value = response.message || 'Failed to update installation'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while updating installation'
      console.error('Update installation error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function completeStep(installationId: number, step: 1 | 2 | 3, photos?: string[]) {
    loading.value = true
    error.value = null

    try {
      const response = await completeInstallationStep(installationId, step, photos)

      if (response.success && response.data) {
        const index = installations.value.findIndex(i => i.id === installationId)
        if (index !== -1) {
          installations.value[index] = response.data
        }
        if (currentInstallation.value?.id === installationId) {
          currentInstallation.value = response.data
        }
        return response.data
      } else {
        error.value = response.message || 'Failed to complete step'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while completing step'
      console.error('Complete step error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function addPhoto(installationId: number, step: 1 | 2, photoUrl: string) {
    loading.value = true
    error.value = null

    try {
      const response = await addInstallationPhoto(installationId, step, photoUrl)

      if (response.success && response.data) {
        const index = installations.value.findIndex(i => i.id === installationId)
        if (index !== -1) {
          installations.value[index] = response.data
        }
        if (currentInstallation.value?.id === installationId) {
          currentInstallation.value = response.data
        }
        return response.data
      } else {
        error.value = response.message || 'Failed to add photo'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while adding photo'
      console.error('Add photo error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    installations,
    currentInstallation,
    loading,
    error,
    // Actions
    fetchInstallations,
    fetchInstallationById,
    fetchInstallationByJobId,
    startInstallation,
    modifyInstallation,
    completeStep,
    addPhoto,
    clearError
  }
})
