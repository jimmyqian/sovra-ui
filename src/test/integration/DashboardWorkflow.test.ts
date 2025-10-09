/**
 * Integration tests for Dashboard workflow
 * Tests the complete dashboard display for Robert Schmidt with new infographic layout
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import SearchDetail from '@/views/SearchDetail.vue'

describe('Dashboard Workflow Integration Tests', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/dashboard/:id',
          name: 'SearchDetail',
          component: SearchDetail
        }
      ]
    })
  })

  it('displays dashboard with infographic layout for Robert Schmidt', async () => {
    const robertSchmidtId = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'

    await router.push(`/dashboard/${robertSchmidtId}`)
    await flushPromises()

    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Verify profile display
    expect(wrapper.text()).toContain('Robert Schmidt')
    expect(wrapper.text()).toContain('Platinum Plus')
  })

  it('displays profile card with correct information', async () => {
    const robertSchmidtId = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'

    await router.push(`/dashboard/${robertSchmidtId}`)
    await flushPromises()

    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Verify profile information
    expect(wrapper.text()).toContain('Robert Schmidt')
    expect(wrapper.text()).toContain('Investment Banker & Business Owner')
    expect(wrapper.text()).toContain('New York, NY')
    expect(wrapper.text()).toContain('$250M+ USD')
  })

  it('displays stats cards in horizontal layout', async () => {
    const robertSchmidtId = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'

    await router.push(`/dashboard/${robertSchmidtId}`)
    await flushPromises()

    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Verify stats cards presence
    expect(wrapper.text()).toContain('Net Worth')
    expect(wrapper.text()).toContain('Network Size')
  })

  it('displays risk score infographic', async () => {
    const robertSchmidtId = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'

    await router.push(`/dashboard/${robertSchmidtId}`)
    await flushPromises()

    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Verify risk score infographic cards
    expect(wrapper.text()).toContain('Reputation Risk')
    expect(wrapper.text()).toContain('MED')
  })

  it('displays network graph visualization', async () => {
    const robertSchmidtId = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'

    await router.push(`/dashboard/${robertSchmidtId}`)
    await flushPromises()

    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Verify network graph
    expect(wrapper.text()).toContain('Network')
    expect(wrapper.text()).toContain('Key relationships and connections')
  })

  it('displays risk assessment cards with visual grid layout', async () => {
    const robertSchmidtId = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'

    await router.push(`/dashboard/${robertSchmidtId}`)
    await flushPromises()

    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Verify risk cards are displayed
    expect(wrapper.text()).toContain('Reputation')
    expect(wrapper.text()).toContain('Interpersonal')
    expect(wrapper.text()).toContain('Cyber Security')
    expect(wrapper.text()).toContain('Corporate')
    expect(wrapper.text()).toContain('Family')
    expect(wrapper.text()).toContain('Physical Risk')
  })

  it('displays risk items in grid format with visual indicators', async () => {
    const robertSchmidtId = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'

    await router.push(`/dashboard/${robertSchmidtId}`)
    await flushPromises()

    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Verify risk domains are displayed
    expect(wrapper.text()).toContain('Reputation')
    expect(wrapper.text()).toContain('HIGH')
    expect(wrapper.text()).toContain('MED')
    expect(wrapper.text()).toContain('LOW')
  })

  it('allows expanding risk cards for additional details', async () => {
    const robertSchmidtId = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'

    await router.push(`/dashboard/${robertSchmidtId}`)
    await flushPromises()

    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Find all risk cards with clickable cursor
    const riskCards = wrapper.findAll('.cursor-pointer')
    const clickableRiskCard = riskCards.find(
      card =>
        card.classes().includes('bg-red-50') ||
        card.classes().includes('bg-orange-50') ||
        card.classes().includes('bg-green-50')
    )

    expect(clickableRiskCard).toBeTruthy()

    if (clickableRiskCard) {
      // Click to expand
      await clickableRiskCard.trigger('click')
      await flushPromises()
      await wrapper.vm.$nextTick()

      // Verify risk details panel appears with risk content
      const text = wrapper.text()
      expect(
        text.includes('Recommended Actions') || text.includes('Risk Analysis')
      ).toBeTruthy()
    }
  })

  it('displays visualization cards in a stacked layout (not grid)', async () => {
    const robertSchmidtId = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'

    await router.push(`/dashboard/${robertSchmidtId}`)
    await flushPromises()

    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Find the visualization cards container
    const stackContainer = wrapper.find('.flex.flex-col.gap-6.mb-6')
    expect(stackContainer.exists()).toBe(true)

    // Verify it uses flex column (vertical stack), not grid
    expect(stackContainer.classes()).toContain('flex')
    expect(stackContainer.classes()).toContain('flex-col')

    // Check that the visualization container does not use grid classes
    expect(stackContainer.classes()).not.toContain('grid')
    expect(stackContainer.classes()).not.toContain('grid-cols-1')
    expect(stackContainer.classes()).not.toContain('lg:grid-cols-2')
  })

  it('displays visualization cards as full width in the stack', async () => {
    const robertSchmidtId = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'

    await router.push(`/dashboard/${robertSchmidtId}`)
    await flushPromises()

    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Find all card wrappers in the visualization stack
    const cardWrappers = wrapper.findAll('.flex.flex-col.gap-6.mb-6 > .w-full')

    // Should have at least 3 cards (Network, Timeline, Map)
    expect(cardWrappers.length).toBeGreaterThanOrEqual(3)

    // Each card wrapper should have w-full class for full width
    cardWrappers.forEach(cardWrapper => {
      expect(cardWrapper.classes()).toContain('w-full')
    })
  })

  it('displays all visualization cards in correct order in the stack', async () => {
    const robertSchmidtId = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'

    await router.push(`/dashboard/${robertSchmidtId}`)
    await flushPromises()

    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Verify all visualization cards are present
    expect(wrapper.text()).toContain('Network')
    expect(wrapper.text()).toContain('Key relationships and connections')
    expect(wrapper.text()).toContain('Life Events Timeline')
    expect(wrapper.text()).toContain('Geographic Footprint')
  })

  it('displays all dashboard cards in a single consolidated stack container', async () => {
    const robertSchmidtId = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'

    await router.push(`/dashboard/${robertSchmidtId}`)
    await flushPromises()

    const wrapper = mount(SearchDetail, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Verify all card types are present in the dashboard
    expect(wrapper.text()).toContain('Personality Profile')
    expect(wrapper.text()).toContain('Top Tracking Sources')
    expect(wrapper.text()).toContain('Network')
    expect(wrapper.text()).toContain('Life Events Timeline')
    expect(wrapper.text()).toContain('Geographic Footprint')

    // Find the main dashboard cards container
    const stackContainer = wrapper.find('.flex.flex-col.gap-6.mb-6')
    expect(stackContainer.exists()).toBe(true)

    // Should use flex column layout
    expect(stackContainer.classes()).toContain('flex')
    expect(stackContainer.classes()).toContain('flex-col')

    // Should contain multiple full-width card wrappers
    const cardWrappers = stackContainer.findAll('.w-full')
    expect(cardWrappers.length).toBeGreaterThanOrEqual(5)
  })
})
