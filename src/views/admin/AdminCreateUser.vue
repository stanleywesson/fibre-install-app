<template>
  <div>
    <AppMenu />
    <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Create New User</h1>

        <div class="bg-white shadow sm:rounded-lg p-6">
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Role</label>
                <select
                  v-model="formData.role"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Role</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Installer">Installer</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Username</label>
                <input
                  v-model="formData.username"
                  type="text"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Password</label>
                <input
                  v-model="formData.password"
                  type="password"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div v-if="formData.role === 'Supervisor'">
                <label class="block text-sm font-medium text-gray-700">Company</label>
                <select
                  v-model="formData.companyId"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Company</option>
                  <option v-for="company in companiesStore.companies" :key="company.id" :value="company.id">
                    {{ company.name }}
                  </option>
                </select>
              </div>

              <div v-if="formData.role === 'Installer'">
                <label class="block text-sm font-medium text-gray-700">Supervisor</label>
                <select
                  v-model="formData.supervisorId"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Supervisor</option>
                  <option v-for="supervisor in supervisors" :key="supervisor.id" :value="supervisor.id">
                    {{ supervisor.name }}
                  </option>
                </select>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="router.back()"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppMenu from '@/components/AppMenu.vue'
import { useUsersStore } from '@/stores/users'
import { useCompaniesStore } from '@/stores/companies'
import { useToast } from 'vue-toastification'
import type { UserRole } from '@/types'

const router = useRouter()
const usersStore = useUsersStore()
const companiesStore = useCompaniesStore()
const toast = useToast()

const formData = ref({
  role: '' as UserRole | '',
  name: '',
  username: '',
  password: '',
  email: '',
  companyId: undefined as number | undefined,
  supervisorId: undefined as number | undefined
})

const supervisors = computed(() => {
  return usersStore.users.filter(u => u.role === 'Supervisor')
})

async function handleSubmit() {
  const userData: any = {
    role: formData.value.role,
    name: formData.value.name,
    username: formData.value.username,
    password: formData.value.password,
    email: formData.value.email || undefined
  }

  if (formData.value.role === 'Supervisor' && formData.value.companyId) {
    userData.companyId = formData.value.companyId
  }

  if (formData.value.role === 'Installer' && formData.value.supervisorId) {
    userData.supervisorId = formData.value.supervisorId
  }

  const result = await usersStore.addUser(userData)

  if (result) {
    toast.success('User created successfully!')
    router.push('/admin/users')
  } else {
    toast.error(usersStore.error || 'Failed to create user')
  }
}

onMounted(async () => {
  await Promise.all([
    usersStore.fetchUsers(),
    companiesStore.fetchCompanies()
  ])
})
</script>
