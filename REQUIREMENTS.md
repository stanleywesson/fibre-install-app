# Fibre Install App - Requirements

## Project Overview
**Name:** Fibre Install App
**Type:** Progressive Web App (PWA)
**Status:** POC (Proof of Concept)
**Based on:** Standesk architecture

## Technology Stack
- **Vue 3** - JavaScript framework (Composition API)
- **TypeScript** - Type safety
- **Vite 7** - Build tool and dev server
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vue Toastification** - Toast notifications
- **Vitest** - Unit testing framework
- **PWA Plugin** - Progressive Web App support

## Features

### 1. Authentication & Authorization

#### Login System
- User login with username/password
- Session management with persistence (localStorage/sessionStorage)
- Role-based access control (RBAC)
- Protected routes based on user role

#### User Roles

**Admin**
- Can create new Installers
- Can create new Supervisors
- Can assign Installers to Supervisors
- Full system access

**Supervisor**
- Belongs to a specific Company
- Can view all jobs for their Company
- **ONLY role** that can assign jobs to Installers
- Can view all Installers under their supervision

**Installer**
- Can view jobs assigned to them
- Can schedule appointments with customers
- Can initiate/start a fibre installation
- Can save completed installations to activation list

### 2. User Management (Admin Only)
- Create new Installers with credentials
- Create new Supervisors with credentials and company assignment
- Assign/unassign Installers to Supervisors
- View all users in the system

### 3. Job Management

**IMPORTANT:** Jobs, Companies, and Customers are **pre-created** in the mock data. They come from external systems (ordering system). This POC does NOT include UI to create Jobs, Companies, or Customers.

**For Supervisors:**
- View all jobs for their company
- Assign unassigned jobs to Installers under their supervision
- View job status and progress
- **Reassign jobs if needed** (can ONLY reassign to Installers under their supervision)
- **Move jobs OUT of "Hold-Over" status** (only Supervisors can do this - job returns to "Assigned")
- View all jobs in "Pending Activation" status for their company

**For Installers:**
- View only jobs assigned to them
- Schedule customer appointments
- Perform 3-step installation process
- **Manually flag jobs as "Hold-Over"** when issues occur
- View their own jobs in "Pending Activation" status

### 4. Installation Workflow

**High-Level Flow:**
1. Job is created (external system) and assigned to a Company → Status: **New**
2. Supervisor assigns job to an Installer → Status: **Assigned**
3. Installer schedules appointment with customer → Status: **Scheduled**
4. Installer starts installation → Status: **Installation in Progress**
5. Installer completes 3-step installation process → Status: **Pending Activation**
6. External cron job processes activation → Status: **Completed** (automatic)

**Hold-Over Status:**
- Can occur from ANY status (Assigned, Scheduled, Installation in Progress)
- Triggered when issues occur: customer unavailable, equipment broken, scheduling conflicts, activation queue failure, etc.
- Installer can manually flag as "Hold-Over" from any step
- Step 3 (Activate) can fail programmatically and auto-set to "Hold-Over"
- **Only Supervisors** can move jobs OUT of "Hold-Over" status
- **When resolved:** Job returns to "Assigned" status and goes back to the same Installer it was originally assigned to

### 5. 3-Step Installation Process

When a job is in "Installation in Progress" status, the Installer must complete 3 sequential steps:

**Step 1: Install Equipment**
- Physical installation of fibre equipment
- **Photos Required:** Installer takes photos (up to 10, typically 2 per device)
- For POC: "Take Photo" button with toast notification (simulated)
- In production: Real photo upload with camera integration
- Installer can save progress and resume later
- Timestamps when step is completed

**Step 2: Scan Serial Number**
- Scan serial numbers of installed equipment
- **Photos Required:** Photos of serial number labels (up to 10, typically 2 devices)
- For POC: "Take Photo" button with toast notification (simulated)
- In production: Barcode/QR scanner integration + photo capture
- Must complete Step 1 before accessing Step 2 (sequential enforcement)
- Timestamps when step is completed

**Step 3: Activate**
- Final activation step - puts equipment in activation queue
- **No photos required** - just a button click
- Must complete Step 1 AND Step 2 before accessing Step 3
- On success: Job status changes to **"Pending Activation"**
- On failure: Job status changes to **"Hold-Over"** (programmatic)
- Timestamps when step is completed

**Progress Tracking:**
- Installation progress is saved to the Installation model
- Installer can exit mid-process and resume where they left off
- UI shows visual progress: Step 1 ✓, Step 2 ✓, Step 3 (in progress)
- Each step tracks: completion status, photos, timestamps

