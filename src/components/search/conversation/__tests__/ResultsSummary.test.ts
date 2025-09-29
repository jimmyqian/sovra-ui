/**
 * Unit tests for ResultsSummary conversation component
 * Tests result count display, template processing, and text formatting
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultsSummary from '../ResultsSummary.vue'
import type { ResultsSummaryItem } from '@/types/conversation'

describe('ResultsSummary', () => {
  const baseItem: ResultsSummaryItem = {
    id: 'summary-1',
    type: 'results-summary',
    resultCount: 25
  }

  describe('Basic Rendering', () => {
    it('renders paragraph with correct structure', () => {
      const wrapper = mount(ResultsSummary, {
        props: { item: baseItem }
      })

      const paragraph = wrapper.find('p')
      expect(paragraph.exists()).toBe(true)
      expect(paragraph.classes()).toContain('mb-4')
      expect(paragraph.classes()).toContain('leading-relaxed')
      expect(paragraph.classes()).toContain('text-text-secondary')
    })

    it('contains strong element for emphasis', () => {
      const wrapper = mount(ResultsSummary, {
        props: { item: baseItem }
      })

      const strong = wrapper.find('strong')
      expect(strong.exists()).toBe(true)
    })
  })

  describe('Default Summary Text', () => {
    it('displays default summary with result count', () => {
      const wrapper = mount(ResultsSummary, {
        props: { item: baseItem }
      })

      const text = wrapper.text()
      expect(text).toContain('25 persons were found in the results.')
      expect(text).toContain(
        "Please provide additional information about the person you're looking for."
      )
    })

    it('handles zero results', () => {
      const zeroItem = { ...baseItem, resultCount: 0 }
      const wrapper = mount(ResultsSummary, {
        props: { item: zeroItem }
      })

      const text = wrapper.text()
      expect(text).toContain('0 persons were found in the results.')
    })

    it('handles single result', () => {
      const singleItem = { ...baseItem, resultCount: 1 }
      const wrapper = mount(ResultsSummary, {
        props: { item: singleItem }
      })

      const text = wrapper.text()
      expect(text).toContain('1 persons were found in the results.')
    })

    it('handles large result counts', () => {
      const largeItem = { ...baseItem, resultCount: 9999 }
      const wrapper = mount(ResultsSummary, {
        props: { item: largeItem }
      })

      const text = wrapper.text()
      expect(text).toContain('9999 persons were found in the results.')
    })
  })

  describe('Custom Template Processing', () => {
    it('processes template with count placeholder', () => {
      const templateItem = {
        ...baseItem,
        resultCount: 42,
        template: 'We found {count} matching results for your search.'
      }

      const wrapper = mount(ResultsSummary, {
        props: { item: templateItem }
      })

      const text = wrapper.text()
      expect(text).toBe('We found 42 matching results for your search.')
    })

    it('processes template with searchTerm placeholder', () => {
      const templateItem = {
        ...baseItem,
        resultCount: 15,
        searchTerm: 'software engineer',
        template: 'Found {count} results for "{searchTerm}" in our database.'
      }

      const wrapper = mount(ResultsSummary, {
        props: { item: templateItem }
      })

      const text = wrapper.text()
      expect(text).toBe(
        'Found 15 results for "software engineer" in our database.'
      )
    })

    it('processes template with both placeholders', () => {
      const templateItem = {
        ...baseItem,
        resultCount: 8,
        searchTerm: 'John Smith',
        template:
          'Displaying {count} profiles matching "{searchTerm}". Refine your search for better results.'
      }

      const wrapper = mount(ResultsSummary, {
        props: { item: templateItem }
      })

      const text = wrapper.text()
      expect(text).toBe(
        'Displaying 8 profiles matching "John Smith". Refine your search for better results.'
      )
    })

    it('handles template with missing searchTerm', () => {
      const templateItem = {
        ...baseItem,
        resultCount: 5,
        template: 'Found {count} results for "{searchTerm}".'
      }

      const wrapper = mount(ResultsSummary, {
        props: { item: templateItem }
      })

      const text = wrapper.text()
      expect(text).toBe('Found 5 results for "".')
    })

    it('handles template without placeholders', () => {
      const templateItem = {
        ...baseItem,
        template: 'Search completed successfully. Review the results below.'
      }

      const wrapper = mount(ResultsSummary, {
        props: { item: templateItem }
      })

      const text = wrapper.text()
      expect(text).toBe(
        'Search completed successfully. Review the results below.'
      )
    })
  })

  describe('Edge Cases', () => {
    it('handles empty template string', () => {
      const emptyTemplateItem = {
        ...baseItem,
        template: ''
      }

      const wrapper = mount(ResultsSummary, {
        props: { item: emptyTemplateItem }
      })

      const text = wrapper.text()
      expect(text).toBe('')
    })

    it('handles undefined searchTerm with placeholder', () => {
      const templateItem = {
        ...baseItem,
        resultCount: 3,
        searchTerm: undefined,
        template: 'Results for {searchTerm}: {count} found'
      }

      const wrapper = mount(ResultsSummary, {
        props: { item: templateItem }
      })

      const text = wrapper.text()
      expect(text).toBe('Results for : 3 found')
    })

    it('handles negative result count', () => {
      const negativeItem = { ...baseItem, resultCount: -1 }
      const wrapper = mount(ResultsSummary, {
        props: { item: negativeItem }
      })

      const text = wrapper.text()
      expect(text).toContain('-1 persons were found in the results.')
    })
  })

  describe('Template Substitution Accuracy', () => {
    it('replaces all occurrences of placeholders', () => {
      const templateItem = {
        ...baseItem,
        resultCount: 7,
        searchTerm: 'test',
        template:
          '{count} results found. Total count: {count}. Search term: {searchTerm} ({searchTerm})'
      }

      const wrapper = mount(ResultsSummary, {
        props: { item: templateItem }
      })

      const text = wrapper.text()
      expect(text).toBe(
        '7 results found. Total count: 7. Search term: test (test)'
      )
    })

    it('handles partial placeholder matches', () => {
      const templateItem = {
        ...baseItem,
        resultCount: 12,
        template: 'account: {count}, accounts: {count}s, counting: {count}ing'
      }

      const wrapper = mount(ResultsSummary, {
        props: { item: templateItem }
      })

      const text = wrapper.text()
      expect(text).toBe('account: 12, accounts: 12s, counting: 12ing')
    })
  })

  describe('Component Props Validation', () => {
    it('works with minimal props', () => {
      const minimalItem = {
        id: 'min-1',
        type: 'results-summary' as const,
        resultCount: 1
      }

      const wrapper = mount(ResultsSummary, {
        props: { item: minimalItem }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('1 persons were found')
    })

    it('works with all props provided', () => {
      const fullItem = {
        id: 'full-1',
        type: 'results-summary' as const,
        resultCount: 50,
        searchTerm: 'complete search',
        template: 'Full search for "{searchTerm}" returned {count} results.'
      }

      const wrapper = mount(ResultsSummary, {
        props: { item: fullItem }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toBe(
        'Full search for "complete search" returned 50 results.'
      )
    })
  })
})
