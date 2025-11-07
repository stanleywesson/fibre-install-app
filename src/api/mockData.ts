import type { User, Company, Customer, Job, Installation } from '@/types'

// Mock data storage
export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    password: '123',
    role: 'Admin',
    name: 'Faizal',
    email: 'admin@fibreinstall.com',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    username: 'super1',
    password: '123',
    role: 'Supervisor',
    name: 'Stan Wesson',
    email: 'stanley@company.com',
    companyId: 1,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 3,
    username: 'super2',
    password: '123',
    role: 'Supervisor',
    name: 'Priska Coetzee',
    email: 'priska@company.com',
    companyId: 2,
    createdAt: new Date('2024-01-20')
  },
  {
    id: 4,
    username: 'install1',
    password: '123',
    role: 'Installer',
    name: 'Ben',
    email: 'ben@installer.com',
    supervisorId: 2,
    createdAt: new Date('2024-02-01')
  },
  {
    id: 5,
    username: 'install2',
    password: '123',
    role: 'Installer',
    name: 'Bert',
    email: 'bert@installer.com',
    supervisorId: 2,
    createdAt: new Date('2024-02-05')
  },
  {
    id: 6,
    username: 'install3',
    password: '123',
    role: 'Installer',
    name: 'Ken',
    email: 'ken@installer.com',
    supervisorId: 3,
    createdAt: new Date('2024-02-10')
  },
  {
    id: 7,
    username: 'install4',
    password: '123',
    role: 'Installer',
    name: 'Fred',
    email: 'fred@installer.com',
    supervisorId: 3,
    createdAt: new Date('2024-02-15')
  }
]

export const mockCompanies: Company[] = [
  {
    id: 1,
    name: 'Metrofibre',
    address: '123 Main St, Tech City, TC 12345',
    contactPerson: 'Jan Jan',
    contactPhone: '555-0101'
  },
  {
    id: 2,
    name: 'Senwes',
    address: '456 Network Ave, Digital Town, DT 67890',
    contactPerson: 'Alf',
    contactPhone: '555-0202'
  },
  {
    id: 3,
    name: 'Vodacom',
    address: '789 Internet Blvd, Web City, WC 11111',
    contactPerson: 'Deon',
    contactPhone: '555-0303'
  }
]

export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Alice Cooper',
    address: '10 Oak Street, Residential Area',
    phone: '555-1001',
    email: 'alice.cooper@email.com'
  },
  {
    id: 2,
    name: 'Bob Martinez',
    address: '25 Pine Avenue, Suburb Heights',
    phone: '555-1002',
    email: 'bob.martinez@email.com'
  },
  {
    id: 3,
    name: 'Carol Lee',
    address: '42 Maple Drive, Downtown District',
    phone: '555-1003',
    email: 'carol.lee@email.com'
  },
  {
    id: 4,
    name: 'David Kim',
    address: '88 Elm Street, Business Park',
    phone: '555-1004',
    email: 'david.kim@email.com'
  },
  {
    id: 5,
    name: 'Eva Rodriguez',
    address: '15 Birch Lane, Garden District',
    phone: '555-1005',
    email: 'eva.rodriguez@email.com'
  },
  {
    id: 6,
    name: 'Frank Wilson',
    address: '77 Cedar Court, Hillside',
    phone: '555-1006',
    email: 'frank.wilson@email.com'
  },
  {
    id: 7,
    name: 'Grace Chen',
    address: '33 Willow Way, Lakeside',
    phone: '555-1007',
    email: 'grace.chen@email.com'
  },
  {
    id: 8,
    name: 'Henry Brown',
    address: '99 Ash Boulevard, Metro Center',
    phone: '555-1008',
    email: 'henry.brown@email.com'
  },
  {
    id: 9,
    name: 'Iris Taylor',
    address: '12 Spruce Street, Valley View',
    phone: '555-1009',
    email: 'iris.taylor@email.com'
  },
  {
    id: 10,
    name: 'Jack Anderson',
    address: '55 Cypress Avenue, Riverside',
    phone: '555-1010',
    email: 'jack.anderson@email.com'
  },
  {
    id: 11,
    name: 'Kate Johnson',
    address: '21 Redwood Road, Mountain View',
    phone: '555-1011',
    email: 'kate.johnson@email.com'
  },
  {
    id: 12,
    name: 'Leo Garcia',
    address: '44 Sequoia Street, Ocean Park',
    phone: '555-1012',
    email: 'leo.garcia@email.com'
  },
  {
    id: 13,
    name: 'Maria Santos',
    address: '66 Palm Drive, Sunset District',
    phone: '555-1013',
    email: 'maria.santos@email.com'
  },
  {
    id: 14,
    name: 'Nathan Lee',
    address: '8 Magnolia Lane, Forest Hills',
    phone: '555-1014',
    email: 'nathan.lee@email.com'
  },
  {
    id: 15,
    name: 'Olivia White',
    address: '90 Poplar Place, Green Valley',
    phone: '555-1015',
    email: 'olivia.white@email.com'
  }
]

