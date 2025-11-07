import { computed } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import type { JobStatus } from '@/types'

/**
 * Jobs composable - Provides convenient access to jobs store functionality
 *
 * @example
 * const { jobs, newJobs, assignedJobs, fetchJobs } = useJobs()
 * await fetchJobs()
 */
export function useJobs() {
  const jobsStore = useJobsStore()

  const jobs = computed(() => jobsStore.jobs)
  const currentJob = computed(() => jobsStore.currentJob)
  const loading = computed(() => jobsStore.loading)
  const error = computed(() => jobsStore.error)

  // Status-based computed properties
  const newJobs = computed(() => jobsStore.newJobs)
  const assignedJobs = computed(() => jobsStore.assignedJobs)
  const scheduledJobs = computed(() => jobsStore.scheduledJobs)
  const inProgressJobs = computed(() => jobsStore.inProgressJobs)
  const pendingActivationJobs = computed(() => jobsStore.pendingActivationJobs)
  const completedJobs = computed(() => jobsStore.completedJobs)
  const holdOverJobs = computed(() => jobsStore.holdOverJobs)

  // Date-filtered jobs
  const jobsInDateRange = computed(() => jobsStore.jobsInDateRange)

  const fetchJobs = async () => {
    return await jobsStore.fetchJobs()
  }

  const fetchJobById = async (id: number) => {
    return await jobsStore.fetchJobById(id)
  }

  const fetchJobsByCompany = async (companyId: number) => {
    return await jobsStore.fetchJobsByCompany(companyId)
  }

  const fetchJobsByInstaller = async (installerId: number) => {
    return await jobsStore.fetchJobsByInstaller(installerId)
  }

  const assignJobToInstaller = async (jobId: number, installerId: number, supervisorId: number) => {
    return await jobsStore.assignJobToInstaller(jobId, installerId, supervisorId)
  }

  const scheduleJobAppointment = async (jobId: number, scheduledDate: Date) => {
    return await jobsStore.scheduleJobAppointment(jobId, scheduledDate)
  }

  const setJobToHoldOver = async (jobId: number, notes: string) => {
    return await jobsStore.setJobToHoldOver(jobId, notes)
  }

  const resolveJobHoldOver = async (jobId: number) => {
    return await jobsStore.resolveJobHoldOver(jobId)
  }

  const setDateRange = (startDate: Date | null, endDate: Date | null) => {
    jobsStore.setDateRange(startDate, endDate)
  }

  const clearDateRange = () => {
    jobsStore.clearDateRange()
  }

  const getJobsByStatus = (status: JobStatus) => {
    return jobs.value.filter(job => job.status === status)
  }

  return {
    // State
    jobs,
    currentJob,
    loading,
    error,

    // Status-based jobs
    newJobs,
    assignedJobs,
    scheduledJobs,
    inProgressJobs,
    pendingActivationJobs,
    completedJobs,
    holdOverJobs,
    jobsInDateRange,

    // Actions
    fetchJobs,
    fetchJobById,
    fetchJobsByCompany,
    fetchJobsByInstaller,
    assignJobToInstaller,
    scheduleJobAppointment,
    setJobToHoldOver,
    resolveJobHoldOver,
    setDateRange,
    clearDateRange,
    getJobsByStatus
  }
}
