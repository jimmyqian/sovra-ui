/**
 * Unit tests for AppSidebar component
 * Tests sidebar rendering, navigation icons, layout, and hover states
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSidebar from '../AppSidebar.vue'

describe('AppSidebar', () => {
  describe('Basic Rendering', () => {
    it('renders sidebar container with correct structure', () => {
      const wrapper = mount(AppSidebar)

      const sidebar = wrapper.find('div')
      expect(sidebar.exists()).toBe(true)
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('renders all navigation icons', () => {
      const wrapper = mount(AppSidebar)

      const icons = wrapper.findAll('svg')
      expect(icons).toHaveLength(5)
    })

    it('renders all navigation icon containers', () => {
      const wrapper = mount(AppSidebar)

      const iconContainers = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('w-10') &&
            div.classes().includes('h-10') &&
            div.classes().includes('flex')
        )
      expect(iconContainers).toHaveLength(5)
    })
  })

  describe('Layout Styling', () => {
    it('applies correct container layout classes', () => {
      const wrapper = mount(AppSidebar)

      const container = wrapper.find('div')
      const expectedClasses = [
        'w-15',
        'bg-bg-card',
        'border-r',
        'border-border-light',
        'flex',
        'flex-col',
        'items-center',
        'py-8',
        'gap-4',
        'flex-shrink-0'
      ]

      expectedClasses.forEach(className => {
        expect(container.classes()).toContain(className)
      })
    })

    it('creates vertical layout with correct spacing', () => {
      const wrapper = mount(AppSidebar)

      const container = wrapper.find('div')
      expect(container.classes()).toContain('flex-col')
      expect(container.classes()).toContain('gap-4')
      expect(container.classes()).toContain('py-8')
    })

    it('maintains fixed width and prevents shrinking', () => {
      const wrapper = mount(AppSidebar)

      const container = wrapper.find('div')
      expect(container.classes()).toContain('w-15')
      expect(container.classes()).toContain('flex-shrink-0')
    })

    it('applies border styling for visual separation', () => {
      const wrapper = mount(AppSidebar)

      const container = wrapper.find('div')
      expect(container.classes()).toContain('border-r')
      expect(container.classes()).toContain('border-border-light')
    })
  })

  describe('Navigation Icons', () => {
    it('renders search icon (first icon) with active state', () => {
      const wrapper = mount(AppSidebar)

      const iconContainers = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('w-10') && div.classes().includes('h-10')
        )
      const firstIcon = iconContainers[0]

      expect(firstIcon.classes()).toContain('bg-brand-orange')
      expect(firstIcon.classes()).toContain('text-bg-card')
      expect(firstIcon.classes()).not.toContain('hover:bg-border-hover')
    })

    it('renders inactive navigation icons with hover states', () => {
      const wrapper = mount(AppSidebar)

      const iconContainers = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('w-10') && div.classes().includes('h-10')
        )

      // Check icons 2-5 (inactive icons)
      for (let i = 1; i < iconContainers.length; i++) {
        const icon = iconContainers[i]
        expect(icon.classes()).toContain('hover:bg-border-hover')
        expect(icon.classes()).toContain('text-text-secondary')
        expect(icon.classes()).toContain('hover:text-text-primary')
        expect(icon.classes()).not.toContain('bg-brand-orange')
      }
    })

    it('applies consistent icon container styling', () => {
      const wrapper = mount(AppSidebar)

      const iconContainers = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('w-10') && div.classes().includes('h-10')
        )

      iconContainers.forEach(container => {
        const expectedClasses = [
          'w-10',
          'h-10',
          'flex',
          'items-center',
          'justify-center',
          'rounded-lg',
          'cursor-pointer',
          'transition-colors'
        ]

        expectedClasses.forEach(className => {
          expect(container.classes()).toContain(className)
        })
      })
    })
  })

  describe('SVG Icons', () => {
    it('renders search icon SVG with correct attributes', () => {
      const wrapper = mount(AppSidebar)

      const svgs = wrapper.findAll('svg')
      const searchIcon = svgs[0]

      expect(searchIcon.attributes('width')).toBe('20')
      expect(searchIcon.attributes('height')).toBe('20')
      expect(searchIcon.attributes('viewBox')).toBe('0 0 24 24')
      expect(searchIcon.attributes('fill')).toBe('none')
    })

    it('renders menu icon SVG with correct paths', () => {
      const wrapper = mount(AppSidebar)

      const svgs = wrapper.findAll('svg')
      const menuIcon = svgs[1]
      const path = menuIcon.find('path')

      expect(path.attributes('d')).toBe('M4 12h16M4 6h16M4 18h16')
      expect(path.attributes('stroke')).toBe('currentColor')
      expect(path.attributes('stroke-width')).toBe('2')
    })

    it('renders all SVG icons with consistent dimensions', () => {
      const wrapper = mount(AppSidebar)

      const svgs = wrapper.findAll('svg')

      svgs.forEach(svg => {
        expect(svg.attributes('width')).toBe('20')
        expect(svg.attributes('height')).toBe('20')
        expect(svg.attributes('viewBox')).toBe('0 0 24 24')
        expect(svg.attributes('fill')).toBe('none')
      })
    })

    it('renders edit icon SVG with correct path', () => {
      const wrapper = mount(AppSidebar)

      const svgs = wrapper.findAll('svg')
      const editIcon = svgs[2]
      const path = editIcon.find('path')

      expect(path.attributes('d')).toBe(
        'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'
      )
    })

    it('renders settings icon SVG with circle and paths', () => {
      const wrapper = mount(AppSidebar)

      const svgs = wrapper.findAll('svg')
      const settingsIcon = svgs[3]
      const circle = settingsIcon.find('circle')
      const path = settingsIcon.find('path')

      expect(circle.exists()).toBe(true)
      expect(path.exists()).toBe(true)
      expect(circle.attributes('cx')).toBe('12')
      expect(circle.attributes('cy')).toBe('12')
      expect(circle.attributes('r')).toBe('3')
    })

    it('renders user icon SVG with path and circle', () => {
      const wrapper = mount(AppSidebar)

      const svgs = wrapper.findAll('svg')
      const userIcon = svgs[4]
      const path = userIcon.find('path')
      const circle = userIcon.find('circle')

      expect(path.exists()).toBe(true)
      expect(circle.exists()).toBe(true)
      expect(circle.attributes('cx')).toBe('12')
      expect(circle.attributes('cy')).toBe('7')
      expect(circle.attributes('r')).toBe('4')
    })
  })

  describe('Interactive States', () => {
    it('applies cursor pointer to all icon containers', () => {
      const wrapper = mount(AppSidebar)

      const iconContainers = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('w-10') && div.classes().includes('h-10')
        )

      iconContainers.forEach(container => {
        expect(container.classes()).toContain('cursor-pointer')
      })
    })

    it('applies transition effects to all icon containers', () => {
      const wrapper = mount(AppSidebar)

      const iconContainers = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('w-10') && div.classes().includes('h-10')
        )

      iconContainers.forEach(container => {
        expect(container.classes()).toContain('transition-colors')
      })
    })
  })

  describe('Visual Hierarchy', () => {
    it('distinguishes active search icon from other icons', () => {
      const wrapper = mount(AppSidebar)

      const iconContainers = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('w-10') && div.classes().includes('h-10')
        )

      const activeIcon = iconContainers[0]
      const inactiveIcon = iconContainers[1]

      // Active icon styling
      expect(activeIcon.classes()).toContain('bg-brand-orange')
      expect(activeIcon.classes()).toContain('text-bg-card')

      // Inactive icon styling
      expect(inactiveIcon.classes()).toContain('text-text-secondary')
      expect(inactiveIcon.classes()).not.toContain('bg-brand-orange')
    })

    it('provides visual feedback through hover states', () => {
      const wrapper = mount(AppSidebar)

      const iconContainers = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('w-10') && div.classes().includes('h-10')
        )

      // Skip first icon (active) and check others for hover states
      for (let i = 1; i < iconContainers.length; i++) {
        const icon = iconContainers[i]
        expect(icon.classes()).toContain('hover:bg-border-hover')
        expect(icon.classes()).toContain('hover:text-text-primary')
      }
    })
  })
})
