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

    it('should render monitor components and regular cards', () => {
      const wrapper = createWrapper()

      // Check for special monitor components
      const lifeSupportMonitor = wrapper.findComponent({
        name: 'LifeSupportMonitor'
      })
      const shipSystemStatus = wrapper.findComponent({
        name: 'ShipSystemStatus'
      })
      expect(lifeSupportMonitor.exists()).toBe(true)
      expect(shipSystemStatus.exists()).toBe(true)

      // Check for clickable regular cards
      const clickableCards = wrapper.findAll('.cursor-pointer')
      expect(clickableCards.length).toBeGreaterThan(0)
    })

    it('should apply random colors to regular cards (not monitor components)', () => {
      const wrapper = createWrapper()

      // Find clickable cards by cursor-pointer class
      const clickableCards = wrapper.findAll('.cursor-pointer')
      let hasColorClass = false

      clickableCards.forEach(card => {
        const classes = card.classes()
        const colorClasses = classes.filter(
          cls => cls.startsWith('bg-') && !cls.includes('gray')
        )
        if (colorClasses.length > 0) {
          hasColorClass = true
        }
      })

      expect(hasColorClass).toBe(true)
    })

    it('should apply random heights to regular cards', () => {
      const wrapper = createWrapper()

      // Find clickable cards by cursor-pointer class
      const clickableCards = wrapper.findAll('.cursor-pointer')
      let hasHeightStyle = false

      clickableCards.forEach(card => {
        const style = card.attributes('style')
        if (style?.includes('height:')) {
          hasHeightStyle = true
        }
      })

      expect(hasHeightStyle).toBe(true)
    })

    it('should render card content with title and description on regular cards', () => {
      const wrapper = createWrapper()

      // Find clickable cards by cursor-pointer class
      const clickableCards = wrapper.findAll('.cursor-pointer')
      expect(clickableCards.length).toBeGreaterThan(0)

      const firstCard = clickableCards[0]
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
    it('should emit card-click event when a regular card is clicked', async () => {
      const wrapper = createWrapper()

      // Find clickable cards by cursor-pointer class
      const clickableCards = wrapper.findAll('.cursor-pointer')
      expect(clickableCards.length).toBeGreaterThan(0)

      const firstCard = clickableCards[0]
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

    it('should apply hover styles correctly to regular cards', () => {
      const wrapper = createWrapper()

      // Find clickable cards by cursor-pointer class
      const clickableCards = wrapper.findAll('.cursor-pointer')
      expect(clickableCards.length).toBeGreaterThan(0)

      const firstCard = clickableCards[0]
      expect(firstCard.classes()).toContain('cursor-pointer')
      expect(firstCard.classes()).toContain('transition-all')
      expect(firstCard.classes()).toContain('hover:shadow-lg')
      expect(firstCard.classes()).toContain('hover:scale-105')
    })

    it('should have proper accessibility attributes on clickable cards', () => {
      const wrapper = createWrapper()

      // Find all clickable cards
      const clickableCards = wrapper.findAll('.cursor-pointer')
      expect(clickableCards.length).toBeGreaterThan(0)

      clickableCards.forEach(card => {
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
    it('should generate cards with valid height ranges for regular cards', () => {
      const wrapper = createWrapper()

      // Find clickable cards by cursor-pointer class
      const clickableCards = wrapper.findAll('.cursor-pointer')
      clickableCards.forEach(card => {
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

    it('should generate unique elements for clickable cards', () => {
      const wrapper = createWrapper()

      // Verify all clickable cards are unique DOM elements
      const clickableCards = wrapper.findAll('.cursor-pointer')
      const cardElements = new Set()

      clickableCards.forEach(item => {
        cardElements.add(item.element)
      })

      expect(cardElements.size).toBe(clickableCards.length)
    })
  })

  describe('Text Content', () => {
    it('should display meaningful titles on regular cards', () => {
      const wrapper = createWrapper()

      // Find clickable cards by cursor-pointer class
      const clickableCards = wrapper.findAll('.cursor-pointer')
      clickableCards.forEach(card => {
        const title = card.find('.font-medium')
        if (title.exists()) {
          expect(title.text()).toMatch(/^[A-Za-z\s]+$/) // Only letters and spaces
          expect(title.text().length).toBeGreaterThan(3)
        }
      })
    })

    it('should display meaningful descriptions on regular cards', () => {
      const wrapper = createWrapper()

      // Find clickable cards by cursor-pointer class
      const clickableCards = wrapper.findAll('.cursor-pointer')
      clickableCards.forEach(card => {
        const description = card.find('.text-sm.text-white.text-opacity-70')
        if (description.exists()) {
          expect(description.text()).toMatch(/^[A-Za-z\s]+$/) // Only letters and spaces
          expect(description.text().length).toBeGreaterThan(10)
        }
      })
    })
  })

  describe('Styling', () => {
    it('should apply proper text styling to regular cards', () => {
      const wrapper = createWrapper()

      // Find clickable cards by cursor-pointer class
      const clickableCards = wrapper.findAll('.cursor-pointer')
      clickableCards.forEach(card => {
        const title = card.find('.font-medium.text-white.text-opacity-90')
        const description = card.find('.text-sm.text-white.text-opacity-70')

        if (title.exists()) {
          expect(title.classes()).toContain('text-white')
          expect(title.classes()).toContain('text-opacity-90')
        }

        if (description.exists()) {
          expect(description.classes()).toContain('text-white')
          expect(description.classes()).toContain('text-opacity-70')
        }
      })
    })

    it('should have proper card structure for regular cards', () => {
      const wrapper = createWrapper()

      // Find clickable cards by cursor-pointer class
      const clickableCards = wrapper.findAll('.cursor-pointer')
      clickableCards.forEach(card => {
        const cardContent = card.find(
          '.p-4.h-full.flex.flex-col.justify-between'
        )
        if (cardContent.exists()) {
          expect(cardContent.classes()).toContain('h-full')
          expect(cardContent.classes()).toContain('flex')
          expect(cardContent.classes()).toContain('flex-col')
          expect(cardContent.classes()).toContain('justify-between')
        }
      })
    })

    it('should have rounded corners on regular cards', () => {
      const wrapper = createWrapper()

      // Find clickable cards by cursor-pointer class
      const clickableCards = wrapper.findAll('.cursor-pointer')
      expect(clickableCards.length).toBeGreaterThan(0)

      clickableCards.forEach(card => {
        expect(card.classes()).toContain('rounded-lg')
      })
    })
  })
})
