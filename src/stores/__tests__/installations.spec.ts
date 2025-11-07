import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useInstallationsStore } from '../installations'
import * as mockApi from '@/api/mockApi'
import type { Installation } from '@/types'

vi.mock('@/api/mockApi')

describe('Installations Store', () => {
  const mockInstallation: Installation = {
    id: 1,
    jobId: 4,
    installerId: 5,
    startedAt: new Date('2025-01-15T09:00:00'),
    devices: [
      {
        deviceNumber: 1,
        installationComplete: true,
        installationPhotos: ['photo1.jpg', 'photo2.jpg'],
        installationCompletedAt: new Date('2025-01-15T10:00:00'),
        serialComplete: true,
        serialPhotos: ['serial1.jpg'],
        serialCompletedAt: new Date('2025-01-15T10:30:00')
      },
      {
        deviceNumber: 2,
        installationComplete: false,
        installationPhotos: [],
        serialComplete: false,
        serialPhotos: []
      }
    ],
    activationComplete: false
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useInstallationsStore()

      expect(store.installations).toEqual([])
      expect(store.currentInstallation).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('fetchInstallations', () => {
    it('should fetch installations successfully', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.getInstallations).mockResolvedValue({
        success: true,
        data: [mockInstallation]
      })

      const result = await store.fetchInstallations()

      expect(result).toBe(true)
      expect(store.installations).toEqual([mockInstallation])
    })
  })

  describe('fetchInstallationById', () => {
    it('should fetch installation by id', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.getInstallationById).mockResolvedValue({
        success: true,
        data: mockInstallation
      })

      const result = await store.fetchInstallationById(1)

      expect(result).toBe(true)
      expect(store.currentInstallation).toEqual(mockInstallation)
    })
  })

  describe('fetchInstallationByJobId', () => {
    it('should fetch installation by job id', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.getInstallationByJobId).mockResolvedValue({
        success: true,
        data: mockInstallation
      })

      const result = await store.fetchInstallationByJobId(4)

      expect(result).toBe(true)
      expect(store.currentInstallation).toEqual(mockInstallation)
    })

    it('should handle null result when no installation exists', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.getInstallationByJobId).mockResolvedValue({
        success: true,
        data: null
      })

      const result = await store.fetchInstallationByJobId(999)

      expect(result).toBe(true)
      expect(store.currentInstallation).toBeNull()
    })
  })

  describe('startInstallation', () => {
    it('should start installation successfully', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.createInstallation).mockResolvedValue({
        success: true,
        data: mockInstallation
      })

      const result = await store.startInstallation(4, 5)

      expect(result).toEqual(mockInstallation)
      expect(store.currentInstallation).toEqual(mockInstallation)
      expect(store.installations).toContainEqual(mockInstallation)
    })

    it('should handle start installation error', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.createInstallation).mockResolvedValue({
        success: false,
        message: 'Failed to start installation'
      })

      const result = await store.startInstallation(4, 5)

      expect(result).toBeNull()
      expect(store.error).toBe('Failed to start installation')
    })
  })

  describe('addInstallPhoto', () => {
    it('should add installation photo successfully', async () => {
      const store = useInstallationsStore()
      const updatedInstallation = {
        ...mockInstallation,
        devices: [
          {
            ...mockInstallation.devices[0],
            installationPhotos: [...mockInstallation.devices[0].installationPhotos, 'photo3.jpg']
          },
          mockInstallation.devices[1]
        ]
      }

      vi.mocked(mockApi.addDeviceInstallationPhoto).mockResolvedValue({
        success: true,
        data: updatedInstallation
      })

      const result = await store.addInstallPhoto(1, 1, 'photo3.jpg')

      expect(result).toBeDefined()
      expect(mockApi.addDeviceInstallationPhoto).toHaveBeenCalledWith(1, 1, 'photo3.jpg')
    })

    it('should handle maximum photos error', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.addDeviceInstallationPhoto).mockResolvedValue({
        success: false,
        message: 'Maximum 10 photos allowed per device'
      })

      const result = await store.addInstallPhoto(1, 1, 'photo11.jpg')

      expect(result).toBeNull()
      expect(store.error).toBe('Maximum 10 photos allowed per device')
    })
  })

  describe('addSerialPhoto', () => {
    it('should add serial photo successfully', async () => {
      const store = useInstallationsStore()
      const updatedInstallation = {
        ...mockInstallation,
        devices: [
          {
            ...mockInstallation.devices[0],
            serialPhotos: [...mockInstallation.devices[0].serialPhotos, 'serial2.jpg']
          },
          mockInstallation.devices[1]
        ]
      }

      vi.mocked(mockApi.addDeviceSerialPhoto).mockResolvedValue({
        success: true,
        data: updatedInstallation
      })

      const result = await store.addSerialPhoto(1, 1, 'serial2.jpg')

      expect(result).toBeDefined()
      expect(mockApi.addDeviceSerialPhoto).toHaveBeenCalledWith(1, 1, 'serial2.jpg')
    })
  })

  describe('completeInstall', () => {
    it('should complete device installation successfully', async () => {
      const store = useInstallationsStore()
      const updatedInstallation = {
        ...mockInstallation,
        devices: [
          mockInstallation.devices[0],
          {
            ...mockInstallation.devices[1],
            installationComplete: true,
            installationCompletedAt: new Date()
          }
        ]
      }

      vi.mocked(mockApi.completeDeviceInstallation).mockResolvedValue({
        success: true,
        data: updatedInstallation
      })

      const result = await store.completeInstall(1, 2)

      expect(result).toBeDefined()
      expect(mockApi.completeDeviceInstallation).toHaveBeenCalledWith(1, 2)
    })

    it('should handle missing photos error', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.completeDeviceInstallation).mockResolvedValue({
        success: false,
        message: 'At least one installation photo is required'
      })

      const result = await store.completeInstall(1, 2)

      expect(result).toBeNull()
      expect(store.error).toBe('At least one installation photo is required')
    })
  })

  describe('completeSerial', () => {
    it('should complete device serial successfully', async () => {
      const store = useInstallationsStore()
      const updatedInstallation = {
        ...mockInstallation,
        devices: [
          mockInstallation.devices[0],
          {
            ...mockInstallation.devices[1],
            installationComplete: true,
            serialComplete: true,
            serialCompletedAt: new Date()
          }
        ]
      }

      vi.mocked(mockApi.completeDeviceSerial).mockResolvedValue({
        success: true,
        data: updatedInstallation
      })

      const result = await store.completeSerial(1, 2)

      expect(result).toBeDefined()
      expect(mockApi.completeDeviceSerial).toHaveBeenCalledWith(1, 2)
    })

    it('should handle sequential validation error', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.completeDeviceSerial).mockResolvedValue({
        success: false,
        message: 'Must complete installation before serial'
      })

      const result = await store.completeSerial(1, 2)

      expect(result).toBeNull()
      expect(store.error).toBe('Must complete installation before serial')
    })
  })

  describe('activate', () => {
    it('should activate installation successfully', async () => {
      const store = useInstallationsStore()
      const activatedInstallation = {
        ...mockInstallation,
        activationComplete: true,
        activationCompletedAt: new Date(),
        completedAt: new Date()
      }

      vi.mocked(mockApi.activateInstallation).mockResolvedValue({
        success: true,
        data: activatedInstallation
      })

      const result = await store.activate(1)

      expect(result).toBeDefined()
      expect(mockApi.activateInstallation).toHaveBeenCalledWith(1)
    })

    it('should handle activation failure', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.activateInstallation).mockResolvedValue({
        success: false,
        message: 'Activation failed - job moved to Hold-Over status'
      })

      const result = await store.activate(1)

      expect(result).toBeNull()
      expect(store.error).toBe('Activation failed - job moved to Hold-Over status')
    })

    it('should handle incomplete devices error', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.activateInstallation).mockResolvedValue({
        success: false,
        message: 'All devices must be installed and scanned before activation'
      })

      const result = await store.activate(1)

      expect(result).toBeNull()
      expect(store.error).toBe('All devices must be installed and scanned before activation')
    })
  })

  describe('modifyInstallation', () => {
    it('should update installation successfully', async () => {
      const store = useInstallationsStore()
      store.installations = [mockInstallation]
      const updatedInstallation = { ...mockInstallation, notes: 'Updated notes' }

      vi.mocked(mockApi.updateInstallation).mockResolvedValue({
        success: true,
        data: updatedInstallation
      })

      const result = await store.modifyInstallation(1, { notes: 'Updated notes' })

      expect(result).toEqual(updatedInstallation)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.getInstallations).mockRejectedValue(new Error('Network error'))

      const result = await store.fetchInstallations()

      expect(result).toBe(false)
      expect(store.error).toBe('An error occurred while fetching installations')
    })
  })

  describe('clearError', () => {
    it('should clear error message', () => {
      const store = useInstallationsStore()
      store.error = 'Some error'

      store.clearError()

      expect(store.error).toBeNull()
    })
  })
})
