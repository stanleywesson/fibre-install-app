import type {
  User,
  Company,
  Customer,
  Job,
  Installation,
  LoginCredentials,
  LoginResponse,
  ApiResponse
} from '@/types'
import {
  mockUsers,
  mockCompanies,
  mockCustomers,
  mockJobs,
  mockInstallations,
  getNextUserId,
  getNextJobId,
  getNextInstallationId
} from './mockData'

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Generate mock JWT token
function generateToken(user: User): string {
  return `mock-jwt-token-${user.id}-${Date.now()}`
}

// ==================== AUTH API ====================

export async function login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
  await delay()

  const user = mockUsers.find(
    u => u.username === credentials.username && u.password === credentials.password
  )

  if (!user) {
    return {
      success: false,
      message: 'Invalid username or password'
    }
  }

  const token = generateToken(user)

  return {
    success: true,
    data: {
      user,
      token
    }
  }
}

export async function verifyToken(token: string): Promise<ApiResponse<User>> {
  await delay(200)

  // Simple token validation (in production, would verify JWT signature)
  if (!token || !token.startsWith('mock-jwt-token-')) {
    return {
      success: false,
      message: 'Invalid token'
    }
  }

  // Extract user ID from token
  const parts = token.split('-')
  const userId = parseInt(parts[3])

  const user = mockUsers.find(u => u.id === userId)

  if (!user) {
    return {
      success: false,
      message: 'User not found'
    }
  }

  return {
    success: true,
    data: user
  }
}

// ==================== USER API ====================

export async function getUsers(): Promise<ApiResponse<User[]>> {
  await delay()

  return {
    success: true,
    data: mockUsers
  }
}

export async function getUserById(id: number): Promise<ApiResponse<User>> {
  await delay()

  const user = mockUsers.find(u => u.id === id)

  if (!user) {
    return {
      success: false,
      message: 'User not found'
    }
  }

  return {
    success: true,
    data: user
  }
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> {
  await delay()

  // Check if username already exists
  if (mockUsers.some(u => u.username === userData.username)) {
    return {
      success: false,
      message: 'Username already exists'
    }
  }

  const newUser: User = {
    ...userData,
    id: getNextUserId(),
    createdAt: new Date()
  }

  mockUsers.push(newUser)

  return {
    success: true,
    data: newUser
  }
}

export async function updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
  await delay()

  const userIndex = mockUsers.findIndex(u => u.id === id)

  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found'
    }
  }

  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...userData,
    id // Prevent ID from being changed
  }

  return {
    success: true,
    data: mockUsers[userIndex]
  }
}

export async function deleteUser(id: number): Promise<ApiResponse<void>> {
  await delay()

  const userIndex = mockUsers.findIndex(u => u.id === id)

  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found'
    }
  }

  mockUsers.splice(userIndex, 1)

  return {
    success: true
  }
}

export async function getInstallersBySupervisorId(supervisorId: number): Promise<ApiResponse<User[]>> {
  await delay()

  const installers = mockUsers.filter(u => u.supervisorId === supervisorId && u.role === 'Installer')

  return {
    success: true,
    data: installers
  }
}

// ==================== COMPANY API ====================

export async function getCompanies(): Promise<ApiResponse<Company[]>> {
  await delay()

  return {
    success: true,
    data: mockCompanies
  }
}

export async function getCompanyById(id: number): Promise<ApiResponse<Company>> {
  await delay()

  const company = mockCompanies.find(c => c.id === id)

  if (!company) {
    return {
      success: false,
      message: 'Company not found'
    }
  }

  return {
    success: true,
    data: company
  }
}

// ==================== CUSTOMER API ====================

export async function getCustomers(): Promise<ApiResponse<Customer[]>> {
  await delay()

  return {
    success: true,
    data: mockCustomers
  }
}

export async function getCustomerById(id: number): Promise<ApiResponse<Customer>> {
  await delay()

  const customer = mockCustomers.find(c => c.id === id)

  if (!customer) {
    return {
      success: false,
      message: 'Customer not found'
    }
  }

  return {
    success: true,
    data: customer
  }
}

// ==================== JOB API ====================

export async function getJobs(): Promise<ApiResponse<Job[]>> {
  await delay()

  return {
    success: true,
    data: mockJobs
  }
}

