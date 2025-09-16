/**
 * Unit tests for ResultsList component
 * Tests search results display, loading states, and load more functionality
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultsList from '../ResultsList.vue'
import ResultCard from '../ResultCard.vue'
import MoreIcon from '@/components/icons/MoreIcon.vue'
import type { SearchResult } from '@/types/search'

// Mock components
vi.mock('../ResultCard.vue', () => ({
  default: {
    name: 'ResultCard',
    props: ['result'],
    template: '<div data-testid="result-card">{{ result.name }}</div>'
  }
}))

vi.mock('@/components/icons/MoreIcon.vue', () => ({
  default: {
    name: 'MoreIcon',
    template: '<svg data-testid="more-icon"></svg>'
  }
}))

// Mock search results data
const mockResults: SearchResult[] = [
  {
    id: 1,
    name: 'John Smith',
    age: 32,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'California',
    rating: 4.2,
    references: 25,
    companies: 5,
    contacts: 15
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    age: 28,
    gender: 'Female',
    maritalStatus: 'Single',
    location: 'New York',
    rating: 4.7,
    references: 32,
    companies: 3,
    contacts: 22
  }
]

describe('ResultsList', () => {
  describe('Basic Rendering', () => {
    it('renders with empty results array', () => {
      const wrapper = mount(ResultsList, {
        props: { results: [] },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      expect(wrapper.text()).toContain('No results found')
      const resultCards = wrapper.findAllComponents(ResultCard)
      expect(resultCards).toHaveLength(0)
    })
  })

  describe('Result Cards Rendering', () => {
    it('renders ResultCard for each result', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      const resultCards = wrapper.findAllComponents(ResultCard)
      expect(resultCards).toHaveLength(mockResults.length)

      resultCards.forEach((card, index) => {
        expect(card.props('result')).toEqual(mockResults[index])
      })
    })

    it('updates result cards when results prop changes', async () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      expect(wrapper.findAllComponents(ResultCard)).toHaveLength(2)

      const newResults = mockResults.slice(0, 1)
      await wrapper.setProps({ results: newResults })

      expect(wrapper.findAllComponents(ResultCard)).toHaveLength(1)
    })

    it('applies correct container styling for results section', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      const resultsContainer = wrapper.find('.flex-1.px-8.py-4.overflow-y-auto')
      expect(resultsContainer.exists()).toBe(true)
    })
  })

  describe('Load More Button', () => {
    it('renders load more button with correct styling', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      const loadMoreContainer = wrapper.find('.px-8.py-4.text-center')
      expect(loadMoreContainer.exists()).toBe(true)

      const loadMoreButton = wrapper.find('button')
      expect(loadMoreButton.exists()).toBe(true)
      expect(loadMoreButton.classes()).toContain('mx-auto')
    })

    it('contains correct button text and icon', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      const button = wrapper.find('button')
      expect(button.text()).toContain('Load More Results')

      const icon = wrapper.findComponent(MoreIcon)
      expect(icon.exists()).toBe(true)
    })

    it('emits loadMore event when clicked', async () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(wrapper.emitted('loadMore')).toBeTruthy()
      expect(wrapper.emitted('loadMore')).toHaveLength(1)
    })

    it('applies correct container styling for load more section', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      const loadMoreContainer = wrapper.find('.px-8.py-4.text-center')
      expect(loadMoreContainer.classes()).toContain('md:px-4')
    })
  })

  describe('Loading and Error States', () => {
    it('displays loading state correctly', () => {
      const wrapper = mount(ResultsList, {
        props: { results: [], isLoading: true },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      expect(wrapper.text()).toContain('Loading results...')
    })

    it('displays error state correctly', () => {
      const wrapper = mount(ResultsList, {
        props: { results: [], error: 'Something went wrong' },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      expect(wrapper.text()).toContain('Error: Something went wrong')
    })

    it('disables load more button when loading', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true, isLoading: true },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
      expect(button.text()).toContain('Loading...')
    })
  })

  describe('Layout and Responsive Design', () => {
    it('applies responsive classes correctly', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      const mainContainer = wrapper.find('.w-full.bg-bg-primary')
      expect(mainContainer.exists()).toBe(true)
      expect(mainContainer.classes()).toContain('flex-col')
      expect(mainContainer.classes()).toContain('md:flex-1')
      expect(mainContainer.classes()).toContain('md:h-auto')
    })

    it('provides correct responsive padding', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      const resultsContainer = wrapper.find('.flex-1.px-8.py-4')
      expect(resultsContainer.classes()).toContain('md:px-4')
    })
  })

  describe('Component Integration', () => {
    it('integrates all child components correctly', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      // Should contain result cards
      expect(wrapper.findAllComponents(ResultCard).length).toBeGreaterThan(0)

      // Should contain more icon in load more button
      expect(wrapper.findComponent(MoreIcon).exists()).toBe(true)
    })

    it('maintains proper component hierarchy', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true },
        global: {
          components: {
            ResultCard,
            MoreIcon
          }
        }
      })

      // Main container should exist
      const mainContainer = wrapper.find('.w-full.bg-bg-primary')
      expect(mainContainer.exists()).toBe(true)

      // Results container should exist within main container
      const resultsContainer = mainContainer.find('.flex-1.px-8.py-4')
      expect(resultsContainer.exists()).toBe(true)

      // Load more container should exist within main container
      const loadMoreContainer = mainContainer.find('.px-8.py-4.text-center')
      expect(loadMoreContainer.exists()).toBe(true)
    })
  })
})
