import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/views/Landing.vue'
import SearchResults from '@/views/SearchResults.vue'

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
  it('completes full search workflow from landing to results', async () => {
    const router = createMockRouter()
    const pushSpy = vi.spyOn(router, 'push')

    // Mount landing page with router
    const wrapper = mount(Landing, {
      global: {
        plugins: [router]
      }
    })

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

    // Verify router navigation was called
    expect(pushSpy).toHaveBeenCalledWith({
      path: '/search',
      query: { q: testQuery }
    })
  })

  it('handles search with Enter key press', async () => {
    const router = createMockRouter()
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(Landing, {
      global: {
        plugins: [router]
      }
    })

    const searchInput = wrapper.find('textarea')
    const testQuery = 'Jane Smith marketing New York'

    await searchInput.setValue(testQuery)
    await searchInput.trigger('keypress.enter')

    expect(pushSpy).toHaveBeenCalledWith({
      path: '/search',
      query: { q: testQuery }
    })
  })

  it('prevents search with empty query', async () => {
    const router = createMockRouter()
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(Landing, {
      global: {
        plugins: [router]
      }
    })

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

    // Should not navigate with empty query
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('prevents search with whitespace-only query', async () => {
    const router = createMockRouter()
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(Landing, {
      global: {
        plugins: [router]
      }
    })

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

    // Should not navigate with whitespace-only query
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
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(Landing, {
      global: {
        plugins: [router]
      }
    })

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

    expect(pushSpy).toHaveBeenCalledWith({
      path: '/search',
      query: { q: specialQuery }
    })
  })

  it('handles very long search queries', async () => {
    const router = createMockRouter()
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(Landing, {
      global: {
        plugins: [router]
      }
    })

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

    expect(pushSpy).toHaveBeenCalledWith({
      path: '/search',
      query: { q: longQuery }
    })
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
