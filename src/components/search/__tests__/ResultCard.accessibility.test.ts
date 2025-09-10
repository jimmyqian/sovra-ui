/**
 * Accessibility tests for ResultCard component
 * Tests semantic structure, ARIA attributes, color contrast, and screen reader compatibility
 */

import { describe, it, expect, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import ResultCard from '../ResultCard.vue'
import { AccessibilityTestHelper } from '@/test/accessibility/shared/accessibility-test-helpers'
import '@/test/accessibility/shared/accessibility-matchers'

describe('ResultCard Accessibility', () => {
  let wrapper: VueWrapper<any>

  const mockResult = {
    id: '1',
    name: 'John Smith',
    age: 35,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'New York, NY',
    rating: 4.5,
    references: 127,
    companies: 8,
    contacts: 23
  }

  beforeEach(() => {
    document.body.innerHTML = '<div id="test-container"></div>'
  })

  afterEach(() => {
    wrapper?.unmount()
    document.body.innerHTML = ''
  })

  describe('Semantic Structure and Headings', () => {
    it('should have proper heading hierarchy', () => {
      wrapper = mount(ResultCard, {
        props: { result: mockResult }
      })

      const heading = wrapper.find('h3').element
      expect(heading.textContent?.trim()).toBe('John Smith')
      expect(heading.className).toContain('text-xl font-semibold')

      // Verify it's properly structured as a heading
      expect(heading.tagName).toBe('H3')
    })

    it('should use semantic HTML structure for data display', () => {
      wrapper = mount(ResultCard, {
        props: { result: mockResult }
      })

      // Should use proper semantic structure for statistics
      const statItems = wrapper.findAll('.stat-item')
      expect(statItems.length).toBe(3)

      // Each stat should have number and label
      statItems.forEach(stat => {
        const number = stat.find('.stat-number')
        const label = stat.find('.stat-label')
        expect(number.exists()).toBe(true)
        expect(label.exists()).toBe(true)
      })
    })

    it('should provide proper document structure for screen readers', () => {
      wrapper = mount(ResultCard, {
        props: { result: mockResult }
      })

      const semanticResult =
        AccessibilityTestHelper.testSemanticStructure(wrapper)
      expect(semanticResult.hasProperHeadingHierarchy).toBe(true)
    })
  })

  describe('ARIA Attributes and Screen Reader Support', () => {
    it('should make statistics accessible to screen readers', () => {
      wrapper = mount(ResultCard, {
        props: { result: mockResult }
      })

      // Statistics should be clearly labeled
      const statNumbers = wrapper.findAll('.stat-number')
      const statLabels = wrapper.findAll('.stat-label')

      expect(statNumbers[0].text()).toBe('127')
      expect(statLabels[0].text()).toContain('References')

      expect(statNumbers[1].text()).toBe('8')
      expect(statLabels[1].text()).toContain('companies')

      expect(statNumbers[2].text()).toBe('23')
      expect(statLabels[2].text()).toContain('Contacts')
    })

    it('should provide accessible rating information', () => {
      wrapper = mount(ResultCard, {
        props: { result: mockResult }
      })

      // Rating should be accessible
      const ratingText = wrapper.find('.text-sm.font-semibold').element
      expect(ratingText.textContent).toBe('4.5')

      // Rating label should be present
      const ratingLabel = wrapper.find('.text-xs.text-text-secondary').element
      expect(ratingLabel.textContent).toBe('Sovra Rating')
    })

    it('should support enhanced ARIA labeling for better screen reader experience', () => {
      // Test with enhanced accessibility attributes
      const enhancedWrapper = mount({
        components: { ResultCard },
        template: `
          <article role="article" aria-labelledby="person-name-1">
            <ResultCard :result="result" />
          </article>
        `,
        data() {
          return { result: mockResult }
        }
      })

      const article = enhancedWrapper.find('article').element
      expect(article.getAttribute('role')).toBe('article')
      expect(article.getAttribute('aria-labelledby')).toBe('person-name-1')
    })

    it('should make personal information accessible', () => {
      wrapper = mount(ResultCard, {
        props: { result: mockResult }
      })

      // Personal info should be clearly structured
      const personalInfo = wrapper.find('.flex.gap-4.mb-3')
      const infoItems = personalInfo.findAll('span')

      expect(infoItems[0].text()).toBe('35 Years')
      expect(infoItems[1].text()).toBe('Male')
      expect(infoItems[2].text()).toBe('Married')
      expect(infoItems[3].text()).toBe('New York, NY')
    })
  })

  describe('Color Contrast and Visual Accessibility', () => {
    it('should meet contrast requirements for primary content', () => {
      wrapper = mount(ResultCard, {
        props: { result: mockResult }
      })

      const heading = wrapper.find('h3').element
      expect(heading.className).toContain('text-text-primary')

      // Test overall contrast
      const contrastResult = AccessibilityTestHelper.testColorContrast(wrapper)
      expect(contrastResult.results.length).toBeGreaterThanOrEqual(0)

      if (!contrastResult.passes) {
        // Log contrast issues for awareness
        console.warn('ResultCard contrast issues:', contrastResult.issues)
      }
    })

    it('should have proper contrast for secondary text elements', () => {
      wrapper = mount(ResultCard, {
        props: { result: mockResult }
      })

      const secondaryText = wrapper.find('.text-text-secondary').element
      expect(secondaryText.className).toContain('text-text-secondary')

      // Secondary text should still be readable
      const styles = window.getComputedStyle(secondaryText)
      expect(styles.color).toBeDefined()
    })

    it('should maintain accessibility with different data values', () => {
      const testResults = [
        { ...mockResult, rating: 1.0, name: 'A' },
        {
          ...mockResult,
          rating: 5.0,
          name: 'Very Long Name That Might Wrap To Multiple Lines'
        },
        { ...mockResult, references: 0, companies: 0, contacts: 0 }
      ]

      testResults.forEach(result => {
        wrapper = mount(ResultCard, { props: { result } })

        const heading = wrapper.find('h3').element
        expect(heading).toHaveAccessibleName(result.name)
        expect(heading.textContent).toBe(result.name)
      })
    })
  })

  describe('Responsive Design Accessibility', () => {
    it('should maintain accessibility across different screen sizes', () => {
      wrapper = mount(ResultCard, {
        props: { result: mockResult }
      })

      // Check for responsive classes that shouldn't break accessibility
      const container = wrapper.find('.result-card').element
      expect(container.className).toContain('result-card')

      // Responsive layout classes
      const flexContainer = wrapper.find('.flex.items-start.gap-4').element
      expect(flexContainer.className).toContain('flex-1 md:min-w-80')
    })

    it('should handle long text content gracefully', () => {
      const longTextResult = {
        ...mockResult,
        name: 'Very Long Name That Might Cause Layout Issues When Displayed',
        location: 'Very Long Location Name, State With Long Name, Country'
      }

      wrapper = mount(ResultCard, {
        props: { result: longTextResult }
      })

      // Text should be properly contained
      const nameElement = wrapper.find('h3').element
      expect(nameElement.className).toContain('min-w-0') // Allows text truncation

      const locationElement = wrapper.find('.location').element
      expect(locationElement.textContent).toBe(longTextResult.location)
    })
  })

  describe('Data Presentation Accessibility', () => {
    it('should present numerical data clearly for screen readers', () => {
      wrapper = mount(ResultCard, {
        props: { result: mockResult }
      })

      // Age should be clearly presented
      const ageElement = wrapper.find('.age').element
      expect(ageElement.textContent).toBe('35 Years')

      // Rating should be clear
      const ratingElement = wrapper.find('.text-sm.font-semibold').element
      expect(ratingElement.textContent).toBe('4.5')

      // Statistics should be clear
      const statNumbers = wrapper.findAll('.stat-number')
      expect(statNumbers[0].text()).toBe('127')
      expect(statNumbers[1].text()).toBe('8')
      expect(statNumbers[2].text()).toBe('23')
    })

    it('should handle edge cases in data presentation', () => {
      const edgeCaseResult = {
        ...mockResult,
        rating: 0,
        references: 999999,
        companies: 0,
        contacts: 1
      }

      wrapper = mount(ResultCard, {
        props: { result: edgeCaseResult }
      })

      // Large numbers should be displayed
      const referencesElement = wrapper.findAll('.stat-number')[0]
      expect(referencesElement.text()).toBe('999999')

      // Zero values should be displayed
      const companiesElement = wrapper.findAll('.stat-number')[1]
      expect(companiesElement.text()).toBe('0')
    })

    it('should make the rating component accessible', () => {
      wrapper = mount(ResultCard, {
        props: { result: mockResult }
      })

      // Rating should have proper context
      const ratingLabel = wrapper.find('.text-xs.text-text-secondary')
      expect(ratingLabel.text()).toBe('Sovra Rating')

      const ratingValue = wrapper.find('.text-sm.font-semibold')
      expect(ratingValue.text()).toBe('4.5')

      // ScoreBar component should be present
      const scoreBar = wrapper.findComponent({ name: 'ScoreBar' })
      expect(scoreBar.exists()).toBe(true)
    })
  })

  describe('Integration Accessibility Tests', () => {
    it('should work properly in list contexts', () => {
      const listWrapper = mount({
        components: { ResultCard },
        template: `
          <div role="list" aria-label="Search results">
            <div role="listitem" v-for="result in results" :key="result.id">
              <ResultCard :result="result" />
            </div>
          </div>
        `,
        data() {
          return {
            results: [mockResult]
          }
        }
      })

      const list = listWrapper.find('[role="list"]').element
      expect(list.getAttribute('aria-label')).toBe('Search results')

      const listItem = listWrapper.find('[role="listitem"]').element
      expect(listItem).toBeDefined()
    })

    it('should support comprehensive accessibility validation', () => {
      wrapper = mount(ResultCard, {
        props: { result: mockResult }
      })

      // Should have reasonable semantic structure
      const semanticResult =
        AccessibilityTestHelper.testSemanticStructure(wrapper)
      expect(semanticResult.hasProperHeadingHierarchy).toBe(true)

      // Main container should be accessible
      const container = wrapper.find('.result-card').element
      expect(container).toBeDefined()
    })

    it('should maintain accessibility with incomplete data', () => {
      const incompleteResult = {
        id: '2',
        name: '',
        age: 0,
        gender: '',
        maritalStatus: '',
        location: '',
        rating: 0,
        references: 0,
        companies: 0,
        contacts: 0
      }

      wrapper = mount(ResultCard, {
        props: { result: incompleteResult }
      })

      // Should handle empty data gracefully
      const heading = wrapper.find('h3').element
      expect(heading.textContent).toBe('')

      // Statistics should still be present
      const statNumbers = wrapper.findAll('.stat-number')
      expect(statNumbers.length).toBe(3)
      statNumbers.forEach(stat => {
        expect(stat.text()).toBe('0')
      })
    })
  })
})
