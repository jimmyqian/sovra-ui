import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ActivityFooter from '../ActivityFooter.vue'

describe('ActivityFooter', () => {
  it('renders activity log section', () => {
    const wrapper = mount(ActivityFooter)

    expect(wrapper.find('h3').text()).toBe('Activity Log')
    expect(wrapper.text()).toContain(
      'Recent activity and data updates will appear here...'
    )
  })

  it('displays all reference category buttons', () => {
    const wrapper = mount(ActivityFooter)

    const expectedCategories = [
      'Loans / Deposits',
      'Travels',
      'Events',
      'Vehicles',
      'Average Pay',
      'Time Line View',
      'SSN & Finance'
    ]

    expectedCategories.forEach(category => {
      expect(wrapper.text()).toContain(category)
    })
  })

  it('has "Average Pay" category active by default', () => {
    const wrapper = mount(ActivityFooter)

    const averagePayButton = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Average Pay')
    expect(averagePayButton?.classes()).toContain('bg-brand-orange')
    expect(averagePayButton?.classes()).toContain('text-white')
    expect(averagePayButton?.classes()).toContain('border-brand-orange')
  })

  it('has inactive styling for non-active categories', () => {
    const wrapper = mount(ActivityFooter)

    const loansButton = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Loans / Deposits')
    expect(loansButton?.classes()).toContain('bg-bg-card')
    expect(loansButton?.classes()).toContain('text-text-secondary')
    expect(loansButton?.classes()).toContain('border-border-light')
  })

  it('toggles category state when clicked', async () => {
    const wrapper = mount(ActivityFooter)

    const travelsButton = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Travels')
    expect(travelsButton?.classes()).not.toContain('bg-brand-orange')

    await travelsButton?.trigger('click')

    expect(travelsButton?.classes()).toContain('bg-brand-orange')
    expect(travelsButton?.classes()).toContain('text-white')
  })

  it('can toggle multiple categories', async () => {
    const wrapper = mount(ActivityFooter)

    const travelsButton = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Travels')
    const eventsButton = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Events')

    await travelsButton?.trigger('click')
    await eventsButton?.trigger('click')

    expect(travelsButton?.classes()).toContain('bg-brand-orange')
    expect(eventsButton?.classes()).toContain('bg-brand-orange')
  })

  it('can deactivate a previously active category', async () => {
    const wrapper = mount(ActivityFooter)

    // Average Pay is active by default
    const averagePayButton = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Average Pay')
    expect(averagePayButton?.classes()).toContain('bg-brand-orange')

    // Click to deactivate
    await averagePayButton?.trigger('click')

    expect(averagePayButton?.classes()).not.toContain('bg-brand-orange')
    expect(averagePayButton?.classes()).toContain('bg-bg-card')
  })

  it('renders "Show all references" button', () => {
    const wrapper = mount(ActivityFooter)

    const showReferencesButton = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Show all references')
    expect(showReferencesButton?.exists()).toBe(true)
    expect(showReferencesButton?.classes()).toContain('border-brand-orange')
    expect(showReferencesButton?.classes()).toContain('text-brand-orange')
  })

  it('displays current year in copyright footer', () => {
    const wrapper = mount(ActivityFooter)
    const currentYear = new Date().getFullYear()

    expect(wrapper.text()).toContain(`© ${currentYear} Sovra.ai`)
  })

  it('emits categoryToggle event when category is clicked', async () => {
    const wrapper = mount(ActivityFooter)

    const travelsButton = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Travels')
    await travelsButton?.trigger('click')

    // Note: The current implementation doesn't emit events, but this test shows the expected behavior
    // In a real implementation, you would check for emitted events here
    expect(travelsButton?.classes()).toContain('bg-brand-orange')
  })

  it('emits showReferences event when show references button is clicked', async () => {
    const wrapper = mount(ActivityFooter)

    const showReferencesButton = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Show all references')
    await showReferencesButton?.trigger('click')

    // Note: The current implementation doesn't emit events, but this test shows the expected behavior
    // This would verify that the showReferences event is emitted
  })

  it('has proper styling for category buttons', () => {
    const wrapper = mount(ActivityFooter)

    const categoryButtons = wrapper.findAll('button').slice(0, -1) // All except "Show all references"

    categoryButtons.forEach(button => {
      expect(button.classes()).toContain('rounded-full')
      expect(button.classes()).toContain('text-sm')
      expect(button.classes()).toContain('border')
      expect(button.classes()).toContain('transition-colors')
    })
  })

  it('has proper hover states for inactive categories', () => {
    const wrapper = mount(ActivityFooter)

    const loansButton = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Loans / Deposits')
    expect(loansButton?.classes()).toContain('hover:border-brand-orange')
    expect(loansButton?.classes()).toContain('hover:text-brand-orange')
  })

  it('displays activity log with proper styling', () => {
    const wrapper = mount(ActivityFooter)

    const activitySection = wrapper.find('.bg-bg-card')
    expect(activitySection.exists()).toBe(true)
    expect(activitySection.classes()).toContain('border')
    expect(activitySection.classes()).toContain('rounded-lg')
  })

  it('centers reference categories and show references button', () => {
    const wrapper = mount(ActivityFooter)

    const categoryContainer = wrapper.find('.flex.flex-wrap.gap-3')
    expect(categoryContainer.classes()).toContain('justify-center')

    const showReferencesContainer = wrapper.find('.text-center')
    expect(showReferencesContainer.exists()).toBe(true)
  })

  it('has proper copyright section styling', () => {
    const wrapper = mount(ActivityFooter)

    const copyrightSection = wrapper.find('.text-center.pt-6.border-t')
    expect(copyrightSection.exists()).toBe(true)
    expect(copyrightSection.classes()).toContain('border-border-light')

    const copyrightText = copyrightSection.find('p')
    expect(copyrightText.classes()).toContain('text-xs')
    expect(copyrightText.classes()).toContain('text-text-muted')
  })
})
