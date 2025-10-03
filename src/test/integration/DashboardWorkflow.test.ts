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
})
