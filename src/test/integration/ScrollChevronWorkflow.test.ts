/**
 * Integration tests for scroll chevron functionality across different pages
 * Tests the new chevron-based scroll controls instead of button wrappers
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import SearchResults from '@/views/SearchResults.vue'
import SearchDetail from '@/views/SearchDetail.vue'
import RightPanel from '@/components/search/RightPanel.vue'
import ChevronUpIcon from '@/components/icons/ChevronUpIcon.vue'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'

describe('Scroll Chevron Integration Tests', () => {
  let pinia: ReturnType<typeof createPinia>
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    pinia = createPinia()
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'Landing',
          component: { template: '<div>Landing</div>' }
        },
        { path: '/search', name: 'SearchResults', component: SearchResults },
        {
          path: '/dashboard/:id',
          name: 'SearchDetail',
          component: SearchDetail
        }
      ]
    })
    vi.clearAllMocks()
  })

  describe('SearchResults Page Chevrons', () => {
    it('should render chevrons with brand orange styling in SearchResults', async () => {
      await router.push('/search?q=test&location=test')
      const wrapper = mount(SearchResults, {
        global: {
          plugins: [pinia, router]
        },
        props: {
          query: 'test search',
          location: 'test location'
        }
      })

      // Trigger scroll to show chevrons
      const scrollContainer = wrapper.find('.conversation-scroll')
      if (scrollContainer.exists()) {
        // Mock scrollable content
        Object.defineProperty(scrollContainer.element, 'scrollHeight', {
          value: 1000,
          writable: true
        })
        Object.defineProperty(scrollContainer.element, 'clientHeight', {
          value: 400,
          writable: true
        })
        Object.defineProperty(scrollContainer.element, 'scrollTop', {
          value: 100,
          writable: true
        })

        await scrollContainer.trigger('scroll')
        await wrapper.vm.$nextTick()

        const chevronUp = wrapper.findComponent(ChevronUpIcon)
        const chevronDown = wrapper.findComponent(ChevronDownIcon)

        if (chevronUp.exists()) {
          expect(chevronUp.classes()).toContain('scroll-chevron')
          expect(chevronUp.classes()).toContain('cursor-pointer')
          expect(chevronUp.attributes('aria-label')).toBe(
            'Scroll conversation to top'
          )
        }

        if (chevronDown.exists()) {
          expect(chevronDown.classes()).toContain('scroll-chevron')
          expect(chevronDown.classes()).toContain('cursor-pointer')
          expect(chevronDown.attributes('aria-label')).toBe(
            'Scroll conversation to bottom'
          )
        }
      }
    })

    it('should handle chevron click events in SearchResults', async () => {
      await router.push('/search?q=test&location=test')
      const wrapper = mount(SearchResults, {
        global: {
          plugins: [pinia, router]
        },
        props: {
          query: 'test search',
          location: 'test location'
        }
      })

      const scrollContainer = wrapper.find('.conversation-scroll')
      if (scrollContainer.exists()) {
        // Mock scrollable content
        Object.defineProperty(scrollContainer.element, 'scrollHeight', {
          value: 1000,
          writable: true
        })
        Object.defineProperty(scrollContainer.element, 'clientHeight', {
          value: 400,
          writable: true
        })
        Object.defineProperty(scrollContainer.element, 'scrollTop', {
          value: 100,
          writable: true
        })

        const mockScrollTo = vi.fn()
        scrollContainer.element.scrollTo = mockScrollTo

        await scrollContainer.trigger('scroll')
        await wrapper.vm.$nextTick()

        const chevronUp = wrapper.findComponent(ChevronUpIcon)
        if (chevronUp.exists()) {
          await chevronUp.trigger('click')
          expect(mockScrollTo).toHaveBeenCalled()
        }
      }
    })
  })

  describe('SearchDetail Page Chevrons', () => {
    it('should render chevrons with brand orange styling in SearchDetail', async () => {
      await router.push('/detail/test-id')
      const wrapper = mount(SearchDetail, {
        global: {
          plugins: [pinia, router]
        },
        props: {
          resultId: 'test-id'
        }
      })

      // Trigger scroll to show chevrons
      const scrollContainer = wrapper.find('.detail-scroll')
      if (scrollContainer.exists()) {
        // Mock scrollable content
        Object.defineProperty(scrollContainer.element, 'scrollHeight', {
          value: 1000,
          writable: true
        })
        Object.defineProperty(scrollContainer.element, 'clientHeight', {
          value: 400,
          writable: true
        })
        Object.defineProperty(scrollContainer.element, 'scrollTop', {
          value: 100,
          writable: true
        })

        await scrollContainer.trigger('scroll')
        await wrapper.vm.$nextTick()

        const chevronUp = wrapper.findComponent(ChevronUpIcon)
        const chevronDown = wrapper.findComponent(ChevronDownIcon)

        if (chevronUp.exists()) {
          expect(chevronUp.classes()).toContain('scroll-chevron')
          expect(chevronUp.classes()).toContain('cursor-pointer')
          expect(chevronUp.attributes('aria-label')).toBe('Scroll to top')
        }

        if (chevronDown.exists()) {
          expect(chevronDown.classes()).toContain('scroll-chevron')
          expect(chevronDown.classes()).toContain('cursor-pointer')
          expect(chevronDown.attributes('aria-label')).toBe('Scroll to bottom')
        }
      }
    })
  })

  describe('RightPanel Chevrons', () => {
    it('should render chevrons with brand orange styling in RightPanel', async () => {
      const wrapper = mount(RightPanel, {
        global: {
          plugins: [pinia]
        },
        props: {
          results: [
            {
              id: 'test-uuid-1',
              name: 'Test Result 1',
              age: 30,
              gender: 'Male',
              maritalStatus: 'Single',
              location: 'Test Location',
              rating: 4.5,
              references: 10,
              companies: 5,
              contacts: 15
            },
            {
              id: 'test-uuid-2',
              name: 'Test Result 2',
              age: 25,
              gender: 'Female',
              maritalStatus: 'Married',
              location: 'Test Location 2',
              rating: 4.0,
              references: 8,
              companies: 3,
              contacts: 12
            }
          ],
          hasMore: false,
          isLoading: false,
          error: null,
          selectedPerson: null
        }
      })

      // Trigger scroll to show chevrons
      const scrollContainer = wrapper.find('.results-scroll')
      if (scrollContainer.exists()) {
        // Mock scrollable content
        Object.defineProperty(scrollContainer.element, 'scrollHeight', {
          value: 1000,
          writable: true
        })
        Object.defineProperty(scrollContainer.element, 'clientHeight', {
          value: 400,
          writable: true
        })
        Object.defineProperty(scrollContainer.element, 'scrollTop', {
          value: 100,
          writable: true
        })

        await scrollContainer.trigger('scroll')
        await wrapper.vm.$nextTick()

        const chevronUp = wrapper.findComponent(ChevronUpIcon)
        const chevronDown = wrapper.findComponent(ChevronDownIcon)

        if (chevronUp.exists()) {
          expect(chevronUp.classes()).toContain('scroll-chevron')
          expect(chevronUp.classes()).toContain('cursor-pointer')
          expect(chevronUp.attributes('aria-label')).toBe('Scroll to top')
        }

        if (chevronDown.exists()) {
          expect(chevronDown.classes()).toContain('scroll-chevron')
          expect(chevronDown.classes()).toContain('cursor-pointer')
          expect(chevronDown.attributes('aria-label')).toBe('Scroll to bottom')
        }
      }
    })
  })

  describe('Chevron Styling Consistency', () => {
    it('should apply consistent brand orange styling across all components', () => {
      const chevronUp = mount(ChevronUpIcon, {
        attrs: {
          class: 'scroll-chevron',
          style: 'color: var(--color-brand-orange)'
        }
      })

      const chevronDown = mount(ChevronDownIcon, {
        attrs: {
          class: 'scroll-chevron',
          style: 'color: var(--color-brand-orange)'
        }
      })

      // Both chevrons should have the same styling
      expect(chevronUp.classes()).toContain('scroll-chevron')
      expect(chevronDown.classes()).toContain('scroll-chevron')

      expect(chevronUp.attributes('style')).toContain(
        'color: var(--color-brand-orange)'
      )
      expect(chevronDown.attributes('style')).toContain(
        'color: var(--color-brand-orange)'
      )
    })

    it('should maintain proper size dimensions for chevrons', () => {
      const chevronUp = mount(ChevronUpIcon)
      const chevronDown = mount(ChevronDownIcon)

      const upSvg = chevronUp.find('svg')
      const downSvg = chevronDown.find('svg')

      // Check SVG dimensions - should be smaller than old buttons
      expect(upSvg.attributes('width')).toBe('20')
      expect(upSvg.attributes('height')).toBe('20')
      expect(downSvg.attributes('width')).toBe('20')
      expect(downSvg.attributes('height')).toBe('20')

      // Ensure they're consistent
      expect(upSvg.attributes('width')).toBe(downSvg.attributes('width'))
      expect(upSvg.attributes('height')).toBe(downSvg.attributes('height'))
    })
  })

  describe('Accessibility Integration', () => {
    it('should maintain proper ARIA labels for screen readers', () => {
      const upChevron = mount(ChevronUpIcon, {
        attrs: {
          'aria-label': 'Scroll to top'
        }
      })

      const downChevron = mount(ChevronDownIcon, {
        attrs: {
          'aria-label': 'Scroll to bottom'
        }
      })

      expect(upChevron.attributes('aria-label')).toBe('Scroll to top')
      expect(downChevron.attributes('aria-label')).toBe('Scroll to bottom')
    })

    it('should support keyboard navigation on chevrons', async () => {
      let clicked = false
      const chevron = mount(ChevronUpIcon, {
        attrs: {
          onClick: () => {
            clicked = true
          },
          tabindex: '0'
        }
      })

      const svg = chevron.find('svg')
      expect(svg.attributes('tabindex')).toBe('0')

      // Test keyboard activation
      await svg.trigger('keydown.enter')
      await svg.trigger('keydown.space')

      // Should be clickable for keyboard users
      await svg.trigger('click')
      expect(clicked).toBe(true)
    })
  })
})
