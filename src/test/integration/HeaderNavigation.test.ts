import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import Landing from '@/views/Landing.vue'
import SearchResults from '@/views/SearchResults.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/navigation/AppSidebar.vue'
import Logo from '@/components/common/Logo.vue'

const createMockRouter = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: Landing },
      { path: '/search', component: SearchResults }
    ]
  })
  return router
}

describe('Header Navigation Integration', () => {
  const createWrapper = (component = AppHeader) => {
    return mount(component, {
      global: {
        plugins: [createPinia()]
      }
    })
  }

  it('displays logo correctly in header component', () => {
    const wrapper = createWrapper(AppHeader)

    // Verify header structure
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('header').classes()).toContain('bg-bg-card')
    expect(wrapper.find('header').classes()).toContain('border-b')
    expect(wrapper.find('header').classes()).toContain('border-border-light')

    // Verify logo component is present
    const logoComponent = wrapper.findComponent(Logo)
    expect(logoComponent.exists()).toBe(true)
  })

  it('renders logo with correct styling in header', () => {
    const wrapper = createWrapper(AppHeader)
    const logoComponent = wrapper.findComponent(Logo)

    // Verify logo SVG dimensions
    const logoSvg = logoComponent.find('svg')
    expect(logoSvg.exists()).toBe(true)
    expect(logoSvg.attributes('width')).toBe('52')
    expect(logoSvg.attributes('height')).toBe('52')

    // Verify logo text
    const logoText = logoComponent.find('span')
    expect(logoText.exists()).toBe(true)
    expect(logoText.text()).toBe('SOVRa')
    expect(logoText.classes()).toContain('text-logo')
    expect(logoText.classes()).toContain('font-semibold')

    // Verify orange accent bar
    const accentBar = logoComponent.find('.absolute.bg-brand-orange')
    expect(accentBar.exists()).toBe(true)
  })

  it('integrates header properly in search results page', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    await router.push('/search?q=test')

    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verify header is present in search results
    const headerComponent = wrapper.findComponent(AppHeader)
    expect(headerComponent.exists()).toBe(true)

    // Verify header is positioned correctly within layout
    const leftPanel = wrapper.find('.w-full.bg-bg-card')
    expect(leftPanel.exists()).toBe(true)
    expect(leftPanel.findComponent(AppHeader).exists()).toBe(true)
  })

  it('displays sidebar navigation correctly', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    await router.push('/')

    const wrapper = mount(AppSidebar, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verify sidebar structure
    expect(wrapper.find('.w-15.bg-bg-card').exists()).toBe(true)
    expect(wrapper.classes()).toContain('border-r')
    expect(wrapper.classes()).toContain('border-border-light')

    // Verify sidebar has navigation items
    const navItems = wrapper.findAll('.w-10.h-10')
    expect(navItems.length).toBe(5) // Should have 5 navigation items

    // Verify first item (search) is active
    const searchItem = navItems[0]!
    expect(searchItem).toBeTruthy()
    expect(searchItem.classes()).toContain('bg-brand-orange')
    expect(searchItem.classes()).toContain('text-bg-card')

    // Verify other items have hover states
    navItems.slice(1).forEach(item => {
      expect(item.classes()).toContain('hover:bg-border-hover')
      expect(item.classes()).toContain('text-text-secondary')
      expect(item.classes()).toContain('hover:text-text-primary')
    })
  })

  it('integrates sidebar properly in search results page', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    await router.push('/search')

    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verify sidebar is present
    const sidebarComponent = wrapper.findComponent(AppSidebar)
    expect(sidebarComponent.exists()).toBe(true)

    // Verify sidebar positioning in layout
    const mainLayout = wrapper.find('.flex-1.flex')
    expect(mainLayout.exists()).toBe(true)
    expect(mainLayout.findComponent(AppSidebar).exists()).toBe(true)
  })

  it('handles logo click interactions', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    await router.push('/search')

    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    const logoComponent = wrapper.findComponent(Logo)
    expect(logoComponent.exists()).toBe(true)

    // Logo should be clickable (though no click handler is implemented yet)
    const logoElement = logoComponent.find('.flex.items-center.gap-2')
    expect(logoElement.exists()).toBe(true)
  })

  it('maintains header consistency across pages', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()

    // Test header on search results page
    await router.push('/search')
    const searchWrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    const searchHeader = searchWrapper.findComponent(AppHeader)
    expect(searchHeader.exists()).toBe(true)

    const searchLogo = searchHeader.findComponent(Logo)
    expect(searchLogo.exists()).toBe(true)
    expect(searchLogo.find('span').text()).toBe('SOVRa')
  })

  it('verifies navigation accessibility features', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    await router.push('/')

    const sidebarWrapper = mount(AppSidebar, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verify navigation items are properly structured for accessibility
    const navItems = sidebarWrapper.findAll('.w-10.h-10')

    navItems.forEach(item => {
      // Should have cursor pointer for interactivity
      expect(item.classes()).toContain('cursor-pointer')

      // Should have transition for smooth interactions
      expect(item.classes()).toContain('transition-colors')

      // Should contain SVG icons
      const svgIcon = item.find('svg')
      expect(svgIcon.exists()).toBe(true)
      expect(svgIcon.attributes('width')).toBe('20')
      expect(svgIcon.attributes('height')).toBe('20')
    })
  })

  it('handles responsive header behavior', () => {
    const wrapper = mount(AppHeader)

    // Verify header has responsive padding
    const header = wrapper.find('header')
    expect(header.classes()).toContain('px-8')
    expect(header.classes()).toContain('py-4')

    // Logo should maintain proper sizing
    const logoComponent = wrapper.findComponent(Logo)
    const logoSvg = logoComponent.find('svg')
    expect(logoSvg.attributes('width')).toBe('52')
    expect(logoSvg.attributes('height')).toBe('52')
  })

  it('integrates navigation state management', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verify both header and sidebar are present and working together
    const headerComponent = wrapper.findComponent(AppHeader)
    const sidebarComponent = wrapper.findComponent(AppSidebar)

    expect(headerComponent.exists()).toBe(true)
    expect(sidebarComponent.exists()).toBe(true)

    // Verify they're positioned correctly relative to each other
    const mainLayout = wrapper.find('.flex-1.flex')
    expect(mainLayout.exists()).toBe(true)
  })

  it('validates navigation item icons and styling', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    await router.push('/')

    const wrapper = mount(AppSidebar, {
      global: {
        plugins: [router, pinia]
      }
    })

    const navItems = wrapper.findAll('.w-10.h-10')

    // Verify search icon (first item)
    const searchIcon = navItems[0]!.find('svg circle')
    expect(searchIcon.exists()).toBe(true)

    // Verify menu icon (second item)
    const menuIcon = navItems[1]!.find('svg path')
    expect(menuIcon.exists()).toBe(true)
    expect(menuIcon.attributes('d')).toContain('M4 12h16')

    // Verify edit icon (third item)
    const editIcon = navItems[2]!.find('svg path')
    expect(editIcon.exists()).toBe(true)
    expect(editIcon.attributes('d')).toContain('M12 20h9')

    // Verify settings icon (fourth item)
    const settingsIcon = navItems[3]!.find('svg circle')
    expect(settingsIcon.exists()).toBe(true)

    // Verify profile icon (fifth item)
    const profileIcon = navItems[4]!.find('svg circle')
    expect(profileIcon.exists()).toBe(true)
  })

  it('handles header border and spacing correctly', () => {
    const wrapper = mount(AppHeader)
    const header = wrapper.find('header')

    // Verify border styling
    expect(header.classes()).toContain('border-b')
    expect(header.classes()).toContain('border-border-light')

    // Verify background and padding
    expect(header.classes()).toContain('bg-bg-card')
    expect(header.classes()).toContain('px-8')
    expect(header.classes()).toContain('py-4')
  })

  it('ensures proper component hierarchy in navigation', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createMockRouter()
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verify component structure hierarchy
    const mainContainer = wrapper.find('.h-screen.bg-bg-primary')
    expect(mainContainer.exists()).toBe(true)

    const flexContainer = wrapper.find('.flex-1.flex')
    expect(flexContainer.exists()).toBe(true)

    // Sidebar should be first child
    const sidebar = flexContainer.findComponent(AppSidebar)
    expect(sidebar.exists()).toBe(true)

    // Main content area with header should be second
    const mainContent = wrapper.find('.flex-1.flex.flex-col.md\\:flex-row')
    expect(mainContent.exists()).toBe(true)

    const leftPanel = wrapper.find('.w-full.bg-bg-card')
    expect(leftPanel.exists()).toBe(true)

    const header = leftPanel.findComponent(AppHeader)
    expect(header.exists()).toBe(true)
  })
})
