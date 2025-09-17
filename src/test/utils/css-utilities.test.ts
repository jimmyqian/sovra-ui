import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

// Test component for validating class applications
const TestComponent = defineComponent({
  props: {
    customClass: {
      type: String,
      default: ''
    }
  },
  template: '<div :class="customClass"><slot /></div>'
})

describe('CSS Utility Class Application', () => {
  describe('Custom Brand Color Classes', () => {
    it('applies bg-brand-orange class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'bg-brand-orange' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('bg-brand-orange')
      expect(element.text()).toBe('Test content')
    })

    it('applies bg-brand-blue class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'bg-brand-blue' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('bg-brand-blue')
    })

    it('applies text-brand-orange class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'text-brand-orange' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('text-brand-orange')
    })

    it('applies text-brand-blue class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'text-brand-blue' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('text-brand-blue')
    })
  })

  describe('Custom Background Color Classes', () => {
    it('applies bg-bg-primary class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'bg-bg-primary' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('bg-bg-primary')
    })

    it('applies bg-bg-secondary class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'bg-bg-secondary' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('bg-bg-secondary')
    })

    it('applies bg-bg-card class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'bg-bg-card' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('bg-bg-card')
    })
  })

  describe('Custom Text Color Classes', () => {
    it('applies text-text-primary class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'text-text-primary' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('text-text-primary')
    })

    it('applies text-text-secondary class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'text-text-secondary' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('text-text-secondary')
    })

    it('applies text-text-muted class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'text-text-muted' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('text-text-muted')
    })

    it('applies text-logo-gray class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'text-logo-gray' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('text-logo-gray')
    })
  })

  describe('Custom Border Color Classes', () => {
    it('applies border-border-light class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'border border-border-light' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('border')
      expect(element.classes()).toContain('border-border-light')
    })

    it('applies border-border-lighter class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'border border-border-lighter' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('border')
      expect(element.classes()).toContain('border-border-lighter')
    })

    it('applies border-border-hover class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'border border-border-hover' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('border')
      expect(element.classes()).toContain('border-border-hover')
    })

    it('applies border-border-dashed class correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'border-dashed border-border-dashed' },
        slots: { default: 'Test content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('border-dashed')
      expect(element.classes()).toContain('border-border-dashed')
    })
  })

  describe('Extended Tailwind Config Classes', () => {
    it('applies custom spacing classes correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'p-15 m-18 w-25' },
        slots: { default: 'Custom spacing' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('p-15')
      expect(element.classes()).toContain('m-18')
      expect(element.classes()).toContain('w-25')
    })

    it('applies custom border radius classes correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'rounded-tag rounded-search' },
        slots: { default: 'Custom radius' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('rounded-tag')
      expect(element.classes()).toContain('rounded-search')
    })

    it('applies custom shadow classes correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'shadow-card shadow-search' },
        slots: { default: 'Custom shadows' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('shadow-card')
      expect(element.classes()).toContain('shadow-search')
    })

    it('applies custom font size classes correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'text-hero text-logo' },
        slots: { default: 'Custom fonts' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('text-hero')
      expect(element.classes()).toContain('text-logo')
    })
  })

  describe('Responsive Class Combinations', () => {
    it('applies responsive classes correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'w-full md:w-1/2 lg:w-1/3 xl:w-1/4' },
        slots: { default: 'Responsive width' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('w-full')
      expect(element.classes()).toContain('md:w-1/2')
      expect(element.classes()).toContain('lg:w-1/3')
      expect(element.classes()).toContain('xl:w-1/4')
    })

    it('applies responsive color classes correctly', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass: 'bg-bg-card md:bg-brand-orange lg:bg-brand-blue'
        },
        slots: { default: 'Responsive colors' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('bg-bg-card')
      expect(element.classes()).toContain('md:bg-brand-orange')
      expect(element.classes()).toContain('lg:bg-brand-blue')
    })

    it('applies hover state classes correctly', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass:
            'bg-bg-card hover:bg-brand-orange hover:text-bg-card'
        },
        slots: { default: 'Hover states' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('bg-bg-card')
      expect(element.classes()).toContain('hover:bg-brand-orange')
      expect(element.classes()).toContain('hover:text-bg-card')
    })
  })

  describe('Complex Class Combinations', () => {
    it('applies multiple utility classes together', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass:
            'bg-brand-orange text-bg-card border border-border-light rounded-tag p-15 shadow-card'
        },
        slots: { default: 'Complex styling' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('bg-brand-orange')
      expect(element.classes()).toContain('text-bg-card')
      expect(element.classes()).toContain('border')
      expect(element.classes()).toContain('border-border-light')
      expect(element.classes()).toContain('rounded-tag')
      expect(element.classes()).toContain('p-15')
      expect(element.classes()).toContain('shadow-card')
    })

    it('handles responsive and hover combinations', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass:
            'text-sm md:text-base lg:text-lg hover:text-brand-orange focus:text-brand-blue'
        },
        slots: { default: 'Complex responsive' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('text-sm')
      expect(element.classes()).toContain('md:text-base')
      expect(element.classes()).toContain('lg:text-lg')
      expect(element.classes()).toContain('hover:text-brand-orange')
      expect(element.classes()).toContain('focus:text-brand-blue')
    })
  })

  describe('Class String Validation', () => {
    it('handles empty class strings', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: '' },
        slots: { default: 'No classes' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toEqual([])
      expect(element.text()).toBe('No classes')
    })

    it('handles single class strings', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'bg-brand-orange' },
        slots: { default: 'Single class' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toEqual(['bg-brand-orange'])
    })

    it('handles space-separated class strings', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'bg-brand-orange text-bg-card p-4' },
        slots: { default: 'Multiple classes' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('bg-brand-orange')
      expect(element.classes()).toContain('text-bg-card')
      expect(element.classes()).toContain('p-4')
      expect(element.classes().length).toBe(3)
    })

    it('handles extra whitespace in class strings', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: '  bg-brand-orange   text-bg-card  ' },
        slots: { default: 'Whitespace handling' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('bg-brand-orange')
      expect(element.classes()).toContain('text-bg-card')
    })
  })

  describe('Component Integration', () => {
    it('applies classes to different HTML elements', () => {
      const ButtonComponent = defineComponent({
        props: {
          customClass: {
            type: String,
            default: ''
          }
        },
        template: '<button :class="customClass"><slot /></button>'
      })

      const wrapper = mount(ButtonComponent, {
        props: {
          customClass: 'bg-brand-orange text-bg-card p-2 rounded-lg'
        },
        slots: { default: 'Button Text' }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-brand-orange')
      expect(button.classes()).toContain('text-bg-card')
      expect(button.classes()).toContain('p-2')
      expect(button.classes()).toContain('rounded-lg')
      expect(button.text()).toBe('Button Text')
    })

    it('works with dynamic class binding', () => {
      const DynamicComponent = defineComponent({
        data() {
          return {
            isActive: false
          }
        },
        methods: {
          toggle() {
            this.isActive = !this.isActive
          }
        },
        template: `
          <div 
            :class="[
              'base-class',
              isActive ? 'bg-brand-orange' : 'bg-bg-card',
              isActive ? 'text-bg-card' : 'text-text-primary'
            ]"
            @click="toggle"
          >
            Dynamic Classes
          </div>
        `
      })

      const wrapper = mount(DynamicComponent)
      const div = wrapper.find('div')

      // Initial state
      expect(div.classes()).toContain('base-class')
      expect(div.classes()).toContain('bg-bg-card')
      expect(div.classes()).toContain('text-text-primary')
      expect(div.classes()).not.toContain('bg-brand-orange')
      expect(div.classes()).not.toContain('text-bg-card')
    })
  })
})
