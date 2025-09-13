/**
 * Unit tests for ActionButton conversation component
 * Tests button rendering, variants, click events, and styling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ActionButton from '../ActionButton.vue'
import type { ActionButtonItem } from '@/types/conversation'

describe('ActionButton', () => {
  const mockOnClick = vi.fn()

  const baseItem: ActionButtonItem = {
    id: 'button-1',
    type: 'action-button',
    text: 'Click me',
    onClick: mockOnClick
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders button element', () => {
      const wrapper = mount(ActionButton, {
        props: { item: baseItem }
      })

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('Click me')
    })

    it('applies base classes', () => {
      const wrapper = mount(ActionButton, {
        props: { item: baseItem }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('px-4')
      expect(button.classes()).toContain('py-2')
      expect(button.classes()).toContain('rounded-full')
      expect(button.classes()).toContain('text-sm')
      expect(button.classes()).toContain('cursor-pointer')
      expect(button.classes()).toContain('transition-colors')
    })
  })

  describe('Button Variants', () => {
    it('applies primary variant classes', () => {
      const primaryItem = {
        ...baseItem,
        variant: 'primary' as const
      }

      const wrapper = mount(ActionButton, {
        props: { item: primaryItem }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-brand-orange')
      expect(button.classes()).toContain('text-bg-card')
      expect(button.classes()).toContain('hover:bg-brand-orange-light')
    })

    it('applies secondary variant classes', () => {
      const secondaryItem = {
        ...baseItem,
        variant: 'secondary' as const
      }

      const wrapper = mount(ActionButton, {
        props: { item: secondaryItem }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-bg-secondary')
      expect(button.classes()).toContain('border')
      expect(button.classes()).toContain('border-border-light')
      expect(button.classes()).toContain('hover:bg-border-hover')
    })

    it('applies dashed variant classes (default)', () => {
      const wrapper = mount(ActionButton, {
        props: { item: baseItem }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-bg-button')
      expect(button.classes()).toContain('border')
      expect(button.classes()).toContain('border-dashed')
      expect(button.classes()).toContain('border-border-dashed')
      expect(button.classes()).toContain('hover:bg-border-hover')
      expect(button.classes()).toContain('text-brand-orange')
    })

    it('applies dashed variant when explicitly specified', () => {
      const dashedItem = {
        ...baseItem,
        variant: 'dashed' as const
      }

      const wrapper = mount(ActionButton, {
        props: { item: dashedItem }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-bg-button')
      expect(button.classes()).toContain('border-dashed')
      expect(button.classes()).toContain('text-brand-orange')
    })
  })

  describe('Custom Classes', () => {
    it('applies custom className when provided', () => {
      const customItem = {
        ...baseItem,
        className: 'custom-btn-class w-full'
      }

      const wrapper = mount(ActionButton, {
        props: { item: customItem }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('custom-btn-class')
      expect(button.classes()).toContain('w-full')
      // Should also retain base classes
      expect(button.classes()).toContain('px-4')
      expect(button.classes()).toContain('rounded-full')
    })

    it('works without custom className', () => {
      const wrapper = mount(ActionButton, {
        props: { item: baseItem }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('px-4')
      expect(button.classes()).toContain('py-2')
      expect(button.classes()).toContain('rounded-full')
    })
  })

  describe('Click Events', () => {
    it('calls onClick when button is clicked', async () => {
      const wrapper = mount(ActionButton, {
        props: { item: baseItem }
      })

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('handles multiple clicks', async () => {
      const wrapper = mount(ActionButton, {
        props: { item: baseItem }
      })

      const button = wrapper.find('button')
      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')

      expect(mockOnClick).toHaveBeenCalledTimes(3)
    })

    it('handles buttons without onClick gracefully', async () => {
      const itemWithoutClick = {
        ...baseItem,
        onClick: undefined
      }

      const wrapper = mount(ActionButton, {
        props: { item: itemWithoutClick }
      })

      const button = wrapper.find('button')

      // Should not throw error when clicking
      await expect(button.trigger('click')).resolves.not.toThrow()
    })
  })

  describe('Text Content', () => {
    it('displays button text correctly', () => {
      const textItem = {
        ...baseItem,
        text: 'Create a new filter'
      }

      const wrapper = mount(ActionButton, {
        props: { item: textItem }
      })

      const button = wrapper.find('button')
      expect(button.text()).toBe('Create a new filter')
    })

    it('handles empty text', () => {
      const emptyTextItem = {
        ...baseItem,
        text: ''
      }

      const wrapper = mount(ActionButton, {
        props: { item: emptyTextItem }
      })

      const button = wrapper.find('button')
      expect(button.text()).toBe('')
      expect(button.exists()).toBe(true)
    })

    it('handles long text content', () => {
      const longTextItem = {
        ...baseItem,
        text: 'This is a very long button text that might wrap to multiple lines depending on the container width'
      }

      const wrapper = mount(ActionButton, {
        props: { item: longTextItem }
      })

      const button = wrapper.find('button')
      expect(button.text()).toContain('This is a very long button text')
    })
  })

  describe('Accessibility', () => {
    it('creates proper button element for screen readers', () => {
      const wrapper = mount(ActionButton, {
        props: { item: baseItem }
      })

      const button = wrapper.find('button')
      expect(button.element.tagName).toBe('BUTTON')
    })

    it('maintains interactive cursor styling', () => {
      const wrapper = mount(ActionButton, {
        props: { item: baseItem }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('cursor-pointer')
    })

    it('provides transition effects for better UX', () => {
      const wrapper = mount(ActionButton, {
        props: { item: baseItem }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('transition-colors')
    })
  })

  describe('Variant Class Combinations', () => {
    it('combines variant and custom classes correctly', () => {
      const combinedItem = {
        ...baseItem,
        variant: 'primary' as const,
        className: 'my-custom-class'
      }

      const wrapper = mount(ActionButton, {
        props: { item: combinedItem }
      })

      const button = wrapper.find('button')
      // Should have base classes
      expect(button.classes()).toContain('px-4')
      expect(button.classes()).toContain('rounded-full')
      // Should have primary variant classes
      expect(button.classes()).toContain('bg-brand-orange')
      expect(button.classes()).toContain('text-bg-card')
      // Should have custom class
      expect(button.classes()).toContain('my-custom-class')
    })

    it('filters out empty class names', () => {
      const itemWithEmptyClass = {
        ...baseItem,
        className: ''
      }

      const wrapper = mount(ActionButton, {
        props: { item: itemWithEmptyClass }
      })

      const button = wrapper.find('button')
      // Should still have base and variant classes
      expect(button.classes()).toContain('px-4')
      expect(button.classes()).toContain('bg-bg-button')
      // Should not have empty string in class list
      expect(button.classes()).not.toContain('')
    })
  })

  describe('Performance', () => {
    it('handles rapid clicking without issues', async () => {
      const wrapper = mount(ActionButton, {
        props: { item: baseItem }
      })

      const button = wrapper.find('button')

      // Simulate rapid clicking
      const clickPromises = Array.from({ length: 10 }, () =>
        button.trigger('click')
      )
      await Promise.all(clickPromises)

      expect(mockOnClick).toHaveBeenCalledTimes(10)
    })
  })
})
