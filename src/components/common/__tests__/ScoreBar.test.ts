/**
 * Unit tests for ScoreBar component
 * Tests rating visualization, width calculation, styling, and visual indicators
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScoreBar from '../ScoreBar.vue'

describe('ScoreBar', () => {
  describe('Basic Rendering', () => {
    it('renders container with correct structure', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      const container = wrapper.find('div')
      expect(container.exists()).toBe(true)
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('renders progress bar and divider elements', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      const allDivs = wrapper.findAll('div')
      // 1 container + 1 progress bar + 4 divider lines = 6 divs
      expect(allDivs).toHaveLength(6)
    })

    it('renders with all required children', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      // Progress bar
      const progressBar = wrapper.findAll('div')[1]
      expect(progressBar.classes()).toContain('h-full')
      expect(progressBar.classes()).toContain('bg-score-bar')

      // Divider lines
      const dividers = wrapper.findAll('div').slice(2)
      expect(dividers).toHaveLength(4)
    })
  })

  describe('Container Styling', () => {
    it('applies correct container classes', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      const container = wrapper.find('div')
      const expectedClasses = [
        'w-36',
        'h-2',
        'bg-border-lighter',
        'rounded',
        'overflow-hidden',
        'relative'
      ]

      expectedClasses.forEach(className => {
        expect(container.classes()).toContain(className)
      })
    })

    it('maintains fixed dimensions', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      const container = wrapper.find('div')
      expect(container.classes()).toContain('w-36')
      expect(container.classes()).toContain('h-2')
    })

    it('applies visual styling for score bar', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      const container = wrapper.find('div')
      expect(container.classes()).toContain('bg-border-lighter')
      expect(container.classes()).toContain('rounded')
      expect(container.classes()).toContain('overflow-hidden')
    })
  })

  describe('Progress Bar', () => {
    it('applies correct progress bar classes', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      const progressBar = wrapper.findAll('div')[1]
      const expectedClasses = [
        'h-full',
        'bg-score-bar',
        'transition-all',
        'duration-300'
      ]

      expectedClasses.forEach(className => {
        expect(progressBar.classes()).toContain(className)
      })
    })

    it('calculates correct width for different ratings', () => {
      const testCases = [
        { rating: 0, expectedWidth: '0%' },
        { rating: 1, expectedWidth: '20%' },
        { rating: 2.5, expectedWidth: '50%' },
        { rating: 3, expectedWidth: '60%' },
        { rating: 4, expectedWidth: '80%' },
        { rating: 5, expectedWidth: '100%' }
      ]

      testCases.forEach(({ rating, expectedWidth }) => {
        const wrapper = mount(ScoreBar, {
          props: { rating }
        })

        const progressBar = wrapper.findAll('div')[1]
        expect(progressBar.element.style.width).toBe(expectedWidth)
      })
    })

    it('handles edge cases for rating values', () => {
      // Test that component accepts edge case values without crashing
      expect(() => {
        mount(ScoreBar, { props: { rating: -1 } })
      }).not.toThrow()

      expect(() => {
        mount(ScoreBar, { props: { rating: 6 } })
      }).not.toThrow()

      expect(() => {
        mount(ScoreBar, { props: { rating: 0 } })
      }).not.toThrow()
    })

    it('includes smooth transition animation', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      const progressBar = wrapper.findAll('div')[1]
      expect(progressBar.classes()).toContain('transition-all')
      expect(progressBar.classes()).toContain('duration-300')
    })
  })

  describe('Divider Lines', () => {
    it('renders exactly 4 divider lines', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      const dividers = wrapper.findAll('div').slice(2) // Skip container and progress bar
      expect(dividers).toHaveLength(4)
    })

    it('applies correct styling to all dividers', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      const dividers = wrapper.findAll('div').slice(2)

      dividers.forEach(divider => {
        const expectedClasses = ['absolute', 'top-0', 'h-full', 'bg-bg-card']

        expectedClasses.forEach(className => {
          expect(divider.classes()).toContain(className)
        })

        expect(divider.attributes('style')).toContain('width: 1px')
      })
    })

    it('positions dividers at correct intervals', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      const dividers = wrapper.findAll('div').slice(2)
      const expectedPositions = [
        'left: calc(20% - 0.5px)',
        'left: calc(40% - 0.5px)',
        'left: calc(60% - 0.5px)',
        'left: calc(80% - 0.5px)'
      ]

      dividers.forEach((divider, index) => {
        expect(divider.attributes('style')).toContain(expectedPositions[index])
      })
    })

    it('creates equal spacing between dividers', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      const dividers = wrapper.findAll('div').slice(2)

      // Each divider should be 20% apart (100% / 5 segments = 20%)
      const positions = ['20%', '40%', '60%', '80%']

      dividers.forEach((divider, index) => {
        expect(divider.attributes('style')).toContain(
          `left: calc(${positions[index]} - 0.5px)`
        )
      })
    })
  })

  describe('Rating Visualization', () => {
    it('shows no progress for zero rating', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 0 }
      })

      const progressBar = wrapper.findAll('div')[1]
      expect(progressBar.element.style.width).toBe('0%')
    })

    it('shows full progress for maximum rating', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 5 }
      })

      const progressBar = wrapper.findAll('div')[1]
      expect(progressBar.element.style.width).toBe('100%')
    })

    it('shows partial progress for mid-range ratings', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 2.5 }
      })

      const progressBar = wrapper.findAll('div')[1]
      expect(progressBar.element.style.width).toBe('50%')
    })

    it('handles decimal ratings correctly', () => {
      const testCases = [
        { rating: 1.5, expectedWidth: '30%' },
        { rating: 2.3, expectedWidth: '46%' },
        { rating: 4.7, expectedWidth: '94%' }
      ]

      testCases.forEach(({ rating, expectedWidth }) => {
        const wrapper = mount(ScoreBar, {
          props: { rating }
        })

        const progressBar = wrapper.findAll('div')[1]
        expect(progressBar.element.style.width).toBe(expectedWidth)
      })
    })
  })

  describe('Dynamic Rating Updates', () => {
    it('updates progress bar width when rating prop changes', async () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 2 }
      })

      let progressBar = wrapper.findAll('div')[1]
      expect(progressBar.element.style.width).toBe('40%')

      await wrapper.setProps({ rating: 4 })

      progressBar = wrapper.findAll('div')[1]
      expect(progressBar.element.style.width).toBe('80%')
    })

    it('maintains smooth transitions on rating changes', async () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 1 }
      })

      const progressBar = wrapper.findAll('div')[1]
      expect(progressBar.classes()).toContain('transition-all')
      expect(progressBar.classes()).toContain('duration-300')

      await wrapper.setProps({ rating: 5 })

      // Transition classes should remain after prop change
      expect(progressBar.classes()).toContain('transition-all')
      expect(progressBar.classes()).toContain('duration-300')
    })
  })

  describe('Visual Design', () => {
    it('provides clear visual indication of score segments', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      // Container provides background
      const container = wrapper.find('div')
      expect(container.classes()).toContain('bg-border-lighter')

      // Progress bar provides score visualization
      const progressBar = wrapper.findAll('div')[1]
      expect(progressBar.classes()).toContain('bg-score-bar')

      // Dividers provide segment separation
      const dividers = wrapper.findAll('div').slice(2)
      dividers.forEach(divider => {
        expect(divider.classes()).toContain('bg-bg-card')
      })
    })

    it('maintains consistent visual hierarchy', () => {
      const wrapper = mount(ScoreBar, {
        props: { rating: 3 }
      })

      // Container is relatively positioned for absolute dividers
      const container = wrapper.find('div')
      expect(container.classes()).toContain('relative')

      // Dividers are absolutely positioned
      const dividers = wrapper.findAll('div').slice(2)
      dividers.forEach(divider => {
        expect(divider.classes()).toContain('absolute')
      })
    })
  })
})
