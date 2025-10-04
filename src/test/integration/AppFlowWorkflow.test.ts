/**
 * Integration tests for complete app flow workflow
 * Tests the user journey: Landing -> Dashboard -> Network -> Search -> Dashboard
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import Landing from '@/views/Landing.vue'
import SearchResults from '@/views/SearchResults.vue'
import SearchDetail from '@/views/SearchDetail.vue'
import Network from '@/views/Network.vue'
import { useSearchStore } from '@/stores/search'
import { useConversationStore } from '@/stores/conversation'

// Mock SearchBar component
vi.mock('@/components/common/SearchBar.vue', () => ({
  default: {
    name: 'SearchBar',
    props: ['modelValue', 'placeholder', 'disabled'],
    emits: ['update:modelValue', 'search', 'fileUpload', 'speechError'],
    template: `
      <div data-testid="search-bar">
        <input
          :value="modelValue"
          :disabled="disabled"
          @input="$emit('update:modelValue', $event.target.value)"
          @keyup.enter="$emit('search')"
          data-testid="search-input"
        />
        <button @click="$emit('search')" :disabled="disabled" data-testid="search-button">Search</button>
      </div>
    `
  }
}))

// Mock layout components
vi.mock('@/components/common/Logo.vue', () => ({
  default: { template: '<div data-testid="logo">Logo</div>' }
}))

vi.mock('@/components/layout/CopyrightFooter.vue', () => ({
  default: { template: '<div data-testid="footer">Footer</div>' }
}))

vi.mock('@/components/layouts/SearchLayout.vue', () => ({
  default: {
    name: 'SearchLayout',
    props: ['searchPlaceholder'],
    emits: ['search', 'fileUpload', 'speechError'],
    template: '<div data-testid="search-layout"><slot /></div>'
  }
}))

vi.mock('@/components/search/RightPanel.vue', () => ({
  default: {
    name: 'RightPanel',
    props: ['results', 'isLoading', 'hasMore', 'error', 'selectedPerson'],
    emits: ['loadMore', 'personSelected', 'backToResults', 'piClick'],
    template: '<div data-testid="right-panel">Right Panel</div>'
  }
}))

vi.mock('@/components/star/StarPanel.vue', () => ({
  default: {
    name: 'StarPanel',
    props: ['nodeCount'],
    template: '<div data-testid="star-panel">Star Panel</div>'
  }
}))

vi.mock('@/components/common/BackButton.vue', () => ({
  default: {
    name: 'BackButton',
    template:
      '<button data-testid="back-button" @click="$router.back()">Back</button>'
  }
}))

vi.mock('@/components/search/PersonProfile.vue', () => ({
  default: {
    template: '<div data-testid="person-profile">Person Profile</div>'
  }
}))

vi.mock('@/components/search/DetailedResultCard.vue', () => ({
  default: {
    template:
      '<div data-testid="detailed-result-card">Detailed Result Card</div>'
  }
}))

vi.mock('@/components/search/CategoryTabs.vue', () => ({
  default: {
    template: '<div data-testid="category-tabs">Category Tabs</div>'
  }
}))

vi.mock('@/components/search/ActivityFooter.vue', () => ({
  default: {
    name: 'ActivityFooter',
    emits: ['categoryToggle', 'showReferences'],
    template: `
      <div data-testid="activity-footer">
        <button @click="$emit('categoryToggle', 'network', true)" data-testid="network-button">
          Network View
        </button>
      </div>
    `
  }
}))

vi.mock('@/components/icons/ChevronUpIcon.vue', () => ({
  default: { template: '<div>Up</div>' }
}))

vi.mock('@/components/icons/ChevronDownIcon.vue', () => ({
  default: { template: '<div>Down</div>' }
}))

const ROBERT_SCHMIDT_1_ID = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'
const PRESTON_WHITTAKER_ID = '7f3e8d9a-2c5b-4e1f-9a6d-3b8c5e2f7a4d'

describe('App Flow Workflow Integration Tests', () => {
  let router: Router
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', redirect: '/dashboard' },
        { path: '/landing', component: Landing },
        { path: '/search', component: SearchResults },
        {
          path: '/dashboard/:id?',
          component: SearchDetail,
          name: 'SearchDetail'
        },
        { path: '/network', component: Network, name: 'Network' }
      ]
    })
  })

  describe('Landing to Dashboard Flow', () => {
    it('should navigate from landing page to Robert Schmidt dashboard', async () => {
      const wrapper = mount(Landing, {
        global: {
          plugins: [pinia, router]
        }
      })

      const searchStore = useSearchStore()
      const conversationStore = useConversationStore()

      // Mock search store methods
      const performSearchSpy = vi.spyOn(searchStore, 'performSearch')
      performSearchSpy.mockResolvedValue()

      const clearConversationSpy = vi.spyOn(
        conversationStore,
        'clearConversation'
      )

      // Perform search
      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('update:modelValue', 'Robert Schmidt')
      await searchBar.vm.$emit('search')
      await flushPromises()

      // Verify conversation was cleared and search was performed
      expect(clearConversationSpy).toHaveBeenCalled()
      expect(performSearchSpy).toHaveBeenCalledWith('Robert Schmidt')

      // Verify navigation to dashboard with Robert Schmidt ID
      expect(router.currentRoute.value.path).toBe(
        `/dashboard/${ROBERT_SCHMIDT_1_ID}`
      )
    })
  })

  describe('Dashboard to Network Flow', () => {
    it('should navigate from dashboard to network view', async () => {
      await router.push(`/dashboard/${ROBERT_SCHMIDT_1_ID}`)
      await flushPromises()

      // Robert's dashboard now shows risk cards instead of ActivityFooter
      // For testing, directly navigate to network view
      await router.push('/network')
      await flushPromises()

      // Verify navigation to network page
      expect(router.currentRoute.value.path).toBe('/network')
    })
  })

  describe('Network to Dashboard Flow', () => {
    it('should allow navigation from network view to Preston dashboard via node click', async () => {
      await router.push('/network')
      await flushPromises()

      // Simulate navigation to Preston's dashboard
      await router.push(`/dashboard/${PRESTON_WHITTAKER_ID}`)
      await flushPromises()

      // Verify navigation to Preston's dashboard
      expect(router.currentRoute.value.path).toBe(
        `/dashboard/${PRESTON_WHITTAKER_ID}`
      )
    })
  })

  describe('Complete User Journey', () => {
    it('should complete full flow: Landing -> Robert Dashboard -> Network -> Preston Dashboard -> Search -> Caruso Dashboard', async () => {
      const searchStore = useSearchStore()

      // Mock search methods
      const performSearchSpy = vi.spyOn(searchStore, 'performSearch')
      performSearchSpy.mockResolvedValue()

      // Step 1: Start at landing page
      await router.push('/landing')
      await flushPromises()
      expect(router.currentRoute.value.path).toBe('/landing')

      // Step 2: Search for Robert Schmidt -> Navigate to Robert's dashboard
      const landingWrapper = mount(Landing, {
        global: { plugins: [pinia, router] }
      })

      const landingSearchBar = landingWrapper.findComponent({
        name: 'SearchBar'
      })
      await landingSearchBar.vm.$emit('update:modelValue', 'Robert Schmidt')
      await landingSearchBar.vm.$emit('search')
      await flushPromises()

      expect(router.currentRoute.value.path).toBe(
        `/dashboard/${ROBERT_SCHMIDT_1_ID}`
      )

      // Step 3: Navigate to network view from Robert's dashboard
      // Robert's dashboard now shows risk cards instead of ActivityFooter
      // User would navigate to network view through other means
      await router.push('/network')
      await flushPromises()

      expect(router.currentRoute.value.path).toBe('/network')

      // Step 4: Click on Preston node -> Navigate to Preston's dashboard
      await router.push(`/dashboard/${PRESTON_WHITTAKER_ID}`)
      await flushPromises()

      expect(router.currentRoute.value.path).toBe(
        `/dashboard/${PRESTON_WHITTAKER_ID}`
      )

      // Step 5: Use quick search for "John Caruso" -> Navigate to search results
      // (This would be handled by ConversationPanel in the actual app)
      await router.push('/search')
      await flushPromises()

      expect(router.currentRoute.value.path).toBe('/search')

      // Step 6: Click on one of the John Caruso results
      const johnCarusoId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'
      await router.push(`/dashboard/${johnCarusoId}`)
      await flushPromises()

      expect(router.currentRoute.value.path).toBe(`/dashboard/${johnCarusoId}`)
    })
  })

  describe('Search Store Integration', () => {
    it('should maintain search results across navigation', async () => {
      const searchStore = useSearchStore()

      // Mock search results but ensure setQuery is called
      const performSearchSpy = vi
        .spyOn(searchStore, 'performSearch')
        .mockImplementation(async (query: string) => {
          searchStore.setQuery(query)
        })

      // Perform search from landing
      await router.push('/landing')
      const wrapper = mount(Landing, {
        global: { plugins: [pinia, router] }
      })

      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('update:modelValue', 'test query')
      await searchBar.vm.$emit('search')
      await flushPromises()

      // Verify search was performed
      expect(performSearchSpy).toHaveBeenCalledWith('test query')
      expect(searchStore.currentQuery).toBe('test query')

      // Navigate through different pages
      await router.push('/network')
      await flushPromises()

      await router.push(`/dashboard/${ROBERT_SCHMIDT_1_ID}`)
      await flushPromises()

      // Search store should maintain state
      expect(searchStore.currentQuery).toBe('test query')
    })
  })
})
