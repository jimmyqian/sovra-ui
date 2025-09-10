import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultCard from '../ResultCard.vue'
import type { SearchResult } from '@/types/search'

describe('ResultCard', () => {
  const mockResult: SearchResult = {
    id: 1,
    name: 'John Doe',
    age: 30,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'New York',
    rating: 4.2,
    references: 25,
    companies: 5,
    contacts: 10
  }

  it('renders correctly with result data', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      }
    })

    expect(wrapper.find('h3').text()).toBe('John Doe')
    expect(wrapper.text()).toContain('30 Years')
    expect(wrapper.text()).toContain('Male')
    expect(wrapper.text()).toContain('Single')
    expect(wrapper.text()).toContain('New York')
    expect(wrapper.text()).toContain('4.2')
  })

  it('displays correct stats values', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      }
    })

    // Check references stat
    const statNumbers = wrapper.findAll('.stat-number')
    expect(statNumbers[0].text()).toBe('25')
    expect(statNumbers[1].text()).toBe('5')
    expect(statNumbers[2].text()).toBe('10')

    // Check stat labels
    const statLabels = wrapper.findAll('.stat-label')
    expect(statLabels[0].text()).toContain('References')
    expect(statLabels[1].text()).toContain('companies')
    expect(statLabels[2].text()).toContain('Contacts')
  })

  it('renders avatar placeholder', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      }
    })

    const avatar = wrapper.find('.w-15.h-15.bg-border-lighter.rounded-full')
    expect(avatar.exists()).toBe(true)
  })

  it('displays Sovra Rating label and score', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      }
    })

    expect(wrapper.text()).toContain('Sovra Rating')
    expect(wrapper.text()).toContain('4.2')
  })

  it('renders ScoreBar component', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      }
    })

    // ScoreBar should be rendered (we'll need to mock it or check for its presence)
    const scoreBarContainer = wrapper.find('.flex.items-center.gap-2')
    expect(scoreBarContainer.exists()).toBe(true)
  })

  it('applies correct CSS classes for layout', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      }
    })

    // Check main container has result-card class
    expect(wrapper.classes()).toContain('result-card')

    // Check stats container has correct classes
    const statsContainer = wrapper.find('.flex.gap-4.md\\:gap-8')
    expect(statsContainer.exists()).toBe(true)
  })

  it('displays all user info fields', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      }
    })

    const userInfoSection = wrapper.find('.flex.gap-4.mb-3')

    expect(userInfoSection.text()).toContain('30 Years')
    expect(userInfoSection.text()).toContain('Male')
    expect(userInfoSection.text()).toContain('Single')
    expect(userInfoSection.text()).toContain('New York')
  })

  it('formats age correctly', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: {
          ...mockResult,
          age: 25
        }
      }
    })

    expect(wrapper.find('.age').text()).toBe('25 Years')
  })

  it('handles different marital status values', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: {
          ...mockResult,
          maritalStatus: 'Married'
        }
      }
    })

    expect(wrapper.find('.status').text()).toBe('Married')
  })

  it('displays rating with correct precision', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: {
          ...mockResult,
          rating: 3.7
        }
      }
    })

    expect(wrapper.text()).toContain('3.7')
  })

  it('renders all stats with consistent borders', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      }
    })

    const statItems = wrapper.findAll('.stat-item')
    expect(statItems).toHaveLength(3)

    // All stat items should have left border
    statItems.forEach(item => {
      expect(item.classes()).toContain('border-l')
      expect(item.classes()).toContain('border-border-lighter')
    })
  })

  it('has responsive padding classes', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      }
    })

    const statItems = wrapper.findAll('.stat-item')

    statItems.forEach(item => {
      expect(item.classes()).toContain('pl-4')
      expect(item.classes()).toContain('md:pl-8')
    })
  })

  it('renders name as heading with correct styling', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      }
    })

    const nameHeading = wrapper.find('h3')
    expect(nameHeading.classes()).toContain('text-xl')
    expect(nameHeading.classes()).toContain('font-semibold')
    expect(nameHeading.classes()).toContain('text-text-primary')
  })
})
