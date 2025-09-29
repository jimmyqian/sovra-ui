/**
 * Integration tests for Sidebar Search Popout functionality
 * Tests complete user workflow from clicking sidebar search to navigation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import AppSidebar from '@/components/navigation/AppSidebar.vue'
import { useSearchStore } from '@/stores/search'

// Mock SearchPopout with more detailed implementation for integration testing
vi.mock('@/components/navigation/SearchPopout.vue', () => ({
  default: {
    name: 'SearchPopout',
    props: ['isVisible'],
    emits: ['close', 'search', 'fileUpload'],
    template: `
      <div v-if="isVisible" data-testid="search-popout" class="search-popout-container">
        <div class="search-popout-content">
          <h3>Quick Search</h3>
          <button @click="$emit('close')" data-testid="close-button">Close</button>
          <textarea
            data-testid="search-input"
            v-model="searchQuery"
            placeholder="What are you looking for?"
            @keydown.enter.prevent="handleSearch"
          ></textarea>
          <button
            @click="handleSearch"
            data-testid="search-button"
            :disabled="!searchQuery.trim()"
          >
            Search
          </button>
          <button @click="triggerUpload" data-testid="upload-button">Upload</button>
          <input
            type="file"
            ref="fileInput"
            data-testid="file-input"
            @change="handleFileUpload"
            style="display: none"
          />
        </div>
      </div>
    `,
    data() {
      return {
        searchQuery: ''
      }
    },
    methods: {
      handleSearch() {
        if ((this as any).searchQuery.trim()) {
          ;(this as any).$emit('search', (this as any).searchQuery.trim())
        }
      },
      triggerUpload() {
        ;((this as any).$refs.fileInput as HTMLInputElement)?.click()
      },
      handleFileUpload(event: Event) {
        const files = (event.target as HTMLInputElement).files
        if (files) {
          ;(this as any).$emit('fileUpload', files)
        }
      }
    }
  }
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/search', component: { template: '<div>Search Page</div>' } },
    {
      path: '/search-results',
      component: { template: '<div>Search Results Page</div>' }
    }
  ]
})

describe('Sidebar Search Popout Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const createWrapper = () => {
    return mount(AppSidebar, {
      global: {
        plugins: [createPinia(), router]
      },
      attachTo: document.body
    })
  }

  describe('Search Button Click Workflow', () => {
    it('opens search popout when search button is clicked', async () => {
      const wrapper = createWrapper()

      // Find and click the search button (first icon with orange background)
      const searchButton = wrapper.find('.bg-brand-orange')
      expect(searchButton.exists()).toBe(true)

      await searchButton.trigger('click')

      // Popout should be visible
      expect(wrapper.find('[data-testid="search-popout"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Quick Search')
    })

    it('closes search popout when close button is clicked', async () => {
      const wrapper = createWrapper()

      // Open popout
      const searchButton = wrapper.find('.bg-brand-orange')
      await searchButton.trigger('click')

      // Verify popout is open
      expect(wrapper.find('[data-testid="search-popout"]').exists()).toBe(true)

      // Close popout
      const closeButton = wrapper.find('[data-testid="close-button"]')
      await closeButton.trigger('click')

      // Popout should be closed
      expect(wrapper.find('[data-testid="search-popout"]').exists()).toBe(false)
    })
  })

  describe('Search Query Workflow', () => {
    it('performs complete search workflow from sidebar to navigation', async () => {
      const wrapper = createWrapper()
      const searchStore = useSearchStore()

      // Spy on router push
      const routerPushSpy = vi.spyOn(router, 'push')

      // Open popout
      const searchButton = wrapper.find('.bg-brand-orange')
      await searchButton.trigger('click')

      // Enter search query
      const searchInput = wrapper.find('[data-testid="search-input"]')
      expect(searchInput.exists()).toBe(true)
      await searchInput.setValue('test search query')

      // Click search button
      const searchActionButton = wrapper.find('[data-testid="search-button"]')
      expect(searchActionButton.exists()).toBe(true)
      await searchActionButton.trigger('click')

      // Verify search store was updated
      expect(searchStore.currentQuery).toBe('test search query')

      // Verify navigation occurred
      expect(routerPushSpy).toHaveBeenCalledWith('/search-results')

      // Verify popout is closed after search
      expect(wrapper.find('[data-testid="search-popout"]').exists()).toBe(false)
    })

    it('handles Enter key press in search input', async () => {
      const wrapper = createWrapper()
      const searchStore = useSearchStore()
      const routerPushSpy = vi.spyOn(router, 'push')

      // Open popout and enter query
      const searchButton = wrapper.find('.bg-brand-orange')
      await searchButton.trigger('click')

      const searchInput = wrapper.find('[data-testid="search-input"]')
      await searchInput.setValue('keyboard search')
      await searchInput.trigger('keydown.enter')

      // Verify search was triggered
      expect(searchStore.currentQuery).toBe('keyboard search')
      expect(routerPushSpy).toHaveBeenCalledWith('/search-results')
    })

    it('trims whitespace from search queries', async () => {
      const wrapper = createWrapper()
      const searchStore = useSearchStore()

      // Open popout and enter query with whitespace
      const searchButton = wrapper.find('.bg-brand-orange')
      await searchButton.trigger('click')

      const searchInput = wrapper.find('[data-testid="search-input"]')
      await searchInput.setValue('  whitespace test  ')

      const searchActionButton = wrapper.find('[data-testid="search-button"]')
      await searchActionButton.trigger('click')

      // Verify whitespace was trimmed
      expect(searchStore.currentQuery).toBe('whitespace test')
    })

    it('does not perform search with empty query', async () => {
      const wrapper = createWrapper()
      const searchStore = useSearchStore()
      const routerPushSpy = vi.spyOn(router, 'push')

      // Open popout without entering query
      const searchButton = wrapper.find('.bg-brand-orange')
      await searchButton.trigger('click')

      const searchActionButton = wrapper.find('[data-testid="search-button"]')
      expect(searchActionButton.attributes('disabled')).toBeDefined()

      // Try to click (should not work)
      await searchActionButton.trigger('click')

      // Verify no search occurred
      expect(searchStore.currentQuery).toBe('')
      expect(routerPushSpy).not.toHaveBeenCalled()
    })
  })

  describe('File Upload Workflow', () => {
    it('handles file upload from sidebar popout', async () => {
      const wrapper = createWrapper()

      // Open popout
      const searchButton = wrapper.find('.bg-brand-orange')
      await searchButton.trigger('click')

      // Click upload button
      const uploadButton = wrapper.find('[data-testid="upload-button"]')
      expect(uploadButton.exists()).toBe(true)

      // Mock file input click
      const fileInput = wrapper.find('[data-testid="file-input"]')
      const clickSpy = vi.spyOn(fileInput.element as HTMLInputElement, 'click')

      await uploadButton.trigger('click')

      // Verify file input was triggered
      expect(clickSpy).toHaveBeenCalled()
    })

    it('processes file upload and closes popout', async () => {
      const wrapper = createWrapper()

      // Open popout
      const searchButton = wrapper.find('.bg-brand-orange')
      await searchButton.trigger('click')

      // Simulate file selection
      const fileInput = wrapper.find('[data-testid="file-input"]')
      const mockFiles = [new File(['test'], 'test.txt')] as unknown as FileList

      Object.defineProperty(fileInput.element, 'files', {
        value: mockFiles,
        configurable: true
      })

      await fileInput.trigger('change')

      // Wait for event processing
      await nextTick()

      // Verify popout is closed after file upload
      expect(wrapper.find('[data-testid="search-popout"]').exists()).toBe(false)
    })
  })

  describe('User Experience Flow', () => {
    it('maintains search button active state', () => {
      const wrapper = createWrapper()

      const searchButton = wrapper.find('.bg-brand-orange')
      expect(searchButton.classes()).toContain('bg-brand-orange')
      expect(searchButton.classes()).toContain('text-bg-card')
    })

    it('provides visual feedback on search button', () => {
      const wrapper = createWrapper()

      const searchButton = wrapper.find('.bg-brand-orange')
      expect(searchButton.classes()).toContain('cursor-pointer')
      expect(searchButton.classes()).toContain('transition-colors')
    })

    it('shows proper accessibility attributes', () => {
      const wrapper = createWrapper()

      const searchButton = wrapper.find('.bg-brand-orange')
      expect(searchButton.attributes('aria-label')).toBe('Open search')
      expect(searchButton.attributes('title')).toBe('Search')
    })
  })

  describe('State Management Integration', () => {
    it('updates search store correctly during workflow', async () => {
      const wrapper = createWrapper()
      const searchStore = useSearchStore()

      // Initial state
      expect(searchStore.currentQuery).toBe('')

      // Perform search
      const searchButton = wrapper.find('.bg-brand-orange')
      await searchButton.trigger('click')

      const searchInput = wrapper.find('[data-testid="search-input"]')
      await searchInput.setValue('integration test query')

      const searchActionButton = wrapper.find('[data-testid="search-button"]')
      await searchActionButton.trigger('click')

      // Verify store state
      expect(searchStore.currentQuery).toBe('integration test query')
    })

    it('handles multiple search operations correctly', async () => {
      const wrapper = createWrapper()
      const searchStore = useSearchStore()

      // First search
      let searchButton = wrapper.find('.bg-brand-orange')
      await searchButton.trigger('click')

      let searchInput = wrapper.find('[data-testid="search-input"]')
      await searchInput.setValue('first search')

      let searchActionButton = wrapper.find('[data-testid="search-button"]')
      await searchActionButton.trigger('click')

      expect(searchStore.currentQuery).toBe('first search')

      // Second search
      searchButton = wrapper.find('.bg-brand-orange')
      await searchButton.trigger('click')

      searchInput = wrapper.find('[data-testid="search-input"]')
      await searchInput.setValue('second search')

      searchActionButton = wrapper.find('[data-testid="search-button"]')
      await searchActionButton.trigger('click')

      expect(searchStore.currentQuery).toBe('second search')
    })
  })

  describe('Error Handling', () => {
    it('handles component mounting without errors', () => {
      expect(() => createWrapper()).not.toThrow()
    })

    it('handles popout state changes gracefully', async () => {
      const wrapper = createWrapper()

      // Rapid open/close operations
      const searchButton = wrapper.find('.bg-brand-orange')

      await searchButton.trigger('click')
      expect(wrapper.find('[data-testid="search-popout"]').exists()).toBe(true)

      const closeButton = wrapper.find('[data-testid="close-button"]')
      await closeButton.trigger('click')
      expect(wrapper.find('[data-testid="search-popout"]').exists()).toBe(false)

      // Should be able to open again
      await searchButton.trigger('click')
      expect(wrapper.find('[data-testid="search-popout"]').exists()).toBe(true)
    })
  })
})
