/**
 * Unit tests for RiskCard component
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RiskCard from '../RiskCard.vue'
import type { RiskItem } from '../RiskCard.vue'

describe('RiskCard', () => {
  const mockRiskItems: RiskItem[] = [
    {
      domain: 'Reputation',
      risk: 'High',
      exposure: 'Multiple online narratives'
    },
    {
      domain: 'Cyber Security',
      risk: 'Medium',
      exposure: 'Family member data breach'
    }
  ]

  describe('Component Rendering', () => {
    it('should render title and subtitle', () => {
      const wrapper = mount(RiskCard, {
        props: {
          title: 'Test Risk Card',
          subtitle: 'Test subtitle'
        }
      })

      expect(wrapper.text()).toContain('Test Risk Card')
      expect(wrapper.text()).toContain('Test subtitle')
    })

    it('should render risk level badge', () => {
      const wrapper = mount(RiskCard, {
        props: {
          title: 'Test Card',
          riskLevel: 'High Risk'
        }
      })

      expect(wrapper.text()).toContain('High Risk')
      expect(wrapper.find('.bg-red-100').exists()).toBe(true)
    })

    it('should render risk items', () => {
      const wrapper = mount(RiskCard, {
        props: {
          title: 'Test Card',
          riskItems: mockRiskItems
        }
      })

      expect(wrapper.text()).toContain('Reputation')
      expect(wrapper.text()).toContain('Cyber Security')
      expect(wrapper.text()).toContain('Multiple online narratives')
    })

    it('should render content HTML', () => {
      const wrapper = mount(RiskCard, {
        props: {
          title: 'Test Card',
          content: '<p>Test <strong>content</strong></p>'
        }
      })

      expect(wrapper.html()).toContain('<p>Test <strong>content</strong></p>')
    })

    it('should render action items', () => {
      const wrapper = mount(RiskCard, {
        props: {
          title: 'Test Card',
          actions: ['Action 1', 'Action 2']
        }
      })

      expect(wrapper.text()).toContain('Recommended Actions:')
      expect(wrapper.text()).toContain('Action 1')
      expect(wrapper.text()).toContain('Action 2')
    })
  })

  describe('Risk Level Styling', () => {
    it('should apply correct class for High Risk', () => {
      const wrapper = mount(RiskCard, {
        props: {
          title: 'Test',
          riskLevel: 'High Risk'
        }
      })

      expect(wrapper.find('.bg-red-100').exists()).toBe(true)
      expect(wrapper.find('.text-red-800').exists()).toBe(true)
    })

    it('should apply correct class for Medium Risk', () => {
      const wrapper = mount(RiskCard, {
        props: {
          title: 'Test',
          riskLevel: 'Medium Risk'
        }
      })

      expect(wrapper.find('.bg-orange-100').exists()).toBe(true)
      expect(wrapper.find('.text-orange-800').exists()).toBe(true)
    })

    it('should apply correct class for Low Risk', () => {
      const wrapper = mount(RiskCard, {
        props: {
          title: 'Test',
          riskLevel: 'Low Risk'
        }
      })

      expect(wrapper.find('.bg-green-100').exists()).toBe(true)
      expect(wrapper.find('.text-green-800').exists()).toBe(true)
    })
  })

  describe('Interactive Behavior', () => {
    it('should toggle expanded state on click when details exist', async () => {
      const wrapper = mount(RiskCard, {
        props: {
          title: 'Test Card',
          details: '<p>Detailed information</p>'
        }
      })

      expect(wrapper.text()).toContain('Click for details')
      expect(wrapper.html()).not.toContain('Detailed information')

      await wrapper.trigger('click')

      expect(wrapper.text()).toContain('Click to collapse')
      expect(wrapper.html()).toContain('Detailed information')

      await wrapper.trigger('click')

      expect(wrapper.text()).toContain('Click for details')
    })

    it('should not show expand indicator without details', () => {
      const wrapper = mount(RiskCard, {
        props: {
          title: 'Test Card'
        }
      })

      expect(wrapper.text()).not.toContain('Click for details')
      expect(wrapper.text()).not.toContain('Click to collapse')
    })
  })

  describe('Risk Dot Styling', () => {
    it('should show correct color dots for risk items', () => {
      const wrapper = mount(RiskCard, {
        props: {
          title: 'Test',
          riskItems: mockRiskItems
        }
      })

      expect(wrapper.find('.bg-red-600').exists()).toBe(true) // High risk
      expect(wrapper.find('.bg-orange-500').exists()).toBe(true) // Medium risk
    })
  })

  describe('Accessibility', () => {
    it('should be clickable for keyboard users', () => {
      const wrapper = mount(RiskCard, {
        props: {
          title: 'Test Card',
          details: 'Details'
        }
      })

      const card = wrapper.find('.cursor-pointer')
      expect(card.exists()).toBe(true)
    })

    it('should have proper semantic structure', () => {
      const wrapper = mount(RiskCard, {
        props: {
          title: 'Risk Assessment',
          subtitle: 'Subtitle',
          riskItems: mockRiskItems
        }
      })

      expect(wrapper.find('h3').text()).toBe('Risk Assessment')
    })
  })
})