export const mockJobs: Job[] = [
  // Company 1 - TechFibre Solutions
  {
    id: 1,
    companyId: 1,
    customerId: 1,
    status: 'New',
    createdAt: new Date('2025-01-05')
  },
  {
    id: 2,
    companyId: 1,
    customerId: 2,
    status: 'Assigned',
    assignedInstallerId: 4,
    supervisorId: 2,
    createdAt: new Date('2025-01-08')
  },
  {
    id: 3,
    companyId: 1,
    customerId: 3,
    status: 'Scheduled',
    assignedInstallerId: 4,
    supervisorId: 2,
    scheduledDate: new Date('2025-01-20'),
    createdAt: new Date('2025-01-10')
  },
  {
    id: 4,
    companyId: 1,
    customerId: 4,
    status: 'Installation in Progress',
    assignedInstallerId: 5,
    supervisorId: 2,
    scheduledDate: new Date('2025-01-15'),
    createdAt: new Date('2025-01-12')
  },
  {
    id: 5,
    companyId: 1,
    customerId: 5,
    status: 'Pending Activation',
    assignedInstallerId: 5,
    supervisorId: 2,
    scheduledDate: new Date('2025-01-14'),
    createdAt: new Date('2025-01-08')
  },
  {
    id: 6,
    companyId: 1,
    customerId: 6,
    status: 'Completed',
    assignedInstallerId: 4,
    supervisorId: 2,
    scheduledDate: new Date('2024-12-20'),
    completedDate: new Date('2024-12-21'),
    createdAt: new Date('2024-12-15')
  },
  {
    id: 7,
    companyId: 1,
    customerId: 7,
    status: 'Hold-Over',
    assignedInstallerId: 4,
    supervisorId: 2,
    scheduledDate: new Date('2025-01-16'),
    notes: 'Customer unavailable at scheduled time',
    createdAt: new Date('2025-01-10')
  },
  // Company 2 - ConnectNet Services
  {
    id: 8,
    companyId: 2,
    customerId: 8,
    status: 'New',
    createdAt: new Date('2025-01-06')
  },
  {
    id: 9,
    companyId: 2,
    customerId: 9,
    status: 'Assigned',
    assignedInstallerId: 6,
    supervisorId: 3,
    createdAt: new Date('2025-01-09')
  },
  {
    id: 10,
    companyId: 2,
    customerId: 10,
    status: 'Scheduled',
    assignedInstallerId: 6,
    supervisorId: 3,
    scheduledDate: new Date('2025-01-22'),
    createdAt: new Date('2025-01-11')
  },
  {
    id: 11,
    companyId: 2,
    customerId: 11,
    status: 'Installation in Progress',
    assignedInstallerId: 7,
    supervisorId: 3,
    scheduledDate: new Date('2025-01-16'),
    createdAt: new Date('2025-01-13')
  },
  {
    id: 12,
    companyId: 2,
    customerId: 12,
    status: 'Pending Activation',
    assignedInstallerId: 7,
    supervisorId: 3,
    scheduledDate: new Date('2025-01-15'),
    createdAt: new Date('2025-01-09')
  },
  {
    id: 13,
    companyId: 2,
    customerId: 13,
    status: 'Completed',
    assignedInstallerId: 6,
    supervisorId: 3,
    scheduledDate: new Date('2024-12-22'),
    completedDate: new Date('2024-12-23'),
    createdAt: new Date('2024-12-18')
  },
  {
    id: 14,
    companyId: 2,
    customerId: 14,
    status: 'Hold-Over',
    assignedInstallerId: 7,
    supervisorId: 3,
    scheduledDate: new Date('2025-01-17'),
    notes: 'Equipment malfunction during installation',
    createdAt: new Date('2025-01-11')
  },
  // Company 3 - FibreLink Corp (unassigned jobs)
  {
    id: 15,
    companyId: 3,
    customerId: 15,
    status: 'New',
    createdAt: new Date('2025-01-07')
  }
]

