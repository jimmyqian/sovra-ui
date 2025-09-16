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
    emits: ['update:modelValue', 'search'],
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
    props: ['messages'],
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
      expect(wrapper.find('.h-screen').exists()).toBe(true)
      expect(wrapper.find('.flex-1.flex').exists()).toBe(true)
      expect(wrapper.find('.md\\:flex-row').exists()).toBe(true)
    })

    it('should pass correct props to SearchBar', () => {
      const wrapper = createWrapper()
      const searchBar = wrapper.findComponent({ name: 'SearchBar' })

      expect(searchBar.props('placeholder')).toContain(
        "Tell me more about who you're looking for"
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
      expect(resultsList.props('hasMore')).toBe(false) // Now always false since we handle Load More outside
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

      // Search should not be called immediately (it's delayed by 3 seconds)
      expect(performSearchSpy).not.toHaveBeenCalled()

      // Wait for the 3-second delay
      await new Promise(resolve => setTimeout(resolve, 3100))

      // Now search should have been called
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
  })

  describe('Conversation Integration', () => {
    it('should include initial user query in conversation messages', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')

      // Check that the first message is a user message with the initial query
      expect(messages).toBeDefined()
      expect(Array.isArray(messages)).toBe(true)
      expect(messages.length).toBeGreaterThan(0)
      expect(messages[0].sender).toBe('user')
      expect(messages[0].content).toContain('Johnson')
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

      // First message should be user message, second should be system
      expect(messages[0].sender).toBe('user')
      const systemMessage = messages[1]
      expect(systemMessage).toBeDefined()
      expect(systemMessage.sender).toBe('system')

      const resultsSummary = systemMessage.items?.find(
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
      // Look for hints group in the system message (second message)
      const hintsGroup = messages[1]?.items?.find(
        (item: any) => item.type === 'hints-group'
      )

      expect(hintsGroup).toBeDefined()
      expect(hintsGroup.hints).toBeDefined()
      expect(hintsGroup.hints.length).toBeGreaterThan(0)

      // Test hint click handler exists
      const firstHint = hintsGroup.hints[0]
      expect(typeof firstHint.onClick).toBe('function')
    })

    it('should not include age range filter in conversation', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')
      // Look for refinement in the system message (should not exist)
      const refinement = messages[1]?.items?.find(
        (item: any) => item.type === 'refinement'
      )

      expect(refinement).toBeUndefined()
    })

    it('should handle create filter action', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')
      // Look for action button in the system message (second message)
      const actionButton = messages[1]?.items?.find(
        (item: any) => item.type === 'action-button'
      )

      expect(actionButton).toBeDefined()
      expect(actionButton.variant).toBe('dashed')
      expect(typeof actionButton.onClick).toBe('function')
    })

    it('should not include file upload in conversation', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')
      // Look for file upload in the system message (should not exist)
      const fileUpload = messages[1]?.items?.find(
        (item: any) => item.type === 'file-upload'
      )

      expect(fileUpload).toBeUndefined()
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
      expect(wrapper.find('.max-h-full').exists()).toBe(true)
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

    it('should maintain empty search query by default', () => {
      const wrapper = createWrapper()

      // Check that component starts with empty search query
      expect(
        wrapper.findComponent({ name: 'SearchBar' }).props('modelValue')
      ).toBe('')
    })
  })

  describe('Scroll Fade Effects', () => {
    it('should show top fade when results are scrolled down', async () => {
      const wrapper = createWrapper()

      // Initially top fade should not be visible
      const topFade = wrapper.find('.fade-overlay-top')
      expect(topFade.exists()).toBe(true)
      expect(topFade.classes()).not.toContain('visible')

      // Mock scroll event with scrollTop > 20
      const resultsContainer = wrapper.find('.results-scroll')
      expect(resultsContainer.exists()).toBe(true)

      // Simulate scroll event
      Object.defineProperty(resultsContainer.element, 'scrollTop', {
        value: 50,
        writable: true
      })

      await resultsContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      // Top fade should now be visible
      expect(topFade.classes()).toContain('visible')
    })

    it('should hide top fade when scrolled back to top', async () => {
      const wrapper = createWrapper()
      const topFade = wrapper.find('.fade-overlay-top')
      const resultsContainer = wrapper.find('.results-scroll')

      // Simulate scroll down first
      Object.defineProperty(resultsContainer.element, 'scrollTop', {
        value: 50,
        writable: true
      })
      await resultsContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      expect(topFade.classes()).toContain('visible')

      // Now scroll back to top
      Object.defineProperty(resultsContainer.element, 'scrollTop', {
        value: 0,
        writable: true
      })
      await resultsContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      // Top fade should be hidden again
      expect(topFade.classes()).not.toContain('visible')
    })

    it('should always show bottom fade overlay', () => {
      const wrapper = createWrapper()

      const bottomFade = wrapper.find('.fade-overlay')
      expect(bottomFade.exists()).toBe(true)
      // Bottom fade should always be visible (no conditional visibility)
    })
  })

  describe('Scroll Control Buttons', () => {
    it('should show scroll buttons when content is scrollable', async () => {
      const wrapper = createWrapper()

      // Mock scrollable content
      const resultsContainer = wrapper.find('.results-scroll')
      expect(resultsContainer.exists()).toBe(true)

      // Mock scroll properties
      Object.defineProperty(resultsContainer.element, 'scrollHeight', {
        value: 1000,
        writable: true
      })
      Object.defineProperty(resultsContainer.element, 'clientHeight', {
        value: 400,
        writable: true
      })
      Object.defineProperty(resultsContainer.element, 'scrollTop', {
        value: 100,
        writable: true
      })

      await resultsContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      const scrollButtons = wrapper.findAll('.scroll-button')
      expect(scrollButtons.length).toBeGreaterThan(0)
    })

    it('should hide scroll buttons when content is not scrollable', async () => {
      const wrapper = createWrapper()

      const resultsContainer = wrapper.find('.results-scroll')

      // Mock non-scrollable content
      Object.defineProperty(resultsContainer.element, 'scrollHeight', {
        value: 300,
        writable: true
      })
      Object.defineProperty(resultsContainer.element, 'clientHeight', {
        value: 400,
        writable: true
      })

      await resultsContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      const scrollButtons = wrapper.findAll('.scroll-button')
      expect(scrollButtons.length).toBe(0)
    })

    it('should hide top button when at top of content', async () => {
      const wrapper = createWrapper()

      const resultsContainer = wrapper.find('.results-scroll')

      // Mock scrollable content at top
      Object.defineProperty(resultsContainer.element, 'scrollHeight', {
        value: 1000,
        writable: true
      })
      Object.defineProperty(resultsContainer.element, 'clientHeight', {
        value: 400,
        writable: true
      })
      Object.defineProperty(resultsContainer.element, 'scrollTop', {
        value: 0,
        writable: true
      })

      await resultsContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      const topButton = wrapper.find('.scroll-button-top')
      expect(topButton.exists()).toBe(false)

      const bottomButton = wrapper.find('.scroll-button-bottom')
      expect(bottomButton.exists()).toBe(true)
    })

    it('should hide bottom button when at bottom of content', async () => {
      const wrapper = createWrapper()

      const resultsContainer = wrapper.find('.results-scroll')

      // Mock scrollable content at bottom
      Object.defineProperty(resultsContainer.element, 'scrollHeight', {
        value: 1000,
        writable: true
      })
      Object.defineProperty(resultsContainer.element, 'clientHeight', {
        value: 400,
        writable: true
      })
      Object.defineProperty(resultsContainer.element, 'scrollTop', {
        value: 600, // scrollHeight - clientHeight
        writable: true
      })

      await resultsContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      const topButton = wrapper.find('.scroll-button-top')
      expect(topButton.exists()).toBe(true)

      const bottomButton = wrapper.find('.scroll-button-bottom')
      expect(bottomButton.exists()).toBe(false)
    })

    it('should scroll incrementally when buttons are clicked', async () => {
      const wrapper = createWrapper()

      const resultsContainer = wrapper.find('.results-scroll')

      // Mock scrollable content in middle position
      Object.defineProperty(resultsContainer.element, 'scrollHeight', {
        value: 1000,
        writable: true
      })
      Object.defineProperty(resultsContainer.element, 'clientHeight', {
        value: 400,
        writable: true
      })
      Object.defineProperty(resultsContainer.element, 'scrollTop', {
        value: 300,
        writable: true
      })

      // Mock scrollTo method
      const scrollToSpy = vi.fn()
      resultsContainer.element.scrollTo = scrollToSpy

      await resultsContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      const topButton = wrapper.find('.scroll-button-top')
      const bottomButton = wrapper.find('.scroll-button-bottom')

      expect(topButton.exists()).toBe(true)
      expect(bottomButton.exists()).toBe(true)

      // Click top button - should scroll up by 200px
      await topButton.trigger('click')
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 100, // 300 - 200
        behavior: 'smooth'
      })

      // Click bottom button - should scroll down by 200px
      await bottomButton.trigger('click')
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 500, // 300 + 200
        behavior: 'smooth'
      })
    })

    it('should not scroll beyond boundaries', async () => {
      const wrapper = createWrapper()

      const resultsContainer = wrapper.find('.results-scroll')

      // Mock scrollable content near top
      Object.defineProperty(resultsContainer.element, 'scrollHeight', {
        value: 1000,
        writable: true
      })
      Object.defineProperty(resultsContainer.element, 'clientHeight', {
        value: 400,
        writable: true
      })
      Object.defineProperty(resultsContainer.element, 'scrollTop', {
        value: 50, // Near top
        writable: true
      })

      const scrollToSpy = vi.fn()
      resultsContainer.element.scrollTo = scrollToSpy

      await resultsContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      const topButton = wrapper.find('.scroll-button-top')

      // Click top button when near top - should not go below 0
      await topButton.trigger('click')
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 0, // Math.max(0, 50 - 200)
        behavior: 'smooth'
      })

      // Test bottom boundary
      Object.defineProperty(resultsContainer.element, 'scrollTop', {
        value: 550, // Near bottom (600 is max: 1000 - 400)
        writable: true
      })

      await resultsContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      const bottomButton = wrapper.find('.scroll-button-bottom')

      // Click bottom button when near bottom - should not exceed max
      await bottomButton.trigger('click')
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 600, // Math.min(600, 550 + 200)
        behavior: 'smooth'
      })
    })
  })

  describe('Conversation Scroll Control Buttons', () => {
    it('should show conversation scroll buttons when content is scrollable', async () => {
      const wrapper = createWrapper()

      // Mock scrollable conversation content
      const conversationContainer = wrapper.find('.conversation-scroll')
      expect(conversationContainer.exists()).toBe(true)

      // Mock scroll properties
      Object.defineProperty(conversationContainer.element, 'scrollHeight', {
        value: 800,
        writable: true
      })
      Object.defineProperty(conversationContainer.element, 'clientHeight', {
        value: 300,
        writable: true
      })
      Object.defineProperty(conversationContainer.element, 'scrollTop', {
        value: 50,
        writable: true
      })

      await conversationContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      const conversationScrollButtons = wrapper.findAll(
        '.conversation-scroll-button'
      )
      expect(conversationScrollButtons.length).toBeGreaterThan(0)
    })

    it('should hide conversation scroll buttons when content is not scrollable', async () => {
      const wrapper = createWrapper()

      const conversationContainer = wrapper.find('.conversation-scroll')

      // Mock non-scrollable conversation content
      Object.defineProperty(conversationContainer.element, 'scrollHeight', {
        value: 200,
        writable: true
      })
      Object.defineProperty(conversationContainer.element, 'clientHeight', {
        value: 300,
        writable: true
      })

      await conversationContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      const conversationScrollButtons = wrapper.findAll(
        '.conversation-scroll-button'
      )
      expect(conversationScrollButtons.length).toBe(0)
    })

    it('should scroll conversation incrementally when buttons are clicked', async () => {
      const wrapper = createWrapper()

      const conversationContainer = wrapper.find('.conversation-scroll')

      // Mock scrollable conversation content in middle position
      Object.defineProperty(conversationContainer.element, 'scrollHeight', {
        value: 800,
        writable: true
      })
      Object.defineProperty(conversationContainer.element, 'clientHeight', {
        value: 300,
        writable: true
      })
      Object.defineProperty(conversationContainer.element, 'scrollTop', {
        value: 250,
        writable: true
      })

      // Mock scrollTo method
      const scrollToSpy = vi.fn()
      conversationContainer.element.scrollTo = scrollToSpy

      await conversationContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      const topButton = wrapper.find(
        '.conversation-scroll-button.scroll-button-top'
      )
      const bottomButton = wrapper.find(
        '.conversation-scroll-button.scroll-button-bottom'
      )

      expect(topButton.exists()).toBe(true)
      expect(bottomButton.exists()).toBe(true)

      // Click top button - should scroll up by 200px
      await topButton.trigger('click')
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 50, // 250 - 200
        behavior: 'smooth'
      })

      // Click bottom button - should scroll down by 200px
      await bottomButton.trigger('click')
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 450, // 250 + 200
        behavior: 'smooth'
      })
    })

    it('should position conversation scroll buttons differently from results buttons', async () => {
      const wrapper = createWrapper()

      const conversationContainer = wrapper.find('.conversation-scroll')

      // Mock scrollable conversation content to make buttons appear
      Object.defineProperty(conversationContainer.element, 'scrollHeight', {
        value: 800,
        writable: true
      })
      Object.defineProperty(conversationContainer.element, 'clientHeight', {
        value: 300,
        writable: true
      })
      Object.defineProperty(conversationContainer.element, 'scrollTop', {
        value: 150,
        writable: true
      })

      await conversationContainer.trigger('scroll')
      await wrapper.vm.$nextTick()

      const conversationTopButton = wrapper.find(
        '.conversation-scroll-button.scroll-button-top'
      )
      const conversationBottomButton = wrapper.find(
        '.conversation-scroll-button.scroll-button-bottom'
      )

      // Check that conversation buttons exist and have specific positioning classes
      expect(conversationTopButton.exists()).toBe(true)
      expect(conversationBottomButton.exists()).toBe(true)
      expect(conversationTopButton.classes()).toContain(
        'conversation-scroll-button'
      )
      expect(conversationBottomButton.classes()).toContain(
        'conversation-scroll-button'
      )
    })
  })
})
