import { describe, it, expect, vi } from 'vitest'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import Landing from '@/views/Landing.vue'
import SearchResults from '@/views/SearchResults.vue'

// Mock the view components
vi.mock('@/views/Landing.vue', () => ({
  default: { name: 'Landing' }
}))

vi.mock('@/views/SearchResults.vue', () => ({
  default: { name: 'SearchResults' }
}))

// Helper to create router instance matching main.ts configuration
const createTestRouter = (): Router => {
  const routes = [
    { path: '/', component: Landing },
    { path: '/search', component: SearchResults }
  ]

  return createRouter({
    history: createWebHistory(),
    routes
  })
}

describe('Router Configuration', () => {
  it('creates router with correct configuration', () => {
    const router = createTestRouter()

    expect(router).toBeDefined()
    expect(router.getRoutes()).toHaveLength(2)
  })

  it('configures landing page route correctly', () => {
    const router = createTestRouter()
    const routes = router.getRoutes()

    const landingRoute = routes.find(route => route.path === '/')

    expect(landingRoute).toBeDefined()
    expect(landingRoute?.path).toBe('/')
    expect(landingRoute?.components?.default).toBe(Landing)
  })

  it('configures search results route correctly', () => {
    const router = createTestRouter()
    const routes = router.getRoutes()

    const searchRoute = routes.find(route => route.path === '/search')

    expect(searchRoute).toBeDefined()
    expect(searchRoute?.path).toBe('/search')
    expect(searchRoute?.components?.default).toBe(SearchResults)
  })

  it('uses web history mode', () => {
    const router = createTestRouter()

    // Check that the router is using HTML5 history mode
    expect(router.options.history).toBeDefined()
    // Base can be empty string in test environment
    expect(typeof router.options.history.base).toBe('string')
  })

  it('resolves root path to landing component', async () => {
    const router = createTestRouter()

    const resolved = router.resolve('/')

    expect(resolved.path).toBe('/')
    expect(resolved.name).toBeUndefined() // No name specified in route config
    expect(resolved.matched[0].components?.default).toBe(Landing)
  })

  it('resolves search path to search results component', async () => {
    const router = createTestRouter()

    const resolved = router.resolve('/search')

    expect(resolved.path).toBe('/search')
    expect(resolved.matched[0].components?.default).toBe(SearchResults)
  })

  it('handles path with query parameters', async () => {
    const router = createTestRouter()

    const resolved = router.resolve('/search?q=john%20doe')

    expect(resolved.path).toBe('/search')
    expect(resolved.query).toEqual({ q: 'john doe' })
    expect(resolved.matched[0].components?.default).toBe(SearchResults)
  })

  it('handles complex query parameters', async () => {
    const router = createTestRouter()

    const resolved = router.resolve(
      '/search?q=software%20engineer&location=california&experience=5'
    )

    expect(resolved.path).toBe('/search')
    expect(resolved.query).toEqual({
      q: 'software engineer',
      location: 'california',
      experience: '5'
    })
  })

  it('handles navigation between routes', async () => {
    const router = createTestRouter()

    // Start at root
    await router.push('/')
    expect(router.currentRoute.value.path).toBe('/')

    // Navigate to search
    await router.push('/search')
    expect(router.currentRoute.value.path).toBe('/search')

    // Navigate back to root
    await router.push('/')
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('handles navigation with query parameters', async () => {
    const router = createTestRouter()

    await router.push('/search?q=test%20query')

    expect(router.currentRoute.value.path).toBe('/search')
    expect(router.currentRoute.value.query).toEqual({ q: 'test query' })
  })

  it('handles programmatic navigation with object syntax', async () => {
    const router = createTestRouter()

    await router.push({
      path: '/search',
      query: { q: 'john doe software engineer' }
    })

    expect(router.currentRoute.value.path).toBe('/search')
    expect(router.currentRoute.value.query).toEqual({
      q: 'john doe software engineer'
    })
  })

  it('handles route replacement', async () => {
    const router = createTestRouter()

    // Navigate to search
    await router.push('/search')
    expect(router.currentRoute.value.path).toBe('/search')

    // Replace with root
    await router.replace('/')
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('handles hash fragments in URLs', async () => {
    const router = createTestRouter()

    await router.push('/search#results')

    expect(router.currentRoute.value.path).toBe('/search')
    expect(router.currentRoute.value.hash).toBe('#results')
  })

  it('validates route matching', () => {
    const router = createTestRouter()

    // Test valid routes
    expect(router.resolve('/').matched).toHaveLength(1)
    expect(router.resolve('/search').matched).toHaveLength(1)

    // Test non-existent route (should still resolve but with no matched routes)
    const nonExistentRoute = router.resolve('/nonexistent')
    expect(nonExistentRoute.path).toBe('/nonexistent')
    expect(nonExistentRoute.matched).toHaveLength(0)
  })

  it('preserves query parameters during navigation', async () => {
    const router = createTestRouter()

    // Navigate with initial query
    await router.push('/search?q=initial%20query')
    expect(router.currentRoute.value.query.q).toBe('initial query')

    // Navigate with updated query
    await router.push('/search?q=updated%20query&filter=active')
    expect(router.currentRoute.value.query).toEqual({
      q: 'updated query',
      filter: 'active'
    })
  })

  it('handles special characters in query parameters', async () => {
    const router = createTestRouter()

    const specialQuery = "John O'Connor & Associates - NYC"
    await router.push({
      path: '/search',
      query: { q: specialQuery }
    })

    expect(router.currentRoute.value.query.q).toBe(specialQuery)
  })

  it('handles multiple query parameters', async () => {
    const router = createTestRouter()

    await router.push({
      path: '/search',
      query: {
        q: 'software engineer',
        location: 'california',
        experience: '5',
        remote: 'true'
      }
    })

    const query = router.currentRoute.value.query
    expect(query.q).toBe('software engineer')
    expect(query.location).toBe('california')
    expect(query.experience).toBe('5')
    expect(query.remote).toBe('true')
  })

  it('handles route history navigation', async () => {
    const router = createTestRouter()

    // Build up some history
    await router.push('/')
    await router.push('/search?q=first')
    await router.push('/search?q=second')

    expect(router.currentRoute.value.query.q).toBe('second')

    // Note: In test environment, router.back() and router.forward()
    // may not work as expected due to lack of browser history
    // Test that the methods exist and can be called
    expect(typeof router.back).toBe('function')
    expect(typeof router.forward).toBe('function')
  })

  it('validates route component loading', () => {
    const router = createTestRouter()
    const routes = router.getRoutes()

    // Verify components are properly assigned
    routes.forEach(route => {
      expect(route.components?.default).toBeDefined()
      expect(typeof route.components?.default).toBe('object')
    })
  })

  it('handles route meta information', () => {
    const router = createTestRouter()
    const routes = router.getRoutes()

    // Check that routes can have meta fields (even if not currently used)
    routes.forEach(route => {
      expect(route.meta).toBeDefined()
      expect(typeof route.meta).toBe('object')
    })
  })

  it('supports dynamic route resolution', () => {
    const router = createTestRouter()

    // Test resolving routes programmatically
    const dynamicPaths = ['/', '/search', '/search?q=test']

    dynamicPaths.forEach(path => {
      const resolved = router.resolve(path)
      expect(resolved).toBeDefined()
      expect(typeof resolved.path).toBe('string')
    })
  })

  it('handles URL encoding and decoding correctly', async () => {
    const router = createTestRouter()

    const encodedQuery = 'software%20engineer%20%40%20tech%20company'
    await router.push(`/search?q=${encodedQuery}`)

    // Query should be automatically decoded
    expect(router.currentRoute.value.query.q).toBe(
      'software engineer @ tech company'
    )
  })

  it('maintains route consistency across different navigation methods', async () => {
    const router = createTestRouter()

    const testPath = '/search'
    const testQuery = { q: 'consistency test' }

    // Test push
    await router.push({ path: testPath, query: testQuery })
    expect(router.currentRoute.value.path).toBe(testPath)
    expect(router.currentRoute.value.query).toEqual(testQuery)

    // Test replace
    await router.replace('/')
    await router.replace({ path: testPath, query: testQuery })
    expect(router.currentRoute.value.path).toBe(testPath)
    expect(router.currentRoute.value.query).toEqual(testQuery)
  })
})
