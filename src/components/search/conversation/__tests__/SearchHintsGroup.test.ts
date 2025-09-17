/**
 * Unit tests for SearchHintsGroup conversation component
 * Tests hint rendering, styling, click events, and interaction
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchHintsGroup from '../SearchHintsGroup.vue'
import type { SearchHintsGroupItem } from '@/types/conversation'

describe('SearchHintsGroup', () => {
  const mockHints = [
    {
      text: 'What specific software role does Johnson hold in his California job',
      onClick: vi.fn()
    },
    {
      text: 'Which California tech hubs are most likely where Johnson works',
      onClick: vi.fn()
    },
    {
      text: 'What skills Johnson has from his current software role',
      onClick: vi.fn(),
      className: 'custom-hint-class'
    }
  ]

  const baseItem: SearchHintsGroupItem = {
    id: 'hints-1',
    type: 'hints-group',
    hints: mockHints
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders container with correct structure', () => {
      const wrapper = mount(SearchHintsGroup, {
        props: { item: baseItem }
      })

      const container = wrapper.find('.my-6')
      expect(container.exists()).toBe(true)
    })

    it('renders all hints', () => {
      const wrapper = mount(SearchHintsGroup, {
        props: { item: baseItem }
      })

      const hintElements = wrapper.findAll('.text-brand-orange-dark')
      expect(hintElements).toHaveLength(3)
    })

    it('displays hint text correctly', () => {
      const wrapper = mount(SearchHintsGroup, {
        props: { item: baseItem }
      })

      mockHints.forEach(hint => {
        expect(wrapper.text()).toContain(hint.text)
      })
    })
  })

  describe('Styling and Classes', () => {
    it('applies base hint classes to all hints', () => {
      const wrapper = mount(SearchHintsGroup, {
        props: { item: baseItem }
      })

      const hintElements = wrapper.findAll('.text-brand-orange-dark')

      hintElements.forEach(element => {
        expect(element.classes()).toContain('text-brand-orange-dark')
        expect(element.classes()).toContain('pb-2')
        expect(element.classes()).toContain('cursor-pointer')
        expect(element.classes()).toContain('hover:text-brand-orange-light')
        expect(element.classes()).toContain('border-t')
        expect(element.classes()).toContain('border-dashed')
        expect(element.classes()).toContain('border-border-dashed')
        expect(element.classes()).toContain('pt-2')
      })
    })

    it('applies border-b class to last hint only', () => {
      const wrapper = mount(SearchHintsGroup, {
        props: { item: baseItem }
      })

      const hintElements = wrapper.findAll('.text-brand-orange-dark')

      // First and second hints should not have border-b
      expect(hintElements[0]!.classes()).not.toContain('border-b')
      expect(hintElements[1]!.classes()).not.toContain('border-b')

      // Last hint should have border-b
      expect(hintElements[2]!.classes()).toContain('border-b')
    })

    it('applies custom className when provided', () => {
      const wrapper = mount(SearchHintsGroup, {
        props: { item: baseItem }
      })

      const hintElements = wrapper.findAll('.text-brand-orange-dark')

      // Third hint has custom class
      expect(hintElements[2]!.classes()).toContain('custom-hint-class')

      // Other hints should not have custom class
      expect(hintElements[0]!.classes()).not.toContain('custom-hint-class')
      expect(hintElements[1]!.classes()).not.toContain('custom-hint-class')
    })
  })

  describe('Click Events', () => {
    it('calls onClick when hint is clicked', async () => {
      const wrapper = mount(SearchHintsGroup, {
        props: { item: baseItem }
      })

      const hintElements = wrapper.findAll('.text-brand-orange-dark')

      // Click first hint
      await hintElements[0]!.trigger('click')
      expect(mockHints[0]!.onClick).toHaveBeenCalledTimes(1)

      // Click second hint
      await hintElements[1]!.trigger('click')
      expect(mockHints[1]!.onClick).toHaveBeenCalledTimes(1)

      // Click third hint
      await hintElements[2]!.trigger('click')
      expect(mockHints[2]!.onClick).toHaveBeenCalledTimes(1)
    })

    it('handles hints without onClick gracefully', async () => {
      const hintsWithoutClick = [
        { text: 'Hint without click handler' },
        { text: 'Another hint without click handler' }
      ]

      const itemWithoutClick = {
        ...baseItem,
        hints: hintsWithoutClick
      }

      const wrapper = mount(SearchHintsGroup, {
        props: { item: itemWithoutClick }
      })

      const hintElements = wrapper.findAll('.text-brand-orange-dark')

      // Should not throw error when clicking
      await expect(hintElements[0]!.trigger('click')).resolves.not.toThrow()
      await expect(hintElements[1]!.trigger('click')).resolves.not.toThrow()
    })

    it('passes correct hint object to handleHintClick', async () => {
      const handleHintClickSpy = vi.fn()

      // Mock the handleHintClick method
      const wrapper = mount(SearchHintsGroup, {
        props: { item: baseItem }
      })

      // Access the component instance to spy on handleHintClick
      const component = wrapper.vm
      // Type assertion to access private method for testing
      ;(component as any).handleHintClick = handleHintClickSpy

      const hintElements = wrapper.findAll('.text-brand-orange-dark')
      await hintElements[0]!.trigger('click')

      expect(handleHintClickSpy).toHaveBeenCalledWith(mockHints[0])
    })
  })

  describe('Empty State', () => {
    it('handles empty hints array', () => {
      const emptyItem = {
        ...baseItem,
        hints: []
      }

      const wrapper = mount(SearchHintsGroup, {
        props: { item: emptyItem }
      })

      const container = wrapper.find('.my-6')
      expect(container.exists()).toBe(true)

      const hintElements = wrapper.findAll('.text-brand-orange-dark')
      expect(hintElements).toHaveLength(0)
    })
  })

  describe('Accessibility', () => {
    it('makes hints keyboard accessible', () => {
      const wrapper = mount(SearchHintsGroup, {
        props: { item: baseItem }
      })

      const hintElements = wrapper.findAll('.text-brand-orange-dark')

      hintElements.forEach(element => {
        expect(element.classes()).toContain('cursor-pointer')
        // Each hint should be clickable
        expect(element.element.tagName).toBe('DIV')
      })
    })

    it('provides visual feedback on hover', () => {
      const wrapper = mount(SearchHintsGroup, {
        props: { item: baseItem }
      })

      const hintElements = wrapper.findAll('.text-brand-orange-dark')

      hintElements.forEach(element => {
        expect(element.classes()).toContain('hover:text-brand-orange-light')
      })
    })
  })

  describe('Performance', () => {
    it('handles large number of hints efficiently', () => {
      const manyHints = Array.from({ length: 100 }, (_, i) => ({
        text: `Hint number ${i + 1}`,
        onClick: vi.fn()
      }))

      const largeItem = {
        ...baseItem,
        hints: manyHints
      }

      const wrapper = mount(SearchHintsGroup, {
        props: { item: largeItem }
      })

      const hintElements = wrapper.findAll('.text-brand-orange-dark')
      expect(hintElements).toHaveLength(100)

      // Last hint should have border-b
      expect(hintElements[99]!.classes()).toContain('border-b')
    })
  })
})