## Data Models

### User
```typescript
interface User {
  id: number
  username: string
  password: string // In mock, stored as plain text (not production-ready)
  role: 'Admin' | 'Supervisor' | 'Installer'
  name: string
  email?: string
  supervisorId?: number // For Installers - which Supervisor they belong to (ONE supervisor at a time)
  companyId?: number // For Supervisors - which Company they belong to (ONE company only)
  createdAt: Date
}
```

**User Relationships:**
- **Supervisor** belongs to ONE company only
- **Installer** belongs to ONE supervisor at a time
- **Admin** can reassign Installers to different Supervisors at any time

### Company
```typescript
interface Company {
  id: number
  name: string
  address?: string
  contactPerson?: string
  contactPhone?: string
}
```

### Job
```typescript
interface Job {
  id: number
  companyId: number
  customerId: number
  status: 'New' | 'Assigned' | 'Scheduled' | 'Installation in Progress' | 'Pending Activation' | 'Completed' | 'Hold-Over'
  assignedInstallerId?: number // Installer assigned to this job
  supervisorId?: number // Supervisor who manages this job (optional until assigned)
  scheduledDate?: Date
  completedDate?: Date
  notes?: string
  createdAt: Date
}
```

**Job Status Flow:**
- **New** - Job created, not yet assigned to an Installer
- **Assigned** - Supervisor assigned job to an Installer
- **Scheduled** - Installer scheduled appointment with customer
- **Installation in Progress** - Installer started the 3-step installation process
- **Pending Activation** - Installation complete, waiting for external cron job to activate
- **Completed** - Activation processed by external system (automatic)
- **Hold-Over** - Issue occurred, requires Supervisor intervention to resolve

### Customer
```typescript
interface Customer {
  id: number
  name: string
  address: string
  phone: string
  email?: string
}
```

### Installation
```typescript
interface Installation {
  id: number
  jobId: number
  installerId: number
  startedAt: Date
  completedAt?: Date

  // Step 1: Install Equipment
  step1Complete: boolean
  step1Photos: string[]  // Array of photo URLs/filenames (max 10, typically 2)
  step1CompletedAt?: Date

  // Step 2: Scan Serial Number
  step2Complete: boolean
  step2Photos: string[]  // Array of photo URLs/filenames (max 10, typically 2)
  step2CompletedAt?: Date

  // Step 3: Activate
  step3Complete: boolean
  step3CompletedAt?: Date

  notes?: string
}
```

**Installation Progress Tracking:**
- Each step tracks completion status, photos (where required), and completion timestamp
- Steps must be completed sequentially: Step 1 → Step 2 → Step 3
- Installer can save progress mid-way and resume later
- When all 3 steps are complete, Job status changes to "Pending Activation"

## User Interface Components

### Core Components
- **LoginForm.vue** - Username/password login form
- **AppMenu.vue** - Responsive navigation (role-based menu items)
- **AppModal.vue** - Reusable modal wrapper

### Admin Components
- **UserManager.vue** - Create and manage users
- **CreateUserForm.vue** - Form to create Installer/Supervisor
- **AssignInstallerForm.vue** - Assign Installers to Supervisors

### Supervisor Components
- **JobList.vue** - View all company jobs with filters (all, new, assigned, scheduled, in progress, pending activation, hold-over)
- **AssignJobForm.vue** - Assign job to an Installer (dropdown of Installers under supervision)
- **ResolveHoldOver.vue** - Move job OUT of Hold-Over status (only Supervisors can do this)
- **InstallerList.vue** - View Installers under supervision
- **ActivationList.vue** - View all company jobs in "Pending Activation" status

### Installer Components
- **MyJobs.vue** - View assigned jobs with filters (all, scheduled, in progress, pending activation, hold-over)
- **ScheduleAppointment.vue** - Schedule customer appointment (date/time picker)
- **InstallationSteps.vue** - 3-step installation wizard with progress tracking
  - Step 1: Install Equipment (take photos, max 10)
  - Step 2: Scan Serial (take photos, max 10)
  - Step 3: Activate (button click)
- **HoldOverButton.vue** - Button to manually flag job as Hold-Over with reason
- **ActivationList.vue** - View own completed installations in "Pending Activation" status

### Shared Components
- **JobDetails.vue** - Display job information
- **CustomerInfo.vue** - Display customer details

## Routes

### Public Routes
- `/login` - Login page (redirect to dashboard if already logged in)

### Protected Routes (Role-based)

