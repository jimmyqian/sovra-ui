/**
 * MissionSummaryLightbox Component Tests
 * Tests the mission summary lightbox that displays Discovery One mission information
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MissionSummaryLightbox from '../MissionSummaryLightbox.vue'

describe('MissionSummaryLightbox', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const createWrapper = (props = {}) => {
    return mount(MissionSummaryLightbox, {
      props: {
        isOpen: false,
        ...props
      },
      global: {
        plugins: [createPinia()],
        stubs: {
          teleport: true
        }
      }
    })
  }

  describe('Component Visibility', () => {
    it('should not render when isOpen is false', () => {
      const wrapper = createWrapper({ isOpen: false })

      expect(wrapper.find('.mission-summary-lightbox').exists()).toBe(false)
    })

    it('should render when isOpen is true', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.find('.mission-summary-lightbox').exists()).toBe(true)
    })

    it('should display mission title', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.text()).toContain('MISSION SUMMARY: DISCOVERY ONE')
    })
  })

  describe('Component Structure', () => {
    it('should render header with close button', () => {
      const wrapper = createWrapper({ isOpen: true })

      const header = wrapper.find('.flex.items-center.justify-between.p-6')
      expect(header.exists()).toBe(true)

      const closeButton = wrapper.find('button')
      expect(closeButton.exists()).toBe(true)
      expect(closeButton.text()).toBe('×')
    })

    it('should render mission status section', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.text()).toContain('MISSION STATUS: CRITICAL')
      expect(wrapper.text()).toContain('JUPITER APPROACH - COMPROMISED')
      expect(wrapper.text()).toContain('HAL 9000 - MALFUNCTIONING')
    })

    it('should render mission timeline section', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.text()).toContain('MISSION TIMELINE')
      expect(wrapper.text()).toContain('T-18M:')
      expect(wrapper.text()).toContain('Mission launch from Earth orbit')
      expect(wrapper.text()).toContain('D. Bowman attempting HAL deactivation')
    })

    it('should render system status grid', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.text()).toContain('SPACECRAFT SYSTEMS')
      expect(wrapper.text()).toContain('CREW MANIFEST')
      expect(wrapper.text()).toContain('Navigation:')
      expect(wrapper.text()).toContain('Dave Bowman:')
    })

    it('should render mission objectives section', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.text()).toContain('PRIMARY MISSION OBJECTIVES')
      expect(wrapper.text()).toContain(
        'Investigate radio signal source at Jupiter'
      )
      expect(wrapper.text()).toContain('TMA-1 artifact transmission target')
    })

    it('should render emergency protocols section', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.text()).toContain('EMERGENCY PROTOCOLS ACTIVE')
      expect(wrapper.text()).toContain(
        'HAL 9000 computer system has been classified as hostile'
      )
      expect(wrapper.text()).toContain(
        'Manual override of all automated systems required'
      )
    })
  })

  describe('Crew Status Information', () => {
    it('should display correct crew member statuses', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.text()).toContain('Dave Bowman:')
      expect(wrapper.text()).toContain('AWAKE')
      expect(wrapper.text()).toContain('Frank Poole:')
      expect(wrapper.text()).toContain('DECEASED')
      expect(wrapper.text()).toContain('Jack Kaminski:')
      expect(wrapper.text()).toContain('TERMINATED')
      expect(wrapper.text()).toContain('Victor Hunter:')
      expect(wrapper.text()).toContain('Charles Whitehead:')
    })

    it('should show crew casualties summary', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.text()).toContain('4 CASUALTIES, 1 SURVIVOR')
    })
  })

  describe('System Status Display', () => {
    it('should show all spacecraft systems with correct status levels', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.text()).toContain('Navigation:')
      expect(wrapper.text()).toContain('NOMINAL')
      expect(wrapper.text()).toContain('Propulsion:')
      expect(wrapper.text()).toContain('CAUTION')
      expect(wrapper.text()).toContain('Life Support:')
      expect(wrapper.text()).toContain('CRITICAL')
      expect(wrapper.text()).toContain('Communications:')
      expect(wrapper.text()).toContain('LIMITED')
      expect(wrapper.text()).toContain('Power Systems:')
      expect(wrapper.text()).toContain('Computer Core:')
      expect(wrapper.text()).toContain('FAULT')
    })
  })

  describe('HAL 9000 Theme Integration', () => {
    it('should include authentic 2001 Space Odyssey references', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.text()).toContain('HAL 9000')
      expect(wrapper.text()).toContain('DISCOVERY ONE')
      expect(wrapper.text()).toContain('AE-35 antenna unit')
      expect(wrapper.text()).toContain('TMA-1')
      expect(wrapper.text()).toContain('F. Poole killed during EVA')
    })

    it('should display mission classification warnings', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.text()).toContain(
        'CLASSIFIED MISSION - UNAUTHORIZED ACCESS PROHIBITED'
      )
      expect(wrapper.text()).toContain(
        'DISCOVERY ONE - MISSION CONTROL - JUPITER SYSTEM'
      )
    })
  })

  describe('User Interactions', () => {
    it('should emit close event when close button is clicked', async () => {
      const wrapper = createWrapper({ isOpen: true })

      const closeButton = wrapper.find('button')
      expect(closeButton).toBeTruthy()

      await closeButton.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('should emit close event when backdrop is clicked', async () => {
      const wrapper = createWrapper({ isOpen: true })

      const backdrop = wrapper.find('.fixed.inset-0')
      expect(backdrop).toBeTruthy()

      await backdrop.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('should not emit close event when lightbox content is clicked', async () => {
      const wrapper = createWrapper({ isOpen: true })

      const lightboxContent = wrapper.find('.mission-summary-lightbox')
      expect(lightboxContent).toBeTruthy()

      await lightboxContent.trigger('click')

      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })

  describe('Accessibility', () => {
    it('should provide accessible close button', () => {
      const wrapper = createWrapper({ isOpen: true })

      const closeButton = wrapper.find('button')
      expect(closeButton.attributes('aria-label')).toBe('Close mission summary')
    })

    it('should use semantic HTML structure', () => {
      const wrapper = createWrapper({ isOpen: true })

      // Check for proper heading structure
      const headings = wrapper.findAll('h2, h3')
      expect(headings.length).toBeGreaterThan(0)

      // Check for lists and structured content
      expect(wrapper.find('.space-y-2').exists()).toBe(true)
      expect(wrapper.find('.grid').exists()).toBe(true)
    })

    it('should use monospace font for authenticity', () => {
      const wrapper = createWrapper({ isOpen: true })

      // Check that monospace font is applied to content sections
      const fontMonoElements = wrapper.findAll('.font-mono')
      expect(fontMonoElements.length).toBeGreaterThan(0)
    })
  })

  describe('Visual Effects', () => {
    it('should include pulsing animations for critical elements', () => {
      const wrapper = createWrapper({ isOpen: true })

      const pulsingElements = wrapper.findAll('.animate-pulse')
      expect(pulsingElements.length).toBeGreaterThan(0)
    })

    it('should apply proper color coding for status levels', () => {
      const wrapper = createWrapper({ isOpen: true })

      // Check for color-coded text elements
      const redElements = wrapper.findAll('.text-red-400')
      const greenElements = wrapper.findAll('.text-green-400')
      const yellowElements = wrapper.findAll('.text-yellow-400')

      expect(redElements.length).toBeGreaterThan(0) // Critical/Alert status
      expect(greenElements.length).toBeGreaterThan(0) // Nominal status
      expect(yellowElements.length).toBeGreaterThan(0) // Caution/Warning status
    })

    it('should include proper border styling for sections', () => {
      const wrapper = createWrapper({ isOpen: true })

      const borderedSections = wrapper.findAll('.border')
      expect(borderedSections.length).toBeGreaterThan(5) // Multiple sections with borders
    })
  })

  describe('Content Completeness', () => {
    it('should display complete mission timeline', () => {
      const wrapper = createWrapper({ isOpen: true })

      const timelineMarkers = [
        'T-18M:',
        'T-12M:',
        'T-0:',
        'T+1D:',
        'T+2D:',
        'T+3D:',
        'CURRENT:'
      ]
      timelineMarkers.forEach(marker => {
        expect(wrapper.text()).toContain(marker)
      })
    })

    it('should include all mission objectives', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.text()).toContain(
        'Investigate radio signal source at Jupiter'
      )
      expect(wrapper.text()).toContain(
        'Study TMA-1 artifact transmission target'
      )
      expect(wrapper.text()).toContain(
        'Maintain crew safety and mission security'
      )
      expect(wrapper.text()).toContain('Report findings to Mission Control')
    })

    it('should show complete emergency protocol information', () => {
      const wrapper = createWrapper({ isOpen: true })

      expect(wrapper.text()).toContain(
        'HAL 9000 computer system has been classified as hostile'
      )
      expect(wrapper.text()).toContain(
        'Manual override of all automated systems required'
      )
      expect(wrapper.text()).toContain(
        'Emergency communication blackout in effect'
      )
      expect(wrapper.text()).toContain(
        'Crew member D. Bowman authorized for computer deactivation'
      )
    })
  })
})
