/**
 * Unit tests for ResultsList component
 * Tests search results display and loading states
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultsList from '../ResultsList.vue'
import ResultCard from '../ResultCard.vue'
import type { SearchResult } from '@/types/search'

// Mock components
vi.mock('../ResultCard.vue', () => ({
  default: {
    name: 'ResultCard',
    props: ['result'],
    template: '<div data-testid="result-card">{{ result.name }}</div>'
  }
}))

// Mock search results data
const mockResults: SearchResult[] = [
  {
    id: 'test-uuid-1',
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
    id: 'test-uuid-2',
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
            ResultCard
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
            ResultCard
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
            ResultCard
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
            ResultCard
          }
        }
      })

      const resultsContainer = wrapper.find('.h-full.px-8.py-4')
      expect(resultsContainer.exists()).toBe(true)
    })
  })

  describe('Loading and Error States', () => {
    it('displays loading state correctly', () => {
      const wrapper = mount(ResultsList, {
        props: { results: [], isLoading: true },
        global: {
          components: {
            ResultCard
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
            ResultCard
          }
        }
      })

      expect(wrapper.text()).toContain('Error: Something went wrong')
    })
  })

  describe('Layout and Responsive Design', () => {
    it('applies responsive classes correctly', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard
          }
        }
      })

      const mainContainer = wrapper.find('.w-full.bg-bg-primary')
      expect(mainContainer.exists()).toBe(true)
      expect(mainContainer.classes()).toContain('h-full')
      expect(mainContainer.classes()).toContain('w-full')
      expect(mainContainer.classes()).toContain('bg-bg-primary')
    })

    it('provides correct responsive padding', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard
          }
        }
      })

      const resultsContainer = wrapper.find('.h-full.px-8.py-4')
      expect(resultsContainer.classes()).toContain('md:px-4')
    })
  })

  describe('Component Integration', () => {
    it('integrates ResultCard components correctly', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard
          }
        }
      })

      // Should contain result cards
      expect(wrapper.findAllComponents(ResultCard).length).toBeGreaterThan(0)
      expect(wrapper.findAllComponents(ResultCard)).toHaveLength(
        mockResults.length
      )
    })

    it('maintains proper component hierarchy', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard
          }
        }
      })

      // Main container should exist
      const mainContainer = wrapper.find('.w-full.bg-bg-primary')
      expect(mainContainer.exists()).toBe(true)

      // Results container should exist within main container
      const resultsContainer = mainContainer.find('.h-full.px-8.py-4')
      expect(resultsContainer.exists()).toBe(true)
    })
  })
})