**Admin Routes:**
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management page
- `/admin/users/create` - Create new user
- `/admin/assignments` - Assign Installers to Supervisors

**Supervisor Routes:**
- `/supervisor/dashboard` - Supervisor dashboard
- `/supervisor/jobs` - View all company jobs
- `/supervisor/jobs/:id` - Job details and assignment
- `/supervisor/installers` - View assigned Installers

**Installer Routes:**
- `/installer/dashboard` - Installer dashboard
- `/installer/jobs` - View assigned jobs (My Jobs)
- `/installer/jobs/:id` - Job details
- `/installer/jobs/:id/schedule` - Schedule appointment
- `/installer/jobs/:id/install` - Installation form
- `/installer/activations` - Activation list

**Shared Routes:**
- `/` - Redirect to role-specific dashboard
- `/unauthorized` - 403 page for unauthorized access
- `/*` - 404 page for not found

## Dashboard Requirements

Each role has a dedicated dashboard displaying key metrics and job counts.

### Admin Dashboard
**Job Counts (All Jobs in System):**
- Total Active Jobs (not completed): Count
- Total Completed Jobs: Count
- Total Hold-Over Jobs: Count

**Date Filter:**
- Default: Current month jobs only
- Should include date range picker to filter by custom date range

**Additional Info:**
- Total number of Companies
- Total number of Supervisors
- Total number of Installers

### Supervisor Dashboard
**Job Counts (Company Jobs Only):**
- Active Jobs for my company (not completed): Count
- Completed Jobs for my company: Count
- Hold-Over Jobs for my company: Count

**Date Filter:**
- Default: Current month jobs only
- Should include date range picker to filter by custom date range

**Additional Info:**
- My Company name
- Number of Installers under my supervision
- Quick links to "Assign Jobs" and "View All Jobs"

### Installer Dashboard
**Job Counts (My Assigned Jobs Only):**
- My Active Jobs (not completed): Count
- My Completed Jobs: Count
- My Hold-Over Jobs: Count

**Date Filter:**
- Default: Current month jobs only
- Should include date range picker to filter by custom date range

**Additional Info:**
- Jobs scheduled for today
- Jobs with pending appointments (need scheduling)
- Quick links to "My Jobs" and "Pending Activations"

## Additional Notes

### Mock Authentication Implementation
- Mock API will store predefined users with roles
- Login will validate credentials and return user object with JWT-like token (simulated)
- Router guards will check authentication and role before allowing route access
- LocalStorage will persist authentication token

### Initial Mock Data
The mock API should include:
- 1 Admin user (username: admin, password: admin123)
- 2-3 Companies (pre-created, from external ordering system)
- 2-3 Supervisors (each assigned to a company)
- 4-6 Installers (assigned to different supervisors)
- 10-15 sample Jobs in various states (New, Assigned, Scheduled, Installation in Progress, Pending Activation, Completed, Hold-Over)
- 10-15 sample Customers (pre-created, from external ordering system)
- Some sample Installation records with partial progress (e.g., Step 1 complete, Step 2 in progress)

### Role-Based Menu Items
- Admin: User Management, Assignments
- Supervisor: Jobs, My Installers
- Installer: My Jobs, Activation List

### Session Management
- Login persists across browser refresh
- Logout clears session and redirects to login
- Automatic logout after token expiration (optional for POC)

### External System Integration
- **Jobs, Companies, Customers** are created by an external ordering system
- This app and the external system **share a database** (simulated with mock data in POC)
- **Activation Processing:** An external cron job monitors jobs in "Pending Activation" status and automatically processes them
- When activation is successful, the external system updates Job status to "Completed"
- This POC simulates this by having pre-created data; in production, the app reads from shared database

### Photo Handling in POC
- **POC Implementation:** "Take Photo" button displays toast notification "Photo taken successfully"
- Photos are simulated as string array entries (e.g., `["photo_1.jpg", "photo_2.jpg"]`)
- Maximum 10 photos per step, typically 2 photos (one per device)
- **Production Implementation:** Real camera integration, file upload to cloud storage, thumbnail previews

### Future Enhancements (Out of Scope for POC)
- Real backend API integration with shared database
- Password encryption (bcrypt/Argon2)
- Email notifications for job assignments
- SMS notifications for appointments
- Real-time updates with WebSockets
- Real photo uploads with camera integration
- Digital signatures for customer sign-off
- Geolocation tracking for installer location
- Offline mode support with sync when online
- Audit logs for all actions
- Reporting dashboard with charts/metrics
