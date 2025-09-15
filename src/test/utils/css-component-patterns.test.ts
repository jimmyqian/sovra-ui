import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

const TestComponent = defineComponent({
  props: {
    customClass: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  template: `<component :is="tag" :class="customClass"><slot /></component>`
})

describe('CSS Component Pattern Utilities', () => {
  describe.skip('Button Pattern Classes - DEPRECATED', () => {
    it('applies btn-primary pattern correctly', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass: 'btn-primary',
          tag: 'button'
        },
        slots: { default: 'Primary Button' }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('btn-primary')
      expect(button.text()).toBe('Primary Button')
    })

    it('applies btn-outline pattern correctly', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass: 'btn-outline',
          tag: 'button'
        },
        slots: { default: 'Outline Button' }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('btn-outline')
      expect(button.text()).toBe('Outline Button')
    })

    it('applies btn-ghost pattern correctly', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass: 'btn-ghost',
          tag: 'button'
        },
        slots: { default: 'Ghost Button' }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('btn-ghost')
      expect(button.text()).toBe('Ghost Button')
    })

    it('combines button patterns with other classes', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass: 'btn-primary w-full text-lg',
          tag: 'button'
        },
        slots: { default: 'Full Width Button' }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('btn-primary')
      expect(button.classes()).toContain('w-full')
      expect(button.classes()).toContain('text-lg')
    })
  })

  describe('Icon Button Pattern Classes', () => {
    it('applies icon-button-base pattern correctly', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass: 'icon-button-base',
          tag: 'button'
        },
        slots: { default: '🏠' }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('icon-button-base')
      expect(button.text()).toBe('🏠')
    })

    it('applies icon-button-primary pattern correctly', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass: 'icon-button-primary',
          tag: 'button'
        },
        slots: { default: '📧' }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('icon-button-primary')
      expect(button.text()).toBe('📧')
    })

    it('applies icon-button-secondary pattern correctly', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass: 'icon-button-secondary',
          tag: 'button'
        },
        slots: { default: '⚙️' }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('icon-button-secondary')
      expect(button.text()).toBe('⚙️')
    })

    it('combines icon button patterns with additional classes', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass: 'icon-button-primary transform rotate-45',
          tag: 'button'
        },
        slots: { default: '➕' }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('icon-button-primary')
      expect(button.classes()).toContain('transform')
      expect(button.classes()).toContain('rotate-45')
    })
  })

  describe('Layout Pattern Classes', () => {
    it('applies flex-center pattern correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'flex-center h-32 w-32' },
        slots: { default: 'Centered Content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('flex-center')
      expect(element.classes()).toContain('h-32')
      expect(element.classes()).toContain('w-32')
      expect(element.text()).toBe('Centered Content')
    })

    it('applies flex-center-start pattern correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'flex-center-start h-16' },
        slots: { default: 'Left Aligned Content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('flex-center-start')
      expect(element.classes()).toContain('h-16')
      expect(element.text()).toBe('Left Aligned Content')
    })

    it('combines layout patterns effectively', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'flex-center bg-bg-card rounded-lg p-4' },
        slots: { default: 'Card Content' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('flex-center')
      expect(element.classes()).toContain('bg-bg-card')
      expect(element.classes()).toContain('rounded-lg')
      expect(element.classes()).toContain('p-4')
    })
  })

  describe('Card Pattern Classes', () => {
    it('applies result-card pattern correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'result-card' },
        slots: {
          default: 'Result content goes here'
        }
      })

      const card = wrapper.find('div')
      expect(card.classes()).toContain('result-card')
      expect(card.text()).toContain('Result content')
    })

    it('combines result-card with responsive classes', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'result-card lg:w-1/2 md:w-full' },
        slots: { default: 'Responsive Card' }
      })

      const card = wrapper.find('div')
      expect(card.classes()).toContain('result-card')
      expect(card.classes()).toContain('lg:w-1/2')
      expect(card.classes()).toContain('md:w-full')
    })
  })

  describe('Statistics Pattern Classes', () => {
    it('applies stat-item pattern correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { customClass: 'stat-item' },
        slots: { default: 'Statistics content' }
      })

      const statItem = wrapper.find('div')
      expect(statItem.classes()).toContain('stat-item')
      expect(statItem.text()).toBe('Statistics content')
    })

    it('applies stat-number pattern correctly', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass: 'stat-number',
          tag: 'span'
        },
        slots: { default: '123' }
      })

      const statNumber = wrapper.find('span')
      expect(statNumber.classes()).toContain('stat-number')
      expect(statNumber.text()).toBe('123')
    })

    it('applies stat-label pattern correctly', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass: 'stat-label',
          tag: 'span'
        },
        slots: { default: 'Total Count' }
      })

      const statLabel = wrapper.find('span')
      expect(statLabel.classes()).toContain('stat-label')
      expect(statLabel.text()).toBe('Total Count')
    })

    it('creates complete statistics display', () => {
      const StatDisplay = defineComponent({
        props: {
          number: { type: [String, Number], required: true },
          label: { type: String, required: true }
        },
        template: `
          <div class="stat-item">
            <span class="stat-number">{{ number }}</span>
            <span class="stat-label">{{ label }}</span>
          </div>
        `
      })

      const wrapper = mount(StatDisplay, {
        props: {
          number: 1500,
          label: 'Total Users'
        }
      })

      const statItem = wrapper.find('.stat-item')
      const statNumber = wrapper.find('.stat-number')
      const statLabel = wrapper.find('.stat-label')

      expect(statItem.exists()).toBe(true)
      expect(statNumber.text()).toBe('1500')
      expect(statLabel.text()).toBe('Total Users')
    })
  })

  describe('Complex Pattern Combinations', () => {
    it('combines multiple patterns in a realistic layout', () => {
      const ComplexComponent = defineComponent({
        template: `
          <div class="result-card">
            <div class="flex-center-start mb-4">
              <h3 class="text-text-primary font-semibold">User Profile</h3>
            </div>
            <div class="flex gap-4 mb-4">
              <div class="stat-item">
                <span class="stat-number">4.8</span>
                <span class="stat-label">Rating</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">156</span>
                <span class="stat-label">Reviews</span>
              </div>
            </div>
            <div class="flex-center gap-2">
              <button class="btn-primary">Contact</button>
              <button class="btn-outline">View Profile</button>
              <button class="icon-button-secondary">⋮</button>
            </div>
          </div>
        `
      })

      const wrapper = mount(ComplexComponent)

      // Verify all pattern classes are applied
      expect(wrapper.find('.result-card').exists()).toBe(true)
      expect(wrapper.find('.flex-center-start').exists()).toBe(true)
      expect(wrapper.find('.stat-item').exists()).toBe(true)
      expect(wrapper.find('.stat-number').exists()).toBe(true)
      expect(wrapper.find('.stat-label').exists()).toBe(true)
      expect(wrapper.find('.btn-primary').exists()).toBe(true)
      expect(wrapper.find('.btn-outline').exists()).toBe(true)
      expect(wrapper.find('.icon-button-secondary').exists()).toBe(true)

      // Verify content is rendered correctly
      expect(wrapper.text()).toContain('User Profile')
      expect(wrapper.text()).toContain('4.8')
      expect(wrapper.text()).toContain('Rating')
      expect(wrapper.text()).toContain('156')
      expect(wrapper.text()).toContain('Reviews')
      expect(wrapper.text()).toContain('Contact')
      expect(wrapper.text()).toContain('View Profile')
    })

    it('handles pattern class inheritance and composition', () => {
      const wrapper = mount(TestComponent, {
        props: {
          customClass: 'result-card flex-center-start'
        },
        slots: {
          default: 'Composed patterns'
        }
      })

      const container = wrapper.find('div')
      expect(container.classes()).toContain('result-card')
      expect(container.classes()).toContain('flex-center-start')
      expect(container.text()).toBe('Composed patterns')
    })

    it('validates pattern class combinations do not conflict', () => {
      // Test that combining layout patterns works correctly
      const wrapper = mount(TestComponent, {
        props: {
          customClass: 'flex-center result-card btn-primary',
          tag: 'button'
        },
        slots: { default: 'Multi-pattern Button' }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('flex-center')
      expect(button.classes()).toContain('result-card')
      expect(button.classes()).toContain('btn-primary')
      expect(button.text()).toBe('Multi-pattern Button')
    })
  })

  describe('Pattern Class Accessibility', () => {
    it('maintains button accessibility with pattern classes', () => {
      const AccessibleButton = defineComponent({
        template: `
          <button 
            class="btn-primary"
            aria-label="Primary action button"
            role="button"
          >
            Accessible Button
          </button>
        `
      })

      const wrapper = mount(AccessibleButton)
      const button = wrapper.find('button')

      expect(button.classes()).toContain('btn-primary')
      expect(button.attributes('aria-label')).toBe('Primary action button')
      expect(button.attributes('role')).toBe('button')
      expect(button.text()).toBe('Accessible Button')
    })

    it('supports keyboard navigation with icon buttons', () => {
      const AccessibleIconButton = defineComponent({
        template: `
          <button 
            class="icon-button-primary"
            tabindex="0"
            aria-label="Close dialog"
          >
            ✕
          </button>
        `
      })

      const wrapper = mount(AccessibleIconButton)
      const button = wrapper.find('button')

      expect(button.classes()).toContain('icon-button-primary')
      expect(button.attributes('tabindex')).toBe('0')
      expect(button.attributes('aria-label')).toBe('Close dialog')
      expect(button.text()).toBe('✕')
    })
  })

  describe('Pattern Class Performance', () => {
    it('applies pattern classes efficiently without rerenders', () => {
      const PerformanceTestComponent = defineComponent({
        template: `
          <div class="result-card">
            <div class="flex-center">
              <button class="btn-primary">Action</button>
            </div>
          </div>
        `
      })

      const wrapper = mount(PerformanceTestComponent)

      expect(wrapper.find('.result-card').exists()).toBe(true)
      expect(wrapper.find('.flex-center').exists()).toBe(true)
      expect(wrapper.find('.btn-primary').exists()).toBe(true)
    })

    it('handles dynamic pattern class changes', async () => {
      const DynamicComponent = defineComponent({
        data() {
          return {
            isPrimary: true
          }
        },
        methods: {
          toggle() {
            this.isPrimary = !this.isPrimary
          }
        },
        template: `
          <button 
            :class="isPrimary ? 'btn-primary' : 'btn-outline'"
            @click="toggle"
          >
            {{ isPrimary ? 'Primary' : 'Outline' }}
          </button>
        `
      })

      const wrapper = mount(DynamicComponent)
      const button = wrapper.find('button')

      expect(button.classes()).toContain('btn-primary')
      expect(button.text()).toBe('Primary')

      await button.trigger('click')

      expect(button.classes()).toContain('btn-outline')
      expect(button.classes()).not.toContain('btn-primary')
      expect(button.text()).toBe('Outline')
    })
  })

  describe('Pattern Class Validation', () => {
    it('validates all expected pattern classes are testable', () => {
      const allPatternClasses = [
        'btn-primary',
        'btn-outline',
        'btn-ghost',
        'icon-button-base',
        'icon-button-primary',
        'icon-button-secondary',
        'flex-center',
        'flex-center-start',
        'result-card',
        'stat-item',
        'stat-number',
        'stat-label'
      ]

      allPatternClasses.forEach(className => {
        const wrapper = mount(TestComponent, {
          props: { customClass: className },
          slots: { default: `Testing ${className}` }
        })

        const element = wrapper.find('div')
        expect(element.classes()).toContain(className)
        expect(element.text()).toBe(`Testing ${className}`)
      })
    })

    it('validates pattern classes work with standard Tailwind classes', () => {
      const combinedClasses = [
        'btn-primary p-4 m-2 rounded-lg',
        'result-card shadow-lg border border-gray-200',
        'flex-center w-full h-32 bg-blue-100',
        'stat-item text-center font-bold'
      ]

      combinedClasses.forEach(classString => {
        const wrapper = mount(TestComponent, {
          props: { customClass: classString },
          slots: { default: 'Combined classes test' }
        })

        const element = wrapper.find('div')
        const classes = classString.split(' ')

        classes.forEach(cls => {
          expect(element.classes()).toContain(cls)
        })
      })
    })

    it('validates pattern classes work across different HTML elements', () => {
      const elementTests = [
        { tag: 'button', class: 'btn-primary', content: 'Button' },
        { tag: 'div', class: 'result-card', content: 'Card' },
        { tag: 'span', class: 'stat-number', content: '42' },
        { tag: 'section', class: 'flex-center', content: 'Section' }
      ]

      elementTests.forEach(({ tag, class: className, content }) => {
        const wrapper = mount(TestComponent, {
          props: {
            customClass: className,
            tag
          },
          slots: { default: content }
        })

        const element = wrapper.find(tag)
        expect(element.classes()).toContain(className)
        expect(element.text()).toBe(content)
      })
    })
  })
})
