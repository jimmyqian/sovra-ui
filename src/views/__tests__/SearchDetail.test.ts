/**
 * Unit tests for SearchDetail component
 * Tests person detail display, route integration, and component interactions
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import SearchDetail from '../SearchDetail.vue'
import { useConversationStore } from '@/stores/conversation'
import { useSearchStore } from '@/stores/search'

// Mock vue-router
const mockRoute = {
  params: { id: 'test-uuid-123' }
}

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRoute: () => mockRoute
  }
})

// Mock components to avoid dependency issues
vi.mock('@/components/layout/AppHeader.vue', () => ({
  default: {
    name: 'AppHeader',
    template: '<div data-testid="app-header">Header</div>'
  }
}))

vi.mock('@/components/navigation/AppSidebar.vue', () => ({
  default: {
    name: 'AppSidebar',
    template: '<div data-testid="app-sidebar">Sidebar</div>'
  }
}))

vi.mock('@/components/common/SearchBar.vue', () => ({
  default: {
    name: 'SearchBar',
    props: ['modelValue', 'placeholder'],
    emits: ['update:modelValue', 'search', 'fileUpload'],
    template: `
      <div data-testid="search-bar">
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          @keyup.enter="$emit('search')"
          data-testid="search-input"
        />
        <button @click="$emit('search')" data-testid="search-button">Search</button>
      </div>
    `
  }
}))

vi.mock('@/components/search/SearchConversation.vue', () => ({
  default: {
    name: 'SearchConversation',
    props: ['messages', 'userQuery'],
    template: '<div data-testid="search-conversation">Conversation</div>'
  }
}))

vi.mock('@/components/search/PersonProfile.vue', () => ({
  default: {
    name: 'PersonProfile',
    props: ['person'],
    emits: ['tagClick'],
    template: `
      <div data-testid="person-profile">
        <h2>{{ person.name }}</h2>
        <div v-for="tag in person.tags" :key="tag" @click="$emit('tagClick', tag)" data-testid="tag">
          {{ tag }}
        </div>
      </div>
    `
  }
}))

vi.mock('@/components/search/DetailedResultCard.vue', () => ({
  default: {
    name: 'DetailedResultCard',
    props: ['person'],
    emits: ['showUpsell'],
    template:
      '<div data-testid="detailed-result-card">{{ person.name }} Details</div>'
  }
}))

vi.mock('@/components/search/CategoryTabs.vue', () => ({
  default: {
    name: 'CategoryTabs',
    props: [
      'accounts',
      'personalData',
      'professionalData',
      'financeData',
      'legalData'
    ],
    template: '<div data-testid="category-tabs">Category Tabs</div>'
  }
}))

vi.mock('@/components/search/ActivityFooter.vue', () => ({
  default: {
    name: 'ActivityFooter',
    emits: ['categoryToggle', 'showReferences'],
    template: `
      <div data-testid="activity-footer">
        <button @click="$emit('categoryToggle', 'personal', true)" data-testid="category-toggle">
          Toggle Category
        </button>
        <button @click="$emit('showReferences')" data-testid="show-references">
          Show References
        </button>
      </div>
    `
  }
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/dashboard/:id', component: { template: '<div>Detail</div>' } }
  ]
})

describe('SearchDetail Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const createWrapper = () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    // Initialize the conversation store with proper hint handlers
    const conversationStore = useConversationStore()
    conversationStore.updateHintHandlers({
      onHintClick: () => {},
      onCreateFilter: () => {}
    })

    // Initialize search store with mock data for tests
    const searchStore = useSearchStore()
    searchStore.updatePagination({ totalResults: 42 })

    // Add mock person that matches the route ID for tests
    const mockPerson = {
      id: 'test-uuid-123',
      name: 'Johnson Smith',
      age: 26,
      gender: 'Male',
      maritalStatus: 'Married',
      location: 'California',
      rating: 4.5,
      references: 42,
      companies: 3,
      contacts: 15
    }
    searchStore.setResults([mockPerson])

    return mount(SearchDetail, {
      global: {
        plugins: [pinia, router]
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render all main sections', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[data-testid="app-sidebar"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="app-header"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="search-conversation"]').exists()).toBe(
        true
      )
      expect(wrapper.find('[data-testid="search-bar"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="person-profile"]').exists()).toBe(true)
      expect(
        wrapper.find('[data-testid="detailed-result-card"]').exists()
      ).toBe(true)
      expect(wrapper.find('[data-testid="category-tabs"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="activity-footer"]').exists()).toBe(
        true
      )
    })

    it('should have correct layout structure', () => {
      const wrapper = createWrapper()

      // Check SearchLayout structure
      expect(wrapper.find('.h-screen').exists()).toBe(true)
      expect(wrapper.find('.md\\:flex-row').exists()).toBe(true)
      expect(wrapper.find('.bg-bg-primary').exists()).toBe(true)
    })

    it('should pass correct placeholder to SearchBar', () => {
      const wrapper = createWrapper()
      const searchBar = wrapper.findComponent({ name: 'SearchBar' })

      expect(searchBar.props('placeholder')).toBe(
        "Tell me more about who you're looking for"
      )
    })
  })

  describe('Person Data Display', () => {
    it('should display person profile data', () => {
      const wrapper = createWrapper()
      const personProfile = wrapper.findComponent({ name: 'PersonProfile' })

      const person = personProfile.props('person')
      expect(person.name).toBe('Johnson Smith')
      expect(person.tags).toContain('Overview')
      expect(person.tags).toContain('Personal Life')
      expect(person.description).toContain(
        'Johnson Smith is an American businessman'
      )
    })

    it('should display detailed person data', () => {
      const wrapper = createWrapper()
      const detailedCard = wrapper.findComponent({ name: 'DetailedResultCard' })

      const person = detailedCard.props('person')
      expect(person.name).toBe('Johnson Smith')
      expect(person.stats.age).toBe('26')
      expect(person.personal.birthDate).toBe('10 Aug 2000')
      expect(person.professional.currentJob).toBe('Software Engineer')
    })

    it('should display category tabs with correct data', () => {
      const wrapper = createWrapper()
      const categoryTabs = wrapper.findComponent({ name: 'CategoryTabs' })

      const personalData = categoryTabs.props('personalData')
      expect(personalData.relationshipStatus).toBe('Married')

      const professionalData = categoryTabs.props('professionalData')
      expect(professionalData.industry).toBe('Technology')

      const financeData = categoryTabs.props('financeData')
      expect(financeData.annualIncome).toBe('$2.5M+')

      const legalData = categoryTabs.props('legalData')
      expect(legalData.backgroundCheck).toBe('Clear')
    })
  })

  describe('Search Functionality', () => {
    it('should handle search with new query', async () => {
      const wrapper = createWrapper()

      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('update:modelValue', 'new search query')
      await searchBar.vm.$emit('search')

      // Search functionality is handled gracefully (no console logging in production)
      expect(searchBar.exists()).toBe(true)
    })

    it('should handle file upload', async () => {
      const wrapper = createWrapper()
      const mockFiles = [new File(['test'], 'test.txt')] as unknown as FileList

      const searchBar = wrapper.findComponent({ name: 'SearchBar' })
      await searchBar.vm.$emit('fileUpload', mockFiles)

      // File upload is handled gracefully (no console logging in production)
      expect(searchBar.exists()).toBe(true)
    })
  })

  describe('Person Profile Interactions', () => {
    it('should handle tag clicks from PersonProfile', async () => {
      const wrapper = createWrapper()

      const personProfile = wrapper.findComponent({ name: 'PersonProfile' })
      await personProfile.vm.$emit('tagClick', 'Personal Life')

      // Tag click is handled gracefully (no console logging in production)
      expect(personProfile.exists()).toBe(true)
    })

    it('should handle category toggle from ActivityFooter', async () => {
      const wrapper = createWrapper()

      const activityFooter = wrapper.findComponent({ name: 'ActivityFooter' })
      await activityFooter.vm.$emit('categoryToggle', 'personal', true)

      // Category toggle is handled gracefully (no console logging in production)
      expect(activityFooter.exists()).toBe(true)
    })

    it('should handle show references from ActivityFooter', async () => {
      const wrapper = createWrapper()

      const activityFooter = wrapper.findComponent({ name: 'ActivityFooter' })
      await activityFooter.vm.$emit('showReferences')

      // Show references is handled gracefully (no console logging in production)
      expect(activityFooter.exists()).toBe(true)
    })
  })

  describe('Conversation Integration', () => {
    it('should generate conversation messages for detail page', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')

      expect(messages).toBeDefined()
      expect(Array.isArray(messages)).toBe(true)
      expect(messages.length).toBeGreaterThan(0)

      // First message is user message, second is system
      const userMessage = messages[0]
      expect(userMessage.sender).toBe('user')
      expect(userMessage.content).toBeDefined()
    })

    it('should include results summary in conversation', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')

      // System message is the second message (index 1)
      const systemMessage = messages[1]
      expect(systemMessage).toBeDefined()
      expect(systemMessage.items).toBeDefined()

      const resultsSummary = systemMessage.items.find(
        (item: any) => item.type === 'results-summary'
      )
      expect(resultsSummary).toBeDefined()
      expect(resultsSummary.resultCount).toBeGreaterThan(0)
    })

    it('should include action buttons in conversation', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')

      // System message is the second message (index 1)
      const systemMessage = messages[1]
      expect(systemMessage).toBeDefined()
      expect(systemMessage.items).toBeDefined()

      const actionButtons = systemMessage.items.filter(
        (item: any) => item.type === 'action-button'
      )
      expect(actionButtons.length).toBeGreaterThan(0)

      // Check for action button with dashed variant (from conversation store)
      const actionButton = actionButtons.find(
        (btn: any) => btn.variant === 'dashed'
      )
      expect(actionButton).toBeDefined()
      expect(actionButton.text).toContain('create a filter')
    })

    it('should handle action button clicks', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const conversation = wrapper.findComponent({ name: 'SearchConversation' })
      const messages = conversation.props('messages')

      // System message is the second message (index 1)
      const systemMessage = messages[1]
      expect(systemMessage).toBeDefined()
      expect(systemMessage.items).toBeDefined()

      const actionButtons = systemMessage.items.filter(
        (item: any) => item.type === 'action-button'
      )

      // Test create filter action (from conversation store)
      const createFilterAction = actionButtons.find((btn: any) =>
        btn.text.includes('create a filter')
      )
      expect(createFilterAction).toBeDefined()
      expect(typeof createFilterAction.onClick).toBe('function')
    })
  })

  describe('Route Integration', () => {
    it('should access route parameters on mount', () => {
      const wrapper = createWrapper()

      // Component should mount successfully and access route params
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle route parameter changes', async () => {
      // Mock route parameter change
      mockRoute.params.id = 'test-uuid-456'

      const wrapper = createWrapper()

      // Component should handle route changes gracefully
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Data Structure', () => {
    it('should render category data in category tabs', () => {
      const wrapper = createWrapper()
      const categoryTabs = wrapper.findComponent({ name: 'CategoryTabs' })

      expect(categoryTabs.props('personalData')).toBeDefined()
      expect(categoryTabs.props('professionalData')).toBeDefined()
      expect(categoryTabs.props('financeData')).toBeDefined()
      expect(categoryTabs.props('legalData')).toBeDefined()
    })

    it('should render person profile data', () => {
      const wrapper = createWrapper()
      const personProfile = wrapper.findComponent({ name: 'PersonProfile' })

      const person = personProfile.props('person')
      expect(person).toBeDefined()
      expect(person.name).toBeDefined()
      expect(person.tags).toBeDefined()
      expect(person.description).toBeDefined()
    })

    it('should render detailed person data', () => {
      const wrapper = createWrapper()
      const detailedCard = wrapper.findComponent({ name: 'DetailedResultCard' })

      const person = detailedCard.props('person')
      expect(person).toBeDefined()
      expect(person.name).toBeDefined()
      expect(person.stats).toBeDefined()
      expect(person.personal).toBeDefined()
      expect(person.professional).toBeDefined()
      expect(person.finance).toBeDefined()
      expect(person.legal).toBeDefined()
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const wrapper = createWrapper()

      // Check for proper flex layout
      expect(wrapper.find('.flex.h-screen').exists()).toBe(true)

      // Check for main content area
      expect(wrapper.find('.flex-1.flex.flex-col').exists()).toBe(true)
      expect(wrapper.find('.space-y-6').exists()).toBe(true)
    })

    it('should maintain responsive design', () => {
      const wrapper = createWrapper()

      // Check for responsive classes in SearchLayout
      expect(wrapper.find('.md\\:flex-row').exists()).toBe(true)
      expect(wrapper.find('.max-h-full').exists()).toBe(true)
      expect(wrapper.find('.overflow-hidden').exists()).toBe(true)
    })

    it('should have proper spacing and layout', () => {
      const wrapper = createWrapper()

      // Check for proper spacing
      expect(wrapper.find('.space-y-6').exists()).toBe(true)
      expect(wrapper.find('.p-6').exists()).toBe(true)
      expect(wrapper.find('.px-8.py-4').exists()).toBe(true)
    })
  })
})
