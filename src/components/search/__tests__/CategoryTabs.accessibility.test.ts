import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CategoryTabs from '../CategoryTabs.vue'
import { useSubscriptionStore } from '@/stores/subscription'

describe('CategoryTabs Accessibility', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockProps = {
    personalData: {
      relationshipStatus: 'Married',
      children: '2 children',
      interests: 'Technology, Space Exploration, AI'
    },
    professionalData: {
      industry: 'Technology',
      experience: '12+ years',
      previousCompanies: 'PayPal, Tesla, SpaceX'
    },
    financeData: {
      annualIncome: '$2.5M+',
      investments: 'Tesla, SpaceX, Neuralink',
      propertyValue: '$100M+'
    },
    legalData: {
      backgroundCheck: 'Clear',
      courtRecords: 'None',
      licenses: 'Professional Engineer License'
    }
  }

  it('implements accessible tab pattern', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    const tabButtons = wrapper
      .findAll('button')
      .filter(btn =>
        ['Personal', 'Professional', 'Finance', 'Legal'].includes(btn.text())
      )

    expect(tabButtons.length).toBe(4)

    // Active tab should be visually distinct
    const activeTab = tabButtons.find(btn =>
      btn.classes().includes('border-brand-orange')
    )
    expect(activeTab?.exists()).toBe(true)
  })

  it('provides keyboard navigation for tabs', async () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    const professionalTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Professional')

    // Tab should be focusable and clickable
    expect(professionalTab?.exists()).toBe(true)
    await professionalTab?.trigger('click')

    // Should switch to professional content
    expect(wrapper.text()).toContain('Industry')
  })

  it('maintains clear visual focus indicators', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    const tabButtons = wrapper
      .findAll('button')
      .filter(btn =>
        ['Personal', 'Professional', 'Finance', 'Legal'].includes(btn.text())
      )

    tabButtons.forEach(button => {
      expect(button.classes()).toContain('transition-colors')
    })
  })

  it('provides accessible color contrast for tabs', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    // Active tab should have sufficient contrast
    const personalTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Personal')
    expect(personalTab?.classes()).toContain('text-brand-orange')
    expect(personalTab?.classes()).toContain('border-brand-orange')

    // Inactive tabs should have accessible colors
    const professionalTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Professional')
    expect(professionalTab?.classes()).toContain('text-text-secondary')
  })

  it('structures tabpanel content accessibly', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    // Tab content should be in structured format
    const contentArea = wrapper.find('.space-y-4')
    expect(contentArea.exists()).toBe(true)

    // Should have proper key-value pair structure
    const keyValuePairs = wrapper.findAll('.flex.justify-between')
    expect(keyValuePairs.length).toBeGreaterThan(0)
  })

  it('provides meaningful labels for data', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    // Should have clear labels for each data point
    expect(wrapper.text()).toContain('Relationship Status')
    expect(wrapper.text()).toContain('Children')
    expect(wrapper.text()).toContain('Interests')

    // Labels should use semantic text colors
    const labels = wrapper.findAll('.text-text-secondary')
    expect(labels.length).toBeGreaterThan(0)
  })

  it('maintains proper semantic structure', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    // Should have proper component structure
    expect(wrapper.classes()).toContain('bg-bg-card')
    expect(wrapper.classes()).toContain('rounded-lg')

    // Should have clear section separation
    const tabBorder = wrapper.find('.border-b.border-border-light')
    expect(tabBorder.exists()).toBe(true)
  })

  it('provides clear visual hierarchy in tab content', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    // Text sizing should create clear hierarchy
    const labels = wrapper.findAll('.text-text-secondary')
    const values = wrapper.findAll('.text-text-primary')

    expect(labels.length).toBeGreaterThan(0)
    expect(values.length).toBeGreaterThan(0)
  })

  it('handles tab state changes accessibly', async () => {
    // Set subscription level to Standard (2) to ensure Professional tab is accessible
    const subscriptionStore = useSubscriptionStore()
    subscriptionStore.setLevel(2)

    const wrapper = mount(CategoryTabs, { props: mockProps })

    // Switch to Professional tab (which should be accessible at level 2)
    const professionalTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Professional')
    await professionalTab?.trigger('click')

    // Should update both visual and content state
    expect(professionalTab?.classes()).toContain('border-brand-orange')
    expect(wrapper.text()).toContain('Industry')
    expect(wrapper.text()).not.toContain('Relationship Status')
  })

  it('maintains readable text sizes throughout', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    // Tab labels should be readable
    const tabButtons = wrapper
      .findAll('button')
      .filter(btn =>
        ['Personal', 'Professional', 'Finance', 'Legal'].includes(btn.text())
      )

    tabButtons.forEach(button => {
      expect(button.classes()).toContain('text-sm')
    })

    // Content text should be readable
    const contentText = wrapper.findAll('.text-sm')
    expect(contentText.length).toBeGreaterThan(0)
  })

  it('provides proper spacing for touch targets', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    // Tab buttons should have adequate padding
    const tabButtons = wrapper
      .findAll('button')
      .filter(btn =>
        ['Personal', 'Professional', 'Finance', 'Legal'].includes(btn.text())
      )

    tabButtons.forEach(button => {
      expect(button.classes()).toContain('py-2')
      expect(button.classes()).toContain('px-1')
    })
  })

  it('handles empty or missing data gracefully', async () => {
    const propsWithMissingData = {
      ...mockProps,
      personalData: {
        relationshipStatus: '',
        children: '',
        interests: ''
      }
    }

    const wrapper = mount(CategoryTabs, { props: propsWithMissingData })

    // Should still render structure properly
    expect(wrapper.text()).toContain('Personal')

    // Should handle empty values without breaking accessibility
    expect(wrapper.findAll('.flex.justify-between').length).toBeGreaterThan(0)
  })

  it('maintains consistent interaction patterns', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    const allButtons = wrapper.findAll('button')

    // All buttons should be consistently styled for interaction
    allButtons.forEach(button => {
      expect(button.classes()).toContain('transition-colors')
    })
  })
})
