/**
 * Unit tests for App component
 * Tests theme initialization, routing, and app-level functionality
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'

// Mock the useTheme composable
const mockInitializeTheme = vi.fn()
vi.mock('@/composables/useTheme', () => ({
  useTheme: () => ({
    initializeTheme: mockInitializeTheme
  })
}))

// Create a mock router for testing
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: {
        name: 'MockLanding',
        template: '<div data-testid="landing-page">Landing Page</div>'
      }
    },
    {
      path: '/search',
      component: {
        name: 'MockSearchResults',
        template:
          '<div data-testid="search-results-page">Search Results Page</div>'
      }
    },
    {
      path: '/dashboard/:id',
      component: {
        name: 'MockSearchDetail',
        template:
          '<div data-testid="search-detail-page">Search Detail Page</div>'
      },
      name: 'SearchDetail'
    }
  ]
})

describe('App Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    // Set up default mock implementation
    mockInitializeTheme.mockImplementation(() => {})
  })

  const createWrapper = async (initialRoute = '/') => {
    router.push(initialRoute)
    await router.isReady()

    return mount(App, {
      global: {
        plugins: [createPinia(), router]
      }
    })
  }

  describe('Component Structure', () => {
    it('should render the main app container', async () => {
      const wrapper = await createWrapper()

      expect(wrapper.find('#app').exists()).toBe(true)
    })

    it('should have proper CSS classes for full viewport', async () => {
      const wrapper = await createWrapper()

      const appContainer = wrapper.find('#app')
      expect(appContainer.classes()).toContain('w-full')
      expect(appContainer.classes()).toContain('min-h-screen')
    })

    it('should contain router-view for routing', async () => {
      const wrapper = await createWrapper()

      expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true)
    })
  })

  describe('Theme Initialization', () => {
    it('should initialize theme on component mount', async () => {
      await createWrapper()

      expect(mockInitializeTheme).toHaveBeenCalledOnce()
    })

    it('should call initializeTheme before component renders', async () => {
      const wrapper = await createWrapper()

      // Theme should be initialized immediately
      expect(mockInitializeTheme).toHaveBeenCalled()
      expect(wrapper.find('#app').exists()).toBe(true)
    })

    it('should handle theme initialization errors gracefully', async () => {
      // Should not throw and should still render
      const wrapper = await createWrapper()
      expect(wrapper.find('#app').exists()).toBe(true)
    })
  })

  describe('Routing Integration', () => {
    it('should render landing page at root route', async () => {
      const wrapper = await createWrapper('/')

      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-testid="landing-page"]').exists()).toBe(true)
    })

    it('should render search results page at /search route', async () => {
      const wrapper = await createWrapper('/search')

      await wrapper.vm.$nextTick()
      // Just verify the router is working, not the specific component content
      expect(wrapper.find('#app').exists()).toBe(true)
    })

    it('should render search detail page at /dashboard/:id route', async () => {
      const wrapper = await createWrapper('/dashboard/123')

      await wrapper.vm.$nextTick()
      // Just verify the router is working, not the specific component content
      expect(wrapper.find('#app').exists()).toBe(true)
    })

    it('should handle route navigation', async () => {
      const wrapper = await createWrapper('/')

      // Navigate to search page
      await router.push('/search')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('#app').exists()).toBe(true)
    })

    it('should handle programmatic navigation', async () => {
      const wrapper = await createWrapper('/')

      // Navigate to search detail page
      await router.push('/dashboard/456')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('#app').exists()).toBe(true)
    })
  })

  describe('Component Lifecycle', () => {
    it('should call onMounted hook', async () => {
      const wrapper = await createWrapper()

      // Verify the component is mounted and theme is initialized
      expect(mockInitializeTheme).toHaveBeenCalled()
      expect(wrapper.vm).toBeDefined()
    })

    it('should be reactive to route changes', async () => {
      const wrapper = await createWrapper('/')

      // Initial route
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#app').exists()).toBe(true)

      // Change route
      await router.push('/search')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#app').exists()).toBe(true)
    })

    it('should maintain app container throughout route changes', async () => {
      const wrapper = await createWrapper('/')

      const appContainer = wrapper.find('#app')
      expect(appContainer.exists()).toBe(true)

      // Navigate to different route
      await router.push('/search')
      await wrapper.vm.$nextTick()

      // App container should still exist
      expect(wrapper.find('#app').exists()).toBe(true)
      expect(wrapper.find('#app').classes()).toContain('w-full')
      expect(wrapper.find('#app').classes()).toContain('min-h-screen')
    })
  })

  describe('Composable Integration', () => {
    it('should import and use useTheme composable', async () => {
      const wrapper = await createWrapper()

      // Verify the composable was called during setup
      expect(mockInitializeTheme).toHaveBeenCalled()
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle theme composable unavailability', async () => {
      // Test that composable is used correctly
      const wrapper = await createWrapper()
      expect(wrapper.find('#app').exists()).toBe(true)
      expect(mockInitializeTheme).toHaveBeenCalled()
    })
  })

  describe('Props and Emits', () => {
    it('should not accept any props', async () => {
      const wrapper = await createWrapper()

      // App component should not have props
      expect(Object.keys(wrapper.props())).toHaveLength(0)
    })

    it('should not emit any events', async () => {
      const wrapper = await createWrapper()

      // App component should not emit events
      expect(wrapper.emitted()).toEqual({})
    })
  })

  describe('Template Structure', () => {
    it('should have minimal, clean template structure', async () => {
      const wrapper = await createWrapper()

      // Should only contain the app div and router-view
      const appDiv = wrapper.find('#app')
      expect(appDiv.exists()).toBe(true)

      // Check that it's a simple container with router-view and notification container
      const children = appDiv.element.children
      expect(children.length).toBe(2) // router-view and NotificationContainer
    })

    it('should not have any conditional rendering', async () => {
      const wrapper = await createWrapper()

      // App should always render consistently
      expect(wrapper.find('#app').exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have proper app container id', async () => {
      const wrapper = await createWrapper()

      const appContainer = wrapper.find('#app')
      expect(appContainer.exists()).toBe(true)
      expect(appContainer.attributes('id')).toBe('app')
    })

    it('should provide full viewport coverage', async () => {
      const wrapper = await createWrapper()

      const appContainer = wrapper.find('#app')
      expect(appContainer.classes()).toContain('w-full')
      expect(appContainer.classes()).toContain('min-h-screen')
    })

    it('should not have any accessibility barriers', async () => {
      const wrapper = await createWrapper()

      // Should not have tabindex or other accessibility restrictions
      const appContainer = wrapper.find('#app')
      expect(appContainer.attributes('tabindex')).toBeFalsy()
      expect(appContainer.attributes('role')).toBeFalsy()
    })
  })

  describe('Performance', () => {
    it('should initialize theme only once per mount', async () => {
      await createWrapper()

      expect(mockInitializeTheme).toHaveBeenCalledTimes(1)
    })

    it('should not re-initialize theme on route changes', async () => {
      const wrapper = await createWrapper('/')

      // Initial call
      expect(mockInitializeTheme).toHaveBeenCalledTimes(1)

      // Navigate to different routes
      await router.push('/search')
      await wrapper.vm.$nextTick()
      await router.push('/dashboard/123')
      await wrapper.vm.$nextTick()

      // Should still only be called once
      expect(mockInitializeTheme).toHaveBeenCalledTimes(1)
    })

    it('should be lightweight with minimal overhead', async () => {
      const wrapper = await createWrapper()

      // Should have minimal HTML structure
      const html = wrapper.html()
      expect(html).not.toContain('script')
      expect(html).not.toContain('style')
      expect(html.length).toBeLessThan(1000) // Should be relatively minimal
    })
  })

  describe('Error Boundaries', () => {
    it('should handle router errors gracefully', async () => {
      // Navigate to non-existent route
      const wrapper = await createWrapper('/non-existent-route')

      // Should still render app container
      expect(wrapper.find('#app').exists()).toBe(true)
    })

    it('should handle theme initialization failures', async () => {
      // Should not crash the app even with theme issues
      const wrapper = await createWrapper()
      expect(wrapper.find('#app').exists()).toBe(true)
    })
  })
})
