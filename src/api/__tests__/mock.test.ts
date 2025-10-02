/**
 * Unit tests for mock API service
 * Tests search functionality, file upload, and data validation
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { searchPeople, uploadFile } from '../mock'
import type { SearchResponse } from '../mock'

// Mock timers for controlling async delays
vi.useFakeTimers()

describe('Mock API Service', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.useFakeTimers()
  })

  describe('searchPeople', () => {
    it('should return search response with query', async () => {
      const query = 'Johnson Smith'
      const responsePromise = searchPeople(query)

      // Fast-forward the timer to resolve the promise
      vi.advanceTimersByTime(1000)
      const response = await responsePromise

      expect(response).toBeDefined()
      expect(response.query).toBe(query)
      expect(response.results).toBeDefined()
      expect(response.totalCount).toBeDefined()
    })

    it('should return array of search results', async () => {
      const query = 'test query'
      const responsePromise = searchPeople(query)

      vi.advanceTimersByTime(1000)
      const response = await responsePromise

      expect(Array.isArray(response.results)).toBe(true)
      expect(response.results.length).toBeGreaterThan(0)
    })

    it('should return proper SearchResponse structure', async () => {
      const query = 'search test'
      const responsePromise = searchPeople(query)

      vi.advanceTimersByTime(1000)
      const response: SearchResponse = await responsePromise

      expect(response).toHaveProperty('query')
      expect(response).toHaveProperty('results')
      expect(response).toHaveProperty('totalCount')
      expect(typeof response.query).toBe('string')
      expect(Array.isArray(response.results)).toBe(true)
      expect(typeof response.totalCount).toBe('number')
    })

    it('should return mock results with correct structure', async () => {
      const query = 'Johnson'
      const responsePromise = searchPeople(query)

      vi.advanceTimersByTime(1000)
      const response = await responsePromise

      expect(response.results.length).toBe(5)

      response.results.forEach(result => {
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('name')
        expect(result).toHaveProperty('age')
        expect(result).toHaveProperty('gender')
        expect(result).toHaveProperty('maritalStatus')
        expect(result).toHaveProperty('location')
        expect(result).toHaveProperty('rating')
        expect(result).toHaveProperty('references')
        expect(result).toHaveProperty('companies')
        expect(result).toHaveProperty('contacts')

        expect(typeof result.id).toBe('string')
        expect(typeof result.name).toBe('string')
        expect(typeof result.age).toBe('number')
        expect(typeof result.gender).toBe('string')
        expect(typeof result.maritalStatus).toBe('string')
        expect(typeof result.location).toBe('string')
        expect(typeof result.rating).toBe('number')
        expect(typeof result.references).toBe('number')
        expect(typeof result.companies).toBe('number')
        expect(typeof result.contacts).toBe('number')
      })
    })

    it('should have consistent mock data', async () => {
      const query = 'consistency test'
      const responsePromise = searchPeople(query)

      vi.advanceTimersByTime(1000)
      const response = await responsePromise

      // Check specific mock data values
      expect(response.results[0]?.name).toBe('Johnson Smith')
      expect(response.results[0]?.age).toBe(26)
      expect(response.results[0]?.gender).toBe('Male')
      expect(response.results[0]?.maritalStatus).toBe('Married')
      expect(response.results[0]?.location).toBe('California')
      expect(response.results[0]?.rating).toBe(3.2)
    })

    it('should simulate realistic API delay', async () => {
      const responsePromise = searchPeople('delay test')

      // Before advancing timers, promise should not be resolved
      let resolved = false
      responsePromise.then(() => {
        resolved = true
      })

      // Should not be resolved immediately
      await Promise.resolve()
      expect(resolved).toBe(false)

      // Advance timers and check resolution
      vi.advanceTimersByTime(1000)
      await responsePromise
      expect(resolved).toBe(true)
    })

    it('should return total count of 56', async () => {
      const query = 'count test'
      const responsePromise = searchPeople(query)

      vi.advanceTimersByTime(1000)
      const response = await responsePromise

      expect(response.totalCount).toBe(56)
    })

    it('should handle empty query strings', async () => {
      const query = ''
      const responsePromise = searchPeople(query)

      vi.advanceTimersByTime(1000)
      const response = await responsePromise

      expect(response.query).toBe('')
      expect(response.results).toBeDefined()
      expect(response.totalCount).toBe(56)
    })

    it('should handle special characters in query', async () => {
      const query = 'test@#$%^&*()'
      const responsePromise = searchPeople(query)

      vi.advanceTimersByTime(1000)
      const response = await responsePromise

      expect(response.query).toBe(query)
      expect(response.results).toBeDefined()
    })

    it('should handle very long query strings', async () => {
      const query = 'a'.repeat(1000)
      const responsePromise = searchPeople(query)

      vi.advanceTimersByTime(1000)
      const response = await responsePromise

      expect(response.query).toBe(query)
      expect(response.results).toBeDefined()
    })
  })

  describe('uploadFile', () => {
    it('should return success response for valid file', async () => {
      const file = new File(['test content'], 'test.txt', {
        type: 'text/plain'
      })
      const responsePromise = uploadFile(file)

      vi.advanceTimersByTime(500)
      const response = await responsePromise

      expect(response).toBeDefined()
      expect(response.success).toBe(true)
      expect(response.message).toBeDefined()
      expect(typeof response.message).toBe('string')
    })

    it('should include filename in success message', async () => {
      const filename = 'document.pdf'
      const file = new File(['pdf content'], filename, {
        type: 'application/pdf'
      })
      const responsePromise = uploadFile(file)

      vi.advanceTimersByTime(500)
      const response = await responsePromise

      expect(response.success).toBe(true)
      expect(response.message).toContain(filename)
      expect(response.message).toContain('uploaded successfully')
    })

    it('should simulate shorter delay than search', async () => {
      const file = new File(['content'], 'test.txt')
      const responsePromise = uploadFile(file)

      // Should not be resolved before 500ms
      let resolved = false
      responsePromise.then(() => {
        resolved = true
      })

      vi.advanceTimersByTime(400)
      await Promise.resolve()
      expect(resolved).toBe(false)

      // Should be resolved after 500ms
      vi.advanceTimersByTime(100)
      await responsePromise
      expect(resolved).toBe(true)
    })

    it('should handle different file types', async () => {
      const files = [
        new File(['text'], 'text.txt', { type: 'text/plain' }),
        new File(['image'], 'image.jpg', { type: 'image/jpeg' }),
        new File(['pdf'], 'document.pdf', { type: 'application/pdf' }),
        new File(['doc'], 'document.docx', {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
      ]

      for (const file of files) {
        const responsePromise = uploadFile(file)
        vi.advanceTimersByTime(500)
        const response = await responsePromise

        expect(response.success).toBe(true)
        expect(response.message).toContain(file.name)
      }
    })

    it('should handle files with no extension', async () => {
      const file = new File(['content'], 'README', { type: 'text/plain' })
      const responsePromise = uploadFile(file)

      vi.advanceTimersByTime(500)
      const response = await responsePromise

      expect(response.success).toBe(true)
      expect(response.message).toContain('README')
    })

    it('should handle files with special characters in name', async () => {
      const filename = 'test file (1) - copy.txt'
      const file = new File(['content'], filename, { type: 'text/plain' })
      const responsePromise = uploadFile(file)

      vi.advanceTimersByTime(500)
      const response = await responsePromise

      expect(response.success).toBe(true)
      expect(response.message).toContain(filename)
    })

    it('should handle empty files', async () => {
      const file = new File([], 'empty.txt', { type: 'text/plain' })
      const responsePromise = uploadFile(file)

      vi.advanceTimersByTime(500)
      const response = await responsePromise

      expect(response.success).toBe(true)
      expect(response.message).toContain('empty.txt')
    })

    it('should handle large file names', async () => {
      const longName = `${'a'.repeat(100)}.txt`
      const file = new File(['content'], longName, { type: 'text/plain' })
      const responsePromise = uploadFile(file)

      vi.advanceTimersByTime(500)
      const response = await responsePromise

      expect(response.success).toBe(true)
      expect(response.message).toContain(longName)
    })
  })

  describe('Type Safety', () => {
    it('should export proper TypeScript interfaces', () => {
      // Test that the types are properly exported and can be used
      const mockResponse: SearchResponse = {
        query: 'test',
        results: [],
        totalCount: 0
      }

      expect(mockResponse).toBeDefined()
      expect(typeof mockResponse.query).toBe('string')
      expect(Array.isArray(mockResponse.results)).toBe(true)
      expect(typeof mockResponse.totalCount).toBe('number')
    })

    it('should maintain proper SearchResult structure', async () => {
      const query = 'type test'
      const responsePromise = searchPeople(query)

      vi.advanceTimersByTime(1000)
      const response = await responsePromise

      // Ensure all required fields are present and have correct types
      response.results.forEach(result => {
        // Required number fields
        expect(typeof result.id).toBe('string')
        expect(typeof result.age).toBe('number')
        expect(typeof result.rating).toBe('number')
        expect(typeof result.references).toBe('number')
        expect(typeof result.companies).toBe('number')
        expect(typeof result.contacts).toBe('number')

        // Required string fields
        expect(typeof result.name).toBe('string')
        expect(typeof result.gender).toBe('string')
        expect(typeof result.maritalStatus).toBe('string')
        expect(typeof result.location).toBe('string')

        // Validate number ranges
        expect(result.age).toBeGreaterThan(0)
        expect(result.rating).toBeGreaterThanOrEqual(0)
        expect(result.rating).toBeLessThanOrEqual(5)
        expect(result.references).toBeGreaterThanOrEqual(0)
        expect(result.companies).toBeGreaterThanOrEqual(0)
        expect(result.contacts).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('Performance', () => {
    it('should complete search within expected timeframe', async () => {
      const query = 'performance test'
      const responsePromise = searchPeople(query)

      // Should complete in exactly 1000ms (simulated)
      vi.advanceTimersByTime(999)
      let resolved = false
      responsePromise.then(() => {
        resolved = true
      })
      await Promise.resolve()
      expect(resolved).toBe(false)

      vi.advanceTimersByTime(1)
      await responsePromise
      expect(resolved).toBe(true)
    })

    it('should complete file upload within expected timeframe', async () => {
      const file = new File(['content'], 'performance.txt')
      const responsePromise = uploadFile(file)

      // Should complete in exactly 500ms (simulated)
      vi.advanceTimersByTime(499)
      let resolved = false
      responsePromise.then(() => {
        resolved = true
      })
      await Promise.resolve()
      expect(resolved).toBe(false)

      vi.advanceTimersByTime(1)
      await responsePromise
      expect(resolved).toBe(true)
    })

    it('should handle concurrent requests', async () => {
      const promises = [
        searchPeople('query1'),
        searchPeople('query2'),
        uploadFile(new File(['1'], 'file1.txt')),
        uploadFile(new File(['2'], 'file2.txt'))
      ]

      // Advance time to resolve all promises
      vi.advanceTimersByTime(1000)

      const results = await Promise.all(promises)
      expect(results).toHaveLength(4)
      expect((results[0] as SearchResponse)?.query).toBe('query1')
      expect((results[1] as SearchResponse)?.query).toBe('query2')
      expect((results[2] as { success: boolean })?.success).toBe(true)
      expect((results[3] as { success: boolean })?.success).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle null/undefined inputs gracefully', async () => {
      // These should be handled by TypeScript, but test runtime behavior
      const responsePromise = searchPeople(null as any)

      vi.advanceTimersByTime(1000)
      const response = await responsePromise

      expect(response.query).toBe(null)
      expect(response.results).toBeDefined()
    })

    it('should handle numeric query inputs', async () => {
      const responsePromise = searchPeople(123 as any)

      vi.advanceTimersByTime(1000)
      const response = await responsePromise

      expect(response.query).toBe(123)
      expect(response.results).toBeDefined()
    })

    it('should handle object query inputs', async () => {
      const queryObject = { name: 'test' }
      const responsePromise = searchPeople(queryObject as any)

      vi.advanceTimersByTime(1000)
      const response = await responsePromise

      expect(response.query).toBe(queryObject)
      expect(response.results).toBeDefined()
    })
  })
})
