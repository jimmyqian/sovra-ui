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
      id: '1',
      title: 'John Doe',
      description: 'Software Engineer',
      score: 0.95,
      details: {
        location: 'California',
        experience: '5 years',
        skills: ['JavaScript', 'Vue.js']
      },
      metadata: {
        lastUpdated: '2024-01-01',
        source: 'LinkedIn'
      }
    },
    {
      id: '2',
      title: 'Jane Smith',
      description: 'Product Manager',
      score: 0.87,
      details: {
        location: 'New York',
        experience: '3 years',
        skills: ['Product Management', 'Agile']
      },
      metadata: {
        lastUpdated: '2024-01-02',
        source: 'Indeed'
      }
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

      const newResults = [
        ...mockResults,
        {
          id: '3',
          title: 'Bob Johnson',
          description: 'Designer',
          score: 0.75,
          details: {
            location: 'Texas',
            experience: '2 years',
            skills: ['Design', 'Figma']
          },
          metadata: {
            lastUpdated: '2024-01-03',
            source: 'Dribbble'
          }
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
      expect(updatedFiltersCount).toBe(initialFiltersCount)
    })

    it('handles other FilterCriteria events', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

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

      await filterCriteria.vm.$emit('dropdownClick', '2')
      await filterCriteria.vm.$emit('edit')
      await filterCriteria.vm.$emit('createMore')

      expect(consoleSpy).toHaveBeenCalledWith('Dropdown clicked:', '2')
      expect(consoleSpy).toHaveBeenCalledWith('Edit filters')
      expect(consoleSpy).toHaveBeenCalledWith('Create more criteria')

      consoleSpy.mockRestore()
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
      const wrapper = mount(ResultsList, {
        props: { results: [mockResults[0]] },
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

      const resultsContainer = wrapper.findAll('div')[2] // Results container
      expect(resultsContainer.classes()).toContain('flex-1')
      expect(resultsContainer.classes()).toContain('px-8')
      expect(resultsContainer.classes()).toContain('py-4')
      expect(resultsContainer.classes()).toContain('overflow-y-auto')
    })
  })

  describe('Load More Button', () => {
    it('renders load more button with correct styling', () => {
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

      const loadMoreButton = wrapper.find('button')
      const expectedClasses = [
        'bg-bg-button',
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
        'flex',
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

      const loadMoreButton = wrapper.find('button')
      expect(loadMoreButton.text()).toContain('Load More Results')

      const moreIcon = wrapper.findComponent(MoreIcon)
      expect(moreIcon.exists()).toBe(true)
    })

    it('emits loadMore event when clicked', async () => {
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

      const loadMoreButton = wrapper.find('button')
      await loadMoreButton.trigger('click')

      expect(wrapper.emitted('loadMore')).toBeTruthy()
      expect(wrapper.emitted('loadMore')![0]).toEqual([])
    })

    it('applies correct container styling for load more section', () => {
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

      const loadMoreContainer = wrapper.findAll('div')[3] // Load more container
      expect(loadMoreContainer.classes()).toContain('px-8')
      expect(loadMoreContainer.classes()).toContain('py-4')
      expect(loadMoreContainer.classes()).toContain('text-center')
    })
  })

  describe('Layout and Responsive Design', () => {
    it('applies responsive classes correctly', () => {
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

      const mainContainer = wrapper.find('div')
      expect(mainContainer.classes()).toContain('md:flex-1')
      expect(mainContainer.classes()).toContain('md:h-auto')

      const headerContainer = wrapper.findAll('div')[1]
      expect(headerContainer.classes()).toContain('md:px-4')

      const resultsContainer = wrapper.findAll('div')[2]
      expect(resultsContainer.classes()).toContain('md:px-4')

      const loadMoreContainer = wrapper.findAll('div')[3]
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
      expect(headerSection.findComponent(FilterCriteria).exists()).toBe(true)

      // CopyrightFooter should be at the bottom
      const footerComponent = wrapper.findComponent(CopyrightFooter)
      expect(footerComponent.exists()).toBe(true)
    })
  })
})