export async function getJobById(id: number): Promise<ApiResponse<Job>> {
  await delay()

  const job = mockJobs.find(j => j.id === id)

  if (!job) {
    return {
      success: false,
      message: 'Job not found'
    }
  }

  return {
    success: true,
    data: job
  }
}

export async function getJobsByCompanyId(companyId: number): Promise<ApiResponse<Job[]>> {
  await delay()

  const jobs = mockJobs.filter(j => j.companyId === companyId)

  return {
    success: true,
    data: jobs
  }
}

export async function getJobsByInstallerId(installerId: number): Promise<ApiResponse<Job[]>> {
  await delay()

  const jobs = mockJobs.filter(j => j.assignedInstallerId === installerId)

  return {
    success: true,
    data: jobs
  }
}

export async function updateJob(id: number, jobData: Partial<Job>): Promise<ApiResponse<Job>> {
  await delay()

  const jobIndex = mockJobs.findIndex(j => j.id === id)

  if (jobIndex === -1) {
    return {
      success: false,
      message: 'Job not found'
    }
  }

  mockJobs[jobIndex] = {
    ...mockJobs[jobIndex],
    ...jobData,
    id // Prevent ID from being changed
  }

  return {
    success: true,
    data: mockJobs[jobIndex]
  }
}

export async function assignJob(jobId: number, installerId: number, supervisorId: number): Promise<ApiResponse<Job>> {
  await delay()

  const jobIndex = mockJobs.findIndex(j => j.id === jobId)

  if (jobIndex === -1) {
    return {
      success: false,
      message: 'Job not found'
    }
  }

  mockJobs[jobIndex] = {
    ...mockJobs[jobIndex],
    assignedInstallerId: installerId,
    supervisorId: supervisorId,
    status: 'Assigned'
  }

  return {
    success: true,
    data: mockJobs[jobIndex]
  }
}

export async function scheduleJob(jobId: number, scheduledDate: Date): Promise<ApiResponse<Job>> {
  await delay()

  const jobIndex = mockJobs.findIndex(j => j.id === jobId)

  if (jobIndex === -1) {
    return {
      success: false,
      message: 'Job not found'
    }
  }

  mockJobs[jobIndex] = {
    ...mockJobs[jobIndex],
    scheduledDate,
    status: 'Scheduled'
  }

  return {
    success: true,
    data: mockJobs[jobIndex]
  }
}

export async function resolveHoldOver(jobId: number): Promise<ApiResponse<Job>> {
  await delay()

  const jobIndex = mockJobs.findIndex(j => j.id === jobId)

  if (jobIndex === -1) {
    return {
      success: false,
      message: 'Job not found'
    }
  }

  if (mockJobs[jobIndex].status !== 'Hold-Over') {
    return {
      success: false,
      message: 'Job is not in Hold-Over status'
    }
  }

  // Return job to Assigned status with same installer
  mockJobs[jobIndex] = {
    ...mockJobs[jobIndex],
    status: 'Assigned'
  }

  return {
    success: true,
    data: mockJobs[jobIndex]
  }
}

export async function setJobHoldOver(jobId: number, notes: string): Promise<ApiResponse<Job>> {
  await delay()

  const jobIndex = mockJobs.findIndex(j => j.id === jobId)

  if (jobIndex === -1) {
    return {
      success: false,
      message: 'Job not found'
    }
  }

  mockJobs[jobIndex] = {
    ...mockJobs[jobIndex],
    status: 'Hold-Over',
    notes
  }

  return {
    success: true,
    data: mockJobs[jobIndex]
  }
}

// ==================== INSTALLATION API ====================

export async function getInstallations(): Promise<ApiResponse<Installation[]>> {
  await delay()

  return {
    success: true,
    data: mockInstallations
  }
}

export async function getInstallationById(id: number): Promise<ApiResponse<Installation>> {
  await delay()

  const installation = mockInstallations.find(i => i.id === id)

  if (!installation) {
    return {
      success: false,
      message: 'Installation not found'
    }
  }

  return {
    success: true,
    data: installation
  }
}

export async function getInstallationByJobId(jobId: number): Promise<ApiResponse<Installation | null>> {
  await delay()

  const installation = mockInstallations.find(i => i.jobId === jobId)

  return {
    success: true,
    data: installation || null
  }
}

