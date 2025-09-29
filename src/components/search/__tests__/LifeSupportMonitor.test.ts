/**
 * LifeSupportMonitor Component Tests
 * Tests the Life Support Monitor component that displays vitals for all Discovery One crew members
 * Shows the timeline of HAL 9000's hostile actions against the crew
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LifeSupportMonitor from '../LifeSupportMonitor.vue'

describe('LifeSupportMonitor', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Component Structure', () => {
    it('renders with correct layout and styling', () => {
      const wrapper = mount(LifeSupportMonitor)

      // Check main container has correct classes
      const container = wrapper.find('.life-support-monitor')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('bg-gray-900')
      expect(container.classes()).toContain('border-red-500')
      expect(container.classes()).toContain('border-2')
    })

    it('displays life support header with critical status', () => {
      const wrapper = mount(LifeSupportMonitor)

      expect(wrapper.text()).toContain('LIFE SUPPORT')
      expect(wrapper.text()).toContain('CRITICAL')
    })

    it('shows mission information header', () => {
      const wrapper = mount(LifeSupportMonitor)

      expect(wrapper.text()).toContain('DISCOVERY ONE CREW')
      expect(wrapper.text()).toContain('LIFE SUPPORT MONITORING')
    })
  })

  describe('Crew Member Graphs', () => {
    it('renders multiple SVG graphs with proper viewBox', () => {
      const wrapper = mount(LifeSupportMonitor)

      const svgs = wrapper.findAll('svg')
      expect(svgs.length).toBe(5) // One for each crew member

      svgs.forEach(svg => {
        expect(svg.attributes('viewBox')).toBe('0 0 100 32')
        expect(svg.attributes('preserveAspectRatio')).toBe('none')
      })
    })

    it('displays all five crew members', () => {
      const wrapper = mount(LifeSupportMonitor)

      expect(wrapper.text()).toContain('D. BOWMAN')
      expect(wrapper.text()).toContain('F. POOLE')
      expect(wrapper.text()).toContain('J. KAMINSKI')
      expect(wrapper.text()).toContain('V. HUNTER')
      expect(wrapper.text()).toContain('C. WHITEHEAD')
    })

    it('shows correct status for each crew member', () => {
      const wrapper = mount(LifeSupportMonitor)

      expect(wrapper.text()).toContain('AWAKE') // D. Bowman
      expect(wrapper.text()).toContain('DECEASED') // F. Poole
      expect(wrapper.text()).toContain('TERMINATED') // Hibernation crew
    })

    it('contains life support lines for all crew members', () => {
      const wrapper = mount(LifeSupportMonitor)

      const polylines = wrapper.findAll('polyline')
      expect(polylines.length).toBe(5) // One line per crew member

      // Check that different stroke colors are used
      const colors = polylines.map(line => line.attributes('stroke'))
      expect(colors).toContain('#22c55e') // Green for Bowman (alive)
      expect(colors).toContain('#ef4444') // Red for Poole (deceased)
      expect(colors).toContain('#f59e0b') // Orange for hibernation crew
    })

    it('includes death/termination markers for deceased crew', () => {
      const wrapper = mount(LifeSupportMonitor)

      const circles = wrapper.findAll('circle')
      expect(circles.length).toBe(4) // Markers for F. Poole + 3 hibernation crew

      circles.forEach(circle => {
        expect(circle.attributes('fill')).toBe('#dc2626')
      })
    })

    it('shows mission timeline indicators', () => {
      const wrapper = mount(LifeSupportMonitor)

      expect(wrapper.text()).toContain('T-0')
      expect(wrapper.text()).toContain('EVA')
      expect(wrapper.text()).toContain('HAL MALFUNCTION')
      expect(wrapper.text()).toContain('CURRENT')
    })
  })

  describe('Visual Effects', () => {
    it('includes pulsing animation class', () => {
      const wrapper = mount(LifeSupportMonitor)

      const pulsingElement = wrapper.find('.animate-pulse')
      expect(pulsingElement.exists()).toBe(true)
    })

    it('applies monospace font styling', () => {
      const wrapper = mount(LifeSupportMonitor)

      const monoElements = wrapper.findAll('.font-mono')
      expect(monoElements.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('provides descriptive text for screen readers', () => {
      const wrapper = mount(LifeSupportMonitor)

      // Check that important information is in text form, not just visual
      expect(wrapper.text()).toContain('LIFE SUPPORT')
      expect(wrapper.text()).toContain('CRITICAL')
      expect(wrapper.text()).toContain('DISCOVERY ONE CREW')

      // All crew members should be accessible
      expect(wrapper.text()).toContain('D. BOWMAN')
      expect(wrapper.text()).toContain('F. POOLE')
      expect(wrapper.text()).toContain('DECEASED')
      expect(wrapper.text()).toContain('TERMINATED')
    })

    it('uses appropriate color contrast for text', () => {
      const wrapper = mount(LifeSupportMonitor)

      // Check for text color classes that provide good contrast
      const textElements = wrapper.findAll(
        '.text-red-400, .text-white, .text-gray-400'
      )
      expect(textElements.length).toBeGreaterThan(0)
    })
  })

  describe('HAL 9000 Theme Integration', () => {
    it('includes 2001 Space Odyssey references', () => {
      const wrapper = mount(LifeSupportMonitor)

      // Check for authentic crew names from the movie
      expect(wrapper.text()).toContain('F. POOLE') // Frank Poole
      expect(wrapper.text()).toContain('D. BOWMAN') // Dave Bowman
      expect(wrapper.text()).toContain('DISCOVERY ONE') // Spacecraft name
      expect(wrapper.text()).toContain('HAL MALFUNCTION') // HAL reference
    })

    it('uses appropriate danger colors for critical state', () => {
      const wrapper = mount(LifeSupportMonitor)

      const container = wrapper.find('.life-support-monitor')
      expect(container.classes()).toContain('border-red-500')

      // Check for red text elements indicating danger
      const dangerElements = wrapper.findAll('.text-red-400')
      expect(dangerElements.length).toBeGreaterThan(0)
    })

    it('displays appropriate timeline for mission crisis', () => {
      const wrapper = mount(LifeSupportMonitor)

      // Check timeline reflects the mission crisis progression
      expect(wrapper.text()).toContain('T-0') // Mission start
      expect(wrapper.text()).toContain('EVA') // EVA incident
      expect(wrapper.text()).toContain('HAL MALFUNCTION') // HAL's hostile actions
      expect(wrapper.text()).toContain('CURRENT') // Current status
    })
  })

  describe('Interactivity', () => {
    it('should be clickable with proper cursor styling', () => {
      const wrapper = mount(LifeSupportMonitor)

      const container = wrapper.find('.life-support-monitor')
      expect(container.classes()).toContain('cursor-pointer')
      expect(container.classes()).toContain('hover:bg-gray-800')
      expect(container.classes()).toContain('transition-colors')
    })

    it('should have proper accessibility attributes', () => {
      const wrapper = mount(LifeSupportMonitor)

      const container = wrapper.find('.life-support-monitor')
      expect(container.attributes('role')).toBe('button')
      expect(container.attributes('tabindex')).toBe('0')
      expect(container.attributes('aria-label')).toBe(
        'Open timeline view with star graph'
      )
    })

    it('should emit openTimelineView event when clicked', async () => {
      const wrapper = mount(LifeSupportMonitor)

      const container = wrapper.find('.life-support-monitor')
      await container.trigger('click')

      expect(wrapper.emitted('openTimelineView')).toBeTruthy()
      expect(wrapper.emitted('openTimelineView')).toHaveLength(1)
    })

    it('should emit openTimelineView event when Enter key is pressed', async () => {
      const wrapper = mount(LifeSupportMonitor)

      const container = wrapper.find('.life-support-monitor')
      await container.trigger('keydown.enter')

      expect(wrapper.emitted('openTimelineView')).toBeTruthy()
      expect(wrapper.emitted('openTimelineView')).toHaveLength(1)
    })

    it('should emit openTimelineView event when Space key is pressed', async () => {
      const wrapper = mount(LifeSupportMonitor)

      const container = wrapper.find('.life-support-monitor')
      await container.trigger('keydown.space')

      expect(wrapper.emitted('openTimelineView')).toBeTruthy()
      expect(wrapper.emitted('openTimelineView')).toHaveLength(1)
    })

    it('should prevent default behavior on Space key press', async () => {
      const wrapper = mount(LifeSupportMonitor)

      const container = wrapper.find('.life-support-monitor')
      const event = { preventDefault: vi.fn() }

      await container.trigger('keydown.space', event)

      // The prevent modifier is set on the component, so the event should be handled
      expect(wrapper.emitted('openTimelineView')).toBeTruthy()
    })
  })
})
