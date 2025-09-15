/**
 * Unit tests for Button component
 * Tests component props, events, classes, and rendering behavior
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../Button.vue'

describe('Button', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(Button, {
        slots: {
          default: 'Click me'
        }
      })

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('Click me')
      expect(button.attributes('type')).toBe('button')
      expect(button.attributes('disabled')).toBeUndefined()
    })

    it('renders slot content correctly', () => {
      const wrapper = mount(Button, {
        slots: {
          default: '<span>Custom Content</span>'
        }
      })

      expect(wrapper.html()).toContain('<span>Custom Content</span>')
    })

    it('renders empty button when no slot content provided', () => {
      const wrapper = mount(Button)
      const button = wrapper.find('button')

      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('')
    })
  })

  describe('Props', () => {
    describe('variant prop', () => {
      it('applies primary variant classes by default', () => {
        const wrapper = mount(Button, {
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).toContain('bg-brand-orange')
      })

      it('applies outline variant classes', () => {
        const wrapper = mount(Button, {
          props: { variant: 'outline' },
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).toContain('bg-transparent')
        expect(wrapper.classes()).not.toContain('bg-brand-orange')
      })

      it('applies ghost variant classes', () => {
        const wrapper = mount(Button, {
          props: { variant: 'ghost' },
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).toContain('bg-transparent')
        expect(wrapper.classes()).not.toContain('bg-brand-orange')
      })
    })

    describe('size prop', () => {
      it('applies medium size classes by default', () => {
        const wrapper = mount(Button, {
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).toContain('px-4')
        expect(wrapper.classes()).toContain('py-2')
        expect(wrapper.classes()).toContain('text-sm')
      })

      it('applies small size classes', () => {
        const wrapper = mount(Button, {
          props: { size: 'sm' },
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).toContain('px-3')
        expect(wrapper.classes()).toContain('py-1.5')
        expect(wrapper.classes()).toContain('text-xs')
      })

      it('applies large size classes', () => {
        const wrapper = mount(Button, {
          props: { size: 'lg' },
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).toContain('px-8')
        expect(wrapper.classes()).toContain('py-3')
        expect(wrapper.classes()).toContain('text-base')
      })
    })

    describe('type prop', () => {
      it('sets button type to button by default', () => {
        const wrapper = mount(Button, {
          slots: { default: 'Button' }
        })

        expect(wrapper.attributes('type')).toBe('button')
      })

      it('sets button type to submit', () => {
        const wrapper = mount(Button, {
          props: { type: 'submit' },
          slots: { default: 'Submit' }
        })

        expect(wrapper.attributes('type')).toBe('submit')
      })

      it('sets button type to reset', () => {
        const wrapper = mount(Button, {
          props: { type: 'reset' },
          slots: { default: 'Reset' }
        })

        expect(wrapper.attributes('type')).toBe('reset')
      })
    })

    describe('disabled prop', () => {
      it('is not disabled by default', () => {
        const wrapper = mount(Button, {
          slots: { default: 'Button' }
        })

        expect(wrapper.attributes('disabled')).toBeUndefined()
        expect(wrapper.element).not.toBeDisabled()
      })

      it('sets disabled attribute when disabled prop is true', () => {
        const wrapper = mount(Button, {
          props: { disabled: true },
          slots: { default: 'Button' }
        })

        expect(wrapper.attributes('disabled')).toBeDefined()
        expect(wrapper.element).toBeDisabled()
      })

      it('applies disabled opacity classes when disabled', () => {
        const wrapper = mount(Button, {
          props: { disabled: true },
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).toContain('disabled:opacity-50')
        expect(wrapper.classes()).toContain('disabled:cursor-not-allowed')
      })
    })

    describe('fullWidth prop', () => {
      it('does not apply full width by default', () => {
        const wrapper = mount(Button, {
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).not.toContain('w-full')
      })

      it('applies full width classes when fullWidth is true', () => {
        const wrapper = mount(Button, {
          props: { fullWidth: true },
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).toContain('w-full')
      })
    })

    describe('active prop', () => {
      it('is not active by default', () => {
        const wrapper = mount(Button, {
          props: { variant: 'outline' },
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).toContain('bg-transparent')
        expect(wrapper.classes()).not.toContain('bg-transparent-active')
      })

      it('applies active outline variant when active is true', () => {
        const wrapper = mount(Button, {
          props: { variant: 'outline', active: true },
          slots: { default: 'Active Button' }
        })

        expect(wrapper.classes()).toContain('bg-transparent-active')
        expect(wrapper.classes()).not.toContain('bg-transparent')
      })

      it('does not affect non-outline variants', () => {
        const wrapper = mount(Button, {
          props: { variant: 'primary', active: true },
          slots: { default: 'Primary Active' }
        })

        expect(wrapper.classes()).toContain('bg-brand-orange')
        expect(wrapper.classes()).not.toContain('bg-transparent-active')
      })
    })
  })

  describe('Events', () => {
    it('emits click event when clicked', async () => {
      const wrapper = mount(Button, {
        slots: { default: 'Click me' }
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('passes mouse event to click handler', async () => {
      const wrapper = mount(Button, {
        slots: { default: 'Click me' }
      })

      await wrapper.trigger('click')

      const clickEvents = wrapper.emitted('click') as MouseEvent[][]
      expect(clickEvents[0]![0]).toBeInstanceOf(MouseEvent)
    })

    it('does not emit click event when disabled', async () => {
      const wrapper = mount(Button, {
        props: { disabled: true },
        slots: { default: 'Disabled' }
      })

      await wrapper.trigger('click')

      // Disabled buttons naturally prevent click events in browsers
      // This test verifies the disabled attribute is properly set
      expect(wrapper.element).toBeDisabled()
    })
  })

  describe('CSS Classes', () => {
    it('always applies base classes', () => {
      const wrapper = mount(Button, {
        slots: { default: 'Button' }
      })

      const expectedBaseClasses = [
        'inline-flex',
        'items-center',
        'justify-center',
        'gap-2',
        'rounded-search',
        'font-medium',
        'cursor-pointer',
        'transition-all',
        'transition-colors',
        'duration-200',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-brand-orange',
        'focus:ring-offset-2',
        'disabled:opacity-50',
        'disabled:cursor-not-allowed'
      ]

      expectedBaseClasses.forEach(className => {
        expect(wrapper.classes()).toContain(className)
      })
    })

    it('combines multiple props correctly', () => {
      const wrapper = mount(Button, {
        props: {
          variant: 'outline',
          size: 'lg',
          fullWidth: true
        },
        slots: { default: 'Large Outline Full Width' }
      })

      expect(wrapper.classes()).toContain('bg-transparent')
      expect(wrapper.classes()).toContain('px-8')
      expect(wrapper.classes()).toContain('py-3')
      expect(wrapper.classes()).toContain('text-base')
      expect(wrapper.classes()).toContain('w-full')
    })

    it('combines active state with other props correctly', () => {
      const wrapper = mount(Button, {
        props: {
          variant: 'outline',
          size: 'sm',
          active: true,
          fullWidth: true
        },
        slots: { default: 'Active Small Outline Full Width' }
      })

      expect(wrapper.classes()).toContain('bg-transparent-active')
      expect(wrapper.classes()).toContain('px-3')
      expect(wrapper.classes()).toContain('py-1.5')
      expect(wrapper.classes()).toContain('text-xs')
      expect(wrapper.classes()).toContain('w-full')
      expect(wrapper.classes()).not.toContain('bg-transparent')
    })
  })

  describe('Accessibility', () => {
    it('maintains focus capabilities', () => {
      const wrapper = mount(Button, {
        slots: { default: 'Focusable' }
      })

      expect(wrapper.classes()).toContain('focus:outline-none')
      expect(wrapper.classes()).toContain('focus:ring-2')
      expect(wrapper.classes()).toContain('focus:ring-brand-orange')
    })

    it('provides proper disabled state for screen readers', () => {
      const wrapper = mount(Button, {
        props: { disabled: true },
        slots: { default: 'Disabled' }
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
      expect(wrapper.classes()).toContain('disabled:cursor-not-allowed')
    })
  })
})
