/**
 * Unit tests for SearchConversation component
 * Tests search query display, conversation interface, suggestions, and user interactions
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchConversation from '../SearchConversation.vue'
import LogoIcon from '@/components/icons/LogoIcon.vue'

describe('SearchConversation', () => {
  const mockSearchQuery = 'Find Johnson who works in software in California'

  describe('Basic Rendering', () => {
    it('renders container with correct structure', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const container = wrapper.find('div')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('px-8')
      expect(container.classes()).toContain('py-8')
    })

    it('renders user and system message sections', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const sections = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('flex') && div.classes().includes('gap-4')
        )

      // Should have user message section and system response section
      expect(sections.length).toBeGreaterThanOrEqual(2)
    })

    it('includes LogoIcon component', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const logoIcon = wrapper.findComponent(LogoIcon)
      expect(logoIcon.exists()).toBe(true)
    })
  })

  describe('Search Query Display', () => {
    it('displays the provided search query', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      expect(wrapper.text()).toContain(mockSearchQuery)
    })

    it('updates search query when prop changes', async () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      expect(wrapper.text()).toContain(mockSearchQuery)

      const newQuery = 'Find Smith who works in design in New York'
      await wrapper.setProps({ searchQuery: newQuery })

      expect(wrapper.text()).toContain(newQuery)
      expect(wrapper.text()).not.toContain(mockSearchQuery)
    })

    it('applies correct styling to search query', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const queryDiv = wrapper
        .findAll('div')
        .find(div => div.text() === mockSearchQuery)

      expect(queryDiv!.classes()).toContain('rounded-lg')
      expect(queryDiv!.classes()).toContain('font-medium')
    })
  })

  describe('User Avatar', () => {
    it('renders user avatar with correct styling', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const userAvatar = wrapper
        .findAll('div')
        .find(
          div =>
            div.classes().includes('w-9') &&
            div.classes().includes('h-9') &&
            div.classes().includes('border-black')
        )

      expect(userAvatar).toBeTruthy()
      const expectedClasses = [
        'w-9',
        'h-9',
        'border',
        'border-black',
        'rounded-full',
        'flex',
        'items-center',
        'justify-center',
        'flex-shrink-0',
        'ml-0.5'
      ]

      expectedClasses.forEach(className => {
        expect(userAvatar!.classes()).toContain(className)
      })
    })

    it('contains user icon SVG with correct attributes', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const userSvg = wrapper.find('svg')
      expect(userSvg.exists()).toBe(true)
      expect(userSvg.attributes('width')).toBe('26')
      expect(userSvg.attributes('height')).toBe('26')
      expect(userSvg.attributes('viewBox')).toBe('0 0 24 24')
      expect(userSvg.attributes('fill')).toBe('none')
    })

    it('renders user icon with correct path and circle elements', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const userSvg = wrapper.find('svg')
      const path = userSvg.find('path')
      const circle = userSvg.find('circle')

      expect(path.exists()).toBe(true)
      expect(circle.exists()).toBe(true)
      expect(circle.attributes('cx')).toBe('12')
      expect(circle.attributes('cy')).toBe('7')
      expect(circle.attributes('r')).toBe('4')
    })
  })

  describe('System Response', () => {
    it('renders LogoIcon with correct props', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const logoIcon = wrapper.findComponent(LogoIcon)
      expect(logoIcon.props('size')).toBe(36)
      expect(logoIcon.props('color')).toBe('var(--color-logo-gray)')
    })

    it('displays the main response message', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      expect(wrapper.text()).toContain('Fantastic!')
      expect(wrapper.text()).toContain('56 persons were found in the results')
      expect(wrapper.text()).toContain('Please provide additional information')
    })

    it('includes follow-up instructions', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      expect(wrapper.text()).toContain('you can use the hints below')
      expect(wrapper.text()).toContain('include further information')
      expect(wrapper.text()).toContain('documents you may have')
    })

    it('applies correct styling to response text', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const responseParagraphs = wrapper
        .findAll('p')
        .filter(p => p.classes().includes('text-text-secondary'))

      responseParagraphs.forEach(p => {
        expect(p.classes()).toContain('leading-relaxed')
        expect(p.classes()).toContain('text-text-secondary')
      })
    })
  })

  describe('Suggestion Hints', () => {
    it('renders all suggestion hints', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const expectedHints = [
        'What specific software role does Johnson hold',
        'Which California tech hubs are most likely',
        'What skills Johnson has from his current'
      ]

      expectedHints.forEach(hint => {
        expect(wrapper.text()).toContain(hint)
      })
    })

    it('applies correct styling to suggestion hints', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const hintParagraphs = wrapper
        .findAll('p')
        .filter(
          p =>
            p.classes().includes('text-brand-orange') &&
            p.classes().includes('cursor-pointer')
        )

      expect(hintParagraphs).toHaveLength(3)

      hintParagraphs.forEach(hint => {
        const expectedClasses = [
          'text-brand-orange',
          'pb-2',
          'cursor-pointer',
          'hover:text-brand-orange-light',
          'border-t',
          'border-dashed',
          'border-border-dashed',
          'pt-2'
        ]

        expectedClasses.forEach(className => {
          expect(hint.classes()).toContain(className)
        })
      })
    })

    it('applies bottom border to last suggestion', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const hintParagraphs = wrapper
        .findAll('p')
        .filter(
          p =>
            p.classes().includes('text-brand-orange') &&
            p.classes().includes('cursor-pointer')
        )

      const lastHint = hintParagraphs[hintParagraphs.length - 1]
      expect(lastHint.classes()).toContain('border-b')
    })

    it('provides interactive hover states for hints', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const hintParagraphs = wrapper
        .findAll('p')
        .filter(p => p.classes().includes('text-brand-orange'))

      hintParagraphs.forEach(hint => {
        expect(hint.classes()).toContain('cursor-pointer')
        expect(hint.classes()).toContain('hover:text-brand-orange-light')
      })
    })
  })

  describe('Action Button', () => {
    it('renders create filter button', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.text()).toContain(
        'create a filter using the details that you provided'
      )
    })

    it('applies correct styling to action button', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const button = wrapper.find('button')
      const expectedClasses = [
        'bg-bg-button',
        'border',
        'border-dashed',
        'border-border-dashed',
        'px-4',
        'py-2',
        'rounded-full',
        'text-sm',
        'cursor-pointer',
        'hover:bg-border-hover',
        'transition-colors',
        'text-brand-orange'
      ]

      expectedClasses.forEach(className => {
        expect(button.classes()).toContain(className)
      })
    })

    it('provides interactive hover state for button', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('cursor-pointer')
      expect(button.classes()).toContain('hover:bg-border-hover')
      expect(button.classes()).toContain('transition-colors')
    })
  })

  describe('Layout Structure', () => {
    it('maintains proper conversation layout', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      // User message section
      const userSection = wrapper
        .findAll('div')
        .find(
          div =>
            div.classes().includes('flex') &&
            div.classes().includes('gap-4') &&
            div.classes().includes('mb-8')
        )
      expect(userSection).toBeTruthy()

      // System response section
      const systemSection = wrapper
        .findAll('div')
        .find(div => div.classes().includes('flex-col'))
      expect(systemSection).toBeTruthy()
    })

    it('provides proper spacing between sections', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const userSection = wrapper
        .findAll('div')
        .find(div => div.classes().includes('mb-8'))
      expect(userSection).toBeTruthy()

      const suggestionSection = wrapper
        .findAll('div')
        .find(div => div.classes().includes('my-6'))
      expect(suggestionSection).toBeTruthy()
    })

    it('ensures proper avatar alignment', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const avatarContainers = wrapper
        .findAll('div')
        .filter(div => div.classes().includes('flex-shrink-0'))

      expect(avatarContainers.length).toBeGreaterThanOrEqual(2)

      avatarContainers.forEach(container => {
        expect(container.classes()).toContain('flex')
        expect(container.classes()).toContain('items-center')
        expect(container.classes()).toContain('justify-center')
      })
    })
  })

  describe('Content Structure', () => {
    it('organizes content in logical conversation flow', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const text = wrapper.text()

      // User query should appear before system response
      const queryIndex = text.indexOf(mockSearchQuery)
      const responseIndex = text.indexOf('Fantastic!')
      expect(queryIndex).toBeLessThan(responseIndex)

      // Hints should appear after main response
      const hintsIndex = text.indexOf('What specific software role')
      expect(responseIndex).toBeLessThan(hintsIndex)

      // Action button should appear last
      const buttonIndex = text.indexOf('create a filter')
      expect(hintsIndex).toBeLessThan(buttonIndex)
    })

    it('provides comprehensive search assistance', () => {
      const wrapper = mount(SearchConversation, {
        props: { searchQuery: mockSearchQuery },
        global: {
          components: { LogoIcon }
        }
      })

      const text = wrapper.text()

      // Contains result count
      expect(text).toContain('56 persons were found')

      // Provides guidance
      expect(text).toContain('provide additional information')

      // Offers specific suggestions
      expect(text).toContain('software role')
      expect(text).toContain('California tech hubs')
      expect(text).toContain('skills Johnson has')

      // Mentions alternative options
      expect(text).toContain('documents')
      expect(text).toContain('upload option')
    })
  })
})
