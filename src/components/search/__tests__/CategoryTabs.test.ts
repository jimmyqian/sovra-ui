import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CategoryTabs from '../CategoryTabs.vue'
import { useSubscriptionStore } from '@/stores/subscription'

describe('CategoryTabs', () => {
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

  const createWrapper = (subscriptionLevel = 3) => {
    const subscriptionStore = useSubscriptionStore()
    subscriptionStore.setLevel(subscriptionLevel as any)
    return mount(CategoryTabs, { props: mockProps })
  }

  it('renders all tab labels correctly', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Personal')
    expect(wrapper.text()).toContain('Professional')
    expect(wrapper.text()).toContain('Finance')
    expect(wrapper.text()).toContain('Legal')
  })

  it('displays personal tab content by default', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    expect(wrapper.text()).toContain('Relationship Status')
    expect(wrapper.text()).toContain('Married')
    expect(wrapper.text()).toContain('Children')
    expect(wrapper.text()).toContain('2 children')
    expect(wrapper.text()).toContain('Interests')
    expect(wrapper.text()).toContain('Technology, Space Exploration, AI')
  })

  it('switches to professional tab when clicked', async () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    const professionalTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Professional')
    await professionalTab?.trigger('click')

    expect(wrapper.text()).toContain('Industry')
    expect(wrapper.text()).toContain('Technology')
    expect(wrapper.text()).toContain('Years Experience')
    expect(wrapper.text()).toContain('12+ years')
    expect(wrapper.text()).toContain('Previous Companies')
    expect(wrapper.text()).toContain('PayPal, Tesla, SpaceX')
  })

  it('switches to finance tab when clicked', async () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    const financeTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Finance')
    await financeTab?.trigger('click')

    expect(wrapper.text()).toContain('Annual Income')
    expect(wrapper.text()).toContain('$2.5M+')
    expect(wrapper.text()).toContain('Investment Portfolio')
    expect(wrapper.text()).toContain('Tesla, SpaceX, Neuralink')
    expect(wrapper.text()).toContain('Property Value')
    expect(wrapper.text()).toContain('$100M+')
  })

  it('switches to legal tab when clicked', async () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    const legalTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Legal')
    await legalTab?.trigger('click')

    expect(wrapper.text()).toContain('Background Check')
    expect(wrapper.text()).toContain('Clear')
    expect(wrapper.text()).toContain('Court Records')
    expect(wrapper.text()).toContain('None')
    expect(wrapper.text()).toContain('Licenses')
    expect(wrapper.text()).toContain('Professional Engineer License')
  })

  it('highlights active tab correctly', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    const personalTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Personal')
    expect(personalTab?.classes()).toContain('border-brand-orange')
    expect(personalTab?.classes()).toContain('text-brand-orange')
  })

  it('applies correct styling to inactive tabs', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    const professionalTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Professional')
    expect(professionalTab?.classes()).toContain('border-transparent')
    expect(professionalTab?.classes()).toContain('text-text-secondary')
  })

  it('has proper component structure', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    expect(wrapper.classes()).toContain('bg-bg-card')
    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('rounded-lg')
  })

  it('displays legal background check with proper styling', async () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    const legalTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Legal')
    await legalTab?.trigger('click')

    const backgroundCheckValue = wrapper.find('.text-green-600')
    expect(backgroundCheckValue?.text()).toBe('Clear')
  })

  it('maintains proper tab state when switching between tabs', async () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    // Switch to Professional
    const professionalTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Professional')
    await professionalTab?.trigger('click')
    expect(wrapper.text()).toContain('Industry')

    // Switch back to Personal
    const personalTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Personal')
    await personalTab?.trigger('click')
    expect(wrapper.text()).toContain('Relationship Status')
    expect(wrapper.text()).not.toContain('Industry')
  })

  it('renders section headers in tab content', async () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    // Check Personal tab headers
    expect(wrapper.text()).toContain('Relationship Status')
    expect(wrapper.text()).toContain('Children')
    expect(wrapper.text()).toContain('Interests')

    // Switch to Professional tab
    const professionalTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Professional')
    await professionalTab?.trigger('click')

    expect(wrapper.text()).toContain('Industry')
    expect(wrapper.text()).toContain('Years Experience')
    expect(wrapper.text()).toContain('Previous Companies')
  })
})
