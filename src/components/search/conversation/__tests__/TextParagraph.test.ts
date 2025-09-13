/**
 * Unit tests for TextParagraph conversation component
 * Tests text rendering, emphasis variants, and custom classes
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextParagraph from '../TextParagraph.vue'
import type { TextParagraphItem } from '@/types/conversation'

describe('TextParagraph', () => {
  const baseItem: TextParagraphItem = {
    id: 'text-1',
    type: 'text',
    content: 'This is a test paragraph'
  }

  describe('Basic Rendering', () => {
    it('renders paragraph with content', () => {
      const wrapper = mount(TextParagraph, {
        props: { item: baseItem }
      })

      const paragraph = wrapper.find('p')
      expect(paragraph.exists()).toBe(true)
      expect(paragraph.text()).toContain('This is a test paragraph')
    })

    it('applies base classes', () => {
      const wrapper = mount(TextParagraph, {
        props: { item: baseItem }
      })

      const paragraph = wrapper.find('p')
      expect(paragraph.classes()).toContain('mb-4')
      expect(paragraph.classes()).toContain('leading-relaxed')
    })
  })

  describe('Emphasis Variants', () => {
    it('renders normal text with primary color', () => {
      const wrapper = mount(TextParagraph, {
        props: {
          item: { ...baseItem, emphasis: 'normal' }
        }
      })

      const paragraph = wrapper.find('p')
      expect(paragraph.classes()).toContain('text-text-primary')
    })

    it('renders strong text with medium font weight', () => {
      const wrapper = mount(TextParagraph, {
        props: {
          item: { ...baseItem, emphasis: 'strong' }
        }
      })

      const paragraph = wrapper.find('p')
      expect(paragraph.classes()).toContain('text-text-primary')
      expect(paragraph.classes()).toContain('font-medium')

      const strong = paragraph.find('strong')
      expect(strong.exists()).toBe(true)
      expect(strong.text()).toContain('This is a test paragraph')
    })

    it('renders secondary text with secondary color', () => {
      const wrapper = mount(TextParagraph, {
        props: {
          item: { ...baseItem, emphasis: 'secondary' }
        }
      })

      const paragraph = wrapper.find('p')
      expect(paragraph.classes()).toContain('text-text-secondary')
    })

    it('defaults to normal emphasis when not specified', () => {
      const wrapper = mount(TextParagraph, {
        props: { item: baseItem }
      })

      const paragraph = wrapper.find('p')
      expect(paragraph.classes()).toContain('text-text-primary')
      expect(paragraph.classes()).not.toContain('font-medium')
    })
  })

  describe('Custom Classes', () => {
    it('applies custom className when provided', () => {
      const itemWithClass = {
        ...baseItem,
        className: 'custom-class text-lg'
      }

      const wrapper = mount(TextParagraph, {
        props: { item: itemWithClass }
      })

      const paragraph = wrapper.find('p')
      expect(paragraph.classes()).toContain('custom-class')
      expect(paragraph.classes()).toContain('text-lg')
    })

    it('works without custom className', () => {
      const wrapper = mount(TextParagraph, {
        props: { item: baseItem }
      })

      const paragraph = wrapper.find('p')
      expect(paragraph.classes()).toContain('mb-4')
      expect(paragraph.classes()).toContain('leading-relaxed')
      expect(paragraph.classes()).toContain('text-text-primary')
    })
  })

  describe('HTML Content', () => {
    it('renders HTML content correctly', () => {
      const htmlItem = {
        ...baseItem,
        content: 'This has <em>emphasized</em> and <strong>bold</strong> text'
      }

      const wrapper = mount(TextParagraph, {
        props: { item: htmlItem }
      })

      const paragraph = wrapper.find('p')
      expect(paragraph.html()).toContain('<em>emphasized</em>')
      expect(paragraph.html()).toContain('<strong>bold</strong>')
    })

    it('handles empty content gracefully', () => {
      const emptyItem = {
        ...baseItem,
        content: ''
      }

      const wrapper = mount(TextParagraph, {
        props: { item: emptyItem }
      })

      const paragraph = wrapper.find('p')
      expect(paragraph.exists()).toBe(true)
      expect(paragraph.text()).toBe('')
    })
  })

  describe('Emphasis and HTML Combination', () => {
    it('wraps HTML content in strong tag when emphasis is strong', () => {
      const strongHtmlItem = {
        ...baseItem,
        content: 'This has <em>emphasized</em> text',
        emphasis: 'strong' as const
      }

      const wrapper = mount(TextParagraph, {
        props: { item: strongHtmlItem }
      })

      const paragraph = wrapper.find('p')
      const strong = paragraph.find('strong')
      expect(strong.exists()).toBe(true)
      expect(strong.html()).toContain('<em>emphasized</em>')
    })

    it('renders HTML content directly for non-strong emphasis', () => {
      const secondaryHtmlItem = {
        ...baseItem,
        content: 'This has <em>emphasized</em> text',
        emphasis: 'secondary' as const
      }

      const wrapper = mount(TextParagraph, {
        props: { item: secondaryHtmlItem }
      })

      const paragraph = wrapper.find('p')
      const span = paragraph.find('span')
      expect(span.exists()).toBe(true)
      expect(span.html()).toContain('<em>emphasized</em>')
    })
  })
})
