/**
 * Search store for managing search queries, results, and state
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

  // Getters
  const hasResults = computed(() => results.value.length > 0)
  const hasSearched = computed(() => currentQuery.value.length > 0)
  const recentSearches = computed(() => searchHistory.value.slice(-5).reverse())

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
    if (!query.trim()) {
      clearResults()
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (!loadMore) {
        setQuery(query)
        resetPagination()
        clearResults()
        addToHistory(query)
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

      // Mock results - replace with actual API call
      const mockResults: SearchResult[] = Array.from(
        { length: pagination.value.pageSize },
        (_, i) => ({
          id:
            (pagination.value.currentPage - 1) * pagination.value.pageSize +
            i +
            1,
          name: `Johnson Smith ${i + 1}"`,
          age: Math.floor(Math.random() * 50) + 20,
          location: 'Mock Location',
          rating: Math.random() * 5,
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

      updatePagination({
        currentPage: loadMore ? pagination.value.currentPage + 1 : 1,
        totalResults: 100, // Mock total
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
    clearHistory
  }
})
