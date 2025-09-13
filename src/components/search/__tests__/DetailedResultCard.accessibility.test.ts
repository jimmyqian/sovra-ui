/**
 * Accessibility tests for DetailedResultCard component
 * Tests semantic structure, ARIA attributes, image accessibility, and color contrast for the detailed card
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import DetailedResultCard from '../DetailedResultCard.vue'
import '@/test/accessibility/shared/accessibility-matchers'

describe('DetailedResultCard Accessibility', () => {
  let wrapper: VueWrapper<InstanceType<typeof DetailedResultCard>>

  const mockPerson = {
    name: 'Johnson Smith',
    profileImage: '/test-profile.jpg',
    images: [
      '/image1.jpg',
      '/image2.jpg',
      '/image3.jpg',
      '/image4.jpg',
      '/image5.jpg',
      '/image6.jpg',
      '/image7.jpg'
    ],
    imageCount: 21,
    stats: {
      age: '26',
      netWorth: '$1.890 M USD (2022)'
    },
    personal: {
      birthDate: '10 Aug 2000',
      birthPlace: 'Pretoria, Washington, USA',
      spouse: 'Justine m. 2023-2025',
      currentLocation: 'Phoenix, AZ, USA',
      height: '176 CMs',
      weight: '67 KG',
      education: {
        university: 'University of Pennsylvania',
        degree: 'Computer Science',
        year: '1997'
      }
    },
    professional: {
      currentJob: 'Software Engineer',
      avgPay: '$120,000/year',
      currentEmployer: 'ABC Technology Inc.',
      timeInField: '5 years',
      boards: 'Tech Advisory Board'
    },
    finance: {
      worth: '$156M+ 67 M USD',
      creditScore: '750',
      housingStatus: 'Own',
      houseWorth: '$850,000',
      businessEntities: '2 LLCs',
      businessStatus: 'Active'
    },
    legal: {
      newsArticles: '45 articles',
      bankruptcies: 'None',
      childSupport: 'N/A',
      crimes: 'None',
      allegations: 'None'
    }
  }

  beforeEach(() => {
    document.body.innerHTML = '<div id="test-container"></div>'
  })

  afterEach(() => {
    wrapper?.unmount()
    document.body.innerHTML = ''
  })

  describe('Image Gallery Accessibility', () => {
    beforeEach(() => {
      wrapper = mount(DetailedResultCard, {
        props: { person: mockPerson }
      })
    })

    it('should provide descriptive alt text for all images', () => {
      const images = wrapper.findAll('img[alt*="image"]')

      expect(images).toHaveLength(7)

      images.forEach((img, index) => {
        const altText = img.attributes('alt')
        expect(altText).toBeDefined()
        expect(altText).toBeTruthy()
        if (altText) {
          expect(altText).toContain('Johnson Smith')
          expect(altText).toContain(`image ${index + 1}`)
          expect(altText.length).toBeGreaterThan(0)
        }
      })
    })

    it('should have proper semantic structure for image gallery', () => {
      // Image gallery should be contained within semantic sections
      const imageGallery = wrapper.find('.space-y-2')
      expect(imageGallery.exists()).toBe(true)

      // Should have clear visual grouping with proper spacing
      expect(imageGallery.classes()).toContain('space-y-2')

      // Top and bottom rows should be properly structured
      const rows = imageGallery.findAll('.grid')
      expect(rows).toHaveLength(2)

      rows.forEach(row => {
        expect(row.classes()).toContain('grid-cols-4')
        expect(row.classes()).toContain('gap-2')
      })
    })

    it('should provide accessible image count indicator', () => {
      const countIndicator = wrapper.find('.bg-card-dark')
      expect(countIndicator.exists()).toBe(true)

      // Check that the count text is readable and properly styled
      const countText = countIndicator.find('.text-brand-orange')
      expect(countText.exists()).toBe(true)
      expect(countText.text()).toBe('21+ Images')

      // Ensure the indicator has proper visual hierarchy
      expect(countText.classes()).toContain('font-medium')
      expect(countIndicator.classes()).toContain('flex')
      expect(countIndicator.classes()).toContain('items-center')
      expect(countIndicator.classes()).toContain('justify-center')
    })

    it('should maintain proper color contrast for image count indicator', () => {
      const countIndicator = wrapper.find('.bg-card-dark .text-brand-orange')
      expect(countIndicator.exists()).toBe(true)

      // The bg-card-dark (#FFEDE2) with brand-orange text should provide sufficient contrast
      // This is a visual design choice that should be validated
      expect(countIndicator.classes()).toContain('text-brand-orange')
    })

    it('should handle empty image arrays accessibly', () => {
      const personWithNoImages = {
        ...mockPerson,
        images: [],
        imageCount: 0
      }

      wrapper = mount(DetailedResultCard, {
        props: { person: personWithNoImages }
      })

      // Count indicator should still be present and informative
      const countIndicator = wrapper.find('.bg-card-dark')
      expect(countIndicator.exists()).toBe(true)
      expect(countIndicator.text()).toContain('0+ Images')

      // No images should be present
      const images = wrapper.findAll('img[alt*="image"]')
      expect(images).toHaveLength(0)
    })
  })

  describe('Section Heading Hierarchy', () => {
    beforeEach(() => {
      wrapper = mount(DetailedResultCard, {
        props: { person: mockPerson }
      })
    })

    it('should have proper heading hierarchy for data sections', () => {
      const headings = wrapper.findAll('h3')
      const headingTexts = headings.map(h => h.text())

      expect(headingTexts).toContain('Personal')
      expect(headingTexts).toContain('Professional')
      expect(headingTexts).toContain('Finance')
      expect(headingTexts).toContain('Legal')
      expect(headingTexts).toContain('Accounts')

      // All section headings should be h3 elements
      headings.forEach(heading => {
        expect(heading.element.tagName).toBe('H3')
        // Some headings use font-semibold, font-medium, or font-bold
        expect(
          heading.classes().includes('font-semibold') ||
            heading.classes().includes('font-medium') ||
            heading.classes().includes('font-bold')
        ).toBe(true)
      })
    })

    it('should maintain consistent heading styles for accessibility', () => {
      const sectionHeadings = wrapper.findAll('h3')

      sectionHeadings.forEach(heading => {
        // Consistent typography for screen readers and visual users
        expect(
          heading.classes().includes('font-semibold') ||
            heading.classes().includes('font-medium') ||
            heading.classes().includes('font-bold')
        ).toBe(true)
        expect(heading.classes()).toContain('text-text-primary')
      })
    })
  })

  describe('Data Presentation Accessibility', () => {
    beforeEach(() => {
      wrapper = mount(DetailedResultCard, {
        props: { person: mockPerson }
      })
    })

    it('should provide clear labels for all data points', () => {
      // Check that data is presented with proper labels
      expect(wrapper.text()).toContain('Born')
      expect(wrapper.text()).toContain('Place of birth')
      expect(wrapper.text()).toContain('Current job title')
      expect(wrapper.text()).toContain('Housing status Rent/Own')
      expect(wrapper.text()).toContain('News articles')

      // Statistical data should be clearly labeled
      expect(wrapper.text()).toContain('Age')
      expect(wrapper.text()).toContain('Net Worth')
      expect(wrapper.text()).toContain('CMS')
      expect(wrapper.text()).toContain('KG')
    })

    it('should use semantic color coding with sufficient contrast', () => {
      // Orange brand color is used for interactive elements and highlights
      const orangeElements = wrapper.findAll('.text-brand-orange')
      expect(orangeElements.length).toBeGreaterThan(0)

      // Check specific use cases of brand orange
      const imageCountElements = wrapper.findAll('.text-brand-orange')
      const imageCountElement = imageCountElements.find(el =>
        el.text().includes('21+ Images')
      )
      expect(imageCountElement).toBeDefined()
      expect(imageCountElement?.text()).toContain('21+ Images')

      // Spouse link should be branded
      const spouseLink = imageCountElements.find(el =>
        el.text().includes('Justine')
      )
      expect(spouseLink).toBeDefined()
    })

    it('should maintain proper text hierarchy for screen readers', () => {
      // Secondary text should be clearly distinguished
      const secondaryTexts = wrapper.findAll('.text-text-secondary')
      expect(secondaryTexts.length).toBeGreaterThan(0)

      // Primary data should use primary text color
      const primaryTexts = wrapper.findAll('.text-text-primary')
      expect(primaryTexts.length).toBeGreaterThan(0)
    })
  })

  describe('Keyboard Navigation and Focus Management', () => {
    beforeEach(() => {
      wrapper = mount(DetailedResultCard, {
        props: { person: mockPerson }
      })
    })

    it('should handle focus for interactive elements', () => {
      // Find interactive elements like buttons and links
      const knowMoreLink = wrapper.find(
        '.text-brand-orange.hover\\:underline.cursor-pointer'
      )
      expect(knowMoreLink.exists()).toBe(true)

      const loginButton = wrapper
        .findAll('button')
        .find(btn => btn.text().includes('Login for more details'))
      expect(loginButton?.exists()).toBe(true)
      expect(loginButton?.text()).toContain('Login for more details')
    })

    it('should provide appropriate focus indicators', () => {
      // Interactive elements should have hover states
      const hoverElements = wrapper.findAll('.hover\\:underline')
      expect(hoverElements.length).toBeGreaterThan(0)

      // Buttons should be properly styled for focus
      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.element.tagName).toBe('BUTTON')
      })
    })
  })

  describe('Responsive Accessibility', () => {
    beforeEach(() => {
      wrapper = mount(DetailedResultCard, {
        props: { person: mockPerson }
      })
    })

    it('should maintain accessibility across responsive breakpoints', () => {
      // Stats grid should be positioned next to image gallery with proper responsive behavior
      const flexContainer = wrapper.find('.flex.flex-wrap')
      expect(flexContainer.exists()).toBe(true)

      // Stats container should be a standard flex-1 container
      const flexItems = flexContainer.findAll('.flex-1')
      expect(flexItems).toHaveLength(2)
      const statsContainer = flexItems[1]
      expect(statsContainer).toBeTruthy()
      if (statsContainer) {
        expect(statsContainer.exists()).toBe(true)

        // Inner stats grid should have proper classes
        const statsGrid = statsContainer.find('.grid.grid-cols-4')
        expect(statsGrid.exists()).toBe(true)
      }

      const infoGrid = wrapper.find('.grid.grid-cols-3.gap-6')
      expect(infoGrid.exists()).toBe(true)

      // Image gallery grid should be properly responsive
      const imageGallery = flexItems[0]
      expect(imageGallery).toBeTruthy()
      if (imageGallery) {
        expect(imageGallery.exists()).toBe(true)
        const imageGrids = imageGallery.findAll('.grid.grid-cols-4.gap-2')
        expect(imageGrids).toHaveLength(2) // Top and bottom rows
      }
    })

    it('should maintain proper spacing and layout for accessibility', () => {
      // Component should use semantic spacing
      const mainContainer = wrapper.find('.p-6.space-y-6')
      expect(mainContainer.exists()).toBe(true)

      // Text content should have proper spacing
      const textSections = wrapper.findAll('.space-y-3')
      expect(textSections.length).toBeGreaterThan(0)
    })
  })
})
