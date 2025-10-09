/**
 * Unit tests for SummaryRecommendationsCard component
 * Tests rendering of summary, findings, and next steps
 * Note: Priority Recommendations section is hidden (v-if="false")
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

  it('does not render Priority Recommendations section (hidden)', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    // Priority Recommendations section is hidden
    expect(wrapper.text()).not.toContain('CRITICAL')
    expect(wrapper.text()).not.toContain('Reputation Management')
    expect(wrapper.text()).not.toContain('HIGH')
    expect(wrapper.text()).not.toContain('Security Review')
  })

  it('does not render recommendation actions (hidden)', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    // Recommendation actions are hidden with Priority Recommendations
    expect(wrapper.text()).not.toContain('Action 1')
    expect(wrapper.text()).not.toContain('Action 2')
    expect(wrapper.text()).not.toContain('Review logs')
    expect(wrapper.text()).not.toContain('Update policies')
  })

  it('renders Next Steps with concierge message', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Next Steps')
    expect(wrapper.text()).toContain(
      'Please reach out to the SOVRA concierge for assistance mitigating these identified risks.'
    )
    // Should not contain the old list items
    expect(wrapper.text()).not.toContain('Activate monitoring')
    expect(wrapper.text()).not.toContain('Deploy security measures')
    expect(wrapper.text()).not.toContain('Schedule review')
  })

  it('does not apply recommendation styling classes (hidden)', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    const html = wrapper.html()
    // Recommendation styling is hidden
    expect(html).not.toContain('border-red-500')
  })

  it('renders without subtitle when not provided', () => {
    const propsWithoutSubtitle = { ...mockProps, subtitle: undefined }
    const wrapper = mount(SummaryRecommendationsCard, {
      props: propsWithoutSubtitle
    })

    expect(wrapper.text()).toContain('Summary & Recommendations')
    expect(wrapper.text()).not.toContain('Comprehensive assessment')
  })

  it('does not render recommendation descriptions (hidden)', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    // Recommendation descriptions are hidden
    expect(wrapper.text()).not.toContain(
      'Address reputation issues immediately'
    )
    expect(wrapper.text()).not.toContain('Conduct security audit')
  })

  it('has proper structure with visible sections only', () => {
    const wrapper = mount(SummaryRecommendationsCard, {
      props: mockProps
    })

    const html = wrapper.html()
    expect(html).toContain('Executive Summary')
    expect(html).toContain('Key Findings')
    expect(html).toContain('Next Steps')
    // Priority Recommendations is in HTML but hidden with v-if="false"
  })
})
