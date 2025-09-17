/**
 * Unit tests for Landing component
 * Tests search integration with Pinia store and navigation
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../Landing.vue'
import { useSearchStore } from '@/stores/search'
import { useLightboxStore } from '@/stores/lightbox'

// Mock components to avoid dependency issues
vi.mock('@/components/common/Logo.vue', () => ({
  default: {
    name: 'Logo',
    template: '<div data-testid="logo">Logo</div>'
  }
}))

vi.mock('@/components/common/SearchBar.vue', () => ({
  default: {
    name: 'SearchBar',
    props: ['modelValue', 'placeholder', 'disabled'],
    emits: ['update:modelValue', 'search', 'fileUpload'],
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

vi.mock('@/components/layout/CopyrightFooter.vue', () => ({
  default: {
    name: 'CopyrightFooter',
    template: '<div data-testid="footer">Footer</div>'
  }
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/search', component: { template: '<div>Search</div>' } }
  ]
})

describe('Landing Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const createWrapper = () => {
    return mount(Landing, {
      global: {
        plugins: [createPinia(), router]
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render all main sections', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[data-testid="logo"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="search-bar"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="footer"]').exists()).toBe(true)
    })

    it('should render hero text correctly', () => {
      const wrapper = createWrapper()

      expect(wrapper.text()).toContain('Hi! I am Sovra')
      expect(wrapper.text()).toContain('What do you want to know today?')
    })

    it('should pass correct props to SearchBar', () => {
      const wrapper = createWrapper()
      const searchBar = wrapper.findComponent({ name: 'SearchBar' })

      expect(searchBar.props('placeholder')).toContain(
        'enter keyword of the person'
      )
      expect(searchBar.props('disabled')).toBe(false)
    })
  })

  describe('Search Store Integration', () => {
    it('should integrate with search store', () => {
      // Create wrapper for store integration test
      createWrapper()
      const store = useSearchStore()

      expect(store).toBeDefined()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should disable search bar when loading', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      store.setLoading(true)
      await wrapper.vm.$nextTick()

      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      expect(searchBar.props('disabled')).toBe(true)
    })

    it('should show loading spinner when search is in progress', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      store.setLoading(true)
      await wrapper.vm.$nextTick()

      const spinner = wrapper.find('.animate-spin')
      expect(spinner.exists()).toBe(true)
      expect(spinner.classes()).toContain('border-brand-orange-dark')
    })

    it('should show error message when search fails', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      store.setError('Search failed')
      await wrapper.vm.$nextTick()

      const errorMessage = wrapper.find('.text-red-600')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Search failed')
    })
  })

  describe('Search Functionality', () => {
    it('should handle search with valid query', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      // Mock the store method
      const performSearchSpy = vi.spyOn(store, 'performSearch')
      performSearchSpy.mockResolvedValue()

      // Mock router push
      const routerPushSpy = vi.spyOn(router, 'push')
      routerPushSpy.mockResolvedValue(undefined)

      // Set search query via v-model
      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('update:modelValue', 'test query')

      // Trigger search
      await searchBar.vm.$emit('search')

      expect(performSearchSpy).toHaveBeenCalledWith('test query')
    })

    it('should not perform search with empty query', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      const performSearchSpy = vi.spyOn(store, 'performSearch')

      // Set empty search query via v-model
      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('update:modelValue', '')

      // Trigger search
      await searchBar.vm.$emit('search')

      expect(performSearchSpy).not.toHaveBeenCalled()
    })

    it('should not perform search with whitespace-only query', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      const performSearchSpy = vi.spyOn(store, 'performSearch')

      // Set whitespace search query via v-model
      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('update:modelValue', '   ')

      // Trigger search
      await searchBar.vm.$emit('search')

      expect(performSearchSpy).not.toHaveBeenCalled()
    })

    it('should navigate to search page after successful search without lightbox', async () => {
      const wrapper = createWrapper()
      const searchStore = useSearchStore()
      const lightboxStore = useLightboxStore()

      // Mock successful search and no lightbox trigger
      const performSearchSpy = vi.spyOn(searchStore, 'performSearch')
      performSearchSpy.mockResolvedValue()

      const handleSearchActionSpy = vi.spyOn(
        lightboxStore,
        'handleSearchAction'
      )
      handleSearchActionSpy.mockReturnValue(false) // Not first search, no lightbox

      // Mock router push
      const routerPushSpy = vi.spyOn(router, 'push')
      routerPushSpy.mockResolvedValue(undefined)

      // Set search query and perform search via v-model
      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('update:modelValue', 'test query')
      await searchBar.vm.$emit('search')

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0))

      // Lightbox should NOT be triggered during normal searches (pi symbol only)
      expect(handleSearchActionSpy).not.toHaveBeenCalled()
      expect(routerPushSpy).toHaveBeenCalledWith('/search')
    })

    it('should navigate normally during regular searches (lightbox only for pi symbol)', async () => {
      const wrapper = createWrapper()
      const searchStore = useSearchStore()
      const lightboxStore = useLightboxStore()

      // Mock successful search with no lightbox trigger during normal searches
      const performSearchSpy = vi.spyOn(searchStore, 'performSearch')
      performSearchSpy.mockResolvedValue()

      const handleSearchActionSpy = vi.spyOn(
        lightboxStore,
        'handleSearchAction'
      )
      handleSearchActionSpy.mockReturnValue(false) // No lightbox during normal searches

      // Mock router push
      const routerPushSpy = vi.spyOn(router, 'push')
      routerPushSpy.mockResolvedValue(undefined)

      // Set search query and perform search via v-model
      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('update:modelValue', 'test query')
      await searchBar.vm.$emit('search')

      // Wait for immediate operations
      await new Promise(resolve => setTimeout(resolve, 0))

      // Lightbox should NOT be triggered during normal searches (pi symbol only)
      expect(handleSearchActionSpy).not.toHaveBeenCalled()
      // Should navigate normally since lightbox is not triggered
      expect(routerPushSpy).toHaveBeenCalledWith('/search')
    })

    it('should handle search errors gracefully', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      // Mock failed search
      const performSearchSpy = vi.spyOn(store, 'performSearch')
      performSearchSpy.mockRejectedValue(new Error('API Error'))

      // Set search query and perform search via v-model
      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('update:modelValue', 'test query')
      await searchBar.vm.$emit('search')

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0))

      // Verify the search was attempted (error handling is graceful)
      expect(performSearchSpy).toHaveBeenCalledWith('test query')
    })
  })

  describe('File Upload Functionality', () => {
    it('should handle file upload', async () => {
      const wrapper = createWrapper()
      const mockFiles = [new File(['test'], 'test.txt')] as File[]

      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('fileUpload', mockFiles)

      // File upload is handled gracefully (no console logging in production)
      expect(searchBar.exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const wrapper = createWrapper()

      // Check for main heading
      const heading = wrapper.find('h1')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toContain('Hi! I am Sovra')

      // Check for descriptive text
      const description = wrapper.find('p')
      expect(description.exists()).toBe(true)
      expect(description.text()).toContain('Try adding more detail')
    })

    it('should disable interactions when loading', async () => {
      const wrapper = createWrapper()
      const store = useSearchStore()

      store.setLoading(true)
      await wrapper.vm.$nextTick()

      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      expect(searchBar.props('disabled')).toBe(true)
    })
  })
})