export const mockInstallations: Installation[] = [
  // Installation for Job 4 (In Progress - Step 1 complete)
  {
    id: 1,
    jobId: 4,
    installerId: 5,
    startedAt: new Date('2025-01-15T09:00:00'),
    step1Complete: true,
    step1Photos: ['photo_job4_step1_1.jpg', 'photo_job4_step1_2.jpg'],
    step1CompletedAt: new Date('2025-01-15T10:30:00'),
    step2Complete: false,
    step2Photos: [],
    step3Complete: false
  },
  // Installation for Job 5 (Pending Activation - all steps complete)
  {
    id: 2,
    jobId: 5,
    installerId: 5,
    startedAt: new Date('2025-01-14T08:00:00'),
    completedAt: new Date('2025-01-14T12:00:00'),
    step1Complete: true,
    step1Photos: ['photo_job5_step1_1.jpg', 'photo_job5_step1_2.jpg'],
    step1CompletedAt: new Date('2025-01-14T09:30:00'),
    step2Complete: true,
    step2Photos: ['photo_job5_step2_1.jpg', 'photo_job5_step2_2.jpg'],
    step2CompletedAt: new Date('2025-01-14T11:00:00'),
    step3Complete: true,
    step3CompletedAt: new Date('2025-01-14T11:45:00')
  },
  // Installation for Job 6 (Completed)
  {
    id: 3,
    jobId: 6,
    installerId: 4,
    startedAt: new Date('2024-12-20T08:00:00'),
    completedAt: new Date('2024-12-20T13:00:00'),
    step1Complete: true,
    step1Photos: ['photo_job6_step1_1.jpg', 'photo_job6_step1_2.jpg'],
    step1CompletedAt: new Date('2024-12-20T10:00:00'),
    step2Complete: true,
    step2Photos: ['photo_job6_step2_1.jpg', 'photo_job6_step2_2.jpg'],
    step2CompletedAt: new Date('2024-12-20T11:30:00'),
    step3Complete: true,
    step3CompletedAt: new Date('2024-12-20T12:30:00')
  },
  // Installation for Job 11 (In Progress - Steps 1 and 2 complete)
  {
    id: 4,
    jobId: 11,
    installerId: 7,
    startedAt: new Date('2025-01-16T09:00:00'),
    step1Complete: true,
    step1Photos: ['photo_job11_step1_1.jpg', 'photo_job11_step1_2.jpg'],
    step1CompletedAt: new Date('2025-01-16T10:30:00'),
    step2Complete: true,
    step2Photos: ['photo_job11_step2_1.jpg', 'photo_job11_step2_2.jpg'],
    step2CompletedAt: new Date('2025-01-16T11:45:00'),
    step3Complete: false
  },
  // Installation for Job 12 (Pending Activation)
  {
    id: 5,
    jobId: 12,
    installerId: 7,
    startedAt: new Date('2025-01-15T08:00:00'),
    completedAt: new Date('2025-01-15T12:30:00'),
    step1Complete: true,
    step1Photos: ['photo_job12_step1_1.jpg', 'photo_job12_step1_2.jpg'],
    step1CompletedAt: new Date('2025-01-15T09:30:00'),
    step2Complete: true,
    step2Photos: ['photo_job12_step2_1.jpg', 'photo_job12_step2_2.jpg'],
    step2CompletedAt: new Date('2025-01-15T11:00:00'),
    step3Complete: true,
    step3CompletedAt: new Date('2025-01-15T12:15:00')
  },
  // Installation for Job 13 (Completed)
  {
    id: 6,
    jobId: 13,
    installerId: 6,
    startedAt: new Date('2024-12-22T08:00:00'),
    completedAt: new Date('2024-12-22T13:30:00'),
    step1Complete: true,
    step1Photos: ['photo_job13_step1_1.jpg', 'photo_job13_step1_2.jpg'],
    step1CompletedAt: new Date('2024-12-22T10:00:00'),
    step2Complete: true,
    step2Photos: ['photo_job13_step2_1.jpg', 'photo_job13_step2_2.jpg'],
    step2CompletedAt: new Date('2024-12-22T11:30:00'),
    step3Complete: true,
    step3CompletedAt: new Date('2024-12-22T13:00:00')
  }
]

// Helper functions to get next IDs
export function getNextUserId(): number {
  return Math.max(...mockUsers.map(u => u.id), 0) + 1
}

export function getNextJobId(): number {
  return Math.max(...mockJobs.map(j => j.id), 0) + 1
}

export function getNextInstallationId(): number {
  return Math.max(...mockInstallations.map(i => i.id), 0) + 1
}
