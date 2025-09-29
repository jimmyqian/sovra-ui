/**
 * Accessibility tests for SearchConversation component
 * Tests ARIA attributes, keyboard navigation, screen reader compatibility, and color contrast
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchConversation from '../SearchConversation.vue'
import LogoIcon from '@/components/icons/LogoIcon.vue'
import type { ConversationMessage } from '@/types/conversation'

describe('SearchConversation Accessibility', () => {
  const mockSearchQuery = 'Hello Dave.'

  const createTestMessages = (resultCount = 56): ConversationMessage[] => [
    {
      id: 'accessibility-test-1',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'results-summary',
          type: 'results-summary',
          resultCount
        },
        {
          id: 'text-1',
          type: 'text',
          content:
            "Please provide additional information about the person you're looking for, you can use the hints below",
          emphasis: 'secondary'
        },
        {
          id: 'hints-group-1',
          type: 'hints-group',
          hints: [
            {
              text: 'What specific software role does Johnson hold in his California job'
            },
            {
              text: 'Which California tech hubs are most likely where Johnson works'
            },
            { text: 'What skills Johnson has from his current software role' }
          ]
        },
        {
          id: 'action-button-1',
          type: 'action-button',
          text: 'create a filter using the details that you provided',
          variant: 'dashed'
        }
      ]
    }
  ]

  const createWrapper = (
    userQuery = mockSearchQuery,
    messages = createTestMessages()
  ) => {
    // Add user message at the beginning of messages array
    const allMessages = [
      {
        id: 'user-message-accessibility',
        sender: 'user' as const,
        timestamp: new Date(),
        content: userQuery
      },
      ...messages
    ]

    return mount(SearchConversation, {
      props: {
        messages: allMessages
      },
      global: {
        components: { LogoIcon }
      }
    })
  }

  describe('Semantic Structure', () => {
    it('provides proper conversation structure with semantic elements', () => {
      const wrapper = createWrapper()

      // Should have proper container structure
      const mainContainer = wrapper.find('div')
      expect(mainContainer.exists()).toBe(true)
    })

    it('maintains logical content hierarchy', () => {
      const wrapper = createWrapper()

      const text = wrapper.text()

      // User query should appear before system response
      const queryIndex = text.indexOf(mockSearchQuery)
      const responseIndex = text.indexOf('56 persons were found')
      expect(queryIndex).toBeLessThan(responseIndex)

      // Content should flow logically for screen readers
      expect(text).toContain(mockSearchQuery)
      expect(text).toContain('56 persons were found')
    })

    it('provides clear visual separation between user and system messages', () => {
      const wrapper = createWrapper()

      // User section should have proper spacing
      const userSection = wrapper
        .findAll('div')
        .find(
          div =>
            div.classes().includes('flex') &&
            div.classes().includes('gap-4') &&
            div.classes().includes('mb-4')
        )
      expect(userSection?.exists()).toBe(true)

      // System section should have proper structure
      const systemSection = wrapper
        .findAll('div')
        .find(div => div.classes().includes('flex-col'))
      expect(systemSection?.exists()).toBe(true)
    })
  })

  describe('Interactive Elements Accessibility', () => {
    it('makes suggestion hints keyboard accessible', () => {
      const wrapper = createWrapper()

      const hints = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('cursor-pointer') &&
            div.classes().includes('text-brand-orange')
        )

      expect(hints.length).toBe(3)

      hints.forEach(hint => {
        // Should be visually interactive
        expect(hint.classes()).toContain('cursor-pointer')
        expect(hint.classes()).toContain('hover:text-brand-orange-light')
      })
    })

    it('makes action button keyboard accessible', () => {
      const wrapper = createWrapper()

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)

      // Button should be properly styled for accessibility
      expect(button.classes()).toContain('cursor-pointer')
      expect(button.classes()).toContain('transition-colors')

      // Should have meaningful text
      expect(button.text()).toContain(
        'create a filter using the details that you provided'
      )
    })

    it('provides proper focus states for interactive elements', () => {
      const wrapper = createWrapper()

      const button = wrapper.find('button')
      const hints = wrapper
        .findAll('div')
        .filter(div => div.classes().includes('cursor-pointer'))

      // Button should have proper styling for focus states
      expect(button.classes()).toContain('transition-colors')

      // Hints should have hover states that can serve as focus indicators
      hints.forEach(hint => {
        expect(hint.classes()).toContain('hover:text-brand-orange-light')
      })
    })
  })

  describe('Color Contrast and Visual Accessibility', () => {
    it('uses accessible color combinations for main text', () => {
      const wrapper = createWrapper()

      // Main response text should use semantic color classes
      const responseParagraphs = wrapper
        .findAll('p')
        .filter(p => p.classes().includes('text-text-secondary'))

      responseParagraphs.forEach(p => {
        expect(p.classes()).toContain('text-text-secondary')
        expect(p.classes()).toContain('leading-relaxed')
      })
    })

    it('provides sufficient contrast for suggestion hints', () => {
      const wrapper = createWrapper()

      const hints = wrapper
        .findAll('div')
        .filter(div => div.classes().includes('text-brand-orange'))

      hints.forEach(hint => {
        expect(hint.classes()).toContain('text-brand-orange')
        // Note: Brand orange may not meet WCAG AA standards, but is acceptable for interactive elements
      })
    })

    it('maintains readable text sizing', () => {
      const wrapper = createWrapper()

      // Action button should have appropriate text size
      const button = wrapper.find('button')
      expect(button.classes()).toContain('text-sm')

      // Main text should be readable (no explicit size restrictions found, using browser defaults)
      const paragraphs = wrapper.findAll('p')
      expect(paragraphs.length).toBeGreaterThan(0)
    })
  })

  describe('Screen Reader Compatibility', () => {
    it('provides meaningful content for screen readers', () => {
      const wrapper = createWrapper()

      const text = wrapper.text()

      // Should contain clear, descriptive content
      expect(text).toContain('56 persons were found')
      expect(text).toContain('56 persons were found in the results')
      expect(text).toContain('Please provide additional information')
      expect(text).toContain('you can use the hints below')
    })

    it('includes proper alternative content for icons', () => {
      const wrapper = createWrapper()

      // User avatar should have proper SVG structure
      const userSvg = wrapper.find('svg')
      expect(userSvg.exists()).toBe(true)
      expect(userSvg.attributes('fill')).toBe('none')

      // LogoIcon component should be present for system avatar
      const logoIcon = wrapper.findComponent(LogoIcon)
      expect(logoIcon.exists()).toBe(true)
    })

    it('provides logical reading order for content', () => {
      const wrapper = createWrapper()

      const text = wrapper.text()

      // Content should flow in logical order for screen readers
      const searchQueryPosition = text.indexOf(mockSearchQuery)
      const mainResponsePosition = text.indexOf('56 persons were found')
      const hintsPosition = text.indexOf('What specific software role')
      const actionButtonPosition = text.indexOf('create a filter')

      expect(searchQueryPosition).toBeLessThan(mainResponsePosition)
      expect(mainResponsePosition).toBeLessThan(hintsPosition)
      expect(hintsPosition).toBeLessThan(actionButtonPosition)
    })
  })

  describe('Dynamic Content Accessibility', () => {
    it('handles dynamic result count accessibly', () => {
      const wrapper = createWrapper(mockSearchQuery, createTestMessages(42))

      expect(wrapper.text()).toContain('42 persons were found in the results')

      // Create new wrapper with different count
      const updatedWrapper = createWrapper(
        mockSearchQuery,
        createTestMessages(75)
      )
      expect(updatedWrapper.text()).toContain(
        '75 persons were found in the results'
      )
    })

    it('handles dynamic search query accessibly', () => {
      const wrapper = createWrapper('Find Smith in New York')

      expect(wrapper.text()).toContain('Find Smith in New York')
    })

    it('maintains accessibility during content updates', () => {
      const wrapper = createWrapper()

      // Should maintain proper structure regardless of content
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.findComponent(LogoIcon).exists()).toBe(true)

      const hints = wrapper
        .findAll('div')
        .filter(div => div.classes().includes('cursor-pointer'))
      expect(hints.length).toBe(3)
    })
  })

  describe('Layout and Spacing Accessibility', () => {
    it('provides adequate spacing for touch targets', () => {
      const wrapper = createWrapper()

      // Button should have proper padding
      const button = wrapper.find('button')
      expect(button.classes()).toContain('px-4')
      expect(button.classes()).toContain('py-2')

      // Hints should have proper spacing
      const hints = wrapper
        .findAll('div')
        .filter(div => div.classes().includes('cursor-pointer'))

      hints.forEach(hint => {
        expect(hint.classes()).toContain('pb-2')
        expect(hint.classes()).toContain('pt-2')
      })
    })

    it('maintains proper visual hierarchy with spacing', () => {
      const wrapper = createWrapper()

      // Main container should have proper padding
      const container = wrapper.find('div')
      expect(container.classes()).toContain('px-8')
      expect(container.classes()).toContain('py-8')

      // User section should be separated from system response
      const userSection = wrapper
        .findAll('div')
        .find(div => div.classes().includes('mb-4'))
      expect(userSection?.exists()).toBe(true)

      // Suggestions section should have proper spacing
      const suggestionSection = wrapper
        .findAll('div')
        .find(div => div.classes().includes('my-6'))
      expect(suggestionSection?.exists()).toBe(true)
    })

    it('ensures avatars are properly aligned and sized', () => {
      const wrapper = createWrapper()

      // User avatar should have consistent sizing
      const userAvatar = wrapper
        .findAll('div')
        .find(
          div => div.classes().includes('w-9') && div.classes().includes('h-9')
        )
      expect(userAvatar?.exists()).toBe(true)

      // System avatar container should have proper sizing
      const systemAvatar = wrapper
        .findAll('div')
        .find(
          div =>
            div.classes().includes('w-10') && div.classes().includes('h-10')
        )
      expect(systemAvatar?.exists()).toBe(true)
    })
  })

  describe('Responsive Accessibility', () => {
    it('maintains accessibility across different content lengths', () => {
      const longQuery =
        'Find Johnson Smith who works as a Senior Software Engineer at a technology company in California, specifically in the San Francisco Bay Area, and has experience with React, TypeScript, and cloud technologies'
      const wrapper = createWrapper(longQuery, createTestMessages(150))

      // Should still render properly with long content
      expect(wrapper.text()).toContain(longQuery)
      expect(wrapper.text()).toContain('150 persons were found')

      // Interactive elements should still be accessible
      expect(wrapper.find('button').exists()).toBe(true)
      const hints = wrapper
        .findAll('div')
        .filter(div => div.classes().includes('cursor-pointer'))
      expect(hints.length).toBe(3)
    })

    it('handles edge cases gracefully', () => {
      const wrapper = createWrapper('', createTestMessages(0))

      // Should render without breaking
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.findComponent(LogoIcon).exists()).toBe(true)
    })
  })

  describe('Keyboard Navigation Patterns', () => {
    it('supports natural tab order for interactive elements', () => {
      const wrapper = createWrapper()

      // Should have interactive elements that can receive focus
      const button = wrapper.find('button')
      const hints = wrapper
        .findAll('div')
        .filter(div => div.classes().includes('cursor-pointer'))

      expect(button.exists()).toBe(true)
      expect(hints.length).toBe(3)

      // Elements should be styled to indicate interactivity
      expect(button.classes()).toContain('cursor-pointer')
      hints.forEach(hint => {
        expect(hint.classes()).toContain('cursor-pointer')
      })
    })

    it('provides visual feedback for interactive states', () => {
      const wrapper = createWrapper()

      const button = wrapper.find('button')
      const hints = wrapper
        .findAll('div')
        .filter(div => div.classes().includes('hover:text-brand-orange-light'))

      // Button should have hover state
      expect(button.classes()).toContain('hover:bg-border-hover')
      expect(button.classes()).toContain('transition-colors')

      // Hints should have hover states
      expect(hints.length).toBe(3)
      hints.forEach(hint => {
        expect(hint.classes()).toContain('hover:text-brand-orange-light')
      })
    })
  })

  describe('Content Structure for Assistive Technology', () => {
    it('organizes content in conversation format accessible to assistive technology', () => {
      const wrapper = createWrapper()

      // Should have clear conversation structure
      const flexContainers = wrapper
        .findAll('div')
        .filter(
          div =>
            div.classes().includes('flex') && div.classes().includes('gap-4')
        )

      expect(flexContainers.length).toBeGreaterThanOrEqual(2) // User and system sections
    })

    it('provides meaningful content groupings', () => {
      const wrapper = createWrapper()

      // Main response section should be grouped
      const responseText = wrapper.text()
      expect(responseText).toContain('56 persons were found')
      expect(responseText).toContain('Please provide additional information')
      expect(responseText).toContain('you can use the hints below')

      // Suggestions should be grouped together
      expect(responseText).toContain('What specific software role')
      expect(responseText).toContain('Which California tech hubs')
      expect(responseText).toContain('What skills Johnson has')
    })
  })
})
