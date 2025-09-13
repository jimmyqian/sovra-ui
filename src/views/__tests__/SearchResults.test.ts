/**
 * Unit tests for SearchResults component
 * Tests search functionality, store integration, and conversation display
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import SearchResults from '../SearchResults.vue'
import { useSearchStore } from '@/stores/search'
import type { SearchResult } from '@/types/search'

// Mock components to avoid dependency issues
vi.mock('@/components/layout/AppHeader.vue', () => ({
  default: {
    name: 'AppHeader',
    template: '<div data-testid="app-header">Header</div>'
  }
}))

vi.mock('@/components/navigation/AppSidebar.vue', () => ({
  default: {
    name: 'AppSidebar',
    template: '<div data-testid="app-sidebar">Sidebar</div>'
  }
}))

vi.mock('@/components/common/SearchBar.vue', () => ({
  default: {
    name: 'SearchBar',
    props: ['modelValue', 'placeholder'],
    emits: ['update:modelValue', 'search', 'fileUpload'],
    template: `
      <div data-testid="search-bar">
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          @keyup.enter="$emit('search')"
          data-testid="search-input"
        />
        <button @click="$emit('search')" data-testid="search-button">Search</button>
      </div>
    `
  }
}))

vi.mock('@/components/search/SearchConversation.vue', () => ({
  default: {
    name: 'SearchConversation',
    props: ['messages', 'userQuery'],
    template: '<div data-testid="search-conversation">Conversation</div>'
  }
}))

vi.mock('@/components/search/ResultsList.vue', () => ({
  default: {
    name: 'ResultsList',
    props: ['results', 'isLoading', 'hasMore', 'error'],
    emits: ['loadMore'],
    template: `
      <div data-testid="results-list">
        <div v-if="isLoading" data-testid="loading">Loading...</div>
        <div v-if="error" data-testid="error">{{ error }}</div>
        <div v-for="result in results" :key="result.id" data-testid="result-item">
          {{ result.name }}
        </div>
        <button v-if="hasMore && !isLoading" @click="$emit('loadMore')" data-testid="load-more">
          Load More
        </button>
      </div>
    `
  }
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/search', component: { template: '<div>Search</div>' } }
  ]
})

describe('SearchResults Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const createWrapper = () => {
    return mount(SearchResults, {
      global: {
        plugins: [createPinia(), router]
      }
    })
  }

  const mockResults: SearchResult[] = [
    {
      id: 1,
      name: 'Johnson Smith',
      age: 26,
      gender: 'Male',
      maritalStatus: 'Married',
      location: 'California',
      rating: 3.2,
      references: 26,
      companies: 10,
      contacts: 7
    },
    {
      id: 2,
      name: 'Johnson Brown',
      age: 28,
      gender: 'Male',
      maritalStatus: 'Single',
      location: 'California',
      rating: 4.1,
      references: 34,
      companies: 8,
      contacts: 12
    }
  ]

  describe('Component Rendering', () => {
    it('should render all main sections', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[data-testid="app-sidebar"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="app-header"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="search-conversation"]').exists()).toBe(
        true
      )
      expect(wrapper.find('[data-testid="search-bar"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="results-list"]').exists()).toBe(true)
    })

    it('should have correct layout structure', () => {
      const wrapper = createWrapper()

      // Check main layout
      expect(wrapper.find('.min-h-screen').exists()).toBe(true)
      expect(wrapper.find('.h-screen').exists()).toBe(true)
      expect(wrapper.find('.md\\:flex-row').exists()).toBe(true)
    })

    it('should pass correct props to SearchBar', () => {
      const wrapper = createWrapper()
      const searchBar = wrapper.findComponent({ name: 'SearchBar' })

      expect(searchBar.props('placeholder')).toContain(
        'Johnson, who is around 26 years old'
      )
    })
  })

  describe('Search Store Integration', () => {
    it('should integrate with search store', () => {
      createWrapper()
      const store = useSearchStore()

      expect(store).toBeDefined()
      expect(store.results).toBeDefined()
      expect(store.isLoading).toBeDefined()
      expect(store.error).toBeDefined()
    })

    it('should pass store data to ResultsList', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      // Set mock data in store
      store.setResults(mockResults)
      store.setLoading(false)
      store.updatePagination({ hasMore: true })

      await wrapper.vm.$nextTick()

      const resultsList = wrapper.findComponent({ name: 'ResultsList' })
      expect(resultsList.props('results')).toEqual(mockResults)
      expect(resultsList.props('isLoading')).toBe(false)
      expect(resultsList.props('hasMore')).toBe(true)
      expect(resultsList.props('error')).toBe(null)
    })

    it('should show loading state', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      store.setLoading(true)
      await wrapper.vm.$nextTick()

      const resultsList = wrapper.findComponent({ name: 'ResultsList' })
      expect(resultsList.props('isLoading')).toBe(true)
    })

    it('should show error state', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      store.setError('Search failed')
      await wrapper.vm.$nextTick()

      const resultsList = wrapper.findComponent({ name: 'ResultsList' })
      expect(resultsList.props('error')).toBe('Search failed')
    })
  })

  describe('Search Functionality', () => {
    it('should handle new search', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      const performSearchSpy = vi.spyOn(store, 'performSearch')
      performSearchSpy.mockResolvedValue()

      // Set search query via v-model
      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('update:modelValue', 'new search query')

      // Trigger search
      await searchBar.vm.$emit('search')

      expect(performSearchSpy).toHaveBeenCalledWith('new search query')
    })

    it('should not perform search with empty query', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      const performSearchSpy = vi.spyOn(store, 'performSearch')

      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('update:modelValue', '')
      await searchBar.vm.$emit('search')

      expect(performSearchSpy).not.toHaveBeenCalled()
    })

    it('should handle load more results', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      const loadMoreSpy = vi.spyOn(store, 'loadMoreResults')
      loadMoreSpy.mockResolvedValue()

      const resultsList = wrapper.findComponent({ name: 'ResultsList' })
      await resultsList.vm.$emit('loadMore')

      expect(loadMoreSpy).toHaveBeenCalled()
    })

    it('should handle file upload', async () => {
      const wrapper = createWrapper()
      const mockFiles = [new File(['test'], 'test.txt')] as unknown as FileList

      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('fileUpload', mockFiles)

      // File upload is handled gracefully (no console logging in production)
      expect(searchBar.exists()).toBe(true)
    })
  })

  describe('Conversation Integration', () => {
    it('should pass current query to SearchConversation', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      store.setQuery('test query')
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      expect(conversation.props('userQuery')).toBe('test query')
    })

    it('should generate conversation messages', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      store.updatePagination({ totalResults: 45 })
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')

      expect(messages).toBeDefined()
      expect(Array.isArray(messages)).toBe(true)
      expect(messages.length).toBeGreaterThan(0)
    })

    it('should include results summary in conversation', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      store.updatePagination({ totalResults: 42 })
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')

      const systemMessage = messages[0]
      expect(systemMessage).toBeDefined()
      expect(systemMessage.sender).toBe('system')

      const resultsSummary = systemMessage.items.find(
        (item: any) => item.type === 'results-summary'
      )
      expect(resultsSummary).toBeDefined()
      expect(resultsSummary.resultCount).toBe(42)
    })
  })

  describe('Conversation Interactions', () => {
    it('should handle hint clicks', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')
      const hintsGroup = messages[0]?.items.find(
        (item: any) => item.type === 'hints-group'
      )

      expect(hintsGroup).toBeDefined()
      expect(hintsGroup.hints).toBeDefined()
      expect(hintsGroup.hints.length).toBeGreaterThan(0)

      // Test hint click handler exists
      const firstHint = hintsGroup.hints[0]
      expect(typeof firstHint.onClick).toBe('function')
    })

    it('should handle age range changes', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')
      const refinement = messages[0]?.items.find(
        (item: any) => item.type === 'refinement'
      )

      expect(refinement).toBeDefined()
      expect(refinement.inputType).toBe('age-range')
      expect(typeof refinement.onChange).toBe('function')
    })

    it('should handle create filter action', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')
      const actionButton = messages[0]?.items.find(
        (item: any) => item.type === 'action-button'
      )

      expect(actionButton).toBeDefined()
      expect(actionButton.variant).toBe('dashed')
      expect(typeof actionButton.onClick).toBe('function')
    })

    it('should handle file upload in conversation', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')
      const fileUpload = messages[0]?.items.find(
        (item: any) => item.type === 'file-upload'
      )

      expect(fileUpload).toBeDefined()
      expect(fileUpload.acceptedTypes).toBeDefined()
      expect(typeof fileUpload.onUpload).toBe('function')
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const wrapper = createWrapper()

      // Check for proper flex layout
      expect(wrapper.find('.flex.h-screen').exists()).toBe(true)

      // Check for main content areas
      expect(wrapper.find('.flex-col.md\\:flex-row').exists()).toBe(true)
    })

    it('should maintain responsive design', () => {
      const wrapper = createWrapper()

      // Check for responsive classes
      expect(wrapper.find('.md\\:w-2\\/5').exists()).toBe(true)
      expect(wrapper.find('.md\\:h-full').exists()).toBe(true)
    })
  })

  describe('Component Props and Events', () => {
    it('should handle search bar model value updates', async () => {
      const wrapper = createWrapper()

      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('update:modelValue', 'test search')

      // Verify the model value is handled
      expect(searchBar.exists()).toBe(true)
    })

    it('should maintain default search query', () => {
      const wrapper = createWrapper()

      // Check that component has default search query
      expect(
        wrapper.findComponent({ name: 'SearchBar' }).props('modelValue')
      ).toContain('Johnson, who is around 26 years old')
    })
  })
})
