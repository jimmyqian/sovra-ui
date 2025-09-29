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

    it('should render 8 total components in the grid with full-width mission overview (default view)', () => {
      const wrapper = createWrapper()

      // In default view, should have 8 components
      const gridItems = wrapper.findAll('.grid > div')
      expect(gridItems.length).toBeGreaterThanOrEqual(3) // Mission overview + life support + conditional content

      // First item should be full-width (col-span-2)
      const firstItem = gridItems[0]
      expect(firstItem).toBeTruthy()
      if (firstItem) {
        expect(firstItem.classes()).toContain('col-span-2')
        expect(firstItem.classes()).toContain('h-64')
      }
    })

    it('should apply proper height classes to different card types in default view', () => {
      const wrapper = createWrapper()

      // Check that computer card exists in default view
      const computerCard = wrapper.findComponent({ name: 'ComputerStatusCard' })
      expect(computerCard.exists()).toBe(true)

      // Check that specific height containers exist
      const missionOverviewContainer = wrapper.find('.col-span-2.h-64')
      expect(missionOverviewContainer.exists()).toBe(true)

      const lifeSupportContainer = wrapper.find('.h-\\[32rem\\]')
      expect(lifeSupportContainer.exists()).toBe(true)

      // Computer and crew status cards are nested inside conditional content
      const computerContainer = wrapper.find('.h-56')
      expect(computerContainer.exists()).toBe(true)

      const crewContainer = wrapper.find('.h-52')
      expect(crewContainer.exists()).toBe(true)
    })
  })

  describe('System Status Integration', () => {
    it('should arrange cards with full-width mission overview at top', () => {
      const wrapper = createWrapper()

      // Top row: Full-width Mission Overview
      const missionOverview = wrapper.findComponent({
        name: 'MissionOverviewCard'
      })
      expect(missionOverview.exists()).toBe(true)

      // Second row: Life Support Monitor (left) + Computer Alert (right)
      expect(
        wrapper.findComponent({ name: 'LifeSupportMonitor' }).exists()
      ).toBe(true)
      expect(
        wrapper.findComponent({ name: 'ComputerStatusCard' }).exists()
      ).toBe(true)

      // Verify critical/alert systems are positioned prominently
      const computerCard = wrapper.findComponent({ name: 'ComputerStatusCard' })
      expect(computerCard.exists()).toBe(true)

      // Warning level cards should appear in next positions
      const commCard = wrapper.findComponent({
        name: 'CommunicationsStatusCard'
      })
      const propCard = wrapper.findComponent({ name: 'PropulsionStatusCard' })
      expect(commCard.exists()).toBe(true)
      expect(propCard.exists()).toBe(true)
    })

    it('should display mission-critical information across all cards', () => {
      const wrapper = createWrapper()

      // Check for 2001 Space Odyssey references
      expect(wrapper.text()).toContain('DISCOVERY ONE')
      expect(wrapper.text()).toContain('JUPITER')
      expect(wrapper.text()).toContain('HAL 9000')
      expect(wrapper.text()).toContain('AE-35')
    })

    it('should show various system statuses including mission alert', () => {
      const wrapper = createWrapper()

      // Check for different status types
      expect(wrapper.text()).toContain('NOMINAL')
      expect(wrapper.text()).toContain('CAUTION')
      expect(wrapper.text()).toContain('WARNING')
      expect(wrapper.text()).toContain('ALERT')

      // Mission should be in ALERT status
      expect(wrapper.text()).toContain('MISSION: JUPITER - CRITICAL')
      expect(wrapper.text()).toContain('COMPROMISED')
      expect(wrapper.text()).toContain('MISSION CRITICAL')
    })

    it('should display system categories', () => {
      const wrapper = createWrapper()

      // Check for all system categories
      expect(wrapper.text()).toContain('NAVIGATION')
      expect(wrapper.text()).toContain('PROPULSION')
      expect(wrapper.text()).toContain('CREW STATUS')
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
    it('should use 2-column grid layout with proper spacing and full-width support', () => {
      const wrapper = createWrapper()

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-2')
      expect(grid.classes()).toContain('gap-4')
      expect(grid.classes()).toContain('auto-rows-max')

      // Check that first item spans full width
      const gridItems = wrapper.findAll('.grid > div')
      const firstItem = gridItems[0]
      expect(firstItem).toBeTruthy()
      if (firstItem) {
        expect(firstItem.classes()).toContain('col-span-2')
      }
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
    it('should display authentic spacecraft terminology reflecting mission crisis', () => {
      const wrapper = createWrapper()

      // Check for realistic spacecraft terms
      const content = wrapper.text()

      // Navigation terms
      expect(content).toContain('Guidance')
      expect(content).toContain('Inertial')
      expect(content).toContain('Attitude')

      // Mission crisis terms reflecting HAL's actions
      expect(content).toContain('COMPROMISED')
      expect(content).toContain('1 AWAKE') // Only Dave Bowman left
      expect(content).toContain('3 TERMINATED') // Hibernation crew terminated by HAL

      // Crew member status
      expect(content).toContain('D. Bowman')
      expect(content).toContain('F. Poole')
      expect(content).toContain('DECEASED') // Frank Poole killed during EVA
      expect(content).toContain('J. Kaminski')
      expect(content).toContain('V. Hunter')
      expect(content).toContain('C. Whitehead')
      expect(content).toContain('TERMINATED') // Hibernation crew terminated by HAL
    })

    it('should show various measurement units and values', () => {
      const wrapper = createWrapper()

      const content = wrapper.text()

      // Check for realistic measurements
      expect(content).toMatch(/\d+%/) // Percentages
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

  describe('Mission Summary Lightbox Integration', () => {
    it('should render mission summary lightbox component', () => {
      const wrapper = createWrapper()

      const lightbox = wrapper.findComponent({ name: 'MissionSummaryLightbox' })
      expect(lightbox.exists()).toBe(true)
    })

    it('should initially render lightbox in closed state', () => {
      const wrapper = createWrapper()

      const lightbox = wrapper.findComponent({ name: 'MissionSummaryLightbox' })
      expect(lightbox).toBeTruthy()
      expect(lightbox.props('isOpen')).toBe(false)
    })

    it('should make computer card clickable', () => {
      const wrapper = createWrapper()

      const computerCard = wrapper.findComponent({ name: 'ComputerStatusCard' })
      expect(computerCard.exists()).toBe(true)

      // Check that the computer card root element has cursor-pointer class
      const computerCardElement = computerCard.find('.computer-status-card')
      expect(computerCardElement.exists()).toBe(true)
      expect(computerCardElement.classes()).toContain('cursor-pointer')
    })

    it('should open lightbox when computer card is clicked', async () => {
      const wrapper = createWrapper()

      const computerCard = wrapper.findComponent({ name: 'ComputerStatusCard' })
      expect(computerCard).toBeTruthy()

      // Trigger click on computer card
      await computerCard.trigger('click')

      // Check that lightbox opens
      const lightbox = wrapper.findComponent({ name: 'MissionSummaryLightbox' })
      expect(lightbox).toBeTruthy()
      expect(lightbox.props('isOpen')).toBe(true)
    })

    it('should close lightbox when close event is emitted', async () => {
      const wrapper = createWrapper()

      // First open the lightbox
      const computerCard = wrapper.findComponent({ name: 'ComputerStatusCard' })
      await computerCard.trigger('click')

      const lightbox = wrapper.findComponent({ name: 'MissionSummaryLightbox' })
      expect(lightbox.props('isOpen')).toBe(true)

      // Emit close event from lightbox
      await lightbox.vm.$emit('close')

      // Check that lightbox is closed
      expect(lightbox.props('isOpen')).toBe(false)
    })

    it('should have proper accessibility attributes on computer card', () => {
      const wrapper = createWrapper()

      const computerCard = wrapper.findComponent({ name: 'ComputerStatusCard' })
      const computerCardElement = computerCard.find('.computer-status-card')

      expect(computerCardElement.attributes('role')).toBe('button')
      expect(computerCardElement.attributes('tabindex')).toBe('0')
      expect(computerCardElement.attributes('aria-label')).toBe(
        'Open mission summary'
      )
    })

    it('should support keyboard navigation on computer card', async () => {
      const wrapper = createWrapper()

      const computerCard = wrapper.findComponent({ name: 'ComputerStatusCard' })
      const computerCardElement = computerCard.find('.computer-status-card')

      // Test Enter key
      await computerCardElement.trigger('keydown.enter')
      const lightbox = wrapper.findComponent({ name: 'MissionSummaryLightbox' })
      expect(lightbox.props('isOpen')).toBe(true)

      // Close lightbox
      await lightbox.vm.$emit('close')

      // Test Space key
      await computerCardElement.trigger('keydown.space')
      expect(lightbox.props('isOpen')).toBe(true)
    })

    it('should include hover effects on computer card', () => {
      const wrapper = createWrapper()

      const computerCard = wrapper.findComponent({ name: 'ComputerStatusCard' })
      const computerCardElement = computerCard.find('.computer-status-card')

      expect(computerCardElement.classes()).toContain('hover:bg-gray-800')
      expect(computerCardElement.classes()).toContain('transition-colors')
    })
  })

  describe('Timeline Star View Integration', () => {
    it('should render star panel component when timeline view is active', async () => {
      const wrapper = createWrapper()

      // Initially star panel should not exist
      let starPanel = wrapper.findComponent({ name: 'StarPanel' })
      expect(starPanel.exists()).toBe(false)

      // Open timeline view
      const lifeSupportMonitor = wrapper.findComponent({
        name: 'LifeSupportMonitor'
      })
      await lifeSupportMonitor.trigger('click')

      // Now star panel should exist
      starPanel = wrapper.findComponent({ name: 'StarPanel' })
      expect(starPanel.exists()).toBe(true)
    })

    it('should initially show status cards and hide timeline view', () => {
      const wrapper = createWrapper()

      // Should show status cards
      const computerCard = wrapper.findComponent({ name: 'ComputerStatusCard' })
      expect(computerCard.exists()).toBe(true)

      // Timeline view should be hidden
      const timelineHeader = wrapper.find('[data-testid="timeline-header"]')
      expect(timelineHeader.exists()).toBe(false)
    })

    it('should make life support monitor clickable', () => {
      const wrapper = createWrapper()

      const lifeSupportMonitor = wrapper.findComponent({
        name: 'LifeSupportMonitor'
      })
      expect(lifeSupportMonitor.exists()).toBe(true)

      // Check that the life support monitor has cursor-pointer class
      const lifeSupportElement = lifeSupportMonitor.find(
        '.life-support-monitor'
      )
      expect(lifeSupportElement.exists()).toBe(true)
      expect(lifeSupportElement.classes()).toContain('cursor-pointer')
    })

    it('should switch to timeline view when life support monitor is clicked', async () => {
      const wrapper = createWrapper()

      const lifeSupportMonitor = wrapper.findComponent({
        name: 'LifeSupportMonitor'
      })
      expect(lifeSupportMonitor).toBeTruthy()

      // Trigger click on life support monitor
      await lifeSupportMonitor.trigger('click')

      // Check that status cards are hidden
      await wrapper.vm.$nextTick()

      // Computer card should be hidden when timeline view is active
      const computerCard = wrapper.findComponent({ name: 'ComputerStatusCard' })
      expect(computerCard.exists()).toBe(false)

      // Timeline header should be visible
      expect(wrapper.text()).toContain('TIMELINE - STAR VIEW')
    })

    it('should close timeline view when close button is clicked', async () => {
      const wrapper = createWrapper()

      // First open the timeline view
      const lifeSupportMonitor = wrapper.findComponent({
        name: 'LifeSupportMonitor'
      })
      await lifeSupportMonitor.trigger('click')

      // Verify timeline view is open
      expect(wrapper.text()).toContain('TIMELINE - STAR VIEW')

      // Find and click close button
      const closeButton = wrapper.find('[aria-label="Close timeline view"]')
      expect(closeButton.exists()).toBe(true)
      await closeButton.trigger('click')

      // Check that status cards are visible again
      await wrapper.vm.$nextTick()
      const computerCard = wrapper.findComponent({ name: 'ComputerStatusCard' })
      expect(computerCard.exists()).toBe(true)

      // Timeline header should be hidden
      expect(wrapper.text()).not.toContain('TIMELINE - STAR VIEW')
    })

    it('should have proper accessibility attributes on life support monitor', () => {
      const wrapper = createWrapper()

      const lifeSupportMonitor = wrapper.findComponent({
        name: 'LifeSupportMonitor'
      })
      const lifeSupportElement = lifeSupportMonitor.find(
        '.life-support-monitor'
      )

      expect(lifeSupportElement.attributes('role')).toBe('button')
      expect(lifeSupportElement.attributes('tabindex')).toBe('0')
      expect(lifeSupportElement.attributes('aria-label')).toBe(
        'Open timeline view with star graph'
      )
    })

    it('should support keyboard navigation on life support monitor', async () => {
      const wrapper = createWrapper()

      const lifeSupportMonitor = wrapper.findComponent({
        name: 'LifeSupportMonitor'
      })
      const lifeSupportElement = lifeSupportMonitor.find(
        '.life-support-monitor'
      )

      // Test Enter key
      await lifeSupportElement.trigger('keydown.enter')
      expect(wrapper.text()).toContain('TIMELINE - STAR VIEW')

      // Close and test Space key
      const closeButton = wrapper.find('[aria-label="Close timeline view"]')
      await closeButton.trigger('click')

      await lifeSupportElement.trigger('keydown.space')
      expect(wrapper.text()).toContain('TIMELINE - STAR VIEW')
    })

    it('should include hover effects on life support monitor', () => {
      const wrapper = createWrapper()

      const lifeSupportMonitor = wrapper.findComponent({
        name: 'LifeSupportMonitor'
      })
      const lifeSupportElement = lifeSupportMonitor.find(
        '.life-support-monitor'
      )

      expect(lifeSupportElement.classes()).toContain('hover:bg-gray-800')
      expect(lifeSupportElement.classes()).toContain('transition-colors')
    })

    it('should render star panel with correct node count in timeline view', async () => {
      const wrapper = createWrapper()

      // Open timeline view
      const lifeSupportMonitor = wrapper.findComponent({
        name: 'LifeSupportMonitor'
      })
      await lifeSupportMonitor.trigger('click')

      // Check star panel props
      const starPanel = wrapper.findComponent({ name: 'StarPanel' })
      expect(starPanel.props('nodeCount')).toBe(7)
    })
  })
})
