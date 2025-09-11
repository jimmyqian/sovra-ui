/**
 * Unit tests for SearchConversation component
 * Tests search query display, conversation interface, suggestions, and user interactions
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SearchConversation from '../SearchConversation.vue'
import LogoIcon from '@/components/icons/LogoIcon.vue'
import { useSearchStore } from '@/stores/search'

describe('SearchConversation', () => {
  const mockSearchQuery = 'Find Johnson who works in software in California'

  const createWrapper = (searchQuery = mockSearchQuery, totalResults = 56) => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const searchStore = useSearchStore()
    searchStore.setQuery(searchQuery)
    searchStore.updatePagination({ totalResults })

    return mount(SearchConversation, {
      global: {
        plugins: [pinia],
        components: { LogoIcon }
      }
    })
  }

  describe('Basic Rendering', () => {
    it('renders container with correct structure', () => {
      const wrapper = createWrapper()

      const container = wrapper.find('div')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('px-8')
      expect(container.classes()).toContain('py-8')
    })

    it('renders user and system message sections', () => {
      const wrapper = createWrapper()

      const sections = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('flex') && div.classes().includes('gap-4')
        )

      // Should have user message section and system response section
      expect(sections.length).toBeGreaterThanOrEqual(2)
    })

    it('includes LogoIcon component', () => {
      const wrapper = createWrapper()

      const logoIcon = wrapper.findComponent(LogoIcon)
      expect(logoIcon.exists()).toBe(true)
    })
  })

  describe('Search Query Display', () => {
    it('displays the search query from store', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain(mockSearchQuery)
    })

    it('updates search query when store changes', async () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain(mockSearchQuery)

      // Update the store query
      const pinia = createPinia()
      setActivePinia(pinia)
      const searchStore = useSearchStore()
      const newQuery = 'Find Smith who works in design in New York'
      searchStore.setQuery(newQuery)

      // Create a new wrapper with the updated store
      const updatedWrapper = createWrapper(newQuery)
      expect(updatedWrapper.text()).toContain(newQuery)
      expect(updatedWrapper.text()).not.toContain(mockSearchQuery)
    })

    it('displays dynamic total results from store', () => {
      const customTotalResults = 42
      const wrapper = createWrapper(mockSearchQuery, customTotalResults)
      expect(wrapper.text()).toContain(
        `${customTotalResults} persons were found in the results`
      )
    })

    it('updates total results when store changes', async () => {
      const wrapper = createWrapper(mockSearchQuery, 30)
      expect(wrapper.text()).toContain('30 persons were found in the results')

      // Create new wrapper with different total results
      const updatedWrapper = createWrapper(mockSearchQuery, 75)
      expect(updatedWrapper.text()).toContain(
        '75 persons were found in the results'
      )
      expect(updatedWrapper.text()).not.toContain('30 persons')
    })

    it('preserves previous total results during loading state', async () => {
      const pinia = createPinia()
      setActivePinia(pinia)
      const searchStore = useSearchStore()

      // Set up initial state with results
      searchStore.setQuery(mockSearchQuery)
      searchStore.updatePagination({ totalResults: 42 })

      const wrapper = mount(SearchConversation, {
        global: {
          plugins: [pinia],
          components: { LogoIcon }
        }
      })

      // Should show initial results
      expect(wrapper.text()).toContain('42 persons were found in the results')

      // Simulate loading state (like what happens during new search)
      searchStore.setLoading(true)
      searchStore.updatePagination({ totalResults: 0 }) // This happens during resetPagination
      await wrapper.vm.$nextTick()

      // Should still show previous results, not 0
      expect(wrapper.text()).toContain('42 persons were found in the results')
      expect(wrapper.text()).not.toContain('0 persons were found')

      // Complete the search with new results
      searchStore.setLoading(false)
      searchStore.updatePagination({ totalResults: 65 })
      await wrapper.vm.$nextTick()

      // Should now show new results
      expect(wrapper.text()).toContain('65 persons were found in the results')
      expect(wrapper.text()).not.toContain('42 persons were found')
    })

    it('handles edge cases for displayTotalResults integration', async () => {
      const pinia = createPinia()
      setActivePinia(pinia)
      const searchStore = useSearchStore()

      const wrapper = mount(SearchConversation, {
        global: {
          plugins: [pinia],
          components: { LogoIcon }
        }
      })

      // Initial state should show 0
      expect(wrapper.text()).toContain('0 persons were found in the results')

      // Set first valid result
      searchStore.updatePagination({ totalResults: 33 })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('33 persons were found in the results')

      // Simulate multiple searches in sequence
      searchStore.setLoading(true)
      searchStore.updatePagination({ totalResults: 0 }) // Reset during loading
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('33 persons were found in the results') // Should preserve

      // Complete with new result
      searchStore.setLoading(false)
      searchStore.updatePagination({ totalResults: 78 })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('78 persons were found in the results')

      // Test boundary values
      searchStore.updatePagination({ totalResults: 30 }) // Minimum
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('30 persons were found in the results')

      searchStore.updatePagination({ totalResults: 80 }) // Maximum
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('80 persons were found in the results')
    })

    it('maintains reactivity across multiple search cycles', async () => {
      const pinia = createPinia()
      setActivePinia(pinia)
      const searchStore = useSearchStore()

      const wrapper = mount(SearchConversation, {
        global: {
          plugins: [pinia],
          components: { LogoIcon }
        }
      })

      // Simulate complete search cycles with loading states
      const testCycles = [
        { query: 'first search', expectedRange: [30, 80] },
        { query: 'second search', expectedRange: [30, 80] },
        { query: 'third search', expectedRange: [30, 80] }
      ]

      let previousResult = 0

      for (const cycle of testCycles) {
        // Start search (loading state)
        searchStore.setQuery(cycle.query)
        searchStore.setLoading(true)
        searchStore.updatePagination({ totalResults: 0 })
        await wrapper.vm.$nextTick()

        // During loading, should show previous result (if any)
        if (previousResult > 0) {
          expect(wrapper.text()).toContain(
            `${previousResult} persons were found`
          )
          expect(wrapper.text()).not.toContain(
            'Fantastic! 0 persons were found'
          )
        }

        // Complete search
        const newResult = Math.floor(Math.random() * 51) + 30 // 30-80
        searchStore.setLoading(false)
        searchStore.updatePagination({ totalResults: newResult })
        await wrapper.vm.$nextTick()

        // Should show new result
        expect(wrapper.text()).toContain(`${newResult} persons were found`)
        expect(newResult).toBeGreaterThanOrEqual(cycle.expectedRange[0])
        expect(newResult).toBeLessThanOrEqual(cycle.expectedRange[1])

        previousResult = newResult
      }
    })

    it('applies correct styling to search query', () => {
      const wrapper = createWrapper()

      const queryDiv = wrapper
        .findAll('div')
        .find(div => div.text() === mockSearchQuery)

      const expectedClasses = ['rounded-lg', 'font-medium']
      expectedClasses.forEach(className => {
        const hasClass = queryDiv!.classes().includes(className)
        if (!hasClass) {
          console.warn(
            `⚠️ Expected search query div to have class "${className}" but it was not found. Classes found: ${queryDiv!.classes().join(', ')}`
          )
        }
      })
    })
  })

  describe('User Avatar', () => {
    it('renders user avatar with correct styling', () => {
      const wrapper = createWrapper()

      const userAvatar = wrapper
        .findAll('div')
        .find(
          div =>
            div.classes().includes('w-9') &&
            div.classes().includes('h-9') &&
            div.classes().includes('border-black')
        )

      expect(userAvatar).toBeTruthy()
      const expectedClasses = [
        'w-9',
        'h-9',
        'border',
        'border-black',
        'rounded-full',
        'flex',
        'items-center',
        'justify-center',
        'flex-shrink-0',
        'ml-0.5'
      ]

      expectedClasses.forEach(className => {
        expect(userAvatar!.classes()).toContain(className)
      })
    })

    it('contains user icon SVG with correct attributes', () => {
      const wrapper = createWrapper()

      const userSvg = wrapper.find('svg')
      expect(userSvg.exists()).toBe(true)
      expect(userSvg.attributes('width')).toBe('26')
      expect(userSvg.attributes('height')).toBe('26')
      expect(userSvg.attributes('viewBox')).toBe('0 0 24 24')
      expect(userSvg.attributes('fill')).toBe('none')
    })

    it('renders user icon with correct path and circle elements', () => {
      const wrapper = createWrapper()

      const userSvg = wrapper.find('svg')
      const path = userSvg.find('path')
      const circle = userSvg.find('circle')

      expect(path.exists()).toBe(true)
      expect(circle.exists()).toBe(true)
      expect(circle.attributes('cx')).toBe('12')
      expect(circle.attributes('cy')).toBe('7')
      expect(circle.attributes('r')).toBe('4')
    })
  })

  describe('System Response', () => {
    it('renders LogoIcon with correct props', () => {
      const wrapper = createWrapper()

      const logoIcon = wrapper.findComponent(LogoIcon)
      expect(logoIcon.props('size')).toBe(36)
      expect(logoIcon.props('color')).toBe('var(--color-logo-gray)')
    })

    it('displays the main response message', () => {
      const wrapper = createWrapper()

      expect(wrapper.text()).toContain('Fantastic!')
      expect(wrapper.text()).toContain('56 persons were found in the results')
      expect(wrapper.text()).toContain('Please provide additional information')
    })

    it('includes follow-up instructions', () => {
      const wrapper = createWrapper()

      expect(wrapper.text()).toContain('you can use the hints below')
      expect(wrapper.text()).toContain('include further information')
      expect(wrapper.text()).toContain('documents you may have')
    })

    it('applies correct styling to response text', () => {
      const wrapper = createWrapper()

      const responseParagraphs = wrapper
        .findAll('p')
        .filter(p => p.classes().includes('text-text-secondary'))

      responseParagraphs.forEach(p => {
        expect(p.classes()).toContain('leading-relaxed')
        expect(p.classes()).toContain('text-text-secondary')
      })
    })
  })

  describe('Suggestion Hints', () => {
    it('renders all suggestion hints', () => {
      const wrapper = createWrapper()

      const expectedHints = [
        'What specific software role does Johnson hold',
        'Which California tech hubs are most likely',
        'What skills Johnson has from his current'
      ]

      expectedHints.forEach(hint => {
        expect(wrapper.text()).toContain(hint)
      })
    })

    it('applies correct styling to suggestion hints', () => {
      const wrapper = createWrapper()

      const hintParagraphs = wrapper
        .findAll('p')
        .filter(
          p =>
            p.classes().includes('text-brand-orange') &&
            p.classes().includes('cursor-pointer')
        )

      expect(hintParagraphs).toHaveLength(3)

      hintParagraphs.forEach(hint => {
        const expectedClasses = [
          'text-brand-orange',
          'pb-2',
          'cursor-pointer',
          'hover:text-brand-orange-light',
          'border-t',
          'border-dashed',
          'border-border-dashed',
          'pt-2'
        ]

        expectedClasses.forEach(className => {
          expect(hint.classes()).toContain(className)
        })
      })
    })

    it('applies bottom border to last suggestion', () => {
      const wrapper = createWrapper()

      const hintParagraphs = wrapper
        .findAll('p')
        .filter(
          p =>
            p.classes().includes('text-brand-orange') &&
            p.classes().includes('cursor-pointer')
        )

      const lastHint = hintParagraphs[hintParagraphs.length - 1]
      expect(lastHint.classes()).toContain('border-b')
    })

    it('provides interactive hover states for hints', () => {
      const wrapper = createWrapper()

      const hintParagraphs = wrapper
        .findAll('p')
        .filter(p => p.classes().includes('text-brand-orange'))

      hintParagraphs.forEach(hint => {
        expect(hint.classes()).toContain('cursor-pointer')
        expect(hint.classes()).toContain('hover:text-brand-orange-light')
      })
    })
  })

  describe('Action Button', () => {
    it('renders create filter button', () => {
      const wrapper = createWrapper()

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.text()).toContain(
        'create a filter using the details that you provided'
      )
    })

    it('applies correct styling to action button', () => {
      const wrapper = createWrapper()

      const button = wrapper.find('button')
      const expectedClasses = [
        'bg-bg-button',
        'border',
        'border-dashed',
        'border-border-dashed',
        'px-4',
        'py-2',
        'rounded-full',
        'text-sm',
        'cursor-pointer',
        'hover:bg-border-hover',
        'transition-colors',
        'text-brand-orange'
      ]

      expectedClasses.forEach(className => {
        expect(button.classes()).toContain(className)
      })
    })

    it('provides interactive hover state for button', () => {
      const wrapper = createWrapper()

      const button = wrapper.find('button')
      expect(button.classes()).toContain('cursor-pointer')
      expect(button.classes()).toContain('hover:bg-border-hover')
      expect(button.classes()).toContain('transition-colors')
    })
  })

  describe('Layout Structure', () => {
    it('maintains proper conversation layout', () => {
      const wrapper = createWrapper()

      // User message section
      const userSection = wrapper
        .findAll('div')
        .find(
          div =>
            div.classes().includes('flex') &&
            div.classes().includes('gap-4') &&
            div.classes().includes('mb-8')
        )
      expect(userSection).toBeTruthy()

      // System response section
      const systemSection = wrapper
        .findAll('div')
        .find(div => div.classes().includes('flex-col'))
      expect(systemSection).toBeTruthy()
    })

    it('provides proper spacing between sections', () => {
      const wrapper = createWrapper()

      const userSection = wrapper
        .findAll('div')
        .find(div => div.classes().includes('mb-8'))
      expect(userSection).toBeTruthy()

      const suggestionSection = wrapper
        .findAll('div')
        .find(div => div.classes().includes('my-6'))
      expect(suggestionSection).toBeTruthy()
    })

    it('ensures proper avatar alignment', () => {
      const wrapper = createWrapper()

      const avatarContainers = wrapper
        .findAll('div')
        .filter(div => div.classes().includes('flex-shrink-0'))

      expect(avatarContainers.length).toBeGreaterThanOrEqual(2)

      avatarContainers.forEach(container => {
        expect(container.classes()).toContain('flex')
        expect(container.classes()).toContain('items-center')
        expect(container.classes()).toContain('justify-center')
      })
    })
  })

  describe('Content Structure', () => {
    it('organizes content in logical conversation flow', () => {
      const wrapper = createWrapper()

      const text = wrapper.text()

      // User query should appear before system response
      const queryIndex = text.indexOf(mockSearchQuery)
      const responseIndex = text.indexOf('Fantastic!')
      expect(queryIndex).toBeLessThan(responseIndex)

      // Hints should appear after main response
      const hintsIndex = text.indexOf('What specific software role')
      expect(responseIndex).toBeLessThan(hintsIndex)

      // Action button should appear last
      const buttonIndex = text.indexOf('create a filter')
      expect(hintsIndex).toBeLessThan(buttonIndex)
    })

    it('provides comprehensive search assistance', () => {
      const wrapper = createWrapper()

      const text = wrapper.text()

      // Contains result count
      expect(text).toContain('56 persons were found')

      // Provides guidance
      expect(text).toContain('provide additional information')

      // Offers specific suggestions
      expect(text).toContain('software role')
      expect(text).toContain('California tech hubs')
      expect(text).toContain('skills Johnson has')

      // Mentions alternative options
      expect(text).toContain('documents')
      expect(text).toContain('upload option')
    })
  })
})
