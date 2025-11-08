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

  describe('addInventory', () => {
    it('should add inventory item successfully', async () => {
      const store = useInstallationsStore()
      const inventoryInstallation = {
        ...mockInstallation,
        devices: [
          {
            ...mockInstallation.devices[0],
            inventoryItems: [
              {
                id: 1,
                deviceNumber: 1,
                serialNumber: 'SN123456',
                deviceType: 'Router',
                model: 'TP-Link AX3000',
                installerId: 5,
                jobId: 4,
                notes: 'Main router',
                createdAt: new Date('2025-01-16T10:00:00')
              }
            ]
          },
          mockInstallation.devices[1]
        ]
      }

      vi.mocked(mockApi.addInventoryItem).mockResolvedValue({
        success: true,
        data: inventoryInstallation
      })

      const result = await store.addInventory(1, 1, 'SN123456', 'Router', 'TP-Link AX3000', 5, 4, 'Main router')

      expect(result).toBeDefined()
      expect(mockApi.addInventoryItem).toHaveBeenCalledWith(1, 1, 'SN123456', 'Router', 'TP-Link AX3000', 5, 4, 'Main router')
    })

    it('should handle add inventory error', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.addInventoryItem).mockResolvedValue({
        success: false,
        message: 'Failed to add inventory item'
      })

      const result = await store.addInventory(1, 1, 'SN123456', 'Router', 'TP-Link AX3000', 5, 4)

      expect(result).toBeNull()
      expect(store.error).toBe('Failed to add inventory item')
    })

    it('should update current installation when inventory added', async () => {
      const store = useInstallationsStore()
      store.currentInstallation = mockInstallation

      const inventoryInstallation = {
        ...mockInstallation,
        devices: [
          {
            ...mockInstallation.devices[0],
            inventoryItems: [
              {
                id: 1,
                deviceNumber: 1,
                serialNumber: 'SN123456',
                deviceType: 'Router',
                model: 'TP-Link AX3000',
                installerId: 5,
                jobId: 4,
                createdAt: new Date()
              }
            ]
          },
          mockInstallation.devices[1]
        ]
      }

      vi.mocked(mockApi.addInventoryItem).mockResolvedValue({
        success: true,
        data: inventoryInstallation
      })

      await store.addInventory(1, 1, 'SN123456', 'Router', 'TP-Link AX3000', 5, 4)

      expect(store.currentInstallation?.devices[0].inventoryItems).toHaveLength(1)
    })

    it('should update installations array when inventory added', async () => {
      const store = useInstallationsStore()
      store.installations = [mockInstallation]

      const inventoryInstallation = {
        ...mockInstallation,
        devices: [
          {
            ...mockInstallation.devices[0],
            inventoryItems: [
              {
                id: 1,
                deviceNumber: 1,
                serialNumber: 'SN123456',
                deviceType: 'Router',
                model: undefined,
                installerId: 5,
                jobId: 4,
                createdAt: new Date()
              }
            ]
          },
          mockInstallation.devices[1]
        ]
      }

      vi.mocked(mockApi.addInventoryItem).mockResolvedValue({
        success: true,
        data: inventoryInstallation
      })

      await store.addInventory(1, 1, 'SN123456', 'Router', undefined, 5, 4)

      const updatedInstallation = store.installations.find(i => i.id === 1)
      expect(updatedInstallation?.devices[0].inventoryItems).toHaveLength(1)
    })

    it('should handle missing required fields', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.addInventoryItem).mockResolvedValue({
        success: false,
        message: 'Serial number and device type are required'
      })

      const result = await store.addInventory(1, 1, '', 'Router', 'TP-Link AX3000', 5, 4)

      expect(result).toBeNull()
      expect(store.error).toBe('Serial number and device type are required')
    })

    it('should handle device not found', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.addInventoryItem).mockResolvedValue({
        success: false,
        message: 'Device not found'
      })

      const result = await store.addInventory(1, 999, 'SN123456', 'Router', 'TP-Link AX3000', 5, 4)

      expect(result).toBeNull()
      expect(store.error).toBe('Device not found')
    })

    it('should handle installation not complete', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.addInventoryItem).mockResolvedValue({
        success: false,
        message: 'Device installation must be complete before adding inventory'
      })

      const result = await store.addInventory(1, 2, 'SN123456', 'Router', 'TP-Link AX3000', 5, 4)

      expect(result).toBeNull()
      expect(store.error).toBe('Device installation must be complete before adding inventory')
    })

    it('should add inventory without optional fields', async () => {
      const store = useInstallationsStore()
      const inventoryInstallation = {
        ...mockInstallation,
        devices: [
          {
            ...mockInstallation.devices[0],
            inventoryItems: [
              {
                id: 1,
                deviceNumber: 1,
                serialNumber: 'SN123456',
                deviceType: 'Other',
                model: undefined,
                notes: undefined,
                installerId: 5,
                jobId: 4,
                createdAt: new Date()
              }
            ]
          },
          mockInstallation.devices[1]
        ]
      }

      vi.mocked(mockApi.addInventoryItem).mockResolvedValue({
        success: true,
        data: inventoryInstallation
      })

      const result = await store.addInventory(1, 1, 'SN123456', 'Other', undefined, 5, 4, undefined)

      expect(result).toBeDefined()
      expect(result?.devices[0].inventoryItems?.[0].model).toBeUndefined()
      expect(result?.devices[0].inventoryItems?.[0].notes).toBeUndefined()
    })

    it('should handle network errors gracefully', async () => {
      const store = useInstallationsStore()

      vi.mocked(mockApi.addInventoryItem).mockRejectedValue(new Error('Network error'))

      const result = await store.addInventory(1, 1, 'SN123456', 'Router', 'TP-Link AX3000', 5, 4)

      expect(result).toBeNull()
      expect(store.error).toBe('An error occurred while adding inventory item')
    })

    it('should add multiple inventory items to same device', async () => {
      const store = useInstallationsStore()
      store.currentInstallation = mockInstallation

      // First item
      const firstItemInstallation = {
        ...mockInstallation,
        devices: [
          {
            ...mockInstallation.devices[0],
            inventoryItems: [
              {
                id: 1,
                deviceNumber: 1,
                serialNumber: 'SN123456',
                deviceType: 'Router',
                model: 'TP-Link AX3000',
                installerId: 5,
                jobId: 4,
                createdAt: new Date()
              }
            ]
          },
          mockInstallation.devices[1]
        ]
      }

      vi.mocked(mockApi.addInventoryItem).mockResolvedValueOnce({
        success: true,
        data: firstItemInstallation
      })

      await store.addInventory(1, 1, 'SN123456', 'Router', 'TP-Link AX3000', 5, 4)

      // Second item
      const secondItemInstallation = {
        ...firstItemInstallation,
        devices: [
          {
            ...firstItemInstallation.devices[0],
            inventoryItems: [
              ...(firstItemInstallation.devices[0].inventoryItems || []),
              {
                id: 2,
                deviceNumber: 1,
                serialNumber: 'SN789012',
                deviceType: 'Cable',
                model: 'Cat6 Ethernet',
                installerId: 5,
                jobId: 4,
                notes: '10m cable',
                createdAt: new Date()
              }
            ]
          },
          firstItemInstallation.devices[1]
        ]
      }

      vi.mocked(mockApi.addInventoryItem).mockResolvedValueOnce({
        success: true,
        data: secondItemInstallation
      })

      await store.addInventory(1, 1, 'SN789012', 'Cable', 'Cat6 Ethernet', 5, 4, '10m cable')

      expect(store.currentInstallation?.devices[0].inventoryItems).toHaveLength(2)
    })
  })
})
