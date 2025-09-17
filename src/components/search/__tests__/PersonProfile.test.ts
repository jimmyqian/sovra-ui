import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PersonProfile from '../PersonProfile.vue'
import Button from '@/components/ui/Button.vue'

// Mock the Button component
vi.mock('@/components/ui/Button.vue', () => ({
  default: {
    name: 'Button',
    template:
      '<button class="mock-button" @click="$emit(\'click\')"><slot /></button>',
    props: ['variant', 'size', 'active'],
    emits: ['click']
  }
}))

describe('PersonProfile', () => {
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

  it('renders person name correctly', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    expect(wrapper.find('h1').text()).toBe('Johnson Smith')
  })

  it('displays all person tags as buttons', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    const tagButtons = wrapper.findAllComponents(Button)
    const tagTexts = tagButtons.map(button => button.text())

    expect(tagButtons).toHaveLength(5)
    expect(tagTexts).toContain('Overview')
    expect(tagTexts).toContain('Personal Life')
    expect(tagTexts).toContain('Professional Life')
    expect(tagTexts).toContain('Finance')
    expect(tagTexts).toContain('Health')
  })

  it('renders person description', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    expect(wrapper.text()).toContain(mockPerson.description)
  })

  it('makes person name bold in description', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    const descriptionElement = wrapper.find(
      '.text-text-secondary.leading-relaxed'
    )
    expect(descriptionElement.exists()).toBe(true)

    // Check that the description HTML contains bold name
    expect(descriptionElement.html()).toContain(
      '<strong>Johnson Smith</strong>'
    )

    // Verify the text content still contains the name
    expect(descriptionElement.text()).toContain('Johnson Smith')
  })

  it('displays Read More toggle button with correct functionality', async () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Find the Read More button
    const readMoreButton = wrapper.find('.text-brand-orange-dark')
    expect(readMoreButton.exists()).toBe(true)
    expect(readMoreButton.text()).toBe('Read More')

    // Check initial styling
    expect(readMoreButton.classes()).toContain('ml-1')
    expect(readMoreButton.classes()).toContain('text-brand-orange-dark')
    expect(readMoreButton.classes()).toContain('hover:underline')
    expect(readMoreButton.classes()).toContain('cursor-pointer')

    // Click the button to toggle
    await readMoreButton.trigger('click')
    expect(readMoreButton.text()).toBe('Show Less')

    // Click again to toggle back
    await readMoreButton.trigger('click')
    expect(readMoreButton.text()).toBe('Read More')
  })

  it('renders tag buttons with correct props', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    const tagButtons = wrapper.findAllComponents(Button)
    expect(tagButtons).toHaveLength(5)

    // Check that buttons have correct variant and size props
    tagButtons.forEach(button => {
      expect(button.props('variant')).toBe('outline')
      expect(button.props('size')).toBe('sm')
    })
  })

  it('sets Overview as active tag by default', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    const tagButtons = wrapper.findAllComponents(Button)
    const overviewButton = tagButtons.find(
      button => button.text() === 'Overview'
    )

    expect(overviewButton?.props('active')).toBe(true)

    // Other buttons should not be active
    const otherButtons = tagButtons.filter(
      button => button.text() !== 'Overview'
    )
    otherButtons.forEach(button => {
      expect(button.props('active')).toBe(false)
    })
  })

  it('updates active state when tag is clicked', async () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    const tagButtons = wrapper.findAllComponents(Button)
    const personalLifeButton = tagButtons.find(
      button => button.text() === 'Personal Life'
    )

    // Initially Overview should be active
    const overviewButton = tagButtons.find(
      button => button.text() === 'Overview'
    )
    expect(overviewButton?.props('active')).toBe(true)
    expect(personalLifeButton?.props('active')).toBe(false)

    // Click Personal Life button
    await personalLifeButton?.trigger('click')

    // Check that active state has changed
    expect(overviewButton?.props('active')).toBe(false)
    expect(personalLifeButton?.props('active')).toBe(true)
  })

  it('emits tagClick event and updates active state when button is clicked', async () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    const tagButtons = wrapper.findAllComponents(Button)
    const financeButton = tagButtons.find(button => button.text() === 'Finance')

    await financeButton?.trigger('click')

    // Check event emission
    expect(wrapper.emitted('tagClick')).toBeTruthy()
    expect(wrapper.emitted('tagClick')![0]).toEqual(['Finance'])

    // Check active state change
    expect(financeButton?.props('active')).toBe(true)
  })

  it('displays user icon with green status indicator', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    const statusIndicator = wrapper.find('.bg-green-500')
    expect(statusIndicator.exists()).toBe(true)
    expect(statusIndicator.classes()).toContain('rounded-full')
    expect(statusIndicator.classes()).toContain('w-8')
    expect(statusIndicator.classes()).toContain('h-8')
  })

  it('has proper accessibility structure', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    expect(wrapper.find('h1').exists()).toBe(true)

    // Check that tag buttons are accessible
    const tagButtons = wrapper.findAllComponents(Button)
    expect(tagButtons).toHaveLength(5)
  })

  it('handles empty or missing tags gracefully', () => {
    const personWithoutTags = {
      name: 'Test Person',
      tags: [],
      description: 'Test description'
    }

    const wrapper = mount(PersonProfile, {
      props: { person: personWithoutTags },
      global: {
        components: { Button }
      }
    })

    expect(wrapper.find('h1').text()).toBe('Test Person')
    // No tag buttons should be rendered
    expect(wrapper.findAllComponents(Button)).toHaveLength(0)
    // There are 3 spans: 1 for description content + 2 for the info section (American and DOB)
    expect(wrapper.findAll('span').length).toBe(3)
  })

  it('handles long descriptions properly', () => {
    const baseDescription =
      'This is a very long description that should be displayed properly without breaking the layout.'
    const longDescription = baseDescription.repeat(10)
    const personWithLongDesc = {
      name: 'Test Person',
      tags: ['Overview'],
      description: longDescription
    }

    const wrapper = mount(PersonProfile, {
      props: { person: personWithLongDesc },
      global: {
        components: { Button }
      }
    })

    expect(wrapper.text()).toContain(baseDescription)
    expect(wrapper.findAllComponents(Button)).toHaveLength(1)
  })

  it('renders unknown tags as buttons', () => {
    const personWithUnknownTags = {
      name: 'Test Person',
      tags: ['Unknown Tag'],
      description: 'Test description'
    }

    const wrapper = mount(PersonProfile, {
      props: { person: personWithUnknownTags },
      global: {
        components: { Button }
      }
    })

    const tagButtons = wrapper.findAllComponents(Button)
    expect(tagButtons).toHaveLength(1)
    expect(tagButtons[0]!.text()).toBe('Unknown Tag')
    expect(tagButtons[0]!.props('variant')).toBe('outline')
    expect(tagButtons[0]!.props('size')).toBe('sm')
  })

  it('has proper component structure and styling', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    expect(wrapper.classes()).toContain('bg-bg-card')
    expect(wrapper.classes()).toContain('rounded-lg')
    expect(wrapper.classes()).toContain('border')
  })

  it('displays additional info details with rounded button styling', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Find elements with bg-bg-card detail styling (rounded button format)
    const detailElements = wrapper.findAll('.bg-bg-card.px-4.py-2.rounded-full')
    expect(detailElements).toHaveLength(2)

    // Check "American" detail styling
    const americanElement = detailElements.find(el => el.text() === 'American')
    expect(americanElement?.exists()).toBe(true)
    expect(americanElement?.classes()).toContain('bg-bg-card')
    expect(americanElement?.classes()).toContain('px-4')
    expect(americanElement?.classes()).toContain('py-2')
    expect(americanElement?.classes()).toContain('rounded-full')
    expect(americanElement?.classes()).toContain('text-text-secondary')

    // Check DOB detail styling
    const dobElement = detailElements.find(el => el.text().includes('DOB'))
    expect(dobElement?.exists()).toBe(true)
    expect(dobElement?.classes()).toContain('bg-bg-card')
    expect(dobElement?.classes()).toContain('px-4')
    expect(dobElement?.classes()).toContain('py-2')
    expect(dobElement?.classes()).toContain('rounded-full')
    expect(dobElement?.classes()).toContain('text-text-secondary')
  })

  it('displays separator border with correct styling', () => {
    const wrapper = mount(PersonProfile, {
      props: { person: mockPerson },
      global: {
        components: { Button }
      }
    })

    // Check for separator border element
    const separatorBorder = wrapper.find(
      '.border-t.border-dashed.border-border-dashed'
    )
    expect(separatorBorder.exists()).toBe(true)

    // Check that border has 100% width
    expect(separatorBorder.classes()).toContain('w-full')

    // Check that separator is centered
    const separatorContainer = separatorBorder.element.parentElement
    expect(separatorContainer?.classList.contains('flex')).toBe(true)
    expect(separatorContainer?.classList.contains('justify-center')).toBe(true)
  })
})
