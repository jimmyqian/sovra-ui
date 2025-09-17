import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DetailedResultCard from '../DetailedResultCard.vue'

describe('DetailedResultCard', () => {
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

  it('renders stats grid correctly', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    // This component focuses on stats and detailed information display
    expect(wrapper.text()).toContain('Age')
    expect(wrapper.text()).toContain('Net Worth')
    expect(wrapper.text()).toContain('CMS')
    expect(wrapper.text()).toContain('KG')
  })

  it('displays spouse information correctly', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    expect(wrapper.text()).toContain('Spouse')
    expect(wrapper.text()).toContain('Justine')
  })

  it('renders image gallery with correct count', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    // Count should be displayed in the count indicator, not above the gallery
    const countIndicator = wrapper.find('.bg-card-dark')
    expect(countIndicator.text()).toContain('21+ Images')

    const galleryImages = wrapper.findAll('img[alt*="image"]')
    expect(galleryImages).toHaveLength(7) // First 7 images displayed
  })

  it('renders image gallery with two-row layout', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    // Image gallery should be in a flex container with stats
    const galleryAndStatsContainer = wrapper.find('.flex.flex-wrap')
    expect(galleryAndStatsContainer.exists()).toBe(true)

    // Image gallery should be first child with flex-1 and min-width
    const flexItems = galleryAndStatsContainer.findAll('.flex-1')
    expect(flexItems).toHaveLength(2)
    const imageGallery = flexItems[0]!
    expect(imageGallery).toBeTruthy()
    expect(imageGallery.attributes('style')).toContain('min-width: 300px')

    // Top row should have 4 images (grid-cols-4)
    const topRow = imageGallery.find('.space-y-2 > .grid:first-child')
    expect(topRow.classes()).toContain('grid-cols-4')
    const topRowImages = topRow.findAll('img')
    expect(topRowImages).toHaveLength(4)

    // Bottom row should have 3 images + count indicator (grid-cols-4 with 4 items)
    const bottomRow = imageGallery.find('.space-y-2 > .grid:last-child')
    expect(bottomRow.classes()).toContain('grid-cols-4')
    const bottomRowImages = bottomRow.findAll('img')
    expect(bottomRowImages).toHaveLength(3)

    // Should have image count indicator
    const countIndicator = bottomRow.find('.bg-card-dark')
    expect(countIndicator.exists()).toBe(true)
    expect(countIndicator.text()).toContain('21+ Images')
  })

  it('displays image count indicator with correct styling', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    const countIndicator = wrapper.find('.bg-card-dark')
    expect(countIndicator.exists()).toBe(true)
    expect(countIndicator.classes()).toContain('bg-card-dark')
    expect(countIndicator.attributes('style')).toContain(
      'aspect-ratio: 1.85 / 1'
    )
    expect(countIndicator.classes()).toContain('rounded-br-xl')
    expect(countIndicator.classes()).toContain('flex')
    expect(countIndicator.classes()).toContain('items-center')
    expect(countIndicator.classes()).toContain('justify-center')

    const countText = countIndicator.find('.text-brand-orange-dark')
    expect(countText.exists()).toBe(true)
    expect(countText.text()).toBe('21+ Images')
  })

  it('displays age and net worth stats', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    expect(wrapper.text()).toContain('26')
    expect(wrapper.text()).toContain('Age')
    expect(wrapper.text()).toContain('$1.890')
    expect(wrapper.text()).toContain('Net Worth')
  })

  it('renders personal information section', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    expect(wrapper.text()).toContain('Personal')
    expect(wrapper.text()).toContain('Born')
    expect(wrapper.text()).toContain('10 Aug 2000 Age 26 years')
    expect(wrapper.text()).toContain('Place of birth')
    expect(wrapper.text()).toContain('Pretoria, Washington, USA')
    expect(wrapper.text()).toContain('Spouse')
    expect(wrapper.text()).toContain('Justine m. 2023-2025')
  })

  it('renders professional information section', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    expect(wrapper.text()).toContain('Professional')
    expect(wrapper.text()).toContain('Current job title')
    expect(wrapper.text()).toContain('Software Engineer')
    expect(wrapper.text()).toContain('avg pay')
    expect(wrapper.text()).toContain('$120,000/year')
    expect(wrapper.text()).toContain('current employee')
    expect(wrapper.text()).toContain('ABC Technology Inc.')
  })

  it('renders finance information section', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    expect(wrapper.text()).toContain('Finance')
    expect(wrapper.text()).toContain('$$$ worth')
    expect(wrapper.text()).toContain('Credit score for B2B')
    expect(wrapper.text()).toContain('Housing status Rent/Own')
    expect(wrapper.text()).toContain('Own')
  })

  it('renders legal information section', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    expect(wrapper.text()).toContain('Legal')
    expect(wrapper.text()).toContain('News articles')
    expect(wrapper.text()).toContain('45 articles')
    expect(wrapper.text()).toContain('bankruptcies')
    expect(wrapper.text()).toContain('None')
    expect(wrapper.text()).toContain('crimes')
    expect(wrapper.text()).toContain('None')
  })

  it('handles missing optional data gracefully', () => {
    const personWithMissingData = {
      ...mockPerson,
      profileImage: undefined,
      images: undefined,
      finance: {
        ...mockPerson.finance,
        creditScore: undefined,
        houseWorth: undefined
      }
    }

    const wrapper = mount(DetailedResultCard, {
      props: { person: personWithMissingData }
    })

    // Profile image is now handled in PersonProfile component
    expect(wrapper.text()).toContain('N/A')
  })

  it('displays education information correctly', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    expect(wrapper.text()).toContain('Education')
    expect(wrapper.text()).toContain('University of Pennsylvania')
    expect(wrapper.text()).toContain('School of Arts and Sciences (1997)')
  })

  it('has proper component structure', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    expect(wrapper.classes()).toContain('bg-bg-card')
    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('rounded-lg')
  })

  it('handles empty image array gracefully', () => {
    const personWithNoImages = {
      ...mockPerson,
      images: [],
      imageCount: 0
    }

    const wrapper = mount(DetailedResultCard, {
      props: { person: personWithNoImages }
    })

    expect(wrapper.text()).toContain('0+ Images')
    const galleryImages = wrapper.findAll('img[alt*="image"]')
    expect(galleryImages).toHaveLength(0)

    // Count indicator should still be present
    const countIndicator = wrapper.find('.bg-card-dark')
    expect(countIndicator.exists()).toBe(true)
    expect(countIndicator.text()).toContain('0+ Images')
  })

  it('renders all section headers correctly', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    const headings = wrapper.findAll('h3')
    const headingTexts = headings.map(h => h.text())

    expect(headingTexts).toContain('Personal')
    expect(headingTexts).toContain('Professional')
    expect(headingTexts).toContain('Finance')
    expect(headingTexts).toContain('Legal')
  })

  it('displays height and weight information', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    expect(wrapper.text()).toContain('Height/Weight')
    expect(wrapper.text()).toContain('176 CMs / 67 KG')
  })

  it('renders stats grid to the right of image gallery with responsive behavior', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    // Should have flex container for gallery and stats
    const container = wrapper.find('.flex.flex-wrap')
    expect(container.exists()).toBe(true)

    // Stats grid container should be the second child with flex-1 for responsive behavior
    const flexItems = container.findAll('.flex-1')
    expect(flexItems).toHaveLength(2)
    const statsContainer = flexItems[1]!
    expect(statsContainer).toBeTruthy()
    expect(statsContainer.exists()).toBe(true)

    // Inner grid should contain the actual stats grid
    const statsGrid = statsContainer.find('.grid.grid-cols-4')
    expect(statsGrid.exists()).toBe(true)

    // Stats grid should contain all 4 stat cards
    const statCards = statsGrid.findAll('.bg-gray-50')
    expect(statCards).toHaveLength(4)

    // Verify stats content is present
    expect(statsGrid.text()).toContain('CMS')
    expect(statsGrid.text()).toContain('KG')
    expect(statsGrid.text()).toContain('Age')
    expect(statsGrid.text()).toContain('Net Worth')
    expect(statsGrid.text()).toContain('Spouse')
  })

  it('renders components with proper aspect ratios and sizing', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    // Image gallery should use aspect-ratio 1.85:1
    const imageContainers = wrapper.findAll(
      'div[style*="aspect-ratio: 1.85 / 1"]'
    )
    expect(imageContainers.length).toBeGreaterThan(0) // Should have images and count indicator

    // Stats cards should have smaller padding for compact layout
    const statCardsWithPadding = wrapper.findAll('.p-2\\.5')
    expect(statCardsWithPadding).toHaveLength(4)

    // Stats container should use flex layout with proper min-width
    const flexItems = wrapper.findAll('.flex-1')
    expect(flexItems).toHaveLength(2)
    const statsContainer = flexItems[1]!
    expect(statsContainer).toBeTruthy()
    expect(statsContainer.exists()).toBe(true)
    expect(statsContainer.attributes('style')).toContain('min-width: 350px')

    // Inner stats grid should use grid layout for horizontal display
    const statsGrid = statsContainer.find('.grid.grid-cols-4')
    expect(statsGrid.exists()).toBe(true)
  })

  it('renders images with proper scaling and centering', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    // All images should have object-cover and object-center classes for proper scaling
    const galleryImages = wrapper.findAll('img[alt*="image"]')
    expect(galleryImages).toHaveLength(7) // First 7 images displayed

    galleryImages.forEach(image => {
      expect(image.classes()).toContain('object-cover')
      expect(image.classes()).toContain('object-center')
      expect(image.classes()).toContain('w-full')
      expect(image.classes()).toContain('h-full')
    })
  })

  it('renders image grid and stats grid with 50/50 width distribution', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    // Both grids should have flex-1 for equal width distribution
    const flexItems = wrapper.findAll('.flex-1')
    expect(flexItems).toHaveLength(2)

    // Image gallery should have 300px minimum width
    const imageGallery = flexItems[0]!
    expect(imageGallery).toBeTruthy()
    expect(imageGallery.attributes('style')).toContain('min-width: 300px')

    // Stats container should have 350px minimum width
    const statsContainer = flexItems[1]!
    expect(statsContainer.attributes('style')).toContain('min-width: 350px')
    expect(statsContainer.classes()).toContain('flex-1')

    // Inner grid should have grid-cols-4
    const innerGrid = statsContainer.find('.grid.grid-cols-4')
    expect(innerGrid.exists()).toBe(true)
    expect(innerGrid.classes()).toContain('grid-cols-4')
  })

  it('renders stats grid with proper layout structure', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    // Main container should use standard flex layout
    const mainContainer = wrapper.find('.flex.flex-wrap')
    expect(mainContainer.exists()).toBe(true)

    // Stats container should be a standard flex-1 container
    const flexItems = wrapper.findAll('.flex-1')
    expect(flexItems).toHaveLength(2)
    const statsContainer = flexItems[1]!
    expect(statsContainer).toBeTruthy()
    expect(statsContainer.exists()).toBe(true)

    // Inner grid should be a standard grid without height restrictions
    const innerGrid = statsContainer.find('.grid.grid-cols-4')
    expect(innerGrid.exists()).toBe(true)
    expect(innerGrid.classes()).toContain('grid-cols-4')
  })
})