export async function createInstallation(installationData: Omit<Installation, 'id'>): Promise<ApiResponse<Installation>> {
  await delay()

  const newInstallation: Installation = {
    ...installationData,
    id: getNextInstallationId()
  }

  mockInstallations.push(newInstallation)

  // Update job status to "Installation in Progress"
  const jobIndex = mockJobs.findIndex(j => j.id === installationData.jobId)
  if (jobIndex !== -1) {
    mockJobs[jobIndex].status = 'Installation in Progress'
  }

  return {
    success: true,
    data: newInstallation
  }
}

export async function updateInstallation(id: number, installationData: Partial<Installation>): Promise<ApiResponse<Installation>> {
  await delay()

  const installationIndex = mockInstallations.findIndex(i => i.id === id)

  if (installationIndex === -1) {
    return {
      success: false,
      message: 'Installation not found'
    }
  }

  mockInstallations[installationIndex] = {
    ...mockInstallations[installationIndex],
    ...installationData,
    id // Prevent ID from being changed
  }

  // If all steps complete, update job status to Pending Activation
  const installation = mockInstallations[installationIndex]
  if (installation.step1Complete && installation.step2Complete && installation.step3Complete) {
    const jobIndex = mockJobs.findIndex(j => j.id === installation.jobId)
    if (jobIndex !== -1) {
      mockJobs[jobIndex].status = 'Pending Activation'
    }
  }

  return {
    success: true,
    data: mockInstallations[installationIndex]
  }
}

export async function completeInstallationStep(
  installationId: number,
  step: 1 | 2 | 3,
  photos?: string[]
): Promise<ApiResponse<Installation>> {
  await delay()

  const installationIndex = mockInstallations.findIndex(i => i.id === installationId)

  if (installationIndex === -1) {
    return {
      success: false,
      message: 'Installation not found'
    }
  }

  const installation = mockInstallations[installationIndex]

  // Validate sequential completion
  if (step === 2 && !installation.step1Complete) {
    return {
      success: false,
      message: 'Must complete Step 1 before Step 2'
    }
  }

  if (step === 3 && (!installation.step1Complete || !installation.step2Complete)) {
    return {
      success: false,
      message: 'Must complete Steps 1 and 2 before Step 3'
    }
  }

  // Step 3 can fail programmatically (10% chance for demo)
  if (step === 3 && Math.random() < 0.1) {
    // Set job to Hold-Over
    const jobIndex = mockJobs.findIndex(j => j.id === installation.jobId)
    if (jobIndex !== -1) {
      mockJobs[jobIndex].status = 'Hold-Over'
      mockJobs[jobIndex].notes = 'Activation queue failure - automatic hold-over'
    }

    return {
      success: false,
      message: 'Activation failed - job moved to Hold-Over status'
    }
  }

  // Update the specific step
  if (step === 1) {
    installation.step1Complete = true
    installation.step1Photos = photos || []
    installation.step1CompletedAt = new Date()
  } else if (step === 2) {
    installation.step2Complete = true
    installation.step2Photos = photos || []
    installation.step2CompletedAt = new Date()
  } else if (step === 3) {
    installation.step3Complete = true
    installation.step3CompletedAt = new Date()
    installation.completedAt = new Date()

    // Update job status to Pending Activation
    const jobIndex = mockJobs.findIndex(j => j.id === installation.jobId)
    if (jobIndex !== -1) {
      mockJobs[jobIndex].status = 'Pending Activation'
    }
  }

  return {
    success: true,
    data: installation
  }
}

export async function addInstallationPhoto(
  installationId: number,
  step: 1 | 2,
  photoUrl: string
): Promise<ApiResponse<Installation>> {
  await delay(300)

  const installationIndex = mockInstallations.findIndex(i => i.id === installationId)

  if (installationIndex === -1) {
    return {
      success: false,
      message: 'Installation not found'
    }
  }

  const installation = mockInstallations[installationIndex]

  if (step === 1) {
    if (installation.step1Photos.length >= 10) {
      return {
        success: false,
        message: 'Maximum 10 photos allowed per step'
      }
    }
    // Create new array to trigger reactivity
    installation.step1Photos = [...installation.step1Photos, photoUrl]
  } else if (step === 2) {
    if (installation.step2Photos.length >= 10) {
      return {
        success: false,
        message: 'Maximum 10 photos allowed per step'
      }
    }
    // Create new array to trigger reactivity
    installation.step2Photos = [...installation.step2Photos, photoUrl]
  }

  // Return a new object reference to ensure reactivity
  const updatedInstallation = { ...installation }

  return {
    success: true,
    data: updatedInstallation
  }
}
