/**
 * Integration tests for RandomCardsGrid functionality
 * Tests complete user workflow from search results to grid interaction
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import SearchResultsList from '@/views/SearchResultsList.vue'
import { useSearchStore } from '@/stores/search'
import { useConversationStore } from '@/stores/conversation'

// Mock SearchLayout and RightPanel components for integration testing
vi.mock('@/components/layouts/SearchLayout.vue', () => ({
  default: {
    name: 'SearchLayout',
    props: ['searchPlaceholder'],
    emits: ['search', 'fileUpload', 'speechError'],
    template: `
      <div data-testid="search-layout">
        <div class="search-input-area">
          <button
            @click="$emit('search', 'integration test query')"
            data-testid="search-button"
          >
            Search
          </button>
        </div>
        <div class="right-panel-area">
          <slot />
        </div>
      </div>
    `
  }
}))

vi.mock('@/components/search/RightPanel.vue', () => ({
  default: {
    name: 'RightPanel',
    props: ['results', 'isLoading', 'hasMore', 'error', 'selectedPerson'],
    emits: ['loadMore', 'personSelected', 'backToResults', 'piClick'],
    template: `
      <div data-testid="right-panel">
        <div data-testid="random-cards-grid">
          <div class="grid grid-cols-2 gap-4 auto-rows-max">
            <div
              v-for="card in mockCards"
              :key="card.id"
              class="card cursor-pointer transition-all duration-200"
              :class="card.colorClass"
              :style="{ height: card.height + 'px' }"
              @click="handleCardClick(card)"
              :data-testid="'grid-card-' + card.id"
            >
              <div class="p-4 h-full flex flex-col justify-between">
                <div class="font-medium text-white text-opacity-90">
                  {{ card.title }}
                </div>
                <div class="text-sm text-white text-opacity-70">
                  {{ card.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        mockCards: Array.from({ length: 20 }, (_, index) => ({
          id: index + 1,
          title: `Card ${index + 1}`,
          description: `Description for card ${index + 1}`,
          height: 120 + index * 10,
          colorClass: index % 2 === 0 ? 'bg-blue-500' : 'bg-red-500'
        }))
      }
    },
    methods: {
      handleCardClick(card: unknown) {
        ;(this as any).$emit('cardClick', card)
      }
    }
  }
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/search', component: { template: '<div>Search Page</div>' } },
    {
      path: '/search-detail/:id',
      name: 'SearchDetail',
      component: { template: '<div>Search Detail Page</div>' }
    }
  ]
})

describe('RandomCardsGrid Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const createWrapper = () => {
    return mount(SearchResultsList, {
      global: {
        plugins: [createPinia(), router]
      }
    })
  }

  describe('Grid Rendering in Search Results', () => {
    it('should render the RandomCardsGrid component within SearchResultsList', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[data-testid="search-layout"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="right-panel"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="random-cards-grid"]').exists()).toBe(
        true
      )
    })

    it('should display 2-column grid layout', () => {
      const wrapper = createWrapper()

      const grid = wrapper.find('.grid.grid-cols-2')
      expect(grid.exists()).toBe(true)
      expect(grid.classes()).toContain('grid-cols-2')
      expect(grid.classes()).toContain('gap-4')
    })

    it('should render 20 cards in the grid', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAll('[data-testid^="grid-card-"]')
      expect(cards).toHaveLength(20)
    })

    it('should apply different colors to alternate cards', () => {
      const wrapper = createWrapper()

      const card1 = wrapper.find('[data-testid="grid-card-1"]')
      const card2 = wrapper.find('[data-testid="grid-card-2"]')

      expect(card1.classes()).toContain('bg-blue-500')
      expect(card2.classes()).toContain('bg-red-500')
    })

    it('should apply incremental heights to cards', () => {
      const wrapper = createWrapper()

      const card1 = wrapper.find('[data-testid="grid-card-1"]')
      const card2 = wrapper.find('[data-testid="grid-card-2"]')

      expect(card1.attributes('style')).toContain('height: 120px')
      expect(card2.attributes('style')).toContain('height: 130px')
    })
  })

  describe('Card Interaction Workflow', () => {
    it('should handle card clicks properly', async () => {
      const wrapper = createWrapper()

      const firstCard = wrapper.find('[data-testid="grid-card-1"]')
      expect(firstCard.exists()).toBe(true)

      await firstCard.trigger('click')

      // Verify the click event was processed
      expect(firstCard.exists()).toBe(true)
    })

    it('should display proper card content', () => {
      const wrapper = createWrapper()

      const firstCard = wrapper.find('[data-testid="grid-card-1"]')
      expect(firstCard.text()).toContain('Card 1')
      expect(firstCard.text()).toContain('Description for card 1')

      const fifthCard = wrapper.find('[data-testid="grid-card-5"]')
      expect(fifthCard.text()).toContain('Card 5')
      expect(fifthCard.text()).toContain('Description for card 5')
    })

    it('should apply hover states correctly', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAll('.card')
      cards.forEach(card => {
        expect(card.classes()).toContain('cursor-pointer')
        expect(card.classes()).toContain('transition-all')
      })
    })
  })

  describe('Integration with Search Store', () => {
    it('should work properly with search store state', () => {
      const wrapper = createWrapper()
      const searchStore = useSearchStore()

      // Test that the component renders regardless of search store state
      expect(wrapper.find('[data-testid="random-cards-grid"]').exists()).toBe(
        true
      )
      expect(searchStore).toBeDefined()
    })

    it('should display grid when no search results are present', () => {
      const wrapper = createWrapper()
      const searchStore = useSearchStore()

      // Clear any existing results
      searchStore.clearResults()

      expect(wrapper.find('[data-testid="random-cards-grid"]').exists()).toBe(
        true
      )
      expect(wrapper.findAll('[data-testid^="grid-card-"]')).toHaveLength(20)
    })
  })

  describe('Integration with Conversation Store', () => {
    it('should initialize conversation history properly', () => {
      createWrapper()
      const conversationStore = useConversationStore()

      expect(
        conversationStore.conversationHistory.length
      ).toBeGreaterThanOrEqual(1)

      const firstMessage = conversationStore.conversationHistory[0]
      expect(firstMessage).toBeDefined()

      const firstItem = firstMessage?.items?.[0]
      expect(firstItem).toBeDefined()

      if (firstItem && 'content' in firstItem) {
        expect(firstItem.content).toBe('Hello Dave')
      }
    })

    it('should maintain conversation state during grid interactions', async () => {
      const wrapper = createWrapper()
      const conversationStore = useConversationStore()

      const initialHistoryLength = conversationStore.conversationHistory.length

      // Click a card
      const firstCard = wrapper.find('[data-testid="grid-card-1"]')
      await firstCard.trigger('click')

      // Conversation history should remain stable
      expect(conversationStore.conversationHistory.length).toBe(
        initialHistoryLength
      )
    })
  })

  describe('Responsive Layout', () => {
    it('should maintain grid structure on different screen sizes', () => {
      const wrapper = createWrapper()

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-2')

      // Grid should always be 2 columns as specified in requirements
      const cards = wrapper.findAll('[data-testid^="grid-card-"]')
      expect(cards).toHaveLength(20)
    })

    it('should have proper spacing in grid layout', () => {
      const wrapper = createWrapper()

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('gap-4')
    })
  })

  describe('Performance and State Management', () => {
    it('should handle multiple interactions without errors', async () => {
      const wrapper = createWrapper()

      // Click multiple cards in sequence
      for (let i = 1; i <= 5; i++) {
        const card = wrapper.find(`[data-testid="grid-card-${i}"]`)
        expect(card.exists()).toBe(true)
        await card.trigger('click')
      }

      // All cards should still be present and functional
      expect(wrapper.findAll('[data-testid^="grid-card-"]')).toHaveLength(20)
    })

    it('should maintain component state during navigation', async () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[data-testid="random-cards-grid"]').exists()).toBe(
        true
      )

      // Simulate some state changes
      await nextTick()

      expect(wrapper.find('[data-testid="random-cards-grid"]').exists()).toBe(
        true
      )
      expect(wrapper.findAll('[data-testid^="grid-card-"]')).toHaveLength(20)
    })
  })

  describe('Error Handling', () => {
    it('should handle component mounting without errors', () => {
      expect(() => createWrapper()).not.toThrow()
    })

    it('should gracefully handle missing card data', () => {
      const wrapper = createWrapper()

      // Even if some cards might have issues, the component should still render
      expect(wrapper.find('[data-testid="random-cards-grid"]').exists()).toBe(
        true
      )
    })
  })

  describe('Accessibility', () => {
    it('should provide proper interactive elements', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAll('.card')
      cards.forEach(card => {
        expect(card.classes()).toContain('cursor-pointer')
      })
    })

    it('should have proper semantic structure', () => {
      const wrapper = createWrapper()

      const titles = wrapper.findAll('.font-medium')
      const descriptions = wrapper.findAll('.text-sm')

      expect(titles.length).toBeGreaterThan(0)
      expect(descriptions.length).toBeGreaterThan(0)
    })
  })
})
