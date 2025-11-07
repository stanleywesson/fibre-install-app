import { ref, computed } from 'vue'

/**
 * Generic filters composable - Reusable filtering logic
 *
 * @example
 * const { activeFilter, setFilter, filteredItems } = useFilters(
 *   jobs,
 *   'all',
 *   (job, filter) => filter === 'all' || job.status === filter
 * )
 */
export function useFilters<T, F extends string = string>(
  items: () => T[],
  initialFilter: F,
  filterFn: (item: T, filter: F) => boolean
) {
  const activeFilter = ref<F>(initialFilter)

  const filteredItems = computed(() => {
    return items().filter(item => filterFn(item, activeFilter.value))
  })

  const setFilter = (filter: F) => {
    activeFilter.value = filter
  }

  const getCount = (filter: F) => {
    return items().filter(item => filterFn(item, filter)).length
  }

  return {
    activeFilter,
    filteredItems,
    setFilter,
    getCount
  }
}

/**
 * Date range filter composable
 *
 * @example
 * const { startDate, endDate, setDateRange, clearDateRange, isInDateRange } = useDateRangeFilter()
 */
export function useDateRangeFilter() {
  const startDate = ref<Date | null>(null)
  const endDate = ref<Date | null>(null)

  const setDateRange = (start: Date | null, end: Date | null) => {
    startDate.value = start
    endDate.value = end
  }

  const clearDateRange = () => {
    startDate.value = null
    endDate.value = null
  }

  const isInDateRange = (date: Date | undefined) => {
    if (!date) return false
    if (!startDate.value && !endDate.value) return true

    const itemDate = new Date(date)

    if (startDate.value && itemDate < startDate.value) return false
    if (endDate.value && itemDate > endDate.value) return false

    return true
  }

  const hasDateRange = computed(() => {
    return startDate.value !== null || endDate.value !== null
  })

  return {
    startDate,
    endDate,
    setDateRange,
    clearDateRange,
    isInDateRange,
    hasDateRange
  }
}

/**
 * Search filter composable
 *
 * @example
 * const { searchQuery, setSearchQuery, searchResults } = useSearch(
 *   users,
 *   (user, query) => user.name.toLowerCase().includes(query.toLowerCase())
 * )
 */
export function useSearch<T>(
  items: () => T[],
  searchFn: (item: T, query: string) => boolean
) {
  const searchQuery = ref('')

  const searchResults = computed(() => {
    if (!searchQuery.value.trim()) {
      return items()
    }
    return items().filter(item => searchFn(item, searchQuery.value))
  })

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const clearSearch = () => {
    searchQuery.value = ''
  }

  return {
    searchQuery,
    searchResults,
    setSearchQuery,
    clearSearch
  }
}
