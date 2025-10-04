/**
 * Unit tests for SummaryRecommendationsCard component
 * Tests rendering of summary, findings, recommendations, and next steps
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SummaryRecommendationsCard from '../SummaryRecommendationsCard.vue'
import {
  FireIcon,
  AcademicCapIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/solid'

describe('SummaryRecommendationsCard', () => {
  const mockProps = {
    title: 'Summary & Recommendations',
    subtitle: 'Comprehensive assessment',
    summary: 'This is a test summary of the key findings and recommendations.',
    keyFindings: [
      {
        category: 'Reputation',
        text: 'High risk area',
        icon: FireIcon,
        colorClass: 'bg-red-50'
      },
      {
        category: 'Education',
        text: 'Strong background',
        icon: AcademicCapIcon,
        colorClass: 'bg-blue-50'
      }
    ],
    recommendations: [
      {
        priority: 'CRITICAL',
        title: 'Reputation Management',
        description: 'Address reputation issues immediately',
        actions: ['Action 1', 'Action 2'],
        icon: FireIcon,
        priorityClass: 'bg-red-600 text-white',
        borderClass: 'border-red-500',
        bgClass: 'bg-red-50',
        iconBgClass: 'bg-red-600'
      },
      {
        priority: 'HIGH',
        title: 'Security Review',
        description: 'Conduct security audit',
        actions: ['Review logs', 'Update policies'],
        icon: ShieldCheckIcon,
        priorityClass: 'bg-orange-600 text-white',
        borderClass: 'border-orange-500',
        bgClass: 'bg-orange-50',
        iconBgClass: 'bg-orange-600'
      }
    ],
    nextSteps: [
      'Activate monitoring',
      'Deploy security measures',
      'Schedule review'
    ]
  }

  it('renders title and subtitle correctly', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Summary & Recommendations')
    expect(wrapper.text()).toContain('Comprehensive assessment')
  })

  it('renders executive summary section', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Executive Summary')
    expect(wrapper.text()).toContain(mockProps.summary)
  })

  it('renders all key findings', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Key Findings')
    expect(wrapper.text()).toContain('Reputation')
    expect(wrapper.text()).toContain('High risk area')
    expect(wrapper.text()).toContain('Education')
    expect(wrapper.text()).toContain('Strong background')
  })

  it('renders all recommendations with priorities', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Priority Recommendations')
    expect(wrapper.text()).toContain('CRITICAL')
    expect(wrapper.text()).toContain('Reputation Management')
    expect(wrapper.text()).toContain('HIGH')
    expect(wrapper.text()).toContain('Security Review')
  })

  it('renders recommendation actions', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Action 1')
    expect(wrapper.text()).toContain('Action 2')
    expect(wrapper.text()).toContain('Review logs')
    expect(wrapper.text()).toContain('Update policies')
  })

  it('renders all next steps', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Next Steps')
    expect(wrapper.text()).toContain('Activate monitoring')
    expect(wrapper.text()).toContain('Deploy security measures')
    expect(wrapper.text()).toContain('Schedule review')
  })

  it('applies correct styling classes for critical priority', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    const html = wrapper.html()
    expect(html).toContain('border-red-500')
    expect(html).toContain('bg-red-50')
  })

  it('renders without subtitle when not provided', () => {
    const propsWithoutSubtitle = { ...mockProps, subtitle: undefined }
    const wrapper = mount(SummaryRecommendationsCard, {
      props: propsWithoutSubtitle
    })

    expect(wrapper.text()).toContain('Summary & Recommendations')
    expect(wrapper.text()).not.toContain('Comprehensive assessment')
  })

  it('renders recommendation descriptions', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Address reputation issues immediately')
    expect(wrapper.text()).toContain('Conduct security audit')
  })

  it('has proper structure with all main sections', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    const html = wrapper.html()
    expect(html).toContain('Executive Summary')
    expect(html).toContain('Key Findings')
    expect(html).toContain('Priority Recommendations')
    expect(html).toContain('Next Steps')
  })
})
