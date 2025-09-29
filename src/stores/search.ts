/**
 * Search store for managing search queries, results, and state
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { escapeHtml } from '@/utils/sanitize'
import type { SearchResult } from '@/types/search'

export interface SearchState {
  currentQuery: string
  searchHistory: string[]
  results: SearchResult[]
  isLoading: boolean
  error: string | null
  pagination: {
    currentPage: number
    pageSize: number
    totalResults: number
    hasMore: boolean
  }
}

export const useSearchStore = defineStore('search', () => {
  // State
  const currentQuery = ref<string>('')
  const searchHistory = ref<string[]>([])
  const results = ref<SearchResult[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    currentPage: 1,
    pageSize: 20,
    totalResults: 0,
    hasMore: false
  })
  const lastTotalResults = ref<number>(0)

  // Getters
  const hasResults = computed(() => results.value.length > 0)
  const hasSearched = computed(() => currentQuery.value.length > 0)
  const recentSearches = computed(() => searchHistory.value.slice(-5).reverse())

  // Get totalResults for display, avoiding 0 during loading states
  const displayTotalResults = computed(() => {
    const currentTotalResults = pagination.value.totalResults
    const loading = isLoading.value

    // If we have valid results, show them
    if (currentTotalResults > 0) {
      return currentTotalResults
    }

    // If loading and we have a previous valid count, show that instead of 0
    if (loading && lastTotalResults.value > 0) {
      return lastTotalResults.value
    }

    // Otherwise show the current value (which could be 0 for no results)
    return currentTotalResults
  })

  // Actions
  const setQuery = (query: string) => {
    currentQuery.value = query
  }

  const addToHistory = (query: string) => {
    if (query.trim() && !searchHistory.value.includes(query.trim())) {
      searchHistory.value.push(query.trim())
      // Keep only last 50 searches
      if (searchHistory.value.length > 50) {
        searchHistory.value = searchHistory.value.slice(-50)
      }
    }
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const setResults = (newResults: SearchResult[]) => {
    results.value = newResults
    error.value = null
  }

  const appendResults = (newResults: SearchResult[]) => {
    results.value.push(...newResults)
  }

  const clearResults = () => {
    results.value = []
    error.value = null
  }

  const updatePagination = (updates: Partial<typeof pagination.value>) => {
    pagination.value = { ...pagination.value, ...updates }
    // Save valid totalResults for loading state display
    if (updates.totalResults && updates.totalResults > 0) {
      lastTotalResults.value = updates.totalResults
    }
  }

  const resetPagination = () => {
    pagination.value = {
      currentPage: 1,
      pageSize: 20,
      totalResults: 0,
      hasMore: false
    }
  }

  const performSearch = async (query: string, loadMore = false) => {
    // Sanitize and validate input
    const sanitizedQuery = escapeHtml(query.trim())

    if (!sanitizedQuery) {
      clearResults()
      return
    }

    // Security: Limit query length to prevent DoS attacks
    if (sanitizedQuery.length > 500) {
      setError('Search query too long. Please use fewer than 500 characters.')
      return
    }

    // Security: Basic validation to prevent injection patterns
    if (
      sanitizedQuery.includes('<script') ||
      sanitizedQuery.includes('javascript:')
    ) {
      setError('Invalid search query detected.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (!loadMore) {
        setQuery(sanitizedQuery)
        // Reset pagination but preserve hasMore to avoid button flickering
        const currentHasMore = pagination.value.hasMore
        resetPagination()
        // Restore hasMore state temporarily until new results arrive
        pagination.value.hasMore = currentHasMore
        // Don't clear results immediately - keep them visible until new results are ready
        addToHistory(sanitizedQuery)
      }

      // Simulate API call - replace with actual search service
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (query === 'error test') {
            reject(new Error('API Error'))
          } else {
            resolve(undefined)
          }
        }, 500)
      })

      // Generate mock search results
      let mockResults: SearchResult[] = []

      // Generate random results for the search
      mockResults = Array.from(
        { length: pagination.value.pageSize },
        (_, i) => ({
          id:
            (pagination.value.currentPage - 1) * pagination.value.pageSize +
            i +
            1,
          name: `Johnson Smith ${i + 1}`,
          age: Math.floor(Math.random() * 50) + 20,
          gender: 'Male',
          maritalStatus: ['Single', 'Married', 'Divorced'][i % 3] ?? 'Single',
          location: 'California',
          rating: Math.round(Math.random() * 5 * 10) / 10,
          references: Math.floor(Math.random() * 100),
          companies: Math.floor(Math.random() * 10),
          contacts: Math.floor(Math.random() * 50)
        })
      )

      if (loadMore) {
        appendResults(mockResults)
      } else {
        setResults(mockResults)
      }

      // Update pagination for random results
      updatePagination({
        currentPage: loadMore ? pagination.value.currentPage + 1 : 1,
        totalResults: Math.floor(Math.random() * (80 - 30 + 1)) + 30, // Random total between 30-80
        hasMore: pagination.value.currentPage < 5 // Mock has more
      })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during search'
      )
    } finally {
      setLoading(false)
    }
  }

  const loadMoreResults = async () => {
    if (pagination.value.hasMore && !isLoading.value) {
      await performSearch(currentQuery.value, true)
    }
  }

  const clearHistory = () => {
    searchHistory.value = []
  }

  const findPersonById = (id: string | number): SearchResult | null => {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id
    return results.value.find(person => person.id === numericId) ?? null
  }

  return {
    // State
    currentQuery,
    searchHistory,
    results,
    isLoading,
    error,
    pagination,

    // Getters
    hasResults,
    hasSearched,
    recentSearches,
    displayTotalResults,

    // Actions
    setQuery,
    addToHistory,
    setLoading,
    setError,
    setResults,
    appendResults,
    clearResults,
    updatePagination,
    resetPagination,
    performSearch,
    loadMoreResults,
    clearHistory,
    findPersonById
  }
})
