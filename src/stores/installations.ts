import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Installation } from '@/types'
import {
  getInstallations,
  getInstallationById,
  getInstallationByJobId,
  createInstallation,
  updateInstallation,
  addDeviceInstallationPhoto,
  addDeviceSerialPhoto,
  completeDeviceInstallation,
  completeDeviceSerial,
  activateInstallation,
  addInventoryItem
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
      const newInstallation: Omit<Installation, 'id' | 'devices' | 'activationComplete'> = {
        jobId,
        installerId,
        startedAt: new Date()
      }

      const response = await createInstallation(newInstallation)

      if (response.success && response.data) {
        installations.value = [...installations.value, response.data]
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

  async function addInstallPhoto(installationId: number, deviceNumber: number, photoUrl: string) {
    loading.value = true
    error.value = null

    try {
      const response = await addDeviceInstallationPhoto(installationId, deviceNumber, photoUrl)

      if (response.success && response.data) {
        const index = installations.value.findIndex(i => i.id === installationId)
        if (index !== -1) {
          installations.value = installations.value.map(i => i.id === installationId ? response.data! : i)
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
      console.error('Add installation photo error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function addSerialPhoto(installationId: number, deviceNumber: number, photoUrl: string) {
    loading.value = true
    error.value = null

    try {
      const response = await addDeviceSerialPhoto(installationId, deviceNumber, photoUrl)

      if (response.success && response.data) {
        const index = installations.value.findIndex(i => i.id === installationId)
        if (index !== -1) {
          installations.value = installations.value.map(i => i.id === installationId ? response.data! : i)
        }
        if (currentInstallation.value?.id === installationId) {
          currentInstallation.value = response.data
        }
        return response.data
      } else {
        error.value = response.message || 'Failed to add serial photo'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while adding serial photo'
      console.error('Add serial photo error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function completeInstall(installationId: number, deviceNumber: number) {
    loading.value = true
    error.value = null

    try {
      const response = await completeDeviceInstallation(installationId, deviceNumber)

      if (response.success && response.data) {
        const index = installations.value.findIndex(i => i.id === installationId)
        if (index !== -1) {
          installations.value = installations.value.map(i => i.id === installationId ? response.data! : i)
        }
        if (currentInstallation.value?.id === installationId) {
          currentInstallation.value = response.data
        }
        return response.data
      } else {
        error.value = response.message || 'Failed to complete installation'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while completing installation'
      console.error('Complete installation error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function completeSerial(installationId: number, deviceNumber: number) {
    loading.value = true
    error.value = null

    try {
      const response = await completeDeviceSerial(installationId, deviceNumber)

      if (response.success && response.data) {
        const index = installations.value.findIndex(i => i.id === installationId)
        if (index !== -1) {
          installations.value = installations.value.map(i => i.id === installationId ? response.data! : i)
        }
        if (currentInstallation.value?.id === installationId) {
          currentInstallation.value = response.data
        }
        return response.data
      } else {
        error.value = response.message || 'Failed to complete serial'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while completing serial'
      console.error('Complete serial error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function activate(installationId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await activateInstallation(installationId)

      if (response.success && response.data) {
        const index = installations.value.findIndex(i => i.id === installationId)
        if (index !== -1) {
          installations.value = installations.value.map(i => i.id === installationId ? response.data! : i)
        }
        if (currentInstallation.value?.id === installationId) {
          currentInstallation.value = response.data
        }
        return response.data
      } else {
        error.value = response.message || 'Failed to activate installation'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while activating installation'
      console.error('Activate installation error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function addInventory(
    installationId: number,
    deviceNumber: number,
    serialNumber: string,
    deviceType: string,
    model: string | undefined,
    installerId: number,
    jobId: number,
    notes?: string
  ) {
    loading.value = true
    error.value = null

    try {
      const response = await addInventoryItem(
        installationId,
        deviceNumber,
        serialNumber,
        deviceType,
        model,
        installerId,
        jobId,
        notes
      )

      if (response.success && response.data) {
        const index = installations.value.findIndex(i => i.id === installationId)
        if (index !== -1) {
          installations.value = installations.value.map(i => i.id === installationId ? response.data! : i)
        }
        if (currentInstallation.value?.id === installationId) {
          currentInstallation.value = response.data
        }
        return response.data
      } else {
        error.value = response.message || 'Failed to add inventory item'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while adding inventory item'
      console.error('Add inventory error:', err)
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
    addInstallPhoto,
    addSerialPhoto,
    completeInstall,
    completeSerial,
    activate,
    addInventory,
    clearError
  }
})
