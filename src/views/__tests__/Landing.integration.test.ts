/**
 * Integration tests for Landing page with lightbox functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import Landing from '../Landing.vue'
import { useSearchStore } from '@/stores/search'
import { useLightboxStore } from '@/stores/lightbox'

// Mock router
const mockPush = vi.fn()
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Landing },
    { path: '/search', component: { template: '<div>Search Results</div>' } }
  ]
})

router.push = mockPush

// Mock stores
vi.mock('@/stores/search', () => ({
  useSearchStore: vi.fn()
}))

vi.mock('@/stores/lightbox', () => ({
  useLightboxStore: vi.fn()
}))

// Mock components that aren't needed for this test
vi.mock('@/components/common/Logo.vue', () => ({
  default: { template: '<div data-testid="logo">Logo</div>' }
}))

vi.mock('@/components/layout/CopyrightFooter.vue', () => ({
  default: { template: '<div data-testid="footer">Footer</div>' }
}))

describe('Landing Page Integration', () => {
  let wrapper: VueWrapper<any>
  let mockSearchStore: any
  let mockLightboxStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    // Setup mock stores
    mockSearchStore = {
      isLoading: false,
      error: null,
      performSearch: vi.fn()
    }

    mockLightboxStore = {
      isVisible: false,
      videoUrl: 'https://youtu.be/3MH54ewvcWo',
      handleSearchAction: vi.fn(),
      hideLightbox: vi.fn()
    }
    ;(useSearchStore as any).mockReturnValue(mockSearchStore)
    ;(useLightboxStore as any).mockReturnValue(mockLightboxStore)
  })

  const createWrapper = () => {
    return mount(Landing, {
      global: {
        plugins: [router]
      }
    })
  }

  describe('First Search Lightbox Integration', () => {
    it('triggers lightbox on first search and delays navigation', async () => {
      mockLightboxStore.handleSearchAction.mockReturnValue(true) // First search
      mockSearchStore.performSearch.mockResolvedValue(undefined)

      wrapper = createWrapper()
      const searchInput = wrapper.find('textarea')
      const searchButton = wrapper.find('button[class*="btn-primary"]')

      // Enter search query
      await searchInput.setValue('test query')
      await searchButton.trigger('click')
      await flushPromises()

      // Verify lightbox was triggered
      expect(mockLightboxStore.handleSearchAction).toHaveBeenCalled()
      expect(mockSearchStore.performSearch).toHaveBeenCalledWith('test query')

      // Navigation should be delayed, not immediate
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('navigates immediately on subsequent searches', async () => {
      mockLightboxStore.handleSearchAction.mockReturnValue(false) // Not first search
      mockSearchStore.performSearch.mockResolvedValue(undefined)

      wrapper = createWrapper()
      const searchInput = wrapper.find('textarea')
      const searchButton = wrapper.find('button[class*="btn-primary"]')

      // Enter search query
      await searchInput.setValue('test query')
      await searchButton.trigger('click')
      await flushPromises()

      // Verify search was performed
      expect(mockLightboxStore.handleSearchAction).toHaveBeenCalled()
      expect(mockSearchStore.performSearch).toHaveBeenCalledWith('test query')

      // Navigation should be immediate
      expect(mockPush).toHaveBeenCalledWith('/search')
    })

    it('handles Enter key press correctly', async () => {
      mockLightboxStore.handleSearchAction.mockReturnValue(true)
      mockSearchStore.performSearch.mockResolvedValue(undefined)

      wrapper = createWrapper()
      const searchInput = wrapper.find('textarea')

      // Enter search query and press Enter
      await searchInput.setValue('test query')
      await searchInput.trigger('keypress.enter')
      await flushPromises()

      // Verify lightbox was triggered
      expect(mockLightboxStore.handleSearchAction).toHaveBeenCalled()
      expect(mockSearchStore.performSearch).toHaveBeenCalledWith('test query')
    })

    it('does not search with empty query', async () => {
      wrapper = createWrapper()
      const searchButton = wrapper.find('button[class*="btn-primary"]')

      await searchButton.trigger('click')
      await flushPromises()

      // Verify no search was performed
      expect(mockLightboxStore.handleSearchAction).not.toHaveBeenCalled()
      expect(mockSearchStore.performSearch).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('does not search with whitespace-only query', async () => {
      wrapper = createWrapper()
      const searchInput = wrapper.find('textarea')
      const searchButton = wrapper.find('button[class*="btn-primary"]')

      await searchInput.setValue('   ')
      await searchButton.trigger('click')
      await flushPromises()

      // Verify no search was performed
      expect(mockLightboxStore.handleSearchAction).not.toHaveBeenCalled()
      expect(mockSearchStore.performSearch).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Search Error Handling', () => {
    it('handles search errors gracefully with lightbox', async () => {
      mockLightboxStore.handleSearchAction.mockReturnValue(true)
      mockSearchStore.performSearch.mockRejectedValue(
        new Error('Search failed')
      )

      wrapper = createWrapper()
      const searchInput = wrapper.find('textarea')
      const searchButton = wrapper.find('button[class*="btn-primary"]')

      await searchInput.setValue('test query')
      await searchButton.trigger('click')
      await flushPromises()

      // Verify lightbox was triggered even on error
      expect(mockLightboxStore.handleSearchAction).toHaveBeenCalled()
      expect(mockSearchStore.performSearch).toHaveBeenCalledWith('test query')

      // Navigation should not happen on error
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('handles search errors gracefully without lightbox', async () => {
      mockLightboxStore.handleSearchAction.mockReturnValue(false)
      mockSearchStore.performSearch.mockRejectedValue(
        new Error('Search failed')
      )

      wrapper = createWrapper()
      const searchInput = wrapper.find('textarea')
      const searchButton = wrapper.find('button[class*="btn-primary"]')

      await searchInput.setValue('test query')
      await searchButton.trigger('click')
      await flushPromises()

      // Verify search was attempted
      expect(mockLightboxStore.handleSearchAction).toHaveBeenCalled()
      expect(mockSearchStore.performSearch).toHaveBeenCalledWith('test query')

      // Navigation should not happen on error
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Loading State Integration', () => {
    it('disables search when loading', async () => {
      mockSearchStore.isLoading = true

      wrapper = createWrapper()
      const searchInput = wrapper.find('textarea')
      const searchButton = wrapper.find('button[class*="btn-primary"]')

      // Verify elements are disabled
      expect(searchInput.attributes('disabled')).toBeDefined()
      expect(searchButton.attributes('disabled')).toBeDefined()

      // Verify loading spinner is shown
      expect(wrapper.find('.animate-spin').exists()).toBe(true)
    })

    it('enables search when not loading', async () => {
      mockSearchStore.isLoading = false

      wrapper = createWrapper()
      const searchInput = wrapper.find('textarea')
      const searchButton = wrapper.find('button[class*="btn-primary"]')

      // Verify elements are not disabled
      expect(searchInput.attributes('disabled')).toBeUndefined()
      expect(searchButton.attributes('disabled')).toBeUndefined()

      // Verify loading spinner is not shown
      expect(wrapper.find('.animate-spin').exists()).toBe(false)
    })
  })

  describe('Error Display Integration', () => {
    it('displays error message when search store has error', async () => {
      mockSearchStore.error = 'Something went wrong'

      wrapper = createWrapper()

      // Verify error message is displayed
      const errorElement = wrapper.find('.text-red-600')
      expect(errorElement.exists()).toBe(true)
      expect(errorElement.text()).toBe('Something went wrong')
    })

    it('does not display error message when no error', async () => {
      mockSearchStore.error = null

      wrapper = createWrapper()

      // Verify no error message is displayed
      expect(wrapper.find('.text-red-600').exists()).toBe(false)
    })
  })

  describe('Accessibility Integration', () => {
    it('maintains proper heading hierarchy', () => {
      wrapper = createWrapper()

      const h1 = wrapper.find('h1')
      const h2 = wrapper.find('h2')

      expect(h1.exists()).toBe(true)
      expect(h2.exists()).toBe(true)
      expect(h1.text()).toContain('Sovra')
      expect(h2.text()).toContain('want to know')
    })

    it('provides descriptive text for search functionality', () => {
      wrapper = createWrapper()

      const description = wrapper.find('p.text-text-secondary')
      expect(description.exists()).toBe(true)
      expect(description.text()).toContain('Try adding more detail')
    })
  })
})
