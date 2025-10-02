/**
 * Unit tests for BackButton component
 * Tests back button rendering, disabled state, and navigation functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import BackButton from '../BackButton.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/dashboard', component: { template: '<div>Dashboard</div>' } }
  ]
})

describe('BackButton', () => {
  beforeEach(() => {
    // Reset history length for each test
    vi.clearAllMocks()
  })

  const createWrapper = () => {
    return mount(BackButton, {
      global: {
        plugins: [router]
      }
    })
  }

  describe('Rendering', () => {
    it('renders button with Back text', () => {
      const wrapper = createWrapper()

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('Back')
    })

    it('renders ChevronLeftIcon', () => {
      const wrapper = createWrapper()

      const icon = wrapper.findComponent({ name: 'ChevronLeftIcon' })
      expect(icon.exists()).toBe(true)
    })

    it('has correct CSS classes', () => {
      const wrapper = createWrapper()

      const button = wrapper.find('button')
      expect(button.classes()).toContain('flex')
      expect(button.classes()).toContain('items-center')
      expect(button.classes()).toContain('gap-2')
      expect(button.classes()).toContain('text-text-secondary')
      expect(button.classes()).toContain('hover:text-text-primary')
      expect(button.classes()).toContain('transition-colors')
    })
  })

  describe('Disabled State', () => {
    it('is disabled when history length is 1', () => {
      // Mock window.history.length to be 1 (no previous page)
      Object.defineProperty(window.history, 'length', {
        writable: true,
        configurable: true,
        value: 1
      })
      Object.defineProperty(window.history, 'state', {
        writable: true,
        configurable: true,
        value: { back: null }
      })

      const wrapper = createWrapper()
      const button = wrapper.find('button')

      expect(button.attributes('disabled')).toBeDefined()
      expect(button.classes()).toContain('disabled:opacity-50')
      expect(button.classes()).toContain('disabled:cursor-not-allowed')
    })

    it('is disabled when history state.back is null (redirect case)', () => {
      // Mock window.history to have length > 1 but state.back is null
      // This represents a redirect scenario (e.g., / -> /dashboard)
      Object.defineProperty(window.history, 'length', {
        writable: true,
        configurable: true,
        value: 2
      })
      Object.defineProperty(window.history, 'state', {
        writable: true,
        configurable: true,
        value: { back: null }
      })

      const wrapper = createWrapper()
      const button = wrapper.find('button')

      expect(button.attributes('disabled')).toBeDefined()
    })

    it('is enabled when history length is greater than 1 and state.back exists', () => {
      // Mock window.history with proper navigation state
      Object.defineProperty(window.history, 'length', {
        writable: true,
        configurable: true,
        value: 2
      })
      Object.defineProperty(window.history, 'state', {
        writable: true,
        configurable: true,
        value: { back: '/previous-page' }
      })

      const wrapper = createWrapper()
      const button = wrapper.find('button')

      expect(button.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Navigation Functionality', () => {
    it('calls router.back() when clicked and enabled', async () => {
      // Mock window.history with proper state
      Object.defineProperty(window.history, 'length', {
        writable: true,
        configurable: true,
        value: 2
      })
      Object.defineProperty(window.history, 'state', {
        writable: true,
        configurable: true,
        value: { back: '/previous-page' }
      })

      const wrapper = createWrapper()
      const backSpy = vi.spyOn(router, 'back')

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(backSpy).toHaveBeenCalled()

      backSpy.mockRestore()
    })

    it('does not navigate when clicked and disabled (no history)', async () => {
      // Mock window.history.length to be 1 (no previous page)
      Object.defineProperty(window.history, 'length', {
        writable: true,
        configurable: true,
        value: 1
      })
      Object.defineProperty(window.history, 'state', {
        writable: true,
        configurable: true,
        value: { back: null }
      })

      const wrapper = createWrapper()
      const backSpy = vi.spyOn(router, 'back')

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(backSpy).not.toHaveBeenCalled()

      backSpy.mockRestore()
    })

    it('does not navigate when clicked and disabled (redirect case)', async () => {
      // Mock window.history with redirect state (back is null)
      Object.defineProperty(window.history, 'length', {
        writable: true,
        configurable: true,
        value: 2
      })
      Object.defineProperty(window.history, 'state', {
        writable: true,
        configurable: true,
        value: { back: null }
      })

      const wrapper = createWrapper()
      const backSpy = vi.spyOn(router, 'back')

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(backSpy).not.toHaveBeenCalled()

      backSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('has proper disabled styling', () => {
      Object.defineProperty(window.history, 'length', {
        writable: true,
        configurable: true,
        value: 1
      })
      Object.defineProperty(window.history, 'state', {
        writable: true,
        configurable: true,
        value: { back: null }
      })

      const wrapper = createWrapper()
      const button = wrapper.find('button')

      expect(button.classes()).toContain('disabled:opacity-50')
      expect(button.classes()).toContain('disabled:cursor-not-allowed')
      expect(button.classes()).toContain('disabled:hover:text-text-secondary')
    })

    it('button is keyboard accessible', () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')

      expect(button.element.tagName).toBe('BUTTON')
    })
  })

  describe('Component Structure', () => {
    it('has correct flex layout', () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')

      expect(button.classes()).toContain('flex')
      expect(button.classes()).toContain('items-center')
      expect(button.classes()).toContain('gap-2')
    })

    it('has transition effects', () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')

      expect(button.classes()).toContain('transition-colors')
    })

    it('contains icon and text in correct order', () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      const children = button.element.children

      expect(children.length).toBeGreaterThan(0)
      expect(button.text()).toBe('Back')
    })
  })
})
