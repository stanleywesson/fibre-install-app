import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Customer } from '@/types'
import { getCustomers, getCustomerById } from '@/api/mockApi'

export const useCustomersStore = defineStore('customers', () => {
  // State
  const customers = ref<Customer[]>([])
  const currentCustomer = ref<Customer | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchCustomers() {
    loading.value = true
    error.value = null

    try {
      const response = await getCustomers()

      if (response.success && response.data) {
        customers.value = response.data
        return true
      } else {
        error.value = response.message || 'Failed to fetch customers'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while fetching customers'
      console.error('Fetch customers error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomerById(id: number) {
    loading.value = true
    error.value = null

    try {
      const response = await getCustomerById(id)

      if (response.success && response.data) {
        currentCustomer.value = response.data
        return true
      } else {
        error.value = response.message || 'Failed to fetch customer'
        return false
      }
    } catch (err) {
      error.value = 'An error occurred while fetching customer'
      console.error('Fetch customer error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  function getCustomerById_sync(id: number) {
    return customers.value.find(c => c.id === id) || null
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    customers,
    currentCustomer,
    loading,
    error,
    // Actions
    fetchCustomers,
    fetchCustomerById,
    getCustomerById_sync,
    clearError
  }
})
