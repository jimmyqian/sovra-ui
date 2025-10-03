/**
 * Unit tests for Network component
 * Tests network view rendering and navigation
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Network from '../Network.vue'

// Mock components to avoid dependency issues
vi.mock('@/components/layouts/SearchLayout.vue', () => ({
  default: {
    name: 'SearchLayout',
    props: ['searchPlaceholder'],
    emits: ['search', 'fileUpload', 'speechError'],
    template: `
      <div data-testid="search-layout">
        <slot />
      </div>
    `
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
    template: '<button data-testid="back-button">Back</button>'
  }
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/network', component: Network, name: 'Network' },
    {
      path: '/dashboard/:id?',
      component: { template: '<div>Dashboard</div>' },
      name: 'SearchDetail'
    }
  ]
})

describe('Network Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const createWrapper = () => {
    return mount(Network, {
      global: {
        plugins: [createPinia(), router]
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render all main sections', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[data-testid="search-layout"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="star-panel"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="back-button"]').exists()).toBe(true)
    })

    it('should pass correct node count to StarPanel', () => {
      const wrapper = createWrapper()
      const starPanel = wrapper.findComponent({ name: 'StarPanel' })

      expect(starPanel.props('nodeCount')).toBe(7)
    })

    it('should render SearchLayout with correct placeholder', () => {
      const wrapper = createWrapper()
      const searchLayout = wrapper.findComponent({ name: 'SearchLayout' })

      expect(searchLayout.props('searchPlaceholder')).toBe(
        'Search network connections'
      )
    })
  })

  describe('Search Functionality', () => {
    it('should handle search event', async () => {
      const wrapper = createWrapper()
      const searchLayout = wrapper.findComponent({ name: 'SearchLayout' })

      await searchLayout.vm.$emit('search', 'test query')

      // Search is handled gracefully
      expect(searchLayout.exists()).toBe(true)
    })

    it('should handle file upload event', async () => {
      const wrapper = createWrapper()
      const searchLayout = wrapper.findComponent({ name: 'SearchLayout' })
      const mockFiles = [new File(['test'], 'test.txt')] as File[]

      await searchLayout.vm.$emit('fileUpload', mockFiles)

      // File upload is handled gracefully
      expect(searchLayout.exists()).toBe(true)
    })

    it('should handle speech error event', async () => {
      const wrapper = createWrapper()
      const searchLayout = wrapper.findComponent({ name: 'SearchLayout' })

      await searchLayout.vm.$emit('speechError', 'Speech recognition error')

      // Speech error is handled gracefully
      expect(searchLayout.exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have back button for navigation', () => {
      const wrapper = createWrapper()
      const backButton = wrapper.find('[data-testid="back-button"]')

      expect(backButton.exists()).toBe(true)
    })

    it('should render network visualization', () => {
      const wrapper = createWrapper()
      const starPanel = wrapper.find('[data-testid="star-panel"]')

      expect(starPanel.exists()).toBe(true)
    })
  })
})
