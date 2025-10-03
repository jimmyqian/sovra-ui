/**
 * Unit tests for RiskGauge component
 * Tests rendering, risk levels, and gauge visualization
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RiskGauge from '../RiskGauge.vue'

describe('RiskGauge', () => {
  it('renders title and risk level correctly', () => {
    const wrapper = mount(RiskGauge, {
      props: {
        title: 'Overall Risk',
        riskLevel: 'High',
        percentage: 80
      }
    })

    expect(wrapper.text()).toContain('Overall Risk')
    expect(wrapper.text()).toContain('High')
  })

  it('renders subtitle when provided', () => {
    const wrapper = mount(RiskGauge, {
      props: {
        title: 'Overall Risk',
        riskLevel: 'Medium',
        percentage: 50,
        subtitle: 'Risk Score'
      }
    })

    expect(wrapper.text()).toContain('Risk Score')
  })

  it('renders risk items when provided', () => {
    const wrapper = mount(RiskGauge, {
      props: {
        title: 'Overall Risk',
        riskLevel: 'Medium',
        percentage: 50,
        items: [
          { label: 'Reputation', risk: 'High' as const },
          { label: 'Cyber Security', risk: 'Medium' as const },
          { label: 'Physical', risk: 'Low' as const }
        ]
      }
    })

    expect(wrapper.text()).toContain('Reputation')
    expect(wrapper.text()).toContain('Cyber Security')
    expect(wrapper.text()).toContain('Physical')
  })

  it('applies correct color for High risk level', () => {
    const wrapper = mount(RiskGauge, {
      props: {
        title: 'Test',
        riskLevel: 'High',
        percentage: 80
      }
    })

    const riskText = wrapper.find('.text-red-600')
    expect(riskText.exists()).toBe(true)
  })

  it('applies correct color for Medium risk level', () => {
    const wrapper = mount(RiskGauge, {
      props: {
        title: 'Test',
        riskLevel: 'Medium',
        percentage: 50
      }
    })

    const riskText = wrapper.find('.text-orange-600')
    expect(riskText.exists()).toBe(true)
  })

  it('applies correct color for Low risk level', () => {
    const wrapper = mount(RiskGauge, {
      props: {
        title: 'Test',
        riskLevel: 'Low',
        percentage: 20
      }
    })

    const riskText = wrapper.find('.text-green-600')
    expect(riskText.exists()).toBe(true)
  })

  it('renders SVG gauge visualization', () => {
    const wrapper = mount(RiskGauge, {
      props: {
        title: 'Test',
        riskLevel: 'Medium',
        percentage: 50
      }
    })

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    const paths = wrapper.findAll('path')
    expect(paths.length).toBeGreaterThanOrEqual(2) // Background and colored arc
  })
})
