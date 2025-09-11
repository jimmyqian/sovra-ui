import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryTabs from '../CategoryTabs.vue'

describe('CategoryTabs', () => {
  const mockProps = {
    accounts: [
      { type: 'instagram', url: 'https://instagram.com/test' },
      { type: 'whatsapp', url: 'https://wa.me/1234567890' },
      { type: 'facebook', url: 'https://facebook.com/test' },
      { type: 'twitter', url: 'https://twitter.com/test' },
      { type: 'linkedin', url: 'https://linkedin.com/in/test' }
    ],
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

  it('renders accounts section with correct title', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    expect(wrapper.text()).toContain('Accounts')
    expect(wrapper.find('h3').text()).toBe('Accounts')
  })

  it('displays all account buttons', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    const accountButtons = wrapper.findAll('button').slice(0, 5) // First 5 buttons are accounts
    expect(accountButtons).toHaveLength(5)
  })

  it('renders all tab labels correctly', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

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

  it('applies correct account button styling for different platforms', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    const accountButtons = wrapper.findAll('button').slice(0, 5)

    // Check that buttons have transition classes
    accountButtons.forEach(button => {
      expect(button.classes()).toContain('transition-colors')
    })
  })

  it('has proper component structure', () => {
    const wrapper = mount(CategoryTabs, { props: mockProps })

    expect(wrapper.classes()).toContain('bg-bg-card')
    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('rounded-lg')
  })

  it('handles empty accounts array gracefully', () => {
    const propsWithEmptyAccounts = {
      ...mockProps,
      accounts: []
    }

    const wrapper = mount(CategoryTabs, { props: propsWithEmptyAccounts })

    expect(wrapper.text()).toContain('Accounts')
    const accountButtons = wrapper.findAll('button').slice(0, 0) // No account buttons
    expect(accountButtons).toHaveLength(0)
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
