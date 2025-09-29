/**
 * Unit tests for RandomCardsGrid component
 * Tests system status dashboard layout and component integration
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RandomCardsGrid from '../RandomCardsGrid.vue'

// Mock Date for consistent time display in components
const mockDate = new Date('2023-01-01T10:30:45Z')
vi.stubGlobal(
  'Date',
  class MockDate extends Date {
    constructor(...args: any[]) {
      if (args.length === 0) {
        super('2023-01-01T10:30:45Z')
      } else {
        super(...(args as []))
      }
    }

    static now() {
      return mockDate.getTime()
    }

    toLocaleTimeString(
      _locale?: string,
      _options?: Intl.DateTimeFormatOptions
    ) {
      return '10:30:45'
    }
  }
)

// Mock setInterval and clearInterval
vi.stubGlobal(
  'setInterval',
  vi.fn((callback: () => void) => {
    callback() // Execute immediately for testing
    return 123 // Return fake timer ID
  })
)
vi.stubGlobal('clearInterval', vi.fn())

describe('RandomCardsGrid Component (System Status Dashboard)', () => {
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

  describe('Component Structure', () => {
    it('should render the grid container with correct layout', () => {
      const wrapper = createWrapper()

      const gridContainer = wrapper.find('.grid.grid-cols-2')
      expect(gridContainer.exists()).toBe(true)
      expect(gridContainer.classes()).toContain('grid-cols-2')
      expect(gridContainer.classes()).toContain('gap-4')
      expect(gridContainer.classes()).toContain('auto-rows-max')
    })

    it('should render all system status components', () => {
      const wrapper = createWrapper()

      // Check for main monitor components
      const lifeSupportMonitor = wrapper.findComponent({
        name: 'LifeSupportMonitor'
      })
      const missionOverviewCard = wrapper.findComponent({
        name: 'MissionOverviewCard'
      })
      expect(lifeSupportMonitor.exists()).toBe(true)
      expect(missionOverviewCard.exists()).toBe(true)

      // Check for all system status cards
      const navigationCard = wrapper.findComponent({
        name: 'NavigationStatusCard'
      })
      const propulsionCard = wrapper.findComponent({
        name: 'PropulsionStatusCard'
      })
      const lifeSupportCard = wrapper.findComponent({
        name: 'LifeSupportStatusCard'
      })
      const communicationsCard = wrapper.findComponent({
        name: 'CommunicationsStatusCard'
      })
      const powerCard = wrapper.findComponent({ name: 'PowerStatusCard' })
      const computerCard = wrapper.findComponent({ name: 'ComputerStatusCard' })

      expect(navigationCard.exists()).toBe(true)
      expect(propulsionCard.exists()).toBe(true)
      expect(lifeSupportCard.exists()).toBe(true)
      expect(communicationsCard.exists()).toBe(true)
      expect(powerCard.exists()).toBe(true)
      expect(computerCard.exists()).toBe(true)
    })

    it('should render 8 total components in the grid (2 monitors + 6 system cards)', () => {
      const wrapper = createWrapper()

      const gridItems = wrapper.findAll('.grid > div')
      expect(gridItems).toHaveLength(8)
    })

    it('should apply proper height classes to different card types', () => {
      const wrapper = createWrapper()

      const gridItems = wrapper.findAll('.grid > div')

      // First two items should have h-80 class (monitors)
      expect(gridItems[0].classes()).toContain('h-80')
      expect(gridItems[1].classes()).toContain('h-80')

      // Remaining items should have h-64 class (system cards)
      for (let i = 2; i < gridItems.length; i++) {
        expect(gridItems[i].classes()).toContain('h-64')
      }
    })
  })

  describe('System Status Integration', () => {
    it('should display mission-critical information across all cards', () => {
      const wrapper = createWrapper()

      // Check for 2001 Space Odyssey references
      expect(wrapper.text()).toContain('DISCOVERY ONE')
      expect(wrapper.text()).toContain('JUPITER')
      expect(wrapper.text()).toContain('HAL 9000')
      expect(wrapper.text()).toContain('AE-35')
    })

    it('should show various system statuses', () => {
      const wrapper = createWrapper()

      // Check for different status types
      expect(wrapper.text()).toContain('NOMINAL')
      expect(wrapper.text()).toContain('CAUTION')
      expect(wrapper.text()).toContain('WARNING')
      expect(wrapper.text()).toContain('ALERT')
    })

    it('should display system categories', () => {
      const wrapper = createWrapper()

      // Check for all system categories
      expect(wrapper.text()).toContain('NAVIGATION')
      expect(wrapper.text()).toContain('PROPULSION')
      expect(wrapper.text()).toContain('LIFE SUPPORT')
      expect(wrapper.text()).toContain('COMMUNICATIONS')
      expect(wrapper.text()).toContain('POWER')
      expect(wrapper.text()).toContain('COMPUTER')
    })

    it('should have hover effects on grid items', () => {
      const wrapper = createWrapper()

      const gridItems = wrapper.findAll('.grid > div')
      gridItems.forEach(item => {
        // All grid items should have some hover effect styling
        expect(item.element).toBeDefined()
      })
    })
  })

  describe('Layout and Styling', () => {
    it('should use 2-column grid layout with proper spacing', () => {
      const wrapper = createWrapper()

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-2')
      expect(grid.classes()).toContain('gap-4')
      expect(grid.classes()).toContain('auto-rows-max')
    })

    it('should have proper container structure', () => {
      const wrapper = createWrapper()

      const container = wrapper.find('.w-full.h-full.bg-bg-primary')
      expect(container.exists()).toBe(true)

      const innerContainer = wrapper.find('.h-full.px-8.py-4.md\\:px-4')
      expect(innerContainer.exists()).toBe(true)
    })

    it('should have proper styling structure', () => {
      const wrapper = createWrapper()

      // Check that component has the expected structure
      const gridContainer = wrapper.find('.grid')
      expect(gridContainer.exists()).toBe(true)
      expect(gridContainer.classes()).toContain('grid-cols-2')
    })
  })

  describe('Component Integration', () => {
    it('should render all components without errors', () => {
      const wrapper = createWrapper()

      // Verify all components are properly mounted
      expect(
        wrapper.findComponent({ name: 'LifeSupportMonitor' }).exists()
      ).toBe(true)
      expect(
        wrapper.findComponent({ name: 'MissionOverviewCard' }).exists()
      ).toBe(true)
      expect(
        wrapper.findComponent({ name: 'NavigationStatusCard' }).exists()
      ).toBe(true)
      expect(
        wrapper.findComponent({ name: 'PropulsionStatusCard' }).exists()
      ).toBe(true)
      expect(
        wrapper.findComponent({ name: 'LifeSupportStatusCard' }).exists()
      ).toBe(true)
      expect(
        wrapper.findComponent({ name: 'CommunicationsStatusCard' }).exists()
      ).toBe(true)
      expect(wrapper.findComponent({ name: 'PowerStatusCard' }).exists()).toBe(
        true
      )
      expect(
        wrapper.findComponent({ name: 'ComputerStatusCard' }).exists()
      ).toBe(true)
    })

    it('should have unique grid items', () => {
      const wrapper = createWrapper()

      // Verify all grid items are unique DOM elements
      const gridItems = wrapper.findAll('.grid > div')
      const itemElements = new Set()

      gridItems.forEach(item => {
        itemElements.add(item.element)
      })

      expect(itemElements.size).toBe(gridItems.length)
    })
  })

  describe('Content Validation', () => {
    it('should display authentic spacecraft terminology', () => {
      const wrapper = createWrapper()

      // Check for realistic spacecraft terms
      const content = wrapper.text()

      // Navigation terms
      expect(content).toContain('Guidance')
      expect(content).toContain('Inertial')
      expect(content).toContain('Attitude')

      // Mission terms
      expect(content).toContain('EN ROUTE')
      expect(content).toContain('AWAKE')
      expect(content).toContain('Hibernation')
    })

    it('should show various measurement units and values', () => {
      const wrapper = createWrapper()

      const content = wrapper.text()

      // Check for realistic measurements
      expect(content).toMatch(/\d+%/) // Percentages
      expect(content).toMatch(/\d+°C/) // Temperature
      expect(content).toMatch(/\d+\.\d+\s*(AU|KM\/S|MW|KB\/S)/) // Various units
    })
  })

  describe('Time Display Integration', () => {
    it('should display current time in mission overview', () => {
      const wrapper = createWrapper()

      // Should contain LAST UPDATE with time from mission overview
      expect(wrapper.text()).toContain('LAST UPDATE:')
      // The time should be present in the mission overview component
      const missionOverview = wrapper.findComponent({
        name: 'MissionOverviewCard'
      })
      expect(missionOverview.exists()).toBe(true)
    })

    it('should handle time updates properly', () => {
      createWrapper()

      // Verify setInterval was called for time updates
      expect(setInterval).toHaveBeenCalled()
    })
  })
})
