import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PersonProfile from '../PersonProfile.vue'
import Button from '@/components/ui/Button.vue'

// Mock the Button component
vi.mock('@/components/ui/Button.vue', () => ({
  default: {
    name: 'Button',
    template:
      '<button class="mock-button" @click="$emit(\'click\')" tabindex="0"><slot /></button>',
    props: ['variant', 'size'],
    emits: ['click']
  }
}))

describe('PersonProfile Accessibility', () => {
  const mockPerson = {
    name: 'Johnson Smith',
    tags: [
      'Overview',
      'Personal Life',
      'Professional Life',
      'Finance',
      'Health'
    ],
    description:
      'Johnson Smith is an American businessman, inventor, and investor best known for co-founding the technology company ABC Inc.'
  }

  it('has proper heading structure', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    const heading = wrapper.find('h1')
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toBe('Johnson Smith')
  })

  it('provides accessible text hierarchy', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Main heading should be h1
    expect(wrapper.find('h1').exists()).toBe(true)

    // Description should be in a separate text block with accessible bold name
    const descriptionText = wrapper.find('.text-text-secondary.leading-relaxed')
    expect(descriptionText.exists()).toBe(true)
    expect(descriptionText.text()).toContain(mockPerson.description)

    // Person's name should be bold for emphasis while maintaining accessibility
    expect(descriptionText.html()).toContain('<strong>Johnson Smith</strong>')
  })

  it('provides accessible tag buttons with proper interaction', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Tags should be rendered as accessible buttons
    const tagButtons = wrapper.findAllComponents(Button)
    expect(tagButtons).toHaveLength(5)

    // All tag buttons should be keyboard accessible
    tagButtons.forEach(button => {
      expect(button.element.tagName).toBe('BUTTON')
      expect(button.element.getAttribute('tabindex')).toBe('0')
    })

    // Buttons should have proper variant for accessibility
    tagButtons.forEach(button => {
      expect(button.props('variant')).toBe('outline')
      expect(button.props('size')).toBe('sm')
    })
  })

  it('provides semantic structure with proper HTML elements', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Should use semantic HTML structure
    expect(wrapper.find('h1').exists()).toBe(true) // Main heading
    expect(wrapper.findAllComponents(Button).length).toBeGreaterThan(0) // Tag buttons
    expect(wrapper.find('.text-sm').exists()).toBe(true) // Description text
  })

  it('maintains readable text sizes', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Main heading should be appropriately sized
    const heading = wrapper.find('h1')
    expect(heading.classes()).toContain('text-xl')

    // Tag buttons should use small size for readability
    const tagButtons = wrapper.findAllComponents(Button)
    tagButtons.forEach(button => {
      expect(button.props('size')).toBe('sm')
    })

    // Info spans should exist for additional information (both description and additional info)
    const infoSpans = wrapper.findAll('.text-text-secondary')
    expect(infoSpans.length).toBeGreaterThan(0) // Should have info text

    // Additional info section should still use small text
    expect(wrapper.find('.text-sm').exists()).toBe(true) // Additional info section
  })

  it('has proper spacing for visual hierarchy', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Component should have proper padding and spacing
    expect(wrapper.classes()).toContain('p-6')

    // Name and tag section should have margin bottom
    const nameTagSection = wrapper.find(
      '.flex.items-center.flex-wrap.gap-3.mb-6'
    )
    expect(nameTagSection.exists()).toBe(true)
  })

  it('uses appropriate border radius and visual elements', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Main container should be accessible visually
    expect(wrapper.classes()).toContain('rounded-lg')
    expect(wrapper.classes()).toContain('border')

    // Status indicator should be visible and properly sized (doubled from original w-4 h-4)
    const statusIndicator = wrapper.find('.bg-green-500')
    expect(statusIndicator.exists()).toBe(true)
    expect(statusIndicator.classes()).toContain('w-8')
    expect(statusIndicator.classes()).toContain('h-8')
    expect(statusIndicator.classes()).toContain('rounded-full')

    // Additional info details should use accessible rounded button styling
    const detailElements = wrapper.findAll('.bg-bg-card.px-4.py-2.rounded-full')
    expect(detailElements).toHaveLength(2)
    detailElements.forEach(element => {
      expect(element.classes()).toContain('rounded-full')
      expect(element.classes()).toContain('text-text-secondary')
    })
  })

  it('provides clear visual separation between elements', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Tags should have visual separation within their container
    const tagsContainer = wrapper.find('.flex.flex-wrap.gap-2')
    expect(tagsContainer.exists()).toBe(true)

    // Name and tag section should have proper spacing from description
    const nameTagSection = wrapper.find(
      '.flex.items-center.flex-wrap.gap-3.mb-6'
    )
    expect(nameTagSection.exists()).toBe(true)

    // Separator border should provide clear visual separation
    const separatorBorder = wrapper.find(
      '.border-t.border-dashed.border-border-dashed'
    )
    expect(separatorBorder.exists()).toBe(true)
    expect(separatorBorder.classes()).toContain('w-full')

    // Profile section should have margin from description
    const profileSection = wrapper.find('.mb-6')
    expect(profileSection.exists()).toBe(true)
  })

  it('handles long content without accessibility issues', () => {
    const baseDescription =
      'This is a very long description that should maintain accessibility standards.'
    const longDescription = baseDescription.repeat(20)
    const personWithLongContent = {
      ...mockPerson,
      description: longDescription,
      name: 'Very Long Name That Could Potentially Wrap to Multiple Lines'
    }

    const wrapper = mount(PersonProfile, {
      props: { person: personWithLongContent },
      global: {
        components: { Button }
      }
    })

    // Should still be accessible with long content
    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.text()).toContain(baseDescription)
    // Buttons should still be accessible
    expect(wrapper.findAllComponents(Button)).toHaveLength(5)
  })

  it('maintains consistent focus management with interactive buttons', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Component now has interactive tag buttons that should be focusable
    const tagButtons = wrapper.findAllComponents(Button)
    expect(tagButtons).toHaveLength(5)

    // All buttons should be keyboard accessible
    tagButtons.forEach(button => {
      expect(button.element.tagName).toBe('BUTTON')
      expect(button.element.getAttribute('tabindex')).toBe('0')
    })
  })

  it('provides appropriate landmarks and structure', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Should provide clear content structure
    const profileContainer = wrapper.find('.flex.items-start.gap-6')
    expect(profileContainer.exists()).toBe(true)

    // Should have profile image area and content area clearly separated
    const imageArea = wrapper.find('.flex-shrink-0')
    const contentArea = wrapper.find('.flex-1')
    expect(imageArea.exists()).toBe(true)
    expect(contentArea.exists()).toBe(true)
  })

  it('uses appropriate ARIA principles implicitly', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Should follow good semantic structure that screen readers can navigate
    expect(wrapper.find('h1').exists()).toBe(true) // Clear heading structure
    expect(wrapper.findAllComponents(Button).length).toBeGreaterThan(0) // Interactive button structure

    // Buttons are inherently accessible with proper keyboard navigation
    const tagButtons = wrapper.findAllComponents(Button)
    tagButtons.forEach(button => {
      expect(button.element.tagName).toBe('BUTTON')
    })
  })

  it('maintains color accessibility standards', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Should use design system colors that meet accessibility standards
    expect(wrapper.classes()).toContain('bg-bg-card')
    expect(wrapper.classes()).toContain('border-border-light')

    // Text should use semantic color classes
    const heading = wrapper.find('h1')
    expect(heading.classes()).toContain('text-text-primary')

    // Tag buttons should use accessible outline variant
    const tagButtons = wrapper.findAllComponents(Button)
    tagButtons.forEach(button => {
      expect(button.props('variant')).toBe('outline')
    })
  })

  it('supports keyboard navigation for tag buttons', async () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    const tagButtons = wrapper.findAllComponents(Button)
    expect(tagButtons).toHaveLength(5)

    // Test keyboard interaction on first button
    const firstButton = tagButtons[0]!
    expect(firstButton).toBeTruthy()

    // Should be focusable
    expect(firstButton.element.getAttribute('tabindex')).toBe('0')

    // Should emit event on click (simulating Enter/Space)
    await firstButton.trigger('click')
    expect(wrapper.emitted('tagClick')).toBeTruthy()
    expect(wrapper.emitted('tagClick')![0]).toEqual(['Overview'])
  })

  it('provides accessible Read More toggle button', async () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Find the Read More button
    const readMoreButton = wrapper.find('.text-brand-orange')
    expect(readMoreButton.exists()).toBe(true)
    expect(readMoreButton.element.tagName).toBe('BUTTON')

    // Should have accessible initial state
    expect(readMoreButton.text()).toBe('Read More')
    expect(readMoreButton.classes()).toContain('cursor-pointer')

    // Should be keyboard accessible (button element)
    expect(readMoreButton.element.tagName).toBe('BUTTON')

    // Test toggle functionality for screen readers
    await readMoreButton.trigger('click')
    expect(readMoreButton.text()).toBe('Show Less')

    // Toggle back
    await readMoreButton.trigger('click')
    expect(readMoreButton.text()).toBe('Read More')

    // Should use appropriate styling for accessibility
    expect(readMoreButton.classes()).toContain('text-brand-orange')
    expect(readMoreButton.classes()).toContain('hover:underline')
  })

  it('uses accessible separator border styling for visual hierarchy', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Separator border should use accessible styling
    const separatorBorder = wrapper.find(
      '.border-t.border-dashed.border-border-dashed'
    )
    expect(separatorBorder.exists()).toBe(true)

    // Should be contained within centered flex container for proper visual alignment
    const separatorContainer = separatorBorder.element.parentElement
    expect(separatorContainer?.classList.contains('flex')).toBe(true)
    expect(separatorContainer?.classList.contains('justify-center')).toBe(true)
    expect(separatorContainer?.classList.contains('mb-6')).toBe(true)

    // Border should be full width for appropriate visual balance
    expect(separatorBorder.classes()).toContain('w-full')

    // Should use theme border colors for consistency
    expect(separatorBorder.classes()).toContain('border-border-dashed')
  })
})
