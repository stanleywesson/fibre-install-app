import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useJobsStore } from '../jobs'
import * as mockApi from '@/api/mockApi'
import type { Job } from '@/types'

vi.mock('@/api/mockApi')

describe('Jobs Store', () => {
  const mockJob: Job = {
    id: 1,
    companyId: 1,
    customerId: 1,
    status: 'New',
    deviceCount: 2,
    createdAt: new Date('2025-01-05')
  }

  const mockJobs: Job[] = [
    mockJob,
    { id: 2, companyId: 1, customerId: 2, status: 'Assigned', assignedInstallerId: 4, supervisorId: 2, deviceCount: 1, createdAt: new Date('2025-01-08') },
    { id: 3, companyId: 1, customerId: 3, status: 'Scheduled', assignedInstallerId: 4, supervisorId: 2, scheduledDate: new Date('2025-01-20'), deviceCount: 3, createdAt: new Date('2025-01-10') },
    { id: 4, companyId: 1, customerId: 4, status: 'Installation in Progress', assignedInstallerId: 5, supervisorId: 2, deviceCount: 2, createdAt: new Date('2025-01-12') },
    { id: 5, companyId: 1, customerId: 5, status: 'Pending Activation', assignedInstallerId: 5, supervisorId: 2, deviceCount: 1, createdAt: new Date('2025-01-08') },
    { id: 6, companyId: 1, customerId: 6, status: 'Completed', assignedInstallerId: 4, supervisorId: 2, deviceCount: 2, completedDate: new Date('2024-12-21'), createdAt: new Date('2024-12-15') },
    { id: 7, companyId: 1, customerId: 7, status: 'Hold-Over', assignedInstallerId: 4, supervisorId: 2, notes: 'Customer unavailable', deviceCount: 1, createdAt: new Date('2025-01-10') }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useJobsStore()

      expect(store.jobs).toEqual([])
      expect(store.currentJob).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('fetchJobs', () => {
    it('should fetch and store jobs successfully', async () => {
      const store = useJobsStore()

      vi.mocked(mockApi.getJobs).mockResolvedValue({
        success: true,
        data: mockJobs
      })

      const result = await store.fetchJobs()

      expect(result).toBe(true)
      expect(store.jobs).toEqual(mockJobs)
      expect(store.error).toBeNull()
    })

    it('should handle fetch error', async () => {
      const store = useJobsStore()

      vi.mocked(mockApi.getJobs).mockResolvedValue({
        success: false,
        message: 'Failed to fetch jobs'
      })

      const result = await store.fetchJobs()

      expect(result).toBe(false)
      expect(store.error).toBe('Failed to fetch jobs')
    })
  })

  describe('fetchJobById', () => {
    it('should fetch and set current job', async () => {
      const store = useJobsStore()

      vi.mocked(mockApi.getJobById).mockResolvedValue({
        success: true,
        data: mockJob
      })

      const result = await store.fetchJobById(1)

      expect(result).toBe(true)
      expect(store.currentJob).toEqual(mockJob)
    })

    it('should handle job not found', async () => {
      const store = useJobsStore()

      vi.mocked(mockApi.getJobById).mockResolvedValue({
        success: false,
        message: 'Job not found'
      })

      const result = await store.fetchJobById(999)

      expect(result).toBe(false)
      expect(store.error).toBe('Job not found')
    })
  })

  describe('Status-based Computed Properties', () => {
    beforeEach(async () => {
      const store = useJobsStore()
      vi.mocked(mockApi.getJobs).mockResolvedValue({
        success: true,
        data: mockJobs
      })
      await store.fetchJobs()
    })

    it('should filter new jobs', () => {
      const store = useJobsStore()
      expect(store.newJobs).toHaveLength(1)
      expect(store.newJobs[0].status).toBe('New')
    })

    it('should filter assigned jobs', () => {
      const store = useJobsStore()
      expect(store.assignedJobs).toHaveLength(1)
      expect(store.assignedJobs[0].status).toBe('Assigned')
    })

    it('should filter scheduled jobs', () => {
      const store = useJobsStore()
      expect(store.scheduledJobs).toHaveLength(1)
      expect(store.scheduledJobs[0].status).toBe('Scheduled')
    })

    it('should filter in-progress jobs', () => {
      const store = useJobsStore()
      expect(store.inProgressJobs).toHaveLength(1)
      expect(store.inProgressJobs[0].status).toBe('Installation in Progress')
    })

    it('should filter pending activation jobs', () => {
      const store = useJobsStore()
      expect(store.pendingActivationJobs).toHaveLength(1)
      expect(store.pendingActivationJobs[0].status).toBe('Pending Activation')
    })

    it('should filter completed jobs', () => {
      const store = useJobsStore()
      expect(store.completedJobs).toHaveLength(1)
      expect(store.completedJobs[0].status).toBe('Completed')
    })

    it('should filter hold-over jobs', () => {
      const store = useJobsStore()
      expect(store.holdOverJobs).toHaveLength(1)
      expect(store.holdOverJobs[0].status).toBe('Hold-Over')
    })
  })

  describe('Date Range Filtering', () => {
    beforeEach(async () => {
      const store = useJobsStore()
      vi.mocked(mockApi.getJobs).mockResolvedValue({
        success: true,
        data: mockJobs
      })
      await store.fetchJobs()
    })

    it('should filter jobs within date range', () => {
      const store = useJobsStore()
      const filtered = store.getJobsByDateRange(new Date('2025-01-01'), new Date('2025-01-15'))

      expect(filtered.length).toBeGreaterThan(0)
      filtered.forEach(job => {
        expect(job.createdAt >= new Date('2025-01-01')).toBe(true)
        expect(job.createdAt <= new Date('2025-01-15')).toBe(true)
      })
    })

    it('should return empty array for date range with no jobs', () => {
      const store = useJobsStore()
      const filtered = store.getJobsByDateRange(new Date('2020-01-01'), new Date('2020-01-15'))
      expect(filtered).toEqual([])
    })
  })

  describe('assignJobToInstaller', () => {
    it('should assign job successfully', async () => {
      const store = useJobsStore()
      const assignedJob = { ...mockJob, assignedInstallerId: 4, supervisorId: 2, status: 'Assigned' as const }

      vi.mocked(mockApi.assignJob).mockResolvedValue({
        success: true,
        data: assignedJob
      })

      const result = await store.assignJobToInstaller(1, 4, 2)

      expect(result).toEqual(assignedJob)
      expect(mockApi.assignJob).toHaveBeenCalledWith(1, 4, 2)
    })
  })

  describe('scheduleJobAppointment', () => {
    it('should schedule job successfully', async () => {
      const store = useJobsStore()
      const scheduledDate = new Date('2025-01-20')
      const scheduledJob = { ...mockJob, scheduledDate, status: 'Scheduled' as const }

      vi.mocked(mockApi.scheduleJob).mockResolvedValue({
        success: true,
        data: scheduledJob
      })

      const result = await store.scheduleJobAppointment(1, scheduledDate)

      expect(result).toEqual(scheduledJob)
      expect(mockApi.scheduleJob).toHaveBeenCalledWith(1, scheduledDate)
    })
  })

  describe('setJobToHoldOver', () => {
    it('should set job to hold-over with notes', async () => {
      const store = useJobsStore()
      const notes = 'Customer not available'
      const holdOverJob = { ...mockJob, status: 'Hold-Over' as const, notes }

      vi.mocked(mockApi.setJobHoldOver).mockResolvedValue({
        success: true,
        data: holdOverJob
      })

      const result = await store.setJobToHoldOver(1, notes)

      expect(result).toEqual(holdOverJob)
      expect(mockApi.setJobHoldOver).toHaveBeenCalledWith(1, notes)
    })
  })

  describe('resolveJobHoldOver', () => {
    it('should resolve hold-over job', async () => {
      const store = useJobsStore()
      const resolvedJob = { ...mockJob, status: 'Assigned' as const }

      vi.mocked(mockApi.resolveHoldOver).mockResolvedValue({
        success: true,
        data: resolvedJob
      })

      const result = await store.resolveJobHoldOver(1)

      expect(result).toEqual(resolvedJob)
      expect(mockApi.resolveHoldOver).toHaveBeenCalledWith(1)
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const store = useJobsStore()

      vi.mocked(mockApi.getJobs).mockRejectedValue(new Error('Network error'))

      const result = await store.fetchJobs()

      expect(result).toBe(false)
      expect(store.error).toBe('An error occurred while fetching jobs')
    })
  })
})
