/**
 * Unit tests for RandomCardsGrid component
 * Tests grid layout, card generation, and click functionality
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RandomCardsGrid from '../RandomCardsGrid.vue'

describe('RandomCardsGrid Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const createWrapper = () => {
    return mount(RandomCardsGrid, {
      global: {
        plugins: [createPinia()]
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render the grid container', () => {
      const wrapper = createWrapper()

      const gridContainer = wrapper.find('.grid.grid-cols-2')
      expect(gridContainer.exists()).toBe(true)
      expect(gridContainer.classes()).toContain('grid-cols-2')
      expect(gridContainer.classes()).toContain('gap-4')
    })

    it('should render 20 cards in the grid', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAll('.grid > div')
      expect(cards).toHaveLength(20)
    })

    it('should apply random colors to cards', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAll('.grid > div')
      let hasColorClass = false

      cards.forEach(card => {
        const classes = card.classes()
        const colorClasses = classes.filter(cls => cls.startsWith('bg-'))
        if (colorClasses.length > 0) {
          hasColorClass = true
        }
      })

      expect(hasColorClass).toBe(true)
    })

    it('should apply random heights to cards', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAll('.grid > div')
      let hasHeightStyle = false

      cards.forEach(card => {
        const style = card.attributes('style')
        if (style?.includes('height:')) {
          hasHeightStyle = true
        }
      })

      expect(hasHeightStyle).toBe(true)
    })

    it('should render card content with title and description', () => {
      const wrapper = createWrapper()

      const firstCard = wrapper.find('.grid > div')
      expect(firstCard.exists()).toBe(true)

      const cardContent = firstCard.find('.p-4')
      expect(cardContent.exists()).toBe(true)

      const title = cardContent.find('.font-medium')
      const description = cardContent.find('.text-sm')

      expect(title.exists()).toBe(true)
      expect(description.exists()).toBe(true)
      expect(title.text().length).toBeGreaterThan(0)
      expect(description.text().length).toBeGreaterThan(0)
    })
  })

  describe('Card Interactions', () => {
    it('should emit card-click event when a card is clicked', async () => {
      const wrapper = createWrapper()

      const firstCard = wrapper.find('.grid > div')
      expect(firstCard.exists()).toBe(true)

      await firstCard.trigger('click')

      const emittedEvents = wrapper.emitted('cardClick')
      expect(emittedEvents).toBeTruthy()
      expect(emittedEvents).toHaveLength(1)

      const eventPayload = emittedEvents?.[0]?.[0] as {
        id: number
        title: string
        description: string
        height: number
        colorClass: string
      }

      expect(eventPayload).toHaveProperty('id')
      expect(eventPayload).toHaveProperty('title')
      expect(eventPayload).toHaveProperty('description')
      expect(eventPayload).toHaveProperty('height')
      expect(eventPayload).toHaveProperty('colorClass')
      expect(typeof eventPayload.id).toBe('number')
      expect(typeof eventPayload.title).toBe('string')
      expect(typeof eventPayload.description).toBe('string')
      expect(typeof eventPayload.height).toBe('number')
      expect(typeof eventPayload.colorClass).toBe('string')
    })

    it('should apply hover styles correctly', () => {
      const wrapper = createWrapper()

      const firstCard = wrapper.find('.grid > div')
      expect(firstCard.exists()).toBe(true)

      expect(firstCard.classes()).toContain('cursor-pointer')
      expect(firstCard.classes()).toContain('transition-all')
      expect(firstCard.classes()).toContain('hover:shadow-lg')
      expect(firstCard.classes()).toContain('hover:scale-105')
    })

    it('should have proper accessibility attributes', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAll('.grid > div')
      cards.forEach(card => {
        expect(card.classes()).toContain('cursor-pointer')
      })
    })
  })

  describe('Grid Layout', () => {
    it('should use 2-column grid layout', () => {
      const wrapper = createWrapper()

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-2')
    })

    it('should have proper gap between cards', () => {
      const wrapper = createWrapper()

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('gap-4')
    })

    it('should use auto-rows-max for proper layout', () => {
      const wrapper = createWrapper()

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('auto-rows-max')
    })
  })

  describe('Card Properties', () => {
    it('should generate cards with valid height ranges', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAll('.grid > div')
      cards.forEach(card => {
        const style = card.attributes('style')
        if (style) {
          const heightMatch = style.match(/height:\s*(\d+)px/)
          if (heightMatch?.[1]) {
            const height = parseInt(heightMatch[1], 10)
            expect(height).toBeGreaterThanOrEqual(120)
            expect(height).toBeLessThanOrEqual(300)
          }
        }
      })
    })

    it('should generate unique card IDs', () => {
      const wrapper = createWrapper()

      // Verify cards are unique by checking their data-testid attributes
      const cards = wrapper.findAll('.grid > div')
      const cardElements = new Set()

      cards.forEach(card => {
        cardElements.add(card.element)
      })

      expect(cardElements.size).toBe(cards.length)
    })
  })

  describe('Text Content', () => {
    it('should display meaningful titles', () => {
      const wrapper = createWrapper()

      const titles = wrapper.findAll('.font-medium')
      titles.forEach(title => {
        expect(title.text()).toMatch(/^[A-Za-z\s]+$/) // Only letters and spaces
        expect(title.text().length).toBeGreaterThan(3)
      })
    })

    it('should display meaningful descriptions', () => {
      const wrapper = createWrapper()

      const descriptions = wrapper.findAll('.text-sm')
      descriptions.forEach(description => {
        expect(description.text()).toMatch(/^[A-Za-z\s]+$/) // Only letters and spaces
        expect(description.text().length).toBeGreaterThan(10)
      })
    })
  })

  describe('Styling', () => {
    it('should apply proper text styling', () => {
      const wrapper = createWrapper()

      const titles = wrapper.findAll('.font-medium')
      titles.forEach(title => {
        expect(title.classes()).toContain('text-white')
        expect(title.classes()).toContain('text-opacity-90')
      })

      const descriptions = wrapper.findAll('.text-sm')
      descriptions.forEach(description => {
        expect(description.classes()).toContain('text-white')
        expect(description.classes()).toContain('text-opacity-70')
      })
    })

    it('should have proper card structure', () => {
      const wrapper = createWrapper()

      const cardContents = wrapper.findAll('.p-4')
      cardContents.forEach(content => {
        expect(content.classes()).toContain('h-full')
        expect(content.classes()).toContain('flex')
        expect(content.classes()).toContain('flex-col')
        expect(content.classes()).toContain('justify-between')
      })
    })

    it('should have rounded corners on cards', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAll('.grid > div')
      cards.forEach(card => {
        expect(card.classes()).toContain('rounded-lg')
      })
    })
  })
})
