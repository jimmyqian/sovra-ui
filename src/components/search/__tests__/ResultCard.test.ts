import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ResultCard from '../ResultCard.vue'
import type { SearchResult } from '@/types/search'

describe('ResultCard', () => {
  const mockResult: SearchResult = {
    id: 'test-uuid-1',
    name: 'John Doe',
    age: 30,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'New York',
    rating: 4.2,
    references: 25,
    companies: 5,
    contacts: 10,
    image: 'https://picsum.photos/240/240?random=test123'
  }

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      {
        path: '/search-detail/:id',
        name: 'SearchDetail',
        component: { template: '<div>Detail</div>' }
      }
    ]
  })

  it('renders correctly with result data', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      },
      global: {
        plugins: [router]
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
      },
      global: {
        plugins: [router]
      }
    })

    // Check references stat
    const statNumbers = wrapper.findAll('.stat-number')
    expect(statNumbers[0]!.text()).toBe('25')
    expect(statNumbers[1]!.text()).toBe('5')
    expect(statNumbers[2]!.text()).toBe('10')

    // Check stat labels
    const statLabels = wrapper.findAll('.stat-label')
    expect(statLabels[0]!.text()).toContain('References')
    expect(statLabels[1]!.text()).toContain('companies')
    expect(statLabels[2]!.text()).toContain('Contacts')
  })

  it('renders avatar image with correct styling', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      },
      global: {
        plugins: [router]
      }
    })

    const avatarContainer = wrapper.find(
      '.w-16.h-16.rounded-full.overflow-hidden'
    )
    expect(avatarContainer.exists()).toBe(true)

    const avatarImage = wrapper.find('img')
    expect(avatarImage.exists()).toBe(true)
    expect(avatarImage.attributes('alt')).toBe('Profile')
    expect(avatarImage.classes()).toContain('w-full')
    expect(avatarImage.classes()).toContain('h-full')
    expect(avatarImage.classes()).toContain('object-cover')
  })

  it('displays image from result data', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      },
      global: {
        plugins: [router]
      }
    })

    const avatarImage = wrapper.find('img')
    expect(avatarImage.attributes('src')).toBe(mockResult.image)
    expect(avatarImage.attributes('src')).toContain('test123')
  })

  it('falls back to default image when result has no image', () => {
    const resultWithoutImage = { ...mockResult }
    delete resultWithoutImage.image

    const wrapper = mount(ResultCard, {
      props: {
        result: resultWithoutImage
      },
      global: {
        plugins: [router]
      }
    })

    const avatarImage = wrapper.find('img')
    expect(avatarImage.attributes('src')).toBe(
      'https://picsum.photos/240/240?random=1'
    )
  })

  it('displays Sovra Rating label and score', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Sovra Rating')
    expect(wrapper.text()).toContain('4.2')
  })

  it('renders ScoreBar component', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      },
      global: {
        plugins: [router]
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
      },
      global: {
        plugins: [router]
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
      },
      global: {
        plugins: [router]
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
      },
      global: {
        plugins: [router]
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
      },
      global: {
        plugins: [router]
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
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('3.7')
  })

  it('renders all stats with consistent borders', () => {
    const wrapper = mount(ResultCard, {
      props: {
        result: mockResult
      },
      global: {
        plugins: [router]
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
      },
      global: {
        plugins: [router]
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
      },
      global: {
        plugins: [router]
      }
    })

    const nameHeading = wrapper.find('h3')
    expect(nameHeading.classes()).toContain('text-xl')
    expect(nameHeading.classes()).toContain('font-bold')
    expect(nameHeading.classes()).toContain('text-text-primary')
  })
})
