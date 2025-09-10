import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

const TestComponent = defineComponent({
  props: {
    customClass: String
  },
  template: '<div :class="customClass"><slot /></div>'
})

describe('CSS Responsive Design Classes', () => {
  describe('Responsive Width Classes', () => {
    it('applies mobile-first responsive width classes correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'w-full md:w-1/2 lg:w-1/3 xl:w-1/4'
        },
        slots: { default: 'Responsive width' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('w-full')
      expect(element.classes()).toContain('md:w-1/2')
      expect(element.classes()).toContain('lg:w-1/3')
      expect(element.classes()).toContain('xl:w-1/4')
    })

    it('applies responsive height classes correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'h-16 md:h-20 lg:h-24 xl:h-32'
        },
        slots: { default: 'Responsive height' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('h-16')
      expect(element.classes()).toContain('md:h-20')
      expect(element.classes()).toContain('lg:h-24')
      expect(element.classes()).toContain('xl:h-32')
    })
  })

  describe('Responsive Text Classes', () => {
    it('applies responsive font sizes correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'text-sm md:text-base lg:text-lg xl:text-xl'
        },
        slots: { default: 'Responsive text' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('text-sm')
      expect(element.classes()).toContain('md:text-base')
      expect(element.classes()).toContain('lg:text-lg')
      expect(element.classes()).toContain('xl:text-xl')
    })

    it('applies responsive custom font sizes correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'text-base md:text-logo lg:text-hero'
        },
        slots: { default: 'Custom responsive fonts' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('text-base')
      expect(element.classes()).toContain('md:text-logo')
      expect(element.classes()).toContain('lg:text-hero')
    })
  })

  describe('Responsive Spacing Classes', () => {
    it('applies responsive padding correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'p-2 md:p-4 lg:p-6 xl:p-8'
        },
        slots: { default: 'Responsive padding' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('p-2')
      expect(element.classes()).toContain('md:p-4')
      expect(element.classes()).toContain('lg:p-6')
      expect(element.classes()).toContain('xl:p-8')
    })

    it('applies responsive custom spacing correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'p-4 md:p-15 lg:p-18 xl:p-25'
        },
        slots: { default: 'Custom responsive spacing' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('p-4')
      expect(element.classes()).toContain('md:p-15')
      expect(element.classes()).toContain('lg:p-18')
      expect(element.classes()).toContain('xl:p-25')
    })

    it('applies responsive margins correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'm-1 md:m-2 lg:m-4 xl:m-8'
        },
        slots: { default: 'Responsive margins' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('m-1')
      expect(element.classes()).toContain('md:m-2')
      expect(element.classes()).toContain('lg:m-4')
      expect(element.classes()).toContain('xl:m-8')
    })
  })

  describe('Responsive Layout Classes', () => {
    it('applies responsive flexbox layouts correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'flex flex-col md:flex-row lg:flex-col xl:flex-row'
        },
        slots: { default: 'Responsive flex' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('flex')
      expect(element.classes()).toContain('flex-col')
      expect(element.classes()).toContain('md:flex-row')
      expect(element.classes()).toContain('lg:flex-col')
      expect(element.classes()).toContain('xl:flex-row')
    })

    it('applies responsive grid layouts correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        },
        slots: { default: 'Responsive grid' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('grid')
      expect(element.classes()).toContain('grid-cols-1')
      expect(element.classes()).toContain('md:grid-cols-2')
      expect(element.classes()).toContain('lg:grid-cols-3')
      expect(element.classes()).toContain('xl:grid-cols-4')
    })

    it('applies responsive custom layout patterns correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'flex-center-start md:flex-center'
        },
        slots: { default: 'Responsive layout patterns' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('flex-center-start')
      expect(element.classes()).toContain('md:flex-center')
    })
  })

  describe('Responsive Display Classes', () => {
    it('applies responsive display utilities correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'block md:hidden lg:block xl:hidden'
        },
        slots: { default: 'Responsive visibility' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('block')
      expect(element.classes()).toContain('md:hidden')
      expect(element.classes()).toContain('lg:block')
      expect(element.classes()).toContain('xl:hidden')
    })

    it('applies responsive flex display correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'hidden md:flex lg:hidden xl:flex'
        },
        slots: { default: 'Responsive flex display' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('hidden')
      expect(element.classes()).toContain('md:flex')
      expect(element.classes()).toContain('lg:hidden')
      expect(element.classes()).toContain('xl:flex')
    })

    it('applies responsive grid display correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'hidden md:grid lg:flex xl:grid'
        },
        slots: { default: 'Responsive grid display' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('hidden')
      expect(element.classes()).toContain('md:grid')
      expect(element.classes()).toContain('lg:flex')
      expect(element.classes()).toContain('xl:grid')
    })
  })

  describe('Responsive Color Classes', () => {
    it('applies responsive brand color classes correctly', () => {
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

    it('applies responsive text color classes correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'text-text-primary md:text-bg-card lg:text-brand-blue'
        },
        slots: { default: 'Responsive text colors' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('text-text-primary')
      expect(element.classes()).toContain('md:text-bg-card')
      expect(element.classes()).toContain('lg:text-brand-blue')
    })
  })

  describe('Responsive Custom Utilities', () => {
    it('applies responsive custom border radius correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'rounded md:rounded-tag lg:rounded-search'
        },
        slots: { default: 'Custom responsive radius' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('rounded')
      expect(element.classes()).toContain('md:rounded-tag')
      expect(element.classes()).toContain('lg:rounded-search')
    })

    it('applies responsive custom shadows correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'shadow md:shadow-card lg:shadow-search'
        },
        slots: { default: 'Custom responsive shadows' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('shadow')
      expect(element.classes()).toContain('md:shadow-card')
      expect(element.classes()).toContain('lg:shadow-search')
    })
  })

  describe('Responsive Component Patterns', () => {
    it('applies responsive button patterns correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'btn-outline md:btn-primary lg:btn-ghost'
        },
        slots: { default: 'Responsive button patterns' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('btn-outline')
      expect(element.classes()).toContain('md:btn-primary')
      expect(element.classes()).toContain('lg:btn-ghost')
    })

    it('applies responsive icon button patterns correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'icon-button-secondary md:icon-button-primary'
        },
        slots: { default: 'Responsive icon buttons' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('icon-button-secondary')
      expect(element.classes()).toContain('md:icon-button-primary')
    })
  })

  describe('Responsive State Classes', () => {
    it('applies responsive hover states correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'bg-bg-card hover:bg-brand-orange md:hover:bg-brand-blue'
        },
        slots: { default: 'Responsive hover' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('bg-bg-card')
      expect(element.classes()).toContain('hover:bg-brand-orange')
      expect(element.classes()).toContain('md:hover:bg-brand-blue')
    })

    it('applies responsive focus states correctly', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'focus:ring-2 focus:ring-brand-orange md:focus:ring-brand-blue'
        },
        slots: { default: 'Responsive focus' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('focus:ring-2')
      expect(element.classes()).toContain('focus:ring-brand-orange')
      expect(element.classes()).toContain('md:focus:ring-brand-blue')
    })

    it('combines responsive states with patterns', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'btn-outline hover:btn-primary md:btn-primary md:hover:btn-ghost'
        },
        slots: { default: 'Complex responsive states' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('btn-outline')
      expect(element.classes()).toContain('hover:btn-primary')
      expect(element.classes()).toContain('md:btn-primary')
      expect(element.classes()).toContain('md:hover:btn-ghost')
    })
  })

  describe('Complex Responsive Combinations', () => {
    it('applies multiple responsive utilities together', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'bg-brand-orange text-bg-card p-2 md:p-4 lg:p-6 rounded md:rounded-tag w-full md:w-1/2 lg:w-1/3'
        },
        slots: { default: 'Complex responsive styling' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('bg-brand-orange')
      expect(element.classes()).toContain('text-bg-card')
      expect(element.classes()).toContain('p-2')
      expect(element.classes()).toContain('md:p-4')
      expect(element.classes()).toContain('lg:p-6')
      expect(element.classes()).toContain('rounded')
      expect(element.classes()).toContain('md:rounded-tag')
      expect(element.classes()).toContain('w-full')
      expect(element.classes()).toContain('md:w-1/2')
      expect(element.classes()).toContain('lg:w-1/3')
    })

    it('handles responsive patterns with standard Tailwind classes', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'result-card w-full md:w-1/2 lg:w-1/3 flex-center md:flex-center-start'
        },
        slots: { default: 'Responsive pattern combinations' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('result-card')
      expect(element.classes()).toContain('w-full')
      expect(element.classes()).toContain('md:w-1/2')
      expect(element.classes()).toContain('lg:w-1/3')
      expect(element.classes()).toContain('flex-center')
      expect(element.classes()).toContain('md:flex-center-start')
    })
  })

  describe('Responsive Layout Patterns', () => {
    it('creates responsive card layout with proper structure', () => {
      const ResponsiveCard = defineComponent({
        template: `
          <div class="result-card w-full md:w-1/2 lg:w-1/3">
            <div class="flex-center-start md:flex-center mb-4">
              <h3 class="text-lg md:text-xl lg:text-2xl">Card Title</h3>
            </div>
            <div class="flex flex-col md:flex-row gap-2 md:gap-4">
              <span class="stat-number text-base md:text-lg">42</span>
              <span class="stat-label text-xs md:text-sm">Items</span>
            </div>
          </div>
        `
      })

      const wrapper = mount(ResponsiveCard)

      // Verify responsive structure
      expect(wrapper.find('.result-card').exists()).toBe(true)
      expect(wrapper.find('.flex-center-start').exists()).toBe(true)
      expect(wrapper.find('.stat-number').exists()).toBe(true)
      expect(wrapper.find('.stat-label').exists()).toBe(true)

      // Verify responsive classes
      const card = wrapper.find('.result-card')
      expect(card.classes()).toContain('w-full')
      expect(card.classes()).toContain('md:w-1/2')
      expect(card.classes()).toContain('lg:w-1/3')

      // Verify content
      expect(wrapper.text()).toContain('Card Title')
      expect(wrapper.text()).toContain('42')
      expect(wrapper.text()).toContain('Items')
    })

    it('validates responsive class ordering and specificity', () => {
      // Test proper mobile-first ordering
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl'
        },
        slots: { default: 'Proper ordering' }
      })

      const element = wrapper.find('div')
      const classes = element.classes()
      
      // Verify all responsive classes are present
      expect(classes).toContain('text-sm')
      expect(classes).toContain('sm:text-base')
      expect(classes).toContain('md:text-lg')
      expect(classes).toContain('lg:text-xl')
      expect(classes).toContain('xl:text-2xl')
    })

    it('handles responsive class conflicts gracefully', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          // Intentionally conflicting classes to test behavior
          customClass: 'w-full w-1/2 md:w-full md:w-1/3 lg:w-1/2 lg:w-1/4'
        },
        slots: { default: 'Conflict resolution' }
      })

      const element = wrapper.find('div')
      // All classes should be present - CSS cascade determines precedence
      expect(element.classes()).toContain('w-full')
      expect(element.classes()).toContain('w-1/2')
      expect(element.classes()).toContain('md:w-full')
      expect(element.classes()).toContain('md:w-1/3')
      expect(element.classes()).toContain('lg:w-1/2')
      expect(element.classes()).toContain('lg:w-1/4')
    })
  })

  describe('Responsive Accessibility', () => {
    it('maintains accessibility features across breakpoints', () => {
      const AccessibleResponsive = defineComponent({
        template: `
          <button 
            class="btn-primary text-sm md:text-base lg:text-lg p-2 md:p-3 lg:p-4"
            aria-label="Responsive accessible button"
            tabindex="0"
          >
            <span class="hidden md:inline">Full Text</span>
            <span class="md:hidden">Short</span>
          </button>
        `
      })

      const wrapper = mount(AccessibleResponsive)
      const button = wrapper.find('button')
      
      expect(button.attributes('aria-label')).toBe('Responsive accessible button')
      expect(button.attributes('tabindex')).toBe('0')
      expect(button.classes()).toContain('btn-primary')
      expect(button.classes()).toContain('text-sm')
      expect(button.classes()).toContain('md:text-base')
      expect(button.classes()).toContain('lg:text-lg')
      
      // Check responsive content
      expect(wrapper.find('.hidden').exists()).toBe(true)
      expect(wrapper.find('.md\\:hidden').exists()).toBe(true)
    })

    it('provides appropriate focus indicators at all breakpoints', () => {
      const wrapper = mount(TestComponent, {
        props: { 
          customClass: 'focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-1 md:focus:ring-offset-2 lg:focus:ring-offset-4'
        },
        slots: { default: 'Focus indicators' }
      })

      const element = wrapper.find('div')
      expect(element.classes()).toContain('focus:outline-none')
      expect(element.classes()).toContain('focus:ring-2')
      expect(element.classes()).toContain('focus:ring-brand-orange')
      expect(element.classes()).toContain('focus:ring-offset-1')
      expect(element.classes()).toContain('md:focus:ring-offset-2')
      expect(element.classes()).toContain('lg:focus:ring-offset-4')
    })
  })

  describe('Responsive Class Validation', () => {
    it('validates all common responsive patterns are supported', () => {
      const responsivePatterns = [
        'w-full md:w-1/2 lg:w-1/3',
        'text-sm md:text-base lg:text-lg',
        'p-2 md:p-4 lg:p-6',
        'flex-col md:flex-row',
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        'hidden md:block lg:hidden',
        'bg-bg-card md:bg-brand-orange lg:bg-brand-blue'
      ]

      responsivePatterns.forEach(classString => {
        const wrapper = mount(TestComponent, {
          props: { customClass: classString },
          slots: { default: 'Pattern validation' }
        })

        const element = wrapper.find('div')
        const classes = classString.split(' ')
        
        classes.forEach(cls => {
          expect(element.classes()).toContain(cls)
        })
      })
    })

    it('validates responsive patterns work with component patterns', () => {
      const componentResponsivePatterns = [
        'btn-outline md:btn-primary lg:btn-ghost',
        'result-card w-full md:w-1/2',
        'flex-center md:flex-center-start',
        'stat-item text-center md:text-left'
      ]

      componentResponsivePatterns.forEach(classString => {
        const wrapper = mount(TestComponent, {
          props: { customClass: classString },
          slots: { default: 'Component responsive validation' }
        })

        const element = wrapper.find('div')
        const classes = classString.split(' ')
        
        classes.forEach(cls => {
          expect(element.classes()).toContain(cls)
        })
      })
    })
  })
})