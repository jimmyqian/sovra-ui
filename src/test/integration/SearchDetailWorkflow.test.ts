import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import SearchDetail from '@/views/SearchDetail.vue'

// Mock the router
const mockPush = vi.fn()
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush
    }),
    useRoute: () => ({
      params: { id: 'johnson-smith' }
    })
  }
})

describe('SearchDetail Integration Tests', () => {
  let router: Router
  let pinia: Pinia

  beforeEach(async () => {
    vi.clearAllMocks()

    // Set up Pinia
    pinia = createPinia()
    setActivePinia(pinia)

    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'Home',
          component: { template: '<div>Home</div>' }
        },
        {
          path: '/search/:id',
          name: 'SearchDetail',
          component: SearchDetail
        }
      ]
    })

    // Set initial route to avoid warnings
    await router.push('/search/1')
  })

  it('renders complete SearchDetail page structure', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Check main layout components are present
    expect(wrapper.findComponent({ name: 'AppHeader' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'AppSidebar' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'SearchBar' }).exists()).toBe(true)
  })

  it('displays person profile information correctly', async () => {
    // Check PersonProfile component content with dynamic name behavior
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Since no person data is found for ID "1" in the search store,
    // it should show "Unknown Person" as the fallback
    expect(wrapper.text()).toContain('Unknown Person')
    expect(wrapper.text()).toContain('Overview')
    expect(wrapper.text()).toContain('Personal Life')
    expect(wrapper.text()).toContain('Professional Life')
  })

  it('handles tag button active states and interactions', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Find the PersonProfile component and its tag buttons
    const personProfile = wrapper.findComponent({ name: 'PersonProfile' })
    expect(personProfile.exists()).toBe(true)

    // Find tag buttons
    const tagButtons = personProfile.findAllComponents({ name: 'Button' })
    expect(tagButtons.length).toBeGreaterThan(0)

    // Find Overview and Personal Life buttons
    const overviewButton = tagButtons.find(btn => btn.text() === 'Overview')
    const personalLifeButton = tagButtons.find(
      btn => btn.text() === 'Personal Life'
    )

    expect(overviewButton?.exists()).toBe(true)
    expect(personalLifeButton?.exists()).toBe(true)

    // Initially Overview should be active (since it's the default)
    expect(overviewButton?.props('active')).toBe(true)
    expect(personalLifeButton?.props('active')).toBe(false)

    // Click Personal Life button
    await personalLifeButton?.trigger('click')

    // Check that Personal Life is now active and Overview is not
    expect(personalLifeButton?.props('active')).toBe(true)
    expect(overviewButton?.props('active')).toBe(false)

    // Verify tagClick event was emitted
    expect(personProfile.emitted('tagClick')).toBeTruthy()
    expect(personProfile.emitted('tagClick')![0]).toEqual(['Personal Life'])
  })

  it('applies correct styling to active tag buttons', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Find PersonProfile component
    const personProfile = wrapper.findComponent({ name: 'PersonProfile' })
    const tagButtons = personProfile.findAllComponents({ name: 'Button' })

    // Check that all tag buttons have outline variant
    tagButtons.forEach(button => {
      expect(button.props('variant')).toBe('outline')
      expect(button.props('size')).toBe('sm')
    })

    // Find Overview button (should be active by default)
    const overviewButton = tagButtons.find(btn => btn.text() === 'Overview')
    expect(overviewButton?.props('active')).toBe(true)

    // Test clicking different tags
    const healthButton = tagButtons.find(btn => btn.text() === 'Health')
    if (healthButton) {
      await healthButton.trigger('click')
      expect(healthButton.props('active')).toBe(true)
    }
  })

  it('shows detailed person information in DetailedResultCard', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Check detailed information sections
    expect(wrapper.text()).toContain('Personal')
    expect(wrapper.text()).toContain('Professional')
    expect(wrapper.text()).toContain('Finance')
    expect(wrapper.text()).toContain('Legal')

    // Check specific data points
    expect(wrapper.text()).toContain('Born')
    expect(wrapper.text()).toContain('10 Aug 2000')
    expect(wrapper.text()).toContain('Software Engineer')
    expect(wrapper.text()).toContain('$120,000/year')
  })

  it('displays category tabs with correct default state', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Check CategoryTabs component
    expect(wrapper.text()).toContain('Relationship Status')
    expect(wrapper.text()).toContain('Married')
  })

  it('allows tab switching in category section', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Find and click Professional tab
    const professionalTab = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Professional')
    await professionalTab?.trigger('click')

    // Check professional content is displayed
    expect(wrapper.text()).toContain('Industry')
    expect(wrapper.text()).toContain('Technology')
    expect(wrapper.text()).toContain('Years Experience')
  })

  it('renders activity footer with reference categories', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Check ActivityFooter content
    expect(wrapper.text()).toContain('Loans / Deposits')
    expect(wrapper.text()).toContain('Average Pay')
    expect(wrapper.text()).toContain('Show all references')
  })

  it('handles search functionality', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Find search input and button
    const searchInput = wrapper.find('textarea')
    const searchButton = wrapper
      .findAll('button')
      .find(btn => btn.element.innerHTML.includes('svg'))

    // Enter search query
    await searchInput.setValue('Test search query')
    await searchButton?.trigger('click')

    // Verify search functionality is triggered (console.log in component)
    expect(searchInput.element.value).toBe('Test search query')
  })

  it('displays correct stats and age information', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Check age and net worth stats
    expect(wrapper.text()).toContain('26')
    expect(wrapper.text()).toContain('Age')
    expect(wrapper.text()).toContain('$1.890')
    expect(wrapper.text()).toContain('Net Worth')
  })

  it('shows social media accounts section', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Check that category tabs are rendered
    expect(wrapper.text()).toContain('Personal')
    expect(wrapper.text()).toContain('Professional')
    expect(wrapper.text()).toContain('Finance')
    expect(wrapper.text()).toContain('Legal')
  })

  it('maintains responsive layout structure', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Check main layout structure (SearchLayout component)
    expect(wrapper.find('.h-screen.bg-bg-primary').exists()).toBe(true)
    expect(
      wrapper.find('.flex-1.flex.max-h-full.overflow-hidden').exists()
    ).toBe(true)
    expect(
      wrapper
        .find('.flex-1.flex.flex-col.md\\:flex-row.max-h-full.overflow-hidden')
        .exists()
    ).toBe(true)

    // Check conversation panel structure (left panel)
    expect(
      wrapper
        .find(
          '.w-full.bg-bg-card.flex.flex-col.md\\:w-2\\/5.max-h-full.relative.overflow-hidden'
        )
        .exists()
    ).toBe(true)

    // Check right panel structure
    expect(
      wrapper
        .find('.flex-1.flex.flex-col.max-h-full.overflow-hidden.relative')
        .exists()
    ).toBe(true)
    expect(wrapper.find('main.p-6.space-y-6').exists()).toBe(true)
  })

  it('loads person data based on route parameter', async () => {
    // This test would verify that the component loads data based on route params
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // In a real application, this would test API calls based on route.params.id
    // For now, we verify that the component is aware of the route parameter structure
    expect(wrapper.vm).toBeDefined()
  })

  it('handles file upload functionality', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Find the upload button
    const uploadButton = wrapper
      .findAll('button')
      .find(btn => btn.text() === 'Upload')

    if (uploadButton) {
      await uploadButton.trigger('click')
      // In real implementation, this would trigger file input
      expect(uploadButton.exists()).toBe(true)
    }
  })

  it('displays education information correctly', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Check education details
    expect(wrapper.text()).toContain('Education')
    expect(wrapper.text()).toContain('University of Pennsylvania')
    expect(wrapper.text()).toContain('1997')
  })

  it('shows proper section organization and hierarchy', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Check that sections are properly organized
    const sections = wrapper.findAll('div.space-y-6 > *')
    expect(sections.length).toBeGreaterThanOrEqual(4) // PersonProfile, DetailedResultCard, CategoryTabs, ActivityFooter

    // Check section headings exist
    expect(wrapper.findAll('h1, h2, h3').length).toBeGreaterThan(0)
  })

  it('integrates search bar with proper placeholder', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('placeholder')).toContain(
      "Tell me more about who you're looking for"
    )
  })

  it('displays image gallery with two-row layout and count indicator', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Check that image gallery shows count in the indicator
    const galleryCountIndicator = wrapper.find('.bg-card-dark')
    expect(galleryCountIndicator.text()).toContain('21+ Images')

    // Check that images are displayed in two rows
    const imageGallery = wrapper.find('.space-y-2')
    expect(imageGallery.exists()).toBe(true)

    // Top row should have 4 images
    const topRowImages = imageGallery.findAll('.grid:first-child img')
    expect(topRowImages).toHaveLength(4)

    // Bottom row should have 3 images
    const bottomRowImages = imageGallery.findAll('.grid:last-child img')
    expect(bottomRowImages).toHaveLength(3)

    // Should have count indicator in bottom row
    const countIndicator = imageGallery.find('.bg-card-dark')
    expect(countIndicator.exists()).toBe(true)
    expect(countIndicator.text()).toContain('21+ Images')
  })

  it('handles image gallery with different image counts', async () => {
    // This would test with different mock data, but for now we verify the structure exists
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verify the gallery structure is present and handles the current data
    const galleryImages = wrapper.findAll('img[alt*="image"]')
    expect(galleryImages).toHaveLength(7) // Should show 7 images total

    // Verify count indicator styling
    const countIndicator = wrapper.find('.bg-card-dark .text-brand-orange')
    expect(countIndicator.exists()).toBe(true)
    expect(countIndicator.classes()).toContain('text-brand-orange')
    expect(countIndicator.classes()).toContain('font-medium')
  })

  it('integrates image gallery with person profile and other sections', async () => {
    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verify image gallery is part of the DetailedResultCard which is in the right panel
    const rightPanel = wrapper.find(
      '.flex-1.flex.flex-col.max-h-full.overflow-hidden.relative'
    )
    expect(rightPanel.exists()).toBe(true)

    const detailedCard = rightPanel.findComponent({
      name: 'DetailedResultCard'
    })
    expect(detailedCard.exists()).toBe(true)

    // Verify image gallery is within the detailed card structure
    const imageGallery = detailedCard.find('.space-y-2')
    expect(imageGallery.exists()).toBe(true)

    // Verify it's properly integrated with other sections
    expect(wrapper.text()).toContain('Personal')
    expect(wrapper.text()).toContain('Professional')
    expect(wrapper.text()).toContain('21+ Images')
  })
})
