/**
 * Unit tests for SearchConversation component with new component system
 * Tests conversation item rendering, dynamic components, and user interactions
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchConversation from '../SearchConversation.vue'
import LogoIcon from '@/components/icons/LogoIcon.vue'
import type { ConversationMessage } from '@/types/conversation'

describe('SearchConversation (New Component System)', () => {
  const mockUserQuery = 'Find Johnson who works in software in California'

  const createTestMessages = (): ConversationMessage[] => [
    {
      id: 'system-response-1',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'results-summary',
          type: 'results-summary',
          resultCount: 42
        },
        {
          id: 'text-1',
          type: 'text',
          content:
            "Please provide additional information about the person you're looking for.",
          emphasis: 'secondary'
        },
        {
          id: 'hints-group-1',
          type: 'hints-group',
          hints: [
            {
              text: 'What specific software role does Johnson hold in his California job',
              onClick: vi.fn()
            },
            {
              text: 'Which California tech hubs are most likely where Johnson works',
              onClick: vi.fn()
            }
          ]
        },
        {
          id: 'refinement-age',
          type: 'refinement',
          label: 'Age range filter',
          inputType: 'age-range',
          value: { min: '', max: '' },
          onChange: vi.fn()
        },
        {
          id: 'action-button-1',
          type: 'action-button',
          text: 'create a filter using the details that you provided',
          variant: 'dashed',
          onClick: vi.fn()
        }
      ]
    }
  ]

  const createWrapper = (
    userQuery = mockUserQuery,
    messages = createTestMessages()
  ) => {
    // Add user message at the beginning if userQuery is provided
    const allMessages = userQuery
      ? [
          {
            id: 'user-message-new',
            sender: 'user' as const,
            timestamp: new Date(),
            content: userQuery
          },
          ...messages
        ]
      : messages

    return mount(SearchConversation, {
      props: {
        messages: allMessages
      },
      global: {
        components: { LogoIcon }
      }
    })
  }

  describe('Basic Rendering', () => {
    it('renders container with correct structure', () => {
      const wrapper = createWrapper()

      const container = wrapper.find('div')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('px-8')
      expect(container.classes()).toContain('py-8')
    })

    it('includes LogoIcon component', () => {
      const wrapper = createWrapper()

      const logoIcon = wrapper.findComponent(LogoIcon)
      expect(logoIcon.exists()).toBe(true)
      expect(logoIcon.props('size')).toBe(36)
      expect(logoIcon.props('color')).toBe('var(--color-logo-gray)')
      expect(logoIcon.classes()).not.toContain('thinking-pulse')
    })
  })

  describe('User Query Display', () => {
    it('displays user query when provided', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain(mockUserQuery)
    })

    it('does not display user section when query is empty', () => {
      const wrapper = createWrapper('')

      const userSections = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('w-9') &&
            div.classes().includes('h-9') &&
            div.classes().includes('border-black')
        )
      expect(userSections).toHaveLength(0)
    })

    it('renders user avatar with correct styling', () => {
      const wrapper = createWrapper()

      const userAvatar = wrapper.find(
        '.w-9.h-9.border.border-black.rounded-search'
      )
      expect(userAvatar.exists()).toBe(true)

      const expectedClasses = [
        'w-9',
        'h-9',
        'border',
        'border-black',
        'rounded-search',
        'flex',
        'items-center',
        'justify-center',
        'flex-shrink-0',
        'ml-0.5'
      ]
      expectedClasses.forEach(className => {
        expect(userAvatar.classes()).toContain(className)
      })
    })
  })

  describe('Conversation Items Rendering', () => {
    it('renders all conversation item types', () => {
      const wrapper = createWrapper()

      // Check for ResultsSummary
      expect(wrapper.text()).toContain('42 persons were found')

      // Check for TextParagraph
      expect(wrapper.text()).toContain('Please provide additional information')

      // Check for SearchHintsGroup
      expect(wrapper.text()).toContain('What specific software role')
      expect(wrapper.text()).toContain('Which California tech hubs')

      // Check for SearchRefinement (age range)
      expect(wrapper.text()).toContain('Age range filter')

      // Check for ActionButton
      expect(wrapper.text()).toContain('create a filter using the details')
    })

    it('renders conversation items in correct order', () => {
      const wrapper = createWrapper()
      const fullText = wrapper.text()

      const summaryIndex = fullText.indexOf('42 persons were found')
      const textIndex = fullText.indexOf(
        'Please provide additional information'
      )
      const hintsIndex = fullText.indexOf('What specific software role')
      const buttonIndex = fullText.indexOf('create a filter using the details')

      expect(summaryIndex).toBeLessThan(textIndex)
      expect(textIndex).toBeLessThan(hintsIndex)
      expect(hintsIndex).toBeLessThan(buttonIndex)
    })

    it('handles empty messages array', () => {
      const wrapper = createWrapper(mockUserQuery, [])

      // Should still render user query
      expect(wrapper.text()).toContain(mockUserQuery)

      // Should not have system messages
      const logoIcon = wrapper.findComponent(LogoIcon)
      expect(logoIcon.exists()).toBe(false)
    })
  })

  describe('Multiple Messages Support', () => {
    it('renders multiple conversation messages', () => {
      const multipleMessages: ConversationMessage[] = [
        {
          id: 'message-1',
          sender: 'system',
          timestamp: new Date(),
          items: [
            {
              id: 'summary-1',
              type: 'results-summary',
              resultCount: 30
            }
          ]
        },
        {
          id: 'message-2',
          sender: 'system',
          timestamp: new Date(),
          items: [
            {
              id: 'text-2',
              type: 'text',
              content: 'Here are additional suggestions:',
              emphasis: 'normal'
            }
          ]
        }
      ]

      const wrapper = createWrapper(mockUserQuery, multipleMessages)

      expect(wrapper.text()).toContain('30 persons were found')
      expect(wrapper.text()).toContain('Here are additional suggestions')

      // Should have multiple logo icons (one per message)
      const logoIcons = wrapper.findAllComponents(LogoIcon)
      expect(logoIcons).toHaveLength(2)
    })
  })

  describe('Component Props Passing', () => {
    it('passes correct props to conversation item components', () => {
      const wrapper = createWrapper()

      // Results summary should show correct count
      expect(wrapper.text()).toContain('Fantastic! 42 persons were found')

      // Text should have secondary emphasis styling
      const textElements = wrapper
        .findAll('p')
        .filter(p => p.classes().includes('text-text-secondary'))
      expect(textElements.length).toBeGreaterThan(0)

      // Hints should be clickable
      const hintElements = wrapper.findAll('.text-brand-orange-dark.cursor-pointer')
      expect(hintElements.length).toBeGreaterThan(0)

      // Button should have dashed variant styling
      const button = wrapper.find('button')
      expect(button.classes()).toContain('border-dashed')
    })
  })

  describe('Unsupported Item Types', () => {
    it('gracefully handles unknown conversation item types', () => {
      const messagesWithUnknown: ConversationMessage[] = [
        {
          id: 'message-unknown',
          sender: 'system',
          timestamp: new Date(),
          items: [
            {
              id: 'unknown-1',
              type: 'unknown-type',
              content: 'This should not render'
            } as any,
            {
              id: 'text-1',
              type: 'text',
              content: 'This should render',
              emphasis: 'normal'
            }
          ]
        }
      ]

      const wrapper = createWrapper(mockUserQuery, messagesWithUnknown)

      // Known item should render
      expect(wrapper.text()).toContain('This should render')

      // Unknown item should not cause errors
      expect(wrapper.text()).not.toContain('This should not render')
    })
  })

  describe('Layout Structure', () => {
    it('maintains proper conversation layout', () => {
      const wrapper = createWrapper()

      // User message section when query exists
      const userSection = wrapper.find('.flex.gap-4.mb-8.items-start')
      expect(userSection.exists()).toBe(true)

      // System response sections
      const systemSections = wrapper.findAll('.flex.flex-col')
      expect(systemSections.length).toBeGreaterThan(0)
    })

    it('provides proper spacing and alignment', () => {
      const wrapper = createWrapper()

      // Check avatar containers have proper flex classes
      const avatarContainers = wrapper.findAll(
        '.w-10.h-10.flex.items-center.justify-center.flex-shrink-0'
      )
      expect(avatarContainers.length).toBeGreaterThan(0)

      // Check content containers have proper flex classes
      const contentContainers = wrapper.findAll('.flex-1')
      expect(contentContainers.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('maintains semantic structure', () => {
      const wrapper = createWrapper()

      // Should have proper button elements
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThan(0)

      // Should have proper form elements for refinements
      const inputs = wrapper.findAll('input')
      expect(inputs.length).toBeGreaterThan(0)

      // Should have proper labels
      const labels = wrapper.findAll('label')
      expect(labels.length).toBeGreaterThan(0)
    })

    it('provides interactive elements with proper styling', () => {
      const wrapper = createWrapper()

      // Clickable hints should have cursor pointer
      const clickableElements = wrapper.findAll('.cursor-pointer')
      expect(clickableElements.length).toBeGreaterThan(0)

      // Interactive elements should have hover states
      const hoverElements = wrapper.findAll('[class*="hover:"]')
      expect(hoverElements.length).toBeGreaterThan(0)
    })
  })

  describe('Error Boundaries', () => {
    it('handles missing item properties gracefully', () => {
      const messagesWithMissingProps: ConversationMessage[] = [
        {
          id: 'message-incomplete',
          sender: 'system',
          timestamp: new Date(),
          items: [
            {
              id: 'incomplete-text',
              type: 'text',
              content: undefined as any
            } as any,
            {
              id: 'complete-text',
              type: 'text',
              content: 'This should still work'
            }
          ]
        }
      ]

      expect(() => {
        const wrapper = createWrapper(mockUserQuery, messagesWithMissingProps)
        expect(wrapper.text()).toContain('This should still work')
      }).not.toThrow()
    })
  })
})
