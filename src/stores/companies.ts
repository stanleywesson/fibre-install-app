import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Company } from '@/types'
import { getCompanies, getCompanyById } from '@/api/mockApi'

export const useCompaniesStore = defineStore('companies', () => {
  // State
  const companies = ref<Company[]>([])
  const currentCompany = ref<Company | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchCompanies() {
    loading.value = true
    error.value = null

    try {
      const response = await getCompanies()

      if (response.success && response.data) {
        companies.value = response.data
        return true
      } else {
        error.value = response.message || 'Failed to fetch companies'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while fetching companies'
      console.error('Fetch companies error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchCompanyById(id: number) {
    loading.value = true
    error.value = null

    try {
      const response = await getCompanyById(id)

      if (response.success && response.data) {
        currentCompany.value = response.data
        return true
      } else {
        error.value = response.message || 'Failed to fetch company'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while fetching company'
      console.error('Fetch company error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  function getCompanyById_sync(id: number) {
    return companies.value.find(c => c.id === id) || null
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    companies,
    currentCompany,
    loading,
    error,
    // Actions
    fetchCompanies,
    fetchCompanyById,
    getCompanyById_sync,
    clearError
  }
})
