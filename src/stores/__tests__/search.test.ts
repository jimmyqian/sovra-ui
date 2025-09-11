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

    it('should generate random totalResults between 30-80 on search', async () => {
      const store = useSearchStore()
      const results: number[] = []

      // Perform multiple searches to test randomness
      for (let i = 0; i < 10; i++) {
        const searchPromise = store.performSearch(`test search ${i}`)
        await vi.runAllTimersAsync()
        await searchPromise
        results.push(store.pagination.totalResults)
      }

      // Check that all results are in the correct range
      results.forEach(totalResults => {
        expect(totalResults).toBeGreaterThanOrEqual(30)
        expect(totalResults).toBeLessThanOrEqual(80)
      })

      // Check that we got some variety (not all the same number)
      const uniqueResults = new Set(results)
      expect(uniqueResults.size).toBeGreaterThan(1)
    })

    it('should provide displayTotalResults that preserves values during loading', async () => {
      const store = useSearchStore()

      // Initial state - should show 0
      expect(store.displayTotalResults).toBe(0)

      // Perform first search
      const firstSearchPromise = store.performSearch('test search 1')
      await vi.runAllTimersAsync()
      await firstSearchPromise

      const firstResults = store.displayTotalResults
      expect(firstResults).toBeGreaterThanOrEqual(30)
      expect(firstResults).toBeLessThanOrEqual(80)

      // Start second search - this will reset totalResults to 0 but displayTotalResults should preserve the value
      store.performSearch('test search 2')
      
      // During loading, displayTotalResults should still show the previous valid value
      expect(store.isLoading).toBe(true)
      expect(store.pagination.totalResults).toBe(0) // This gets reset
      expect(store.displayTotalResults).toBe(firstResults) // But this preserves the previous value

      // Complete the second search
      await vi.runAllTimersAsync()
      
      // Now displayTotalResults should show the new value
      const secondResults = store.displayTotalResults
      expect(secondResults).toBeGreaterThanOrEqual(30)
      expect(secondResults).toBeLessThanOrEqual(80)
      expect(store.isLoading).toBe(false)
    })

    it('should handle displayTotalResults edge cases', async () => {
      const store = useSearchStore()

      // Test 1: displayTotalResults should show 0 when no previous results and not loading
      expect(store.displayTotalResults).toBe(0)
      expect(store.isLoading).toBe(false)

      // Test 2: displayTotalResults should show 0 when no previous results but is loading
      store.setLoading(true)
      expect(store.displayTotalResults).toBe(0) // No previous results to preserve

      // Test 3: After search with results, displayTotalResults should match totalResults
      store.setLoading(false)
      store.updatePagination({ totalResults: 45 })
      expect(store.displayTotalResults).toBe(45)

      // Test 4: updatePagination with 0 totalResults should not update lastTotalResults
      const previousDisplay = store.displayTotalResults
      store.updatePagination({ totalResults: 0 })
      expect(store.pagination.totalResults).toBe(0)
      // In non-loading state, should show the current value (0)
      expect(store.displayTotalResults).toBe(0)

      // Test 5: But if we're loading, should preserve the last valid value
      store.updatePagination({ totalResults: 67 }) // Set a valid value first
      expect(store.displayTotalResults).toBe(67)
      
      // Now simulate loading with reset
      store.setLoading(true)
      store.updatePagination({ totalResults: 0 })
      expect(store.displayTotalResults).toBe(67) // Should preserve 67, not show 0

      // Test 6: Multiple updatePagination calls should preserve the highest/latest valid value
      store.updatePagination({ totalResults: 55 }) // This should update lastTotalResults
      store.updatePagination({ totalResults: 0 })  // This shouldn't
      expect(store.displayTotalResults).toBe(55)   // Should show 55
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
