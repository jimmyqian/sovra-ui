/**
 * Unit tests for the search store
 * Tests search functionality, state management, and actions
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSearchStore } from '../search'
import type { SearchResult } from '@/types/search'

describe('Search Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useSearchStore()

      expect(store.currentQuery).toBe('')
      expect(store.searchHistory).toEqual([])
      expect(store.results).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.pagination).toEqual({
        currentPage: 1,
        pageSize: 20,
        totalResults: 0,
        hasMore: false
      })
    })

    it('should have correct initial computed values', () => {
      const store = useSearchStore()

      expect(store.hasResults).toBe(false)
      expect(store.hasSearched).toBe(false)
      expect(store.recentSearches).toEqual([])
    })
  })

  describe('Query Management', () => {
    it('should set query correctly', () => {
      const store = useSearchStore()
      const query = 'test query'

      store.setQuery(query)

      expect(store.currentQuery).toBe(query)
      expect(store.hasSearched).toBe(true)
    })

    it('should add queries to history', () => {
      const store = useSearchStore()
      const queries = ['query 1', 'query 2', 'query 3']

      queries.forEach(query => store.addToHistory(query))

      expect(store.searchHistory).toEqual(queries)
    })

    it('should not add duplicate queries to history', () => {
      const store = useSearchStore()
      const query = 'duplicate query'

      store.addToHistory(query)
      store.addToHistory(query)

      expect(store.searchHistory).toEqual([query])
    })

    it('should not add empty queries to history', () => {
      const store = useSearchStore()

      store.addToHistory('')
      store.addToHistory('   ')

      expect(store.searchHistory).toEqual([])
    })

    it('should limit search history to 50 items', () => {
      const store = useSearchStore()
      const queries = Array.from({ length: 60 }, (_, i) => `query ${i}`)

      queries.forEach(query => store.addToHistory(query))

      expect(store.searchHistory).toHaveLength(50)
      expect(store.searchHistory).toEqual(queries.slice(-50))
    })

    it('should return recent searches in reverse order', () => {
      const store = useSearchStore()
      const queries = ['oldest', 'middle', 'newest']

      queries.forEach(query => store.addToHistory(query))

      expect(store.recentSearches).toEqual(['newest', 'middle', 'oldest'])
    })

    it('should limit recent searches to 5 items', () => {
      const store = useSearchStore()
      const queries = Array.from({ length: 10 }, (_, i) => `query ${i}`)

      queries.forEach(query => store.addToHistory(query))

      expect(store.recentSearches).toHaveLength(5)
    })
  })

  describe('Loading State Management', () => {
    it('should set loading state', () => {
      const store = useSearchStore()

      store.setLoading(true)
      expect(store.isLoading).toBe(true)

      store.setLoading(false)
      expect(store.isLoading).toBe(false)
    })
  })

  describe('Error Management', () => {
    it('should set error message', () => {
      const store = useSearchStore()
      const errorMessage = 'Something went wrong'

      store.setError(errorMessage)

      expect(store.error).toBe(errorMessage)
    })

    it('should clear error message', () => {
      const store = useSearchStore()

      store.setError('error')
      store.setError(null)

      expect(store.error).toBe(null)
    })
  })

  describe('Results Management', () => {
    const mockResults: SearchResult[] = [
      {
        id: 1,
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        maritalStatus: 'Single',
        location: 'New York',
        rating: 4.5,
        references: 10,
        companies: 3,
        contacts: 25
      },
      {
        id: 2,
        name: 'Jane Smith',
        age: 28,
        gender: 'Female',
        maritalStatus: 'Married',
        location: 'Los Angeles',
        rating: 4.2,
        references: 8,
        companies: 2,
        contacts: 18
      }
    ]

    it('should set results', () => {
      const store = useSearchStore()

      store.setResults(mockResults)

      expect(store.results).toEqual(mockResults)
      expect(store.hasResults).toBe(true)
      expect(store.error).toBe(null)
    })

    it('should append results', () => {
      const store = useSearchStore()
      const initialResults = [mockResults[0]]
      const newResults = [mockResults[1]]

      store.setResults(initialResults)
      store.appendResults(newResults)

      expect(store.results).toEqual(mockResults)
    })

    it('should clear results', () => {
      const store = useSearchStore()

      store.setResults(mockResults)
      store.clearResults()

      expect(store.results).toEqual([])
      expect(store.hasResults).toBe(false)
      expect(store.error).toBe(null)
    })
  })

  describe('Pagination Management', () => {
    it('should update pagination', () => {
      const store = useSearchStore()
      const updates = {
        currentPage: 2,
        totalResults: 100,
        hasMore: true
      }

      store.updatePagination(updates)

      expect(store.pagination.currentPage).toBe(2)
      expect(store.pagination.totalResults).toBe(100)
      expect(store.pagination.hasMore).toBe(true)
      expect(store.pagination.pageSize).toBe(20) // Should preserve existing values
    })

    it('should reset pagination', () => {
      const store = useSearchStore()

      store.updatePagination({ currentPage: 3, totalResults: 150 })
      store.resetPagination()

      expect(store.pagination).toEqual({
        currentPage: 1,
        pageSize: 20,
        totalResults: 0,
        hasMore: false
      })
    })
  })

  describe('Search Actions', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should perform search with new query', async () => {
      const store = useSearchStore()
      const query = 'test search'

      const searchPromise = store.performSearch(query)

      expect(store.isLoading).toBe(true)
      expect(store.currentQuery).toBe(query)
      expect(store.searchHistory).toContain(query)

      // Fast-forward timers to complete the mock API call
      await vi.runAllTimersAsync()
      await searchPromise

      expect(store.isLoading).toBe(false)
      expect(store.results).toHaveLength(20) // pageSize
      expect(store.error).toBe(null)
      expect(store.pagination.currentPage).toBe(1)
    })

    it('should handle empty search query', async () => {
      const store = useSearchStore()

      await store.performSearch('')

      expect(store.results).toEqual([])
      expect(store.isLoading).toBe(false)
    })

    it('should load more results', async () => {
      const store = useSearchStore()

      // Initial search
      const searchPromise = store.performSearch('test')
      await vi.runAllTimersAsync()
      await searchPromise

      expect(store.results).toHaveLength(20)

      // Load more
      store.updatePagination({ hasMore: true })
      const loadMorePromise = store.loadMoreResults()
      await vi.runAllTimersAsync()
      await loadMorePromise

      expect(store.results).toHaveLength(40)
      expect(store.pagination.currentPage).toBe(2)
    })

    it('should not load more when hasMore is false', async () => {
      const store = useSearchStore()

      store.updatePagination({ hasMore: false })
      await store.loadMoreResults()

      expect(store.results).toHaveLength(0)
    })

    it('should not load more when already loading', async () => {
      const store = useSearchStore()

      store.setLoading(true)
      store.updatePagination({ hasMore: true })
      await store.loadMoreResults()

      expect(store.results).toHaveLength(0)
    })

    it('should handle search errors', async () => {
      const store = useSearchStore()
      const query = 'error test'

      // Mock a failed API call by overriding the promise
      vi.spyOn(global, 'setTimeout').mockImplementation(callback => {
        // Simulate an error during the API call
        callback()
        throw new Error('API Error')
      })

      try {
        await store.performSearch(query)
      } catch {
        // Expected to throw
      }

      expect(store.error).toBe('API Error')
      expect(store.isLoading).toBe(false)
    })
  })

  describe('History Management', () => {
    it('should clear search history', () => {
      const store = useSearchStore()

      store.addToHistory('query 1')
      store.addToHistory('query 2')
      store.clearHistory()

      expect(store.searchHistory).toEqual([])
    })
  })
})
