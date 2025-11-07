// User types
export type UserRole = 'Admin' | 'Supervisor' | 'Installer'

export interface User {
  id: number
  username: string
  password: string // In mock, stored as plain text (not production-ready)
  role: UserRole
  name: string
  email?: string
  supervisorId?: number // For Installers - which Supervisor they belong to (ONE supervisor at a time)
  companyId?: number // For Supervisors - which Company they belong to (ONE company only)
  createdAt: Date
}

// Company types
export interface Company {
  id: number
  name: string
  address?: string
  contactPerson?: string
  contactPhone?: string
}

// Customer types
export interface Customer {
  id: number
  name: string
  address: string
  phone: string
  email?: string
}

// Job types
export type JobStatus =
  | 'New'
  | 'Assigned'
  | 'Scheduled'
  | 'Installation in Progress'
  | 'Pending Activation'
  | 'Completed'
  | 'Hold-Over'

export interface Job {
  id: number
  companyId: number
  customerId: number
  status: JobStatus
  assignedInstallerId?: number // Installer assigned to this job
  supervisorId?: number // Supervisor who manages this job (optional until assigned)
  scheduledDate?: Date
  completedDate?: Date
  notes?: string
  deviceCount: number // Number of devices to install (default 1)
  createdAt: Date
}

// Installation types
export interface Device {
  deviceNumber: number // 1, 2, 3, etc.
  installationComplete: boolean
  installationPhotos: string[] // Photos of installed equipment
  installationCompletedAt?: Date
  serialComplete: boolean
  serialPhotos: string[] // Photos of serial number
  serialCompletedAt?: Date
}

export interface Installation {
  id: number
  jobId: number
  installerId: number
  startedAt: Date
  completedAt?: Date

  devices: Device[] // Array of devices to install

  // Step 3: Activate (only after all devices complete)
  activationComplete: boolean
  activationCompletedAt?: Date

  notes?: string
}

// Auth types
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}
