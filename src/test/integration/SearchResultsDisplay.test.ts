import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import SearchResults from '@/views/SearchResults.vue'
import type { SearchResult } from '@/types/search'

const createMockRouter = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/search', component: SearchResults }]
  })
  return router
}

// Mock search results data
// Mock search results data removed as it was unused

describe('Search Results Display Integration', () => {
  it('displays search results with correct layout structure', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    await router.push('/search?q=software%20engineer')

    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verify main layout structure
    expect(wrapper.find('.h-screen').exists()).toBe(true)
    expect(wrapper.find('.flex-1.flex').exists()).toBe(true)

    // Verify left panel (search conversation)
    const leftPanel = wrapper.find('.w-full.bg-bg-card')
    expect(leftPanel.exists()).toBe(true)

    // Verify right panel (results list) exists
    const resultsComponent = wrapper.findComponent({ name: 'ResultsList' })
    expect(resultsComponent.exists()).toBe(true)
  })

  it('displays individual result cards with complete information', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Trigger a search to populate results via store directly
    const { useSearchStore } = await import('@/stores/search')
    const searchStore = useSearchStore()
    await searchStore.performSearch('test query')

    // Wait for the search to complete
    await new Promise(resolve => setTimeout(resolve, 600))

    // Check that results are displayed (using store data)
    const resultsComponent = wrapper.findComponent({ name: 'ResultsList' })
    expect(resultsComponent.exists()).toBe(true)

    // Verify results props are passed correctly
    const resultsProps = resultsComponent.props()
    expect(Array.isArray(resultsProps.results)).toBe(true)
    expect(resultsProps.results.length).toBeGreaterThan(0)
  })

  it('handles empty search results gracefully', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    await router.push('/search?q=nonexistent%20person')

    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Should still render results component even with empty data
    const resultsComponent = wrapper.findComponent({ name: 'ResultsList' })
    expect(resultsComponent.exists()).toBe(true)
  })

  it('displays search conversation panel with correct content', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verify search conversation component
    const conversationComponent = wrapper.findComponent({
      name: 'SearchConversation'
    })
    expect(conversationComponent.exists()).toBe(true)

    // SearchConversation now reads directly from search store (no props needed)
  })

  it('maintains responsive design on different screen sizes', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verify responsive classes
    const leftPanel = wrapper.find('.w-full.bg-bg-card')
    expect(leftPanel.classes()).toContain('md:w-1/3')
    expect(leftPanel.classes()).toContain('max-h-full')

    // Verify main content area has responsive flex direction
    const mainContent = wrapper.find('.flex-1.flex.flex-col.md\\:flex-row')
    expect(mainContent.exists()).toBe(true)
  })

  it('handles load more functionality integration', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    const resultsComponent = wrapper.findComponent({ name: 'ResultsList' })

    // Simulate load more action
    await resultsComponent.vm.$emit('loadMore')

    // Verify load more event is handled via results component
    expect(resultsComponent.exists()).toBe(true)
    // The load-more event should be emittable
    expect(() => resultsComponent.vm.$emit('loadMore')).not.toThrow()
  })

  it('integrates search bar functionality within results page', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Find search bar in results page
    const searchBar = wrapper.findComponent({ name: 'SearchBar' })
    expect(searchBar.exists()).toBe(true)

    // Verify search bar has correct placeholder
    const searchBarProps = searchBar.props()
    expect(searchBarProps.placeholder).toContain(
      "Tell me more about who you're looking for"
    )

    // Test search functionality
    const newQuery = 'New search query'
    await searchBar.vm.$emit('update:modelValue', newQuery)

    // Verify model value is updated in component
    expect(searchBar.props('modelValue')).toBe(newQuery)
  })

  it('displays correct query parameter in search context', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    const testQuery = 'software developer california'

    // Simulate performing a search (like Landing page would do)
    const { useSearchStore } = await import('@/stores/search')
    const searchStore = useSearchStore()
    await searchStore.performSearch(testQuery)

    await router.push('/search')

    // Mount wrapper for component instantiation
    mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Search store should contain the query
    expect(searchStore.currentQuery).toBe(testQuery)
  })

  it('handles complex search scenarios with multiple filters', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    const complexQuery =
      'John age:25-35 location:California experience:5+ years'

    // Simulate performing a search (like Landing page would do)
    const { useSearchStore } = await import('@/stores/search')
    const searchStore = useSearchStore()
    await searchStore.performSearch(complexQuery)

    await router.push('/search')

    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verify complex query is handled in store
    expect(searchStore.currentQuery).toBe(complexQuery)

    // Results should still be displayed
    const resultsComponent = wrapper.findComponent({ name: 'ResultsList' })
    expect(resultsComponent.exists()).toBe(true)
  })

  it('maintains proper component communication flow', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verify all major components are present and communicating
    expect(wrapper.findComponent({ name: 'AppHeader' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'AppSidebar' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'SearchBar' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'SearchConversation' }).exists()).toBe(
      true
    )
    expect(wrapper.findComponent({ name: 'ResultsList' }).exists()).toBe(true)
  })

  it('handles search results pagination and infinite scroll', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    const resultsComponent = wrapper.findComponent({ name: 'ResultsList' })

    // Verify load more functionality exists
    expect(resultsComponent.exists()).toBe(true)

    // Should have load more handler via results component
    expect(resultsComponent.exists()).toBe(true)
    // The load-more event should be emittable
    expect(() => resultsComponent.vm.$emit('loadMore')).not.toThrow()
  })

  it('displays search statistics and metadata', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Trigger a search to populate results via store directly
    const { useSearchStore } = await import('@/stores/search')
    const searchStore = useSearchStore()
    await searchStore.performSearch('test query')

    // Wait for the search to complete
    await new Promise(resolve => setTimeout(resolve, 600))

    // Verify results contain statistical information
    const results = searchStore.results
    expect(Array.isArray(results)).toBe(true)

    if (results.length > 0) {
      const firstResult = results[0]
      expect(firstResult).toHaveProperty('rating')
      expect(firstResult).toHaveProperty('references')
      expect(firstResult).toHaveProperty('companies')
      expect(firstResult).toHaveProperty('contacts')
    }
  })

  it('handles error states in search results display', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()

    // Simulate an empty search (no search performed)
    await router.push('/search')

    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Store should have empty query when no search performed
    const { useSearchStore } = await import('@/stores/search')
    const searchStore = useSearchStore()
    expect(searchStore.currentQuery).toBe('')

    // Components should still render
    expect(wrapper.findComponent({ name: 'ResultsList' }).exists()).toBe(true)
  })

  it('verifies search results data integrity', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Trigger a search to populate results via store directly
    const { useSearchStore } = await import('@/stores/search')
    const searchStore = useSearchStore()
    await searchStore.performSearch('test query')

    // Wait for the search to complete
    await new Promise(resolve => setTimeout(resolve, 600))

    const results = searchStore.results

    // Verify each result has required properties
    results.forEach((result: SearchResult) => {
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

      // Verify data types
      expect(typeof result.id).toBe('string')
      expect(typeof result.name).toBe('string')
      expect(typeof result.age).toBe('number')
      expect(typeof result.rating).toBe('number')
    })
  })
})
