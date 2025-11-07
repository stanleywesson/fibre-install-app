import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Job, JobStatus } from '@/types'
import {
  getJobs,
  getJobById,
  getJobsByCompanyId,
  getJobsByInstallerId,
  updateJob,
  assignJob,
  scheduleJob,
  resolveHoldOver,
  setJobHoldOver
} from '@/api/mockApi'

export const useJobsStore = defineStore('jobs', () => {
  // State
  const jobs = ref<Job[]>([])
  const currentJob = ref<Job | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const newJobs = computed(() => jobs.value.filter(j => j.status === 'New'))
  const assignedJobs = computed(() => jobs.value.filter(j => j.status === 'Assigned'))
  const scheduledJobs = computed(() => jobs.value.filter(j => j.status === 'Scheduled'))
  const inProgressJobs = computed(() => jobs.value.filter(j => j.status === 'Installation in Progress'))
  const pendingActivationJobs = computed(() => jobs.value.filter(j => j.status === 'Pending Activation'))
  const completedJobs = computed(() => jobs.value.filter(j => j.status === 'Completed'))
  const holdOverJobs = computed(() => jobs.value.filter(j => j.status === 'Hold-Over'))
  const activeJobs = computed(() => jobs.value.filter(j => j.status !== 'Completed'))

  // Actions
  async function fetchJobs() {
    loading.value = true
    error.value = null

    try {
      const response = await getJobs()

      if (response.success && response.data) {
        jobs.value = response.data
        return true
      } else {
        error.value = response.message || 'Failed to fetch jobs'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while fetching jobs'
      console.error('Fetch jobs error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchJobById(id: number) {
    loading.value = true
    error.value = null

    try {
      const response = await getJobById(id)

      if (response.success && response.data) {
        currentJob.value = response.data
        return true
      } else {
        error.value = response.message || 'Failed to fetch job'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while fetching job'
      console.error('Fetch job error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchJobsByCompany(companyId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await getJobsByCompanyId(companyId)

      if (response.success && response.data) {
        jobs.value = response.data
        return true
      } else {
        error.value = response.message || 'Failed to fetch company jobs'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while fetching company jobs'
      console.error('Fetch company jobs error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchJobsByInstaller(installerId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await getJobsByInstallerId(installerId)

      if (response.success && response.data) {
        jobs.value = response.data
        return true
      } else {
        error.value = response.message || 'Failed to fetch installer jobs'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while fetching installer jobs'
      console.error('Fetch installer jobs error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function modifyJob(id: number, jobData: Partial<Job>) {
    loading.value = true
    error.value = null

    try {
      const response = await updateJob(id, jobData)

      if (response.success && response.data) {
        const index = jobs.value.findIndex(j => j.id === id)
        if (index !== -1) {
          jobs.value[index] = response.data
        }
        if (currentJob.value?.id === id) {
          currentJob.value = response.data
        }
        return response.data
      } else {
        error.value = response.message || 'Failed to update job'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while updating job'
      console.error('Update job error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function assignJobToInstaller(jobId: number, installerId: number, supervisorId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await assignJob(jobId, installerId, supervisorId)

      if (response.success && response.data) {
        const index = jobs.value.findIndex(j => j.id === jobId)
        if (index !== -1) {
          jobs.value[index] = response.data
        }
        if (currentJob.value?.id === jobId) {
          currentJob.value = response.data
        }
        return response.data
      } else {
        error.value = response.message || 'Failed to assign job'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while assigning job'
      console.error('Assign job error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function scheduleJobAppointment(jobId: number, scheduledDate: Date) {
    loading.value = true
    error.value = null

    try {
      const response = await scheduleJob(jobId, scheduledDate)

      if (response.success && response.data) {
        const index = jobs.value.findIndex(j => j.id === jobId)
        if (index !== -1) {
          jobs.value[index] = response.data
        }
        if (currentJob.value?.id === jobId) {
          currentJob.value = response.data
        }
        return response.data
      } else {
        error.value = response.message || 'Failed to schedule job'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while scheduling job'
      console.error('Schedule job error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function resolveJobHoldOver(jobId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await resolveHoldOver(jobId)

      if (response.success && response.data) {
        const index = jobs.value.findIndex(j => j.id === jobId)
        if (index !== -1) {
          jobs.value[index] = response.data
        }
        if (currentJob.value?.id === jobId) {
          currentJob.value = response.data
        }
        return response.data
      } else {
        error.value = response.message || 'Failed to resolve hold-over'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while resolving hold-over'
      console.error('Resolve hold-over error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function setJobToHoldOver(jobId: number, notes: string) {
    loading.value = true
    error.value = null

    try {
      const response = await setJobHoldOver(jobId, notes)

      if (response.success && response.data) {
        const index = jobs.value.findIndex(j => j.id === jobId)
        if (index !== -1) {
          jobs.value[index] = response.data
        }
        if (currentJob.value?.id === jobId) {
          currentJob.value = response.data
        }
        return response.data
      } else {
        error.value = response.message || 'Failed to set job to hold-over'
        return null
      }
    } catch (err) {
      error.value = 'An error occurred while setting job to hold-over'
      console.error('Set hold-over error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  function getJobsByStatus(status: JobStatus) {
    return jobs.value.filter(j => j.status === status)
  }

  function getJobsByDateRange(startDate: Date, endDate: Date) {
    return jobs.value.filter(j => {
      const jobDate = new Date(j.createdAt)
      return jobDate >= startDate && jobDate <= endDate
    })
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    jobs,
    currentJob,
    loading,
    error,
    // Getters
    newJobs,
    assignedJobs,
    scheduledJobs,
    inProgressJobs,
    pendingActivationJobs,
    completedJobs,
    holdOverJobs,
    activeJobs,
    // Actions
    fetchJobs,
    fetchJobById,
    fetchJobsByCompany,
    fetchJobsByInstaller,
    modifyJob,
    assignJobToInstaller,
    scheduleJobAppointment,
    resolveJobHoldOver,
    setJobToHoldOver,
    getJobsByStatus,
    getJobsByDateRange,
    clearError
  }
})
