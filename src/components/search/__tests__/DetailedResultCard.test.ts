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
      '/image6.jpg'
    ],
    imageCount: 21,
    stats: {
      age: '26',
      netWorth: '$1,890 M USD (2022)'
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

    expect(wrapper.text()).toContain('21+ Images')
    const galleryImages = wrapper.findAll('img[alt*="image"]')
    expect(galleryImages).toHaveLength(6) // First 6 images displayed
  })

  it('displays age and net worth stats', () => {
    const wrapper = mount(DetailedResultCard, {
      props: { person: mockPerson }
    })

    expect(wrapper.text()).toContain('26')
    expect(wrapper.text()).toContain('Age')
    expect(wrapper.text()).toContain('$1,890')
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
})
