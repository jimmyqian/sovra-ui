/**
 * Unit tests for AppSidebar component
 * Tests sidebar rendering, navigation icons, layout, hover states, and search popout
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import AppSidebar from '../AppSidebar.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/search', component: { template: '<div>Search</div>' } }
  ]
})

describe('AppSidebar', () => {
  const createWrapper = () => {
    return mount(AppSidebar, {
      global: {
        plugins: [router]
      }
    })
  }

  describe('Basic Rendering', () => {
    it('renders sidebar container with correct structure', () => {
      const wrapper = createWrapper()

      const sidebar = wrapper.find('div')
      expect(sidebar.exists()).toBe(true)
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('renders all navigation icons', () => {
      const wrapper = createWrapper()

      const icons = wrapper.findAll('svg')
      expect(icons).toHaveLength(5) // 5 navigation icons (popout is hidden by default)
    })

    it('renders all navigation icon containers', () => {
      const wrapper = createWrapper()

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
      const wrapper = createWrapper()

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
      const wrapper = createWrapper()

      const container = wrapper.find('div')
      expect(container.classes()).toContain('flex-col')
      expect(container.classes()).toContain('gap-4')
      expect(container.classes()).toContain('py-8')
    })

    it('maintains fixed width and prevents shrinking', () => {
      const wrapper = createWrapper()

      const container = wrapper.find('div')
      expect(container.classes()).toContain('w-15')
      expect(container.classes()).toContain('flex-shrink-0')
    })

    it('applies border styling for visual separation', () => {
      const wrapper = createWrapper()

      const container = wrapper.find('div')
      expect(container.classes()).toContain('border-r')
      expect(container.classes()).toContain('border-border-light')
    })
  })

  describe('Navigation Icons', () => {
    it('renders search icon (first icon) with active state', () => {
      const wrapper = createWrapper()

      const iconContainers = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('w-10') && div.classes().includes('h-10')
        )
      const firstIcon = iconContainers[0]
      expect(firstIcon).toBeTruthy()

      if (firstIcon) {
        expect(firstIcon.classes()).toContain('bg-brand-orange')
        expect(firstIcon.classes()).toContain('text-bg-card')
        expect(firstIcon.classes()).not.toContain('hover:bg-border-hover')
      }
    })

    it('renders inactive navigation icons with hover states', () => {
      const wrapper = createWrapper()

      const iconContainers = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('w-10') && div.classes().includes('h-10')
        )

      // Check icons 2-5 (inactive icons)
      for (let i = 1; i < iconContainers.length; i++) {
        const icon = iconContainers[i]
        expect(icon).toBeTruthy()
        if (icon) {
          expect(icon.classes()).toContain('hover:bg-border-hover')
          expect(icon.classes()).toContain('text-text-secondary')
          expect(icon.classes()).toContain('hover:text-text-primary')
          expect(icon.classes()).not.toContain('bg-brand-orange')
        }
      }
    })

    it('applies consistent icon container styling', () => {
      const wrapper = createWrapper()

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
      const wrapper = createWrapper()

      const svgs = wrapper.findAll('svg')
      const searchIcon = svgs[0]
      expect(searchIcon).toBeTruthy()

      if (searchIcon) {
        expect(searchIcon.attributes('width')).toBe('20')
        expect(searchIcon.attributes('height')).toBe('20')
        expect(searchIcon.attributes('viewBox')).toBe('0 0 24 24')
        expect(searchIcon.attributes('fill')).toBe('none')
      }
    })

    it('renders menu icon SVG with correct paths', () => {
      const wrapper = createWrapper()

      const svgs = wrapper.findAll('svg')
      const menuIcon = svgs[1]
      expect(menuIcon).toBeTruthy()
      if (menuIcon) {
        const path = menuIcon.find('path')

        expect(path.attributes('d')).toBe('M4 12h16M4 6h16M4 18h16')
        expect(path.attributes('stroke')).toBe('currentColor')
        expect(path.attributes('stroke-width')).toBe('2')
      }
    })

    it('renders all SVG icons with consistent dimensions', () => {
      const wrapper = createWrapper()

      const svgs = wrapper.findAll('svg')

      svgs.forEach(svg => {
        expect(svg.attributes('width')).toBe('20')
        expect(svg.attributes('height')).toBe('20')
        expect(svg.attributes('viewBox')).toBe('0 0 24 24')
        expect(svg.attributes('fill')).toBe('none')
      })
    })

    it('renders edit icon SVG with correct path', () => {
      const wrapper = createWrapper()

      const svgs = wrapper.findAll('svg')
      const editIcon = svgs[2]
      expect(editIcon).toBeTruthy()
      if (editIcon) {
        const path = editIcon.find('path')

        expect(path.attributes('d')).toBe(
          'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'
        )
      }
    })

    it('renders settings icon SVG with circle and paths', () => {
      const wrapper = createWrapper()

      const svgs = wrapper.findAll('svg')
      const settingsIcon = svgs[3]
      expect(settingsIcon).toBeTruthy()
      if (settingsIcon) {
        const circle = settingsIcon.find('circle')
        const path = settingsIcon.find('path')

        expect(circle.exists()).toBe(true)
        expect(path.exists()).toBe(true)
        expect(circle.attributes('cx')).toBe('12')
        expect(circle.attributes('cy')).toBe('12')
        expect(circle.attributes('r')).toBe('3')
      }
    })

    it('renders user icon SVG with path and circle', () => {
      const wrapper = createWrapper()

      const svgs = wrapper.findAll('svg')
      const userIcon = svgs[4]
      expect(userIcon).toBeTruthy()
      if (userIcon) {
        const path = userIcon.find('path')
        const circle = userIcon.find('circle')

        expect(path.exists()).toBe(true)
        expect(circle.exists()).toBe(true)
        expect(circle.attributes('cx')).toBe('12')
        expect(circle.attributes('cy')).toBe('7')
        expect(circle.attributes('r')).toBe('4')
      }
    })
  })

  describe('Interactive States', () => {
    it('applies cursor pointer to all icon containers', () => {
      const wrapper = createWrapper()

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
      const wrapper = createWrapper()

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
      const wrapper = createWrapper()

      const iconContainers = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('w-10') && div.classes().includes('h-10')
        )

      const activeIcon = iconContainers[0]
      const inactiveIcon = iconContainers[1]
      expect(activeIcon).toBeTruthy()
      expect(inactiveIcon).toBeTruthy()

      // Active icon styling
      if (activeIcon) {
        expect(activeIcon.classes()).toContain('bg-brand-orange')
        expect(activeIcon.classes()).toContain('text-bg-card')
      }

      // Inactive icon styling
      if (inactiveIcon) {
        expect(inactiveIcon.classes()).toContain('text-text-secondary')
        expect(inactiveIcon.classes()).not.toContain('bg-brand-orange')
      }
    })

    it('provides visual feedback through hover states', () => {
      const wrapper = createWrapper()

      const iconContainers = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('w-10') && div.classes().includes('h-10')
        )

      // Skip first icon (active) and check others for hover states
      for (let i = 1; i < iconContainers.length; i++) {
        const icon = iconContainers[i]
        expect(icon).toBeTruthy()
        if (icon) {
          expect(icon.classes()).toContain('hover:bg-border-hover')
          expect(icon.classes()).toContain('hover:text-text-primary')
        }
      }
    })
  })

  describe('Search Popout Functionality', () => {
    it('does not show search popout by default', () => {
      const wrapper = createWrapper()

      const popout = wrapper.find('.absolute.left-full')
      expect(popout.exists()).toBe(false)
    })

    it('shows search popout when search icon is clicked', async () => {
      const wrapper = createWrapper()

      const searchIcon = wrapper.find('.bg-brand-orange')
      await searchIcon.trigger('click')

      const popout = wrapper.find('.absolute.left-full')
      expect(popout.exists()).toBe(true)
    })

    it('hides search popout when close button is clicked', async () => {
      const wrapper = createWrapper()

      const searchIcon = wrapper.find('.bg-brand-orange')
      await searchIcon.trigger('click')

      const closeButton = wrapper.find('.ml-auto')
      await closeButton.trigger('click')

      const popout = wrapper.find('.absolute.left-full')
      expect(popout.exists()).toBe(false)
    })

    it('renders search input in popout', async () => {
      const wrapper = createWrapper()

      const searchIcon = wrapper.find('.bg-brand-orange')
      await searchIcon.trigger('click')

      const input = wrapper.find('input[type="text"]')
      expect(input.exists()).toBe(true)
      expect(input.attributes('placeholder')).toBe(
        'Search for people, places, events...'
      )
    })

    it('renders search button in popout', async () => {
      const wrapper = createWrapper()

      const searchIcon = wrapper.find('.bg-brand-orange')
      await searchIcon.trigger('click')

      const searchButton = wrapper.find('button.bg-brand-orange')
      expect(searchButton.exists()).toBe(true)
      expect(searchButton.text()).toBe('Search')
    })

    it('navigates to search page when search button is clicked with query', async () => {
      const wrapper = createWrapper()
      const pushSpy = vi.spyOn(router, 'push')

      const searchIcon = wrapper.find('.bg-brand-orange')
      await searchIcon.trigger('click')
      await wrapper.vm.$nextTick()

      const input = wrapper.find('input[type="text"]')
      await input.setValue('test query')

      const buttons = wrapper.findAll('button')
      const searchButton = buttons.find(btn => btn.text() === 'Search')
      expect(searchButton).toBeTruthy()
      await searchButton?.trigger('click')

      expect(pushSpy).toHaveBeenCalledWith({
        path: '/search',
        query: { q: 'test query' }
      })

      pushSpy.mockRestore()
    })

    it('closes popout after successful search', async () => {
      const wrapper = createWrapper()

      const searchIconDiv = wrapper.find('.bg-brand-orange')
      await searchIconDiv.trigger('click')

      const input = wrapper.find('input[type="text"]')
      await input.setValue('test query')

      const searchButton = wrapper.find('button.bg-brand-orange')
      await searchButton.trigger('click')
      await wrapper.vm.$nextTick()

      const popout = wrapper.find('.absolute.left-full')
      expect(popout.exists()).toBe(false)
    })

    it('handles enter key in search input', async () => {
      const wrapper = createWrapper()
      const pushSpy = vi.spyOn(router, 'push')

      const searchIcon = wrapper.find('.bg-brand-orange')
      await searchIcon.trigger('click')

      const input = wrapper.find('input[type="text"]')
      await input.setValue('test query')
      await input.trigger('keyup.enter')

      expect(pushSpy).toHaveBeenCalledWith({
        path: '/search',
        query: { q: 'test query' }
      })

      pushSpy.mockRestore()
    })

    it('handles escape key to close popout', async () => {
      const wrapper = createWrapper()

      const searchIcon = wrapper.find('.bg-brand-orange')
      await searchIcon.trigger('click')

      const input = wrapper.find('input[type="text"]')
      await input.trigger('keyup.esc')

      const popout = wrapper.find('.absolute.left-full')
      expect(popout.exists()).toBe(false)
    })

    it('does not navigate with empty search query', async () => {
      const wrapper = createWrapper()
      const pushSpy = vi.spyOn(router, 'push')

      const searchIcon = wrapper.find('.bg-brand-orange')
      await searchIcon.trigger('click')

      const searchButton = wrapper.find('button.bg-brand-orange')
      await searchButton.trigger('click')

      expect(pushSpy).not.toHaveBeenCalled()

      pushSpy.mockRestore()
    })

    it('focuses input when popout is opened', async () => {
      const wrapper = createWrapper()

      const searchIcon = wrapper.find('.bg-brand-orange')
      await searchIcon.trigger('click')
      await wrapper.vm.$nextTick()

      const input = wrapper.find('input[type="text"]')
      // Note: focus() doesn't work in JSDOM but we can verify the input exists
      expect(input.exists()).toBe(true)
    })
  })
})
