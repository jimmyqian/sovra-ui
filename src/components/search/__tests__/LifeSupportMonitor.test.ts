/**
 * LifeSupportMonitor Component Tests
 * Tests the Life Support Monitor component that displays declining vitals during HAL's murder of Frank Poole
 */

import { describe, it, expect, beforeEach } from 'vitest'
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

    it('shows crew member information', () => {
      const wrapper = mount(LifeSupportMonitor)

      expect(wrapper.text()).toContain('CREW MEMBER: F. POOLE')
      expect(wrapper.text()).toContain('STATUS: DECEASED')
    })
  })

  describe('Graph Elements', () => {
    it('renders SVG graph with proper viewBox', () => {
      const wrapper = mount(LifeSupportMonitor)

      const svg = wrapper.find('svg')
      expect(svg.exists()).toBe(true)
      expect(svg.attributes('viewBox')).toBe('0 0 100 100')
      expect(svg.attributes('preserveAspectRatio')).toBe('none')
    })

    it('contains three phase lines for health decline', () => {
      const wrapper = mount(LifeSupportMonitor)

      const polylines = wrapper.findAll('polyline')
      expect(polylines).toHaveLength(3)

      // Check stroke colors for different phases
      const colors = polylines.map(line => line.attributes('stroke'))
      expect(colors).toContain('#22c55e') // Green for healthy phase
      expect(colors).toContain('#eab308') // Yellow for declining phase
      expect(colors).toContain('#ef4444') // Red for critical phase
    })

    it('includes death marker circle', () => {
      const wrapper = mount(LifeSupportMonitor)

      const circle = wrapper.find('circle')
      expect(circle.exists()).toBe(true)
      expect(circle.attributes('fill')).toBe('#dc2626')
      expect(circle.attributes('cx')).toBe('95')
      expect(circle.attributes('cy')).toBe('95')
    })

    it('displays Y-axis percentage labels', () => {
      const wrapper = mount(LifeSupportMonitor)

      expect(wrapper.text()).toContain('100%')
      expect(wrapper.text()).toContain('75%')
      expect(wrapper.text()).toContain('50%')
      expect(wrapper.text()).toContain('25%')
      expect(wrapper.text()).toContain('0%')
    })

    it('shows time indicators', () => {
      const wrapper = mount(LifeSupportMonitor)

      expect(wrapper.text()).toContain('00:00')
      expect(wrapper.text()).toContain('EVA START')
      expect(wrapper.text()).toContain('SYSTEM FAIL')
      expect(wrapper.text()).toContain('00:47')
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
      expect(wrapper.text()).toContain('F. POOLE')
      expect(wrapper.text()).toContain('DECEASED')
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

      // Check for authentic HAL references
      expect(wrapper.text()).toContain('F. POOLE') // Frank Poole from the movie
    })

    it('uses appropriate danger colors for critical state', () => {
      const wrapper = mount(LifeSupportMonitor)

      const container = wrapper.find('.life-support-monitor')
      expect(container.classes()).toContain('border-red-500')

      // Check for red text elements indicating danger
      const dangerElements = wrapper.findAll('.text-red-400')
      expect(dangerElements.length).toBeGreaterThan(0)
    })

    it('displays appropriate timeline for EVA incident', () => {
      const wrapper = mount(LifeSupportMonitor)

      // Check timeline matches a realistic EVA incident duration
      expect(wrapper.text()).toContain('00:00')
      expect(wrapper.text()).toContain('00:47') // 47 minutes - realistic for the incident
      expect(wrapper.text()).toContain('EVA START')
      expect(wrapper.text()).toContain('SYSTEM FAIL')
    })
  })
})
