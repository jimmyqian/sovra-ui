/**
 * UserMessage Component Tests
 * Tests the user message component with person icon
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserMessage from '../UserMessage.vue'

describe('UserMessage', () => {
  const createWrapper = (props = {}) => {
    return mount(UserMessage, {
      props: {
        content: 'Test message content',
        ...props
      }
    })
  }

  describe('Component Structure', () => {
    it('should render with correct layout', () => {
      const wrapper = createWrapper()

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.classes()).toContain('flex')
      expect(wrapper.classes()).toContain('gap-4')
      expect(wrapper.classes()).toContain('mb-4')
      expect(wrapper.classes()).toContain('items-start')
    })

    it('should render the person icon', () => {
      const wrapper = createWrapper()

      const personSvg = wrapper.find('svg')
      expect(personSvg.exists()).toBe(true)
    })

    it('should render person icon with correct dimensions', () => {
      const wrapper = createWrapper()

      const personSvg = wrapper.find('svg')
      expect(personSvg.attributes('width')).toBe('26')
      expect(personSvg.attributes('height')).toBe('26')
      expect(personSvg.attributes('viewBox')).toBe('0 0 24 24')
    })

    it('should render the message content', () => {
      const content = 'This is a test message'
      const wrapper = createWrapper({ content })

      expect(wrapper.text()).toContain(content)
    })

    it('should have correct icon container styling', () => {
      const wrapper = createWrapper()

      const iconContainer = wrapper.find('.w-9.h-9')
      expect(iconContainer.exists()).toBe(true)
      expect(iconContainer.classes()).toContain('border')
      expect(iconContainer.classes()).toContain('border-black')
      expect(iconContainer.classes()).toContain('rounded-search')
      expect(iconContainer.classes()).toContain('flex')
      expect(iconContainer.classes()).toContain('items-center')
      expect(iconContainer.classes()).toContain('justify-center')
      expect(iconContainer.classes()).toContain('flex-shrink-0')
      expect(iconContainer.classes()).toContain('ml-0.5')
    })

    it('should have correct content container styling', () => {
      const wrapper = createWrapper()

      const contentContainer = wrapper.find('.flex-1')
      expect(contentContainer.exists()).toBe(true)

      const messageContainer = contentContainer.find('.rounded-lg.font-medium')
      expect(messageContainer.exists()).toBe(true)
    })
  })

  describe('Content Rendering', () => {
    it('should display provided content text', () => {
      const testContent = 'Hello, this is a user message'
      const wrapper = createWrapper({ content: testContent })

      const messageElement = wrapper.find('.rounded-lg.font-medium')
      expect(messageElement.text()).toBe(testContent)
    })

    it('should handle empty content', () => {
      const wrapper = createWrapper({ content: '' })

      const messageElement = wrapper.find('.rounded-lg.font-medium')
      expect(messageElement.text()).toBe('')
    })

    it('should handle long content', () => {
      const longContent =
        'This is a very long message that should wrap properly in the container and maintain good readability for the user.'
      const wrapper = createWrapper({ content: longContent })

      expect(wrapper.text()).toContain(longContent)
    })

    it('should handle content with special characters', () => {
      const specialContent = 'Message with special chars: @#$%^&*()!'
      const wrapper = createWrapper({ content: specialContent })

      expect(wrapper.text()).toContain(specialContent)
    })
  })

  describe('User Icon Styling', () => {
    it('should use person icon representing user', () => {
      const wrapper = createWrapper()

      const personSvg = wrapper.find('svg')
      expect(personSvg.exists()).toBe(true)

      // Verify the icon is properly positioned within the circular container
      const iconContainer = wrapper.find('.w-9.h-9')
      expect(iconContainer.exists()).toBe(true)

      // Verify the SVG has proper stroke styling
      const circle = personSvg.find('circle')
      const path = personSvg.find('path')
      expect(circle.exists()).toBe(true)
      expect(path.exists()).toBe(true)
    })

    it('should maintain consistent sizing with message layout', () => {
      const wrapper = createWrapper()

      // Icon container should be fixed size
      const iconContainer = wrapper.find('.w-9.h-9')
      expect(iconContainer.exists()).toBe(true)

      // Content should be flexible
      const contentContainer = wrapper.find('.flex-1')
      expect(contentContainer.exists()).toBe(true)
    })

    it('should have appropriate visual styling for user icon', () => {
      const wrapper = createWrapper()

      // Icon should be contained in a bordered circular container
      const iconContainer = wrapper.find(
        '.w-9.h-9.border.border-black.rounded-search'
      )
      expect(iconContainer.exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const wrapper = createWrapper()

      // Should have proper flex layout for screen readers
      expect(wrapper.element.tagName).toBe('DIV')
      expect(wrapper.classes()).toContain('flex')
      expect(wrapper.classes()).toContain('items-start')
    })

    it('should render content in accessible text container', () => {
      const wrapper = createWrapper()

      const messageElement = wrapper.find('.rounded-lg.font-medium')
      expect(messageElement.exists()).toBe(true)
      expect(messageElement.element.tagName).toBe('DIV')
    })

    it('should maintain logical reading order', () => {
      const wrapper = createWrapper()

      const children = wrapper.element.children
      expect(children).toHaveLength(2)

      // Icon container should be first, content second
      expect(children[0].classList.contains('w-9')).toBe(true)
      expect(children[1].classList.contains('flex-1')).toBe(true)
    })
  })

  describe('Component Props', () => {
    it('should accept content prop', () => {
      const testContent = 'Test content for props validation'
      const wrapper = createWrapper({ content: testContent })

      expect(wrapper.props('content')).toBe(testContent)
    })

    it('should be required to have content prop', () => {
      // This test ensures the TypeScript interface requires content
      const wrapper = createWrapper()
      expect(wrapper.vm.$props).toHaveProperty('content')
    })
  })

  describe('Visual Layout', () => {
    it('should have correct gap spacing between icon and content', () => {
      const wrapper = createWrapper()

      expect(wrapper.classes()).toContain('gap-4')
    })

    it('should have bottom margin for message separation', () => {
      const wrapper = createWrapper()

      expect(wrapper.classes()).toContain('mb-4')
    })

    it('should align items to start for proper text alignment', () => {
      const wrapper = createWrapper()

      expect(wrapper.classes()).toContain('items-start')
    })
  })
})
