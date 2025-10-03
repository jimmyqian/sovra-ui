/**
 * Unit tests for InfoGraphicCard component
 * Tests rendering, stats, progress bars, and tags
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InfoGraphicCard from '../InfoGraphicCard.vue'

describe('InfoGraphicCard', () => {
  it('renders title and subtitle correctly', () => {
    const wrapper = mount(InfoGraphicCard, {
      props: {
        title: 'Family Profile',
        subtitle: 'Multi-generational UHNW family'
      }
    })

    expect(wrapper.text()).toContain('Family Profile')
    expect(wrapper.text()).toContain('Multi-generational UHNW family')
  })

  it('renders stats grid when stats are provided', () => {
    const wrapper = mount(InfoGraphicCard, {
      props: {
        title: 'Test Card',
        stats: [
          { label: 'Children', value: 3 },
          { label: 'Marriages', value: 2 }
        ]
      }
    })

    expect(wrapper.text()).toContain('Children')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('Marriages')
    expect(wrapper.text()).toContain('2')
  })

  it('renders progress bars when progress data is provided', () => {
    const wrapper = mount(InfoGraphicCard, {
      props: {
        title: 'Network Analysis',
        progress: [
          { label: 'Finance', value: 85 },
          { label: 'Politics', value: 70 }
        ]
      }
    })

    expect(wrapper.text()).toContain('Finance')
    expect(wrapper.text()).toContain('85%')
    expect(wrapper.text()).toContain('Politics')
    expect(wrapper.text()).toContain('70%')
  })

  it('applies correct progress bar colors based on value', () => {
    const wrapper = mount(InfoGraphicCard, {
      props: {
        title: 'Test',
        progress: [
          { label: 'High', value: 85 },
          { label: 'Medium', value: 60 },
          { label: 'Low', value: 30 }
        ]
      }
    })

    const progressBars = wrapper.findAll('.h-2.rounded-full.transition-all')
    expect(progressBars[0].classes()).toContain('bg-green-500')
    expect(progressBars[1].classes()).toContain('bg-orange-500')
    expect(progressBars[2].classes()).toContain('bg-red-500')
  })

  it('renders tags when provided', () => {
    const wrapper = mount(InfoGraphicCard, {
      props: {
        title: 'Test',
        tags: ['UHNW', 'Philanthropic', 'Multi-gen']
      }
    })

    expect(wrapper.text()).toContain('UHNW')
    expect(wrapper.text()).toContain('Philanthropic')
    expect(wrapper.text()).toContain('Multi-gen')
  })

  it('applies correct size class for large size', () => {
    const wrapper = mount(InfoGraphicCard, {
      props: {
        title: 'Test',
        size: 'lg'
      }
    })

    expect(wrapper.classes()).toContain('col-span-2')
  })

  it('applies correct size class for full size', () => {
    const wrapper = mount(InfoGraphicCard, {
      props: {
        title: 'Test',
        size: 'full'
      }
    })

    expect(wrapper.classes()).toContain('col-span-full')
  })

  it('renders header image when provided', () => {
    const wrapper = mount(InfoGraphicCard, {
      props: {
        title: 'Test',
        headerImage: 'https://example.com/image.jpg'
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
  })
})
