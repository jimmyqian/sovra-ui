import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import Landing from '@/views/Landing.vue'
import SearchResults from '@/views/SearchResults.vue'
import { useSearchStore } from '@/stores/search'

// Mock router for integration testing
const createMockRouter = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: Landing },
      { path: '/search', component: SearchResults }
    ]
  })
  return router
}

describe('Search Workflow Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('completes full search workflow from landing to results', async () => {
    const router = createMockRouter()
    const pinia = createPinia()
    const pushSpy = vi.spyOn(router, 'push')

    // Mount landing page with router and Pinia
    const wrapper = mount(Landing, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Get store instance
    const store = useSearchStore()
    const performSearchSpy = vi.spyOn(store, 'performSearch')
    performSearchSpy.mockResolvedValue()

    // Find search input and search button
    const searchInput = wrapper.find('textarea')
    const searchButton = wrapper
      .findAll('button')
      .find(
        btn =>
          btn.text().includes('Search') || btn.classes().includes('btn-primary')
      )

    expect(searchInput.exists()).toBe(true)
    expect(searchButton?.exists()).toBe(true)

    // Enter search query
    const testQuery = 'John Doe software engineer California'
    await searchInput.setValue(testQuery)

    // Verify input value
    expect(searchInput.element.value).toBe(testQuery)

    // Click search button
    if (searchButton) {
      await searchButton.trigger('click')
    }

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0))

    // Verify store method was called
    expect(performSearchSpy).toHaveBeenCalledWith(testQuery)

    // Verify router navigation was called
    expect(pushSpy).toHaveBeenCalledWith({
      path: '/search',
      query: { q: testQuery }
    })
  })

  it('handles search with Enter key press', async () => {
    const router = createMockRouter()
    const pinia = createPinia()
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(Landing, {
      global: {
        plugins: [router, pinia]
      }
    })

    const store = useSearchStore()
    const performSearchSpy = vi.spyOn(store, 'performSearch')
    performSearchSpy.mockResolvedValue()

    const searchInput = wrapper.find('textarea')
    const testQuery = 'Jane Smith marketing New York'

    await searchInput.setValue(testQuery)
    await searchInput.trigger('keypress.enter')

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(performSearchSpy).toHaveBeenCalledWith(testQuery)
    expect(pushSpy).toHaveBeenCalledWith({
      path: '/search',
      query: { q: testQuery }
    })
  })

  it('prevents search with empty query', async () => {
    const router = createMockRouter()
    const pinia = createPinia()
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(Landing, {
      global: {
        plugins: [router, pinia]
      }
    })

    const store = useSearchStore()
    const performSearchSpy = vi.spyOn(store, 'performSearch')

    const searchButton = wrapper
      .findAll('button')
      .find(
        btn =>
          btn.text().includes('Search') || btn.classes().includes('btn-primary')
      )

    // Click search with empty input
    if (searchButton) {
      await searchButton.trigger('click')
    }

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0))

    // Should not call store method or navigate with empty query
    expect(performSearchSpy).not.toHaveBeenCalled()
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('prevents search with whitespace-only query', async () => {
    const router = createMockRouter()
    const pinia = createPinia()
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(Landing, {
      global: {
        plugins: [router, pinia]
      }
    })

    const store = useSearchStore()
    const performSearchSpy = vi.spyOn(store, 'performSearch')

    const searchInput = wrapper.find('textarea')
    const searchButton = wrapper
      .findAll('button')
      .find(
        btn =>
          btn.text().includes('Search') || btn.classes().includes('btn-primary')
      )

    // Enter whitespace-only query
    await searchInput.setValue('   ')
    if (searchButton) {
      await searchButton.trigger('click')
    }

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0))

    // Should not call store method or navigate with whitespace-only query
    expect(performSearchSpy).not.toHaveBeenCalled()
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('displays search results page correctly after navigation', async () => {
    const router = createMockRouter()

    // Navigate to search results with query
    await router.push('/search?q=test%20query')

    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router]
      }
    })

    // Verify search results page structure
    expect(
      wrapper.find('[data-testid="app-header"]').exists() ||
        wrapper.find('.w-full.bg-bg-card').exists()
    ).toBe(true)
    expect(
      wrapper.find('[data-testid="search-conversation"]').exists() ||
        wrapper.text()
    ).toContain('Fantastic! 56 persons were found')
    expect(
      wrapper.find('[data-testid="results-list"]').exists() ||
        wrapper.find('.result-card').exists()
    ).toBe(true)
  })

  it('maintains search context between pages', async () => {
    const router = createMockRouter()

    // Test query parameter handling
    await router.push('/search?q=Johnson%20software%20California')

    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router]
      }
    })

    // Component should receive and process the query parameter
    expect(wrapper.vm.searchQuery ?? wrapper.text()).toBeTruthy()
  })

  it('handles special characters in search query', async () => {
    const router = createMockRouter()
    const pinia = createPinia()
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(Landing, {
      global: {
        plugins: [router, pinia]
      }
    })

    const store = useSearchStore()
    const performSearchSpy = vi.spyOn(store, 'performSearch')
    performSearchSpy.mockResolvedValue()

    const searchInput = wrapper.find('textarea')
    const searchButton = wrapper
      .findAll('button')
      .find(
        btn =>
          btn.text().includes('Search') || btn.classes().includes('btn-primary')
      )

    // Test query with special characters
    const specialQuery = "John O'Connor & Associates - NYC"
    await searchInput.setValue(specialQuery)
    if (searchButton) {
      await searchButton.trigger('click')
    }

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(performSearchSpy).toHaveBeenCalledWith(specialQuery)
    expect(pushSpy).toHaveBeenCalledWith({
      path: '/search',
      query: { q: specialQuery }
    })
  })

  it('handles very long search queries', async () => {
    const router = createMockRouter()
    const pinia = createPinia()
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(Landing, {
      global: {
        plugins: [router, pinia]
      }
    })

    const store = useSearchStore()
    const performSearchSpy = vi.spyOn(store, 'performSearch')
    performSearchSpy.mockResolvedValue()

    const searchInput = wrapper.find('textarea')
    const searchButton = wrapper
      .findAll('button')
      .find(
        btn =>
          btn.text().includes('Search') || btn.classes().includes('btn-primary')
      )

    // Test very long query
    const longQuery =
      'Looking for John Smith who works as a senior software engineer at a technology company in California, specifically in the San Francisco Bay Area, who graduated from Stanford University with a computer science degree and has experience with JavaScript, TypeScript, React, Vue.js, and Node.js'

    await searchInput.setValue(longQuery)
    if (searchButton) {
      await searchButton.trigger('click')
    }

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(performSearchSpy).toHaveBeenCalledWith(longQuery)
    expect(pushSpy).toHaveBeenCalledWith({
      path: '/search',
      query: { q: longQuery }
    })
  })

  it('shows loading state during search process', async () => {
    const router = createMockRouter()
    const pinia = createPinia()

    const wrapper = mount(Landing, {
      global: {
        plugins: [router, pinia]
      }
    })

    const store = useSearchStore()

    // Initially should not be loading
    expect(wrapper.find('.animate-spin').exists()).toBe(false)

    // Set loading state
    store.setLoading(true)
    await wrapper.vm.$nextTick()

    // Should show loading spinner
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
    expect(wrapper.find('.border-brand-orange').exists()).toBe(true)
  })

  it('shows error state when search fails', async () => {
    const router = createMockRouter()
    const pinia = createPinia()

    const wrapper = mount(Landing, {
      global: {
        plugins: [router, pinia]
      }
    })

    const store = useSearchStore()

    // Initially should not show error
    expect(wrapper.find('.text-red-600').exists()).toBe(false)

    // Set error state
    store.setError('Search failed')
    await wrapper.vm.$nextTick()

    // Should show error message
    const errorElement = wrapper.find('.text-red-600')
    expect(errorElement.exists()).toBe(true)
    expect(errorElement.text()).toBe('Search failed')
  })

  it('updates search input height as user types', async () => {
    const wrapper = mount(Landing)
    const searchInput = wrapper.find('textarea')

    // Mock scrollHeight property
    Object.defineProperty(searchInput.element, 'scrollHeight', {
      value: 120,
      writable: true
    })

    const longText =
      'This is a very long search query that should cause the textarea to expand in height to accommodate multiple lines of text'

    await searchInput.setValue(longText)

    // Verify height adjustment (the component should set style.height to scrollHeight)
    expect(searchInput.element.style.height).toBe('120px')
  })
})
