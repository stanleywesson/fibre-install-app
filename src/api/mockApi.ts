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

export async function verifyJobOtp(jobId: number, enteredOtp: string): Promise<ApiResponse<Job>> {
  await delay()

  const jobIndex = mockJobs.findIndex(j => j.id === jobId)

  if (jobIndex === -1) {
    return {
      success: false,
      message: 'Job not found'
    }
  }

  const job = mockJobs[jobIndex]

  if (!job.customerOtp) {
    return {
      success: false,
      message: 'No OTP set for this job'
    }
  }

  if (job.otpVerified) {
    return {
      success: true,
      data: job,
      message: 'OTP already verified'
    }
  }

  if (enteredOtp !== job.customerOtp) {
    return {
      success: false,
      message: 'Invalid OTP. Please try again.'
    }
  }

  mockJobs[jobIndex] = {
    ...mockJobs[jobIndex],
    otpVerified: true,
    otpVerifiedAt: new Date()
  }

  return {
    success: true,
    data: mockJobs[jobIndex],
    message: 'OTP verified successfully'
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

export async function createInstallation(installationData: Omit<Installation, 'id' | 'devices'>): Promise<ApiResponse<Installation>> {
  await delay()

  // Find the job to get device count
  const job = mockJobs.find(j => j.id === installationData.jobId)
  if (!job) {
    return {
      success: false,
      message: 'Job not found'
    }
  }

  // Initialize devices array based on job's deviceCount
  const devices = Array.from({ length: job.deviceCount }, (_, index) => ({
    deviceNumber: index + 1,
    installationComplete: false,
    installationPhotos: [],
    serialComplete: false,
    serialPhotos: []
  }))

  const newInstallation: Installation = {
    ...installationData,
    id: getNextInstallationId(),
    devices,
    activationComplete: false
  }

  mockInstallations.push(newInstallation)

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

  // If all devices complete, update job status to Pending Activation
  const installation = mockInstallations[installationIndex]
  const allDevicesComplete = installation.devices.every(d => d.installationComplete && d.serialComplete)
  if (installation.activationComplete && allDevicesComplete) {
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

// Add photo to device installation
export async function addDeviceInstallationPhoto(
  installationId: number,
  deviceNumber: number,
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
  const device = installation.devices.find(d => d.deviceNumber === deviceNumber)

  if (!device) {
    return {
      success: false,
      message: 'Device not found'
    }
  }

  if (device.installationPhotos.length >= 10) {
    return {
      success: false,
      message: 'Maximum 10 photos allowed per device'
    }
  }

  device.installationPhotos = [...device.installationPhotos, photoUrl]
  const updatedInstallation = { ...installation, devices: [...installation.devices] }

  return {
    success: true,
    data: updatedInstallation
  }
}

// Add photo to device serial
export async function addDeviceSerialPhoto(
  installationId: number,
  deviceNumber: number,
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
  const device = installation.devices.find(d => d.deviceNumber === deviceNumber)

  if (!device) {
    return {
      success: false,
      message: 'Device not found'
    }
  }

  if (device.serialPhotos.length >= 10) {
    return {
      success: false,
      message: 'Maximum 10 photos allowed per device'
    }
  }

  device.serialPhotos = [...device.serialPhotos, photoUrl]
  const updatedInstallation = { ...installation, devices: [...installation.devices] }

  return {
    success: true,
    data: updatedInstallation
  }
}

// Complete device installation step
export async function completeDeviceInstallation(
  installationId: number,
  deviceNumber: number
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
  const device = installation.devices.find(d => d.deviceNumber === deviceNumber)

  if (!device) {
    return {
      success: false,
      message: 'Device not found'
    }
  }

  if (device.installationPhotos.length === 0) {
    return {
      success: false,
      message: 'At least one installation photo is required'
    }
  }

  device.installationComplete = true
  device.installationCompletedAt = new Date()

  return {
    success: true,
    data: installation
  }
}

// Complete device serial step
export async function completeDeviceSerial(
  installationId: number,
  deviceNumber: number
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
  const device = installation.devices.find(d => d.deviceNumber === deviceNumber)

  if (!device) {
    return {
      success: false,
      message: 'Device not found'
    }
  }

  if (!device.installationComplete) {
    return {
      success: false,
      message: 'Must complete installation before serial'
    }
  }

  if (device.serialPhotos.length === 0) {
    return {
      success: false,
      message: 'At least one serial photo is required'
    }
  }

  device.serialComplete = true
  device.serialCompletedAt = new Date()

  return {
    success: true,
    data: installation
  }
}

// Activate installation (final step after all devices complete)
export async function activateInstallation(
  installationId: number
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

  // Check all devices are complete
  const allDevicesComplete = installation.devices.every(d => d.installationComplete && d.serialComplete)
  if (!allDevicesComplete) {
    return {
      success: false,
      message: 'All devices must be installed and scanned before activation'
    }
  }

  // Activation can fail programmatically (10% chance for demo)
  if (Math.random() < 0.1) {
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

  installation.activationComplete = true
  installation.activationCompletedAt = new Date()
  installation.completedAt = new Date()

  const jobIndex = mockJobs.findIndex(j => j.id === installation.jobId)
  if (jobIndex !== -1) {
    mockJobs[jobIndex].status = 'Pending Activation'
  }

  return {
    success: true,
    data: installation
  }
}
