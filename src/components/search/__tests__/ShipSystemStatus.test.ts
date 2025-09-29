/**
 * ShipSystemStatus Component Tests
 * Tests the Ship System Status monitor component that displays Discovery One's system health
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ShipSystemStatus from '../ShipSystemStatus.vue'

// Mock Date to provide consistent time for testing
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

describe('ShipSystemStatus', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Component Structure', () => {
    it('renders with correct layout and styling', () => {
      const wrapper = mount(ShipSystemStatus)

      // Check main container has correct classes
      const container = wrapper.find('.ship-system-status')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('bg-gray-900')
      expect(container.classes()).toContain('border-blue-400')
    })

    it('displays system status header with nominal status', () => {
      const wrapper = mount(ShipSystemStatus)

      expect(wrapper.text()).toContain('SYSTEM STATUS')
      expect(wrapper.text()).toContain('NOMINAL')
    })

    it('shows ship identification information', () => {
      const wrapper = mount(ShipSystemStatus)

      expect(wrapper.text()).toContain('VESSEL: DISCOVERY ONE')
      expect(wrapper.text()).toContain('MISSION: JUPITER')
    })

    it('displays overall system status', () => {
      const wrapper = mount(ShipSystemStatus)

      expect(wrapper.text()).toContain('ALL SYSTEMS NOMINAL')
    })
  })

  describe('System Categories', () => {
    it('displays navigation system status', () => {
      const wrapper = mount(ShipSystemStatus)

      expect(wrapper.text()).toContain('NAVIGATION')
      expect(wrapper.text()).toContain('Guidance')
      expect(wrapper.text()).toContain('Inertial')
      expect(wrapper.text()).toContain('Attitude')
    })

    it('displays propulsion system status', () => {
      const wrapper = mount(ShipSystemStatus)

      expect(wrapper.text()).toContain('PROPULSION')
      expect(wrapper.text()).toContain('Main Engine')
      expect(wrapper.text()).toContain('RCS')
      expect(wrapper.text()).toContain('Fuel Level')
      expect(wrapper.text()).toContain('78%')
    })

    it('displays life support system status', () => {
      const wrapper = mount(ShipSystemStatus)

      expect(wrapper.text()).toContain('LIFE SUPPORT')
      expect(wrapper.text()).toContain('Atmosphere')
      expect(wrapper.text()).toContain('Recycling')
      expect(wrapper.text()).toContain('Temperature')
      expect(wrapper.text()).toContain('22°C')
    })

    it('displays communications system status', () => {
      const wrapper = mount(ShipSystemStatus)

      expect(wrapper.text()).toContain('COMMS')
      expect(wrapper.text()).toContain('Earth Link')
      expect(wrapper.text()).toContain('AE-35')
      expect(wrapper.text()).toContain('Signal')
      expect(wrapper.text()).toContain('95%')
    })

    it('displays power system status', () => {
      const wrapper = mount(ShipSystemStatus)

      expect(wrapper.text()).toContain('POWER')
      expect(wrapper.text()).toContain('Nuclear')
      expect(wrapper.text()).toContain('Battery')
      expect(wrapper.text()).toContain('100%')
      expect(wrapper.text()).toContain('Load')
      expect(wrapper.text()).toContain('67%')
    })

    it('displays computer system status', () => {
      const wrapper = mount(ShipSystemStatus)

      expect(wrapper.text()).toContain('COMPUTER')
      expect(wrapper.text()).toContain('HAL 9000')
      expect(wrapper.text()).toContain('Backup')
      expect(wrapper.text()).toContain('Memory')
      expect(wrapper.text()).toContain('42%')
    })
  })

  describe('Status Indicators', () => {
    it('shows OK status for operational systems', () => {
      const wrapper = mount(ShipSystemStatus)

      const okStatuses = wrapper.text().match(/OK/g)
      expect(okStatuses).toBeTruthy()
      expect(okStatuses!.length).toBeGreaterThan(5)
    })

    it('shows CHECK status for AE-35 antenna', () => {
      const wrapper = mount(ShipSystemStatus)

      expect(wrapper.text()).toContain('CHECK')
    })

    it('displays percentage values for measurable systems', () => {
      const wrapper = mount(ShipSystemStatus)

      expect(wrapper.text()).toContain('78%') // Fuel level
      expect(wrapper.text()).toContain('95%') // Signal strength
      expect(wrapper.text()).toContain('100%') // Battery
      expect(wrapper.text()).toContain('67%') // Power load
      expect(wrapper.text()).toContain('42%') // Memory usage
    })

    it('shows temperature reading', () => {
      const wrapper = mount(ShipSystemStatus)

      expect(wrapper.text()).toContain('22°C')
    })
  })

  describe('Grid Layout', () => {
    it('uses 2-column grid for system categories', () => {
      const wrapper = mount(ShipSystemStatus)

      const gridContainer = wrapper.find('.grid-cols-2')
      expect(gridContainer.exists()).toBe(true)
    })

    it('contains system category boxes', () => {
      const wrapper = mount(ShipSystemStatus)

      const systemBoxes = wrapper.findAll('.bg-gray-800')
      expect(systemBoxes.length).toBe(6) // 6 system categories
    })
  })

  describe('Time Display', () => {
    it('displays current time', () => {
      const wrapper = mount(ShipSystemStatus)

      // Should contain LAST UPDATE with time
      expect(wrapper.text()).toContain('LAST UPDATE:')
      // Should contain the mocked time
      expect(wrapper.text()).toContain('10:30:45')
    })

    it('sets up time interval on mount', () => {
      mount(ShipSystemStatus)

      expect(setInterval).toHaveBeenCalledTimes(1)
      expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000)
    })

    it('clears time interval on unmount', () => {
      const wrapper = mount(ShipSystemStatus)

      wrapper.unmount()

      expect(clearInterval).toHaveBeenCalledTimes(1)
      expect(clearInterval).toHaveBeenCalledWith(123)
    })
  })

  describe('Visual Styling', () => {
    it('uses monospace font styling', () => {
      const wrapper = mount(ShipSystemStatus)

      const monoElements = wrapper.findAll('.font-mono')
      expect(monoElements.length).toBeGreaterThan(0)
    })

    it('applies appropriate color coding', () => {
      const wrapper = mount(ShipSystemStatus)

      // Check for green status indicators (OK systems)
      const greenElements = wrapper.findAll('.text-green-400')
      expect(greenElements.length).toBeGreaterThan(0)

      // Check for yellow warning indicators
      const yellowElements = wrapper.findAll('.text-yellow-400')
      expect(yellowElements.length).toBeGreaterThan(0)

      // Check for blue informational elements
      const blueElements = wrapper.findAll('.text-blue-400, .text-blue-300')
      expect(blueElements.length).toBeGreaterThan(0)
    })

    it('includes green status indicator dot', () => {
      const wrapper = mount(ShipSystemStatus)

      const statusDot = wrapper.find('.bg-green-500.rounded-full')
      expect(statusDot.exists()).toBe(true)
    })
  })

  describe('2001 Space Odyssey Theme', () => {
    it('includes authentic references', () => {
      const wrapper = mount(ShipSystemStatus)

      // Check for authentic 2001 references
      expect(wrapper.text()).toContain('DISCOVERY ONE')
      expect(wrapper.text()).toContain('HAL 9000')
      expect(wrapper.text()).toContain('AE-35') // The antenna unit from the movie
      expect(wrapper.text()).toContain('JUPITER') // Mission destination
    })

    it('displays appropriate system categories for spacecraft', () => {
      const wrapper = mount(ShipSystemStatus)

      // Check for realistic spacecraft systems
      expect(wrapper.text()).toContain('NAVIGATION')
      expect(wrapper.text()).toContain('PROPULSION')
      expect(wrapper.text()).toContain('LIFE SUPPORT')
      expect(wrapper.text()).toContain('COMMS')
      expect(wrapper.text()).toContain('POWER')
      expect(wrapper.text()).toContain('COMPUTER')
    })

    it('shows mission-appropriate status values', () => {
      const wrapper = mount(ShipSystemStatus)

      // Fuel level should be realistic for deep space mission
      expect(wrapper.text()).toContain('78%')
      // All critical systems should be operational
      expect(wrapper.text()).toContain('ALL SYSTEMS NOMINAL')
    })
  })

  describe('Accessibility', () => {
    it('provides descriptive text for all systems', () => {
      const wrapper = mount(ShipSystemStatus)

      // Ensure all system information is accessible via text
      expect(wrapper.text()).toContain('SYSTEM STATUS')
      expect(wrapper.text()).toContain('NOMINAL')
      expect(wrapper.text()).toContain('DISCOVERY ONE')
      expect(wrapper.text()).toContain('JUPITER')
    })

    it('uses proper heading structure', () => {
      const wrapper = mount(ShipSystemStatus)

      const heading = wrapper.find('h3')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toBe('SYSTEM STATUS')
    })
  })
})
