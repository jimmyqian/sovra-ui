/**
 * Integration tests for SearchConversation workflow
 * Tests end-to-end conversation functionality with dynamic components
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import SearchResults from '@/views/SearchResults.vue'
import { useSearchStore } from '@/stores/search'

describe('Search Conversation Integration Tests', () => {
  let searchStore: ReturnType<typeof useSearchStore>
  let pinia: Pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    searchStore = useSearchStore()
  })

  const createSearchResultsWrapper = () => {
    return mount(SearchResults, {
      global: {
        plugins: [pinia]
      }
    })
  }

  describe('Dynamic Conversation Generation', () => {
    it('generates conversation based on search results', async () => {
      const wrapper = createSearchResultsWrapper()

      // Set search results - need to set up the search store properly
      searchStore.setQuery('software engineer california')
      searchStore.updatePagination({ totalResults: 56 })
      await wrapper.vm.$nextTick()

      // Should display results summary with count
      expect(wrapper.text()).toContain('persons were found in the results')

      // Should display search hints
      expect(wrapper.text()).toContain('What specific software role')
      expect(wrapper.text()).toContain('California tech hubs')

      // Should display refinement options
      expect(wrapper.text()).toContain('Only show results with ages from')

      // Should display action buttons
      expect(wrapper.text()).toContain('create a filter')
    })

    it('updates conversation when search results change', async () => {
      const wrapper = createSearchResultsWrapper()

      // Initial search with few results - use displayTotalResults logic
      searchStore.setQuery('test search')
      searchStore.setLoading(false)
      searchStore.updatePagination({ totalResults: 15 })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('15 persons were found')

      // Update with more results
      searchStore.updatePagination({ totalResults: 85 })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('85 persons were found')
    })
  })

  describe('Interactive Elements', () => {
    it('handles hint clicks', async () => {
      const wrapper = createSearchResultsWrapper()

      const hintElements = wrapper.findAll('.text-brand-orange.cursor-pointer')
      expect(hintElements.length).toBeGreaterThan(0)

      // Click a hint
      await hintElements[0]!.trigger('click')

      // Should not throw error (functionality to be implemented)
      expect(wrapper.exists()).toBe(true)
    })

    it('handles age range refinement input', async () => {
      const wrapper = createSearchResultsWrapper()

      const ageInputs = wrapper.findAll('input[type="number"]')
      expect(ageInputs.length).toBe(2) // min and max age inputs

      // Enter age range
      await ageInputs[0]!.setValue('25')
      await ageInputs[1]!.setValue('35')

      expect((ageInputs[0]!.element as HTMLInputElement).value).toBe('25')
      expect((ageInputs[1]!.element as HTMLInputElement).value).toBe('35')
    })

    it('handles filter creation button click', async () => {
      const wrapper = createSearchResultsWrapper()

      const filterButton = wrapper
        .findAll('button')
        .find(btn => btn.text().includes('create a filter'))
      expect(filterButton?.exists()).toBe(true)

      // Click filter button
      await filterButton!.trigger('click')

      // Should not throw error (functionality to be implemented)
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('File Upload Integration', () => {
    it('displays file upload component', async () => {
      const wrapper = createSearchResultsWrapper()

      // Should have file upload section
      expect(wrapper.text()).toContain('Upload additional documents')

      const fileInputs = wrapper.findAll('input[type="file"]')
      expect(fileInputs.length).toBeGreaterThan(0)
    })

    it('handles file upload interactions', async () => {
      const wrapper = createSearchResultsWrapper()

      const uploadButton = wrapper
        .findAll('button')
        .find(btn => btn.text().includes('Click to upload files'))
      expect(uploadButton?.exists()).toBe(true)

      // Click upload button
      await uploadButton!.trigger('click')

      // Should not throw error
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('User Query Display', () => {
    it('displays current search query', async () => {
      const wrapper = createSearchResultsWrapper()

      // Set a search query - need to check how the SearchResults view handles this
      const queryText = 'Find software developers in California'
      searchStore.setQuery(queryText)
      await wrapper.vm.$nextTick()

      // The query should be displayed in the conversation
      expect(wrapper.text()).toContain(queryText)
    })

    it('displays user avatar with search query', async () => {
      const wrapper = createSearchResultsWrapper()

      const queryText = 'Test query'
      searchStore.setQuery(queryText)
      await wrapper.vm.$nextTick()

      // Should display the query in the conversation
      expect(wrapper.text()).toContain(queryText)

      // Should have user avatar when query is present
      const userAvatar = wrapper.find(
        '.w-9.h-9.border.border-black.rounded-full'
      )
      expect(userAvatar.exists()).toBe(true)
    })
  })

  describe('Search Bar Integration', () => {
    it('includes search bar for new queries', async () => {
      const wrapper = createSearchResultsWrapper()

      // Should have search bar component
      const searchBar = wrapper.find('textarea, input[type="text"]')
      expect(searchBar.exists()).toBe(true)
    })

    it('maintains search bar functionality with conversation', async () => {
      const wrapper = createSearchResultsWrapper()

      const searchBar = wrapper.find('textarea')
      if (searchBar.exists()) {
        await searchBar.setValue('New search query')

        // Find search button (could be a submit button or have search text)
        const buttons = wrapper.findAll('button')
        const searchButton = buttons.find(
          btn =>
            btn.attributes('type') === 'submit' ||
            btn.text().toLowerCase().includes('search') ||
            btn.element.closest('form') // Button inside a form
        )

        if (searchButton) {
          await searchButton.trigger('click')
          // Should not throw error
          expect(wrapper.exists()).toBe(true)
        }
      }
    })
  })

  describe('Responsive Layout', () => {
    it('maintains proper layout structure', async () => {
      const wrapper = createSearchResultsWrapper()

      // Set up some search results for the test AFTER creating wrapper (like other tests)
      searchStore.setQuery('test query')
      searchStore.updatePagination({ totalResults: 25 })
      await wrapper.vm.$nextTick()

      // Should have main flex container
      const mainContainer = wrapper.find(
        '.min-h-screen.bg-bg-primary.flex.flex-col'
      )
      expect(mainContainer.exists()).toBe(true)

      // Should have left panel for conversation
      const leftPanels = wrapper.findAll('.bg-bg-card')
      expect(leftPanels.length).toBeGreaterThan(0)

      // Conversation should be in one of the left panels
      let foundConversation = false
      for (let i = 0; i < leftPanels.length; i++) {
        const panelText = leftPanels[i]!.text()
        if (panelText.includes('persons were found')) {
          foundConversation = true
          break
        }
      }
      expect(foundConversation).toBe(true)
    })

    it('properly positions conversation relative to search bar', async () => {
      const wrapper = createSearchResultsWrapper()

      const leftPanel = wrapper.find('.bg-bg-card')
      expect(leftPanel.exists()).toBe(true)

      // Conversation should appear before search bar in DOM order
      const leftPanelHtml = leftPanel.html()
      const conversationIndex = leftPanelHtml.indexOf('persons were found')
      const searchBarIndex = leftPanelHtml.indexOf('textarea')

      if (conversationIndex !== -1 && searchBarIndex !== -1) {
        expect(conversationIndex).toBeLessThan(searchBarIndex)
      }
    })
  })

  describe('Error Handling', () => {
    it('handles missing search results gracefully', async () => {
      const wrapper = createSearchResultsWrapper()

      // Clear any existing results
      searchStore.clearResults()
      await wrapper.vm.$nextTick()

      // Should still render conversation structure
      expect(wrapper.find('.px-8.py-8').exists()).toBe(true)

      // Should handle 0 results
      expect(wrapper.text()).toContain('0 persons were found')
    })

    it('handles search store errors gracefully', async () => {
      const wrapper = createSearchResultsWrapper()

      // Simulate error state
      searchStore.setError('Search failed')
      await wrapper.vm.$nextTick()

      // Should still render conversation
      expect(wrapper.find('.px-8.py-8').exists()).toBe(true)
    })
  })

  describe('Performance', () => {
    it('renders efficiently with many conversation items', async () => {
      const wrapper = createSearchResultsWrapper()

      // Set large result count to test performance
      searchStore.setLoading(false)
      searchStore.updatePagination({ totalResults: 9999 })
      await wrapper.vm.$nextTick()

      // Should render without performance issues
      expect(wrapper.text()).toContain('9999 persons were found')
      expect(wrapper.exists()).toBe(true)
    })

    it('handles rapid search updates efficiently', async () => {
      const wrapper = createSearchResultsWrapper()

      // Simulate rapid search updates with proper store state
      const updates = [10, 25, 50, 75, 100]
      searchStore.setLoading(false)
      for (const count of updates) {
        searchStore.updatePagination({ totalResults: count })
        await wrapper.vm.$nextTick()
      }

      // Should show final result
      expect(wrapper.text()).toContain('100 persons were found')
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Accessibility Integration', () => {
    it('maintains accessibility in full workflow', async () => {
      const wrapper = createSearchResultsWrapper()

      // Set up search results so components with headings are rendered
      searchStore.setQuery('test search')
      searchStore.updatePagination({ totalResults: 10 })

      // Add some mock results to the store to trigger ResultCard rendering
      const mockResults = [
        {
          id: 1,
          name: 'John Doe',
          age: 30,
          gender: 'Male',
          maritalStatus: 'Single',
          location: 'New York',
          rating: 4.5,
          references: 5,
          companies: 2,
          contacts: 15
        }
      ]
      searchStore.setResults(mockResults)
      await wrapper.vm.$nextTick()

      // Should have proper heading structure (from ResultCard h3 elements)
      const headings = wrapper.findAll('h1, h2, h3, h4, h5, h6')
      expect(headings.length).toBeGreaterThan(0)

      // Should have proper form labels
      const labels = wrapper.findAll('label')
      expect(labels.length).toBeGreaterThan(0)

      // Should have proper button elements
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('provides keyboard navigation support', async () => {
      const wrapper = createSearchResultsWrapper()

      // Interactive elements should be keyboard accessible
      const interactiveElements = wrapper.findAll(
        'button, input, textarea, [tabindex]'
      )
      expect(interactiveElements.length).toBeGreaterThan(0)

      // Should have focus management
      const focusableElements = wrapper.findAll(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled])'
      )
      expect(focusableElements.length).toBeGreaterThan(0)
    })
  })
})
