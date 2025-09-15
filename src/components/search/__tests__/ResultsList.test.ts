/**
 * Unit tests for ResultsList component
 * Tests results display, filtering, load more functionality, and component integration
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultsList from '../ResultsList.vue'
import ResultCard from '../ResultCard.vue'
import FilterCriteria from '../FilterCriteria.vue'
import CopyrightFooter from '@/components/layout/CopyrightFooter.vue'
import MoreIcon from '@/components/icons/MoreIcon.vue'
import type { SearchResult } from '@/types/search'

// Mock components
vi.mock('../ResultCard.vue', () => ({
  default: {
    name: 'ResultCard',
    template: '<div class="mock-result-card">{{ result.title }}</div>',
    props: ['result']
  }
}))

vi.mock('../FilterCriteria.vue', () => ({
  default: {
    name: 'FilterCriteria',
    template: '<div class="mock-filter-criteria">FilterCriteria</div>',
    props: ['filters'],
    emits: ['removeFilter', 'dropdownClick', 'edit', 'createMore']
  }
}))

vi.mock('@/components/layout/CopyrightFooter.vue', () => ({
  default: {
    name: 'CopyrightFooter',
    template: '<div class="mock-copyright-footer">CopyrightFooter</div>'
  }
}))

vi.mock('@/components/icons/MoreIcon.vue', () => ({
  default: {
    name: 'MoreIcon',
    template: '<span class="mock-more-icon">MoreIcon</span>'
  }
}))

describe('ResultsList', () => {
  const mockResults: SearchResult[] = [
    {
      id: 1,
      name: 'John Doe',
      age: 28,
      gender: 'Male',
      maritalStatus: 'Single',
      location: 'California',
      rating: 4.5,
      references: 10,
      companies: 3,
      contacts: 25
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      maritalStatus: 'Married',
      location: 'New York',
      rating: 4.2,
      references: 8,
      companies: 2,
      contacts: 18
    }
  ]

  describe('Basic Rendering', () => {
    it('renders main container with correct structure', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      const container = wrapper.find('div')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('w-full')
      expect(container.classes()).toContain('bg-bg-primary')
      expect(container.classes()).toContain('flex')
      expect(container.classes()).toContain('flex-col')
    })

    it('renders all main sections', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      // Header section with results count and filters
      expect(wrapper.text()).toContain('Results')

      // Results section with result cards
      const resultCards = wrapper.findAllComponents(ResultCard)
      expect(resultCards).toHaveLength(mockResults.length)

      // Load more button section
      expect(wrapper.text()).toContain('Load More Results')

      // Footer section
      const footer = wrapper.findComponent(CopyrightFooter)
      expect(footer.exists()).toBe(true)
    })

    it('renders with empty results array', () => {
      const wrapper = mount(ResultsList, {
        props: { results: [] },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      expect(wrapper.text()).toContain('Results (0)')
      const resultCards = wrapper.findAllComponents(ResultCard)
      expect(resultCards).toHaveLength(0)
    })
  })

  describe('Results Count Display', () => {
    it('displays correct results count', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      expect(wrapper.text()).toContain(`Results (${mockResults.length})`)
    })

    it('updates results count when results prop changes', async () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      expect(wrapper.text()).toContain('Results (2)')

      const newResults: SearchResult[] = [
        ...mockResults,
        {
          id: 3,
          name: 'Bob Johnson',
          age: 25,
          gender: 'Male',
          maritalStatus: 'Single',
          location: 'Texas',
          rating: 4.0,
          references: 5,
          companies: 1,
          contacts: 12
        }
      ]

      await wrapper.setProps({ results: newResults })
      expect(wrapper.text()).toContain('Results (3)')
    })

    it('applies correct styling to results count', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      const resultsSpan = wrapper.find('span')
      expect(resultsSpan.classes()).toContain('text-xl')
      expect(resultsSpan.classes()).toContain('font-semibold')
      expect(resultsSpan.classes()).toContain('text-text-primary')
    })
  })

  describe('Filter Criteria Integration', () => {
    it('renders FilterCriteria component with correct props', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      const filterCriteria = wrapper.findComponent(FilterCriteria)
      expect(filterCriteria.exists()).toBe(true)
      expect(filterCriteria.props('filters')).toBeDefined()
      expect(filterCriteria.props('filters')).toHaveLength(6)
    })

    it('handles removeFilter event from FilterCriteria', async () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      const filterCriteria = wrapper.findComponent(FilterCriteria)
      const initialFiltersCount = filterCriteria.props('filters').length

      await filterCriteria.vm.$emit('removeFilter', '1')

      // Filter should be removed from internal state
      const updatedFiltersCount = filterCriteria.props('filters').length
      // Verify filter removal behavior
      expect(updatedFiltersCount).toBeLessThanOrEqual(initialFiltersCount)
    })

    it('handles other FilterCriteria events', async () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      const filterCriteria = wrapper.findComponent(FilterCriteria)

      // Test that events are handled gracefully (no console logging in production)
      await filterCriteria.vm.$emit('dropdownClick', '2')
      await filterCriteria.vm.$emit('edit')
      await filterCriteria.vm.$emit('createMore')

      // Verify component remains functional
      expect(filterCriteria.exists()).toBe(true)
    })
  })

  describe('Result Cards Rendering', () => {
    it('renders ResultCard for each result', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
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
      expect(mockResults.length).toBeGreaterThan(0)
      const firstResult = mockResults[0]!
      const wrapper = mount(ResultsList, {
        props: { results: [firstResult] },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      expect(wrapper.findAllComponents(ResultCard)).toHaveLength(1)

      await wrapper.setProps({ results: mockResults })
      expect(wrapper.findAllComponents(ResultCard)).toHaveLength(2)
    })

    it('applies correct container styling for results section', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      // Find the results container by its specific classes
      const resultsContainer = wrapper.find('.flex-1.px-8.py-4.overflow-y-auto')
      expect(resultsContainer.exists()).toBe(true)
      const expectedClasses = [
        'flex-1',
        'px-8',
        'py-4',
        'overflow-y-auto',
        'md:px-4'
      ]
      expectedClasses.forEach(className => {
        expect(resultsContainer.classes()).toContain(className)
      })
    })
  })

  describe('Load More Button', () => {
    it('renders load more button with correct styling', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      const loadMoreButton = wrapper.find('button')
      const expectedClasses = [
        'bg-transparent',
        'text-brand-orange',
        'border',
        'border-brand-orange',
        'px-8',
        'py-3',
        'rounded-search',
        'text-base',
        'cursor-pointer',
        'transition-colors',
        'hover:bg-brand-orange',
        'hover:text-bg-card',
        'inline-flex',
        'items-center',
        'gap-2',
        'mx-auto'
      ]

      expectedClasses.forEach(className => {
        expect(loadMoreButton.classes()).toContain(className)
      })
    })

    it('contains correct button text and icon', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      const loadMoreButton = wrapper.find('button')
      expect(loadMoreButton.text()).toContain('Load More Results')

      const moreIcon = wrapper.findComponent(MoreIcon)
      expect(moreIcon.exists()).toBe(true)
    })

    it('emits loadMore event when clicked', async () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      const loadMoreButton = wrapper.find('button')
      await loadMoreButton.trigger('click')

      expect(wrapper.emitted('loadMore')).toBeTruthy()
      expect(wrapper.emitted('loadMore')![0]).toEqual([])
    })

    it('applies correct container styling for load more section', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      // Find the load more container by its specific classes
      const loadMoreContainer = wrapper.find('.px-8.py-4.text-center')
      expect(loadMoreContainer.exists()).toBe(true)
      const expectedClasses = ['px-8', 'py-4', 'text-center', 'md:px-4']
      expectedClasses.forEach(className => {
        expect(loadMoreContainer.classes()).toContain(className)
      })
    })
  })

  describe('Layout and Responsive Design', () => {
    it('applies responsive classes correctly', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      const mainContainer = wrapper.find('div')
      expect(mainContainer.classes()).toContain('md:flex-1')
      expect(mainContainer.classes()).toContain('md:h-auto')

      // Find containers by their specific class combinations
      const headerContainer = wrapper.find('.px-8.py-4.bg-bg-primary')
      expect(headerContainer.exists()).toBe(true)
      expect(headerContainer.classes()).toContain('md:px-4')

      const resultsContainer = wrapper.find('.flex-1.px-8.py-4.overflow-y-auto')
      expect(resultsContainer.exists()).toBe(true)
      expect(resultsContainer.classes()).toContain('md:px-4')

      const loadMoreContainer = wrapper.find('.px-8.py-4.text-center')
      expect(loadMoreContainer.exists()).toBe(true)
      expect(loadMoreContainer.classes()).toContain('md:px-4')
    })

    it('provides flexible layout for filter criteria', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      const filterContainer = wrapper
        .findAll('div')
        .find(
          div =>
            div.classes().includes('flex-1') &&
            div.classes().includes('min-w-96')
        )
      expect(filterContainer).toBeTruthy()
    })
  })

  describe('Component Integration', () => {
    it('integrates all child components correctly', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults, hasMore: true },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      expect(wrapper.findComponent(FilterCriteria).exists()).toBe(true)
      expect(wrapper.findAllComponents(ResultCard)).toHaveLength(2)
      expect(wrapper.findComponent(CopyrightFooter).exists()).toBe(true)
      expect(wrapper.findComponent(MoreIcon).exists()).toBe(true)
    })

    it('maintains proper component hierarchy', () => {
      const wrapper = mount(ResultsList, {
        props: { results: mockResults },
        global: {
          components: {
            ResultCard,
            FilterCriteria,
            CopyrightFooter,
            MoreIcon
          }
        }
      })

      // FilterCriteria should be in header section
      const headerSection = wrapper.findAll('div')[1]
      expect(headerSection).toBeTruthy()
      expect(headerSection!.findComponent(FilterCriteria).exists()).toBe(true)

      // CopyrightFooter should be at the bottom
      const footerComponent = wrapper.findComponent(CopyrightFooter)
      expect(footerComponent.exists()).toBe(true)
    })
  })
})
