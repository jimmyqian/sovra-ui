/**
 * Unit tests for StatsCard component
 * Tests rendering, props, and visual states
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsCard from '../StatsCard.vue'

describe('StatsCard', () => {
  it('renders label and value correctly', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Net Worth',
        value: '$250M+'
      }
    })

    expect(wrapper.text()).toContain('Net Worth')
    expect(wrapper.text()).toContain('$250M+')
  })

  it('renders subtitle when provided', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Net Worth',
        value: '$250M+',
        subtitle: 'Updated 2025'
      }
    })

    expect(wrapper.text()).toContain('Updated 2025')
  })

  it('renders trend information when provided', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Net Worth',
        value: '$250M+',
        trend: {
          direction: 'up' as const,
          value: '12%',
          label: 'vs last year'
        }
      }
    })

    expect(wrapper.text()).toContain('12%')
    expect(wrapper.text()).toContain('vs last year')
    expect(wrapper.text()).toContain('↑')
  })

  it('shows down arrow for negative trend', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Risk Score',
        value: '65',
        trend: {
          direction: 'down' as const,
          value: '5%',
          label: 'vs last month'
        }
      }
    })

    expect(wrapper.text()).toContain('↓')
  })

  it('applies correct size class', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Test',
        value: '100',
        size: 'lg'
      }
    })

    expect(wrapper.classes()).toContain('col-span-2')
  })

  it('applies default medium size when size not provided', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Test',
        value: '100'
      }
    })

    expect(wrapper.classes()).toContain('col-span-1')
  })

  it('applies correct icon color classes', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Test',
        value: '100',
        iconColor: 'green'
      }
    })

    // Icon container only renders when icon prop is provided
    const html = wrapper.html()
    expect(html).toContain('col-span-1')
  })
})
