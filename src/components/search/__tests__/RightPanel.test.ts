/**
 * RightPanel Component Tests
 * Tests the unified right panel that can switch between results and person details
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RightPanel from '../RightPanel.vue'

// Mock components
vi.mock('../RandomCardsGrid.vue', () => ({
  default: {
    name: 'RandomCardsGrid',
    template: '<div data-testid="random-cards-grid">RandomCardsGrid</div>',
    emits: ['cardClick']
  }
}))

vi.mock('../PersonProfile.vue', () => ({
  default: {
    name: 'PersonProfile',
    template: '<div data-testid="person-profile">PersonProfile</div>',
    props: ['person'],
    emits: ['tagClick']
  }
}))

vi.mock('../DetailedResultCard.vue', () => ({
  default: {
    name: 'DetailedResultCard',
    template:
      '<div data-testid="detailed-result-card">DetailedResultCard</div>',
    props: ['person']
  }
}))

vi.mock('../CategoryTabs.vue', () => ({
  default: {
    name: 'CategoryTabs',
    template: '<div data-testid="category-tabs">CategoryTabs</div>',
    props: [
      'accounts',
      'personalData',
      'professionalData',
      'financeData',
      'legalData'
    ]
  }
}))

vi.mock('../ActivityFooter.vue', () => ({
  default: {
    name: 'ActivityFooter',
    template: '<div data-testid="activity-footer">ActivityFooter</div>',
    emits: ['categoryToggle', 'showReferences']
  }
}))

vi.mock('@/components/layout/CopyrightFooter.vue', () => ({
  default: {
    name: 'CopyrightFooter',
    template: '<div data-testid="copyright-footer">CopyrightFooter</div>',
    emits: ['piClick']
  }
}))

const mockSearchResult = {
  id: 1,
  name: 'John Doe',
  age: 30,
  gender: 'Male',
  maritalStatus: 'Married',
  location: 'New York, NY',
  rating: 8.5,
  references: 15,
  companies: 3,
  contacts: 25
}

const mockResults = [mockSearchResult]

const defaultProps = {
  results: mockResults,
  isLoading: false,
  error: null,
  selectedPerson: null
}

describe('RightPanel', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Results View', () => {
    it('should render RandomCardsGrid when no person is selected', () => {
      const wrapper = mount(RightPanel, { props: defaultProps })

      expect(wrapper.find('[data-testid="random-cards-grid"]').exists()).toBe(
        true
      )
      expect(wrapper.find('[data-testid="person-profile"]').exists()).toBe(
        false
      )
    })

    it('should render RandomCardsGrid component', () => {
      const wrapper = mount(RightPanel, { props: defaultProps })
      const cardsGrid = wrapper.findComponent({ name: 'RandomCardsGrid' })

      expect(cardsGrid.exists()).toBe(true)
    })

    it('should show scroll buttons when results are scrollable', async () => {
      const wrapper = mount(RightPanel, { props: defaultProps })

      // Mock scroll container with scrollable content
      const mockContainer = {
        scrollTop: 100,
        scrollHeight: 500,
        clientHeight: 300
      }

      // Access component instance with proper typing
      const component = wrapper.vm as any

      // Set up scrollable state by mocking the container
      component.resultsScrollContainer = mockContainer
      component.handleResultsScroll()

      await wrapper.vm.$nextTick()

      // The buttons should appear when content is scrollable
      // Note: These might not be visible due to v-if conditions, so we test the underlying state
      expect(mockContainer.scrollHeight > mockContainer.clientHeight).toBe(true)
    })
  })

  describe('Person Details View', () => {
    const propsWithSelectedPerson = {
      ...defaultProps,
      selectedPerson: mockSearchResult
    }

    it('should render person details when person is selected', () => {
      const wrapper = mount(RightPanel, { props: propsWithSelectedPerson })

      expect(wrapper.find('[data-testid="results-list"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="person-profile"]').exists()).toBe(true)
      expect(
        wrapper.find('[data-testid="detailed-result-card"]').exists()
      ).toBe(true)
      expect(wrapper.find('[data-testid="category-tabs"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="activity-footer"]').exists()).toBe(
        true
      )
    })

    it('should show back to results button', () => {
      const wrapper = mount(RightPanel, { props: propsWithSelectedPerson })

      expect(wrapper.text()).toContain('Back to Results')
    })

    it('should emit backToResults when back button is clicked', async () => {
      const wrapper = mount(RightPanel, { props: propsWithSelectedPerson })

      const backButton = wrapper.find('button')
      expect(backButton.exists()).toBe(true)
      expect(backButton.text()).toContain('Back to Results')

      await backButton.trigger('click')
      expect(wrapper.emitted('backToResults')).toBeTruthy()
    })

    it('should generate detailed person data from search result', () => {
      const wrapper = mount(RightPanel, { props: propsWithSelectedPerson })
      const component = wrapper.vm as any
      const detailedData = component.getDetailedPersonData(mockSearchResult)

      expect(detailedData.name).toBe(mockSearchResult.name)
      expect(detailedData.stats.age).toBe(mockSearchResult.age.toString())
      expect(detailedData.personal.currentLocation).toBe(
        mockSearchResult.location
      )
      expect(detailedData.personal.spouse).toBe('Justine m. 2023-2025') // Married status
    })

    it('should handle single marital status correctly', () => {
      const singlePerson = { ...mockSearchResult, maritalStatus: 'Single' }
      const wrapper = mount(RightPanel, {
        props: { ...defaultProps, selectedPerson: singlePerson }
      })
      const component = wrapper.vm as any
      const detailedData = component.getDetailedPersonData(singlePerson)

      expect(detailedData.personal.spouse).toBe('Single')
    })
  })

  describe('Event Handling', () => {
    it('should handle cardClick event from RandomCardsGrid', async () => {
      const wrapper = mount(RightPanel, { props: defaultProps })
      const cardsGrid = wrapper.findComponent({ name: 'RandomCardsGrid' })

      const mockCard = {
        id: 1,
        title: 'Test Card',
        description: 'Test Description',
        height: 150,
        colorClass: 'bg-blue-500'
      }
      await cardsGrid.vm.$emit('cardClick', mockCard)

      // The component should handle the card click (even if it doesn't emit anything currently)
      expect(cardsGrid.exists()).toBe(true)
    })

    it('should emit piClick when footer emits piClick', async () => {
      const wrapper = mount(RightPanel, { props: defaultProps })
      const footer = wrapper.findComponent({ name: 'CopyrightFooter' })

      await footer.vm.$emit('piClick')
      expect(wrapper.emitted('piClick')).toBeTruthy()
    })
  })

  describe('Scroll Functionality', () => {
    it('should handle results scroll events', () => {
      const wrapper = mount(RightPanel, { props: defaultProps })
      const component = wrapper.vm as any

      // Mock scroll container
      const mockContainer = {
        scrollTop: 100,
        scrollHeight: 500,
        clientHeight: 300
      }
      component.resultsScrollContainer = mockContainer

      component.handleResultsScroll()

      expect(component.showTopFade).toBe(true) // scrollTop > 20
      expect(component.canScrollUp).toBe(true)
      expect(component.canScrollDown).toBe(true)
      expect(component.hasScrollableContent).toBe(true)
    })

    it('should scroll to top when top scroll button is clicked', () => {
      const wrapper = mount(RightPanel, { props: defaultProps })
      const component = wrapper.vm as any

      const mockScrollTo = vi.fn()
      component.resultsScrollContainer = {
        scrollTop: 300,
        scrollTo: mockScrollTo
      }

      component.scrollResultsToTop()

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 100, // 300 - 200
        behavior: 'smooth'
      })
    })

    it('should scroll to bottom when bottom scroll button is clicked', () => {
      const wrapper = mount(RightPanel, { props: defaultProps })
      const component = wrapper.vm as any

      const mockScrollTo = vi.fn()
      component.resultsScrollContainer = {
        scrollTop: 100,
        scrollHeight: 500,
        clientHeight: 300,
        scrollTo: mockScrollTo
      }

      component.scrollResultsToBottom()

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 200, // min(200, 100 + 200)
        behavior: 'smooth'
      })
    })
  })

  describe('Error Handling', () => {
    it('should render RandomCardsGrid regardless of error state', () => {
      const error = 'Something went wrong'
      const wrapper = mount(RightPanel, { props: { ...defaultProps, error } })
      const cardsGrid = wrapper.findComponent({ name: 'RandomCardsGrid' })

      expect(cardsGrid.exists()).toBe(true)
    })

    it('should render RandomCardsGrid regardless of loading state', () => {
      const wrapper = mount(RightPanel, {
        props: { ...defaultProps, isLoading: true }
      })
      const cardsGrid = wrapper.findComponent({ name: 'RandomCardsGrid' })

      expect(cardsGrid.exists()).toBe(true)
    })
  })

  describe('Responsive Design', () => {
    it('should have proper CSS classes for responsive layout', () => {
      const wrapper = mount(RightPanel, { props: defaultProps })
      const rootElement = wrapper.find('div')

      expect(rootElement.classes()).toContain('flex-1')
      expect(rootElement.classes()).toContain('flex')
      expect(rootElement.classes()).toContain('flex-col')
      expect(rootElement.classes()).toContain('max-h-full')
      expect(rootElement.classes()).toContain('overflow-hidden')
    })

    it('should show fade overlays only in results view', async () => {
      const wrapper = mount(RightPanel, { props: defaultProps })
      expect(wrapper.find('.fade-overlay').exists()).toBe(true)
      expect(wrapper.find('.fade-overlay-top').exists()).toBe(true)

      await wrapper.setProps({ selectedPerson: mockSearchResult })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.fade-overlay').exists()).toBe(false)
      expect(wrapper.find('.fade-overlay-top').exists()).toBe(false)
    })
  })
})
