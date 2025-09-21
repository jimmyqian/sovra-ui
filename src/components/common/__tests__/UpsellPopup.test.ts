import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import UpsellPopup from '../UpsellPopup.vue'

describe('UpsellPopup', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const createWrapper = (props = {}) => {
    return mount(UpsellPopup, {
      props: {
        modelValue: false,
        ...props
      }
    })
  }

  describe('Component Structure', () => {
    it('renders with correct Mr. T themed content', () => {
      const wrapper = createWrapper({ modelValue: true })

      expect(wrapper.text()).toContain('Hold Up There, Fool!')
      expect(wrapper.text()).toContain('PAY SOME MONEY, FOOL!')
      expect(wrapper.text()).toContain('I pity the fool')
      expect(wrapper.text()).toContain('jibber-jabber cheapskate')
    })

    it('shows premium features list', () => {
      const wrapper = createWrapper({ modelValue: true })

      expect(wrapper.text()).toContain('Full financial breakdowns')
      expect(wrapper.text()).toContain('Complete property details')
      expect(wrapper.text()).toContain('Extended family networks')
      expect(wrapper.text()).toContain('Professional history deep-dive')
      expect(wrapper.text()).toContain('Legal records & background')
    })

    it('renders upgrade and maybe later buttons', () => {
      const wrapper = createWrapper({ modelValue: true })

      const buttons = wrapper.findAll('button')
      const upgradeButton = buttons.find(btn =>
        btn.text().includes('Upgrade to Premium')
      )
      const maybeLaterButton = buttons.find(btn =>
        btn.text().includes('Maybe later')
      )

      expect(upgradeButton?.exists()).toBe(true)
      expect(maybeLaterButton?.exists()).toBe(true)
    })
  })

  describe('Visibility Control', () => {
    it('is hidden when modelValue is false', () => {
      const wrapper = createWrapper({ modelValue: false })
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })

    it('is visible when modelValue is true', () => {
      const wrapper = createWrapper({ modelValue: true })
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
    })
  })

  describe('Event Handling', () => {
    it('emits upgrade event when upgrade button is clicked', async () => {
      const wrapper = createWrapper({ modelValue: true })

      const buttons = wrapper.findAll('button')
      const upgradeButton = buttons.find(btn =>
        btn.text().includes('Upgrade to Premium')
      )

      await upgradeButton?.trigger('click')

      expect(wrapper.emitted('upgrade')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })

    it('emits maybe-later event when maybe later button is clicked', async () => {
      const wrapper = createWrapper({ modelValue: true })

      const buttons = wrapper.findAll('button')
      const maybeLaterButton = buttons.find(btn =>
        btn.text().includes('Maybe later')
      )

      await maybeLaterButton?.trigger('click')

      expect(wrapper.emitted('maybeLater')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })

    it('closes popup when close button is clicked', async () => {
      const wrapper = createWrapper({ modelValue: true })

      const closeButton = wrapper.find('button[aria-label="Close popup"]')
      await closeButton.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })

    it('closes popup when overlay is clicked', async () => {
      const wrapper = createWrapper({ modelValue: true })

      const overlay = wrapper.find('.fixed.inset-0')
      await overlay.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })

    it('does not close when modal content is clicked', async () => {
      const wrapper = createWrapper({ modelValue: true })

      const modalContent = wrapper.find('.bg-bg-card')
      await modalContent.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('Styling and Accessibility', () => {
    it('has proper modal styling', () => {
      const wrapper = createWrapper({ modelValue: true })

      const overlay = wrapper.find('.fixed.inset-0')
      expect(overlay.classes()).toContain('bg-black')
      expect(overlay.classes()).toContain('bg-opacity-50')
      expect(overlay.classes()).toContain('z-50')

      const modal = wrapper.find('.bg-bg-card')
      expect(modal.classes()).toContain('rounded-xl')
      expect(modal.classes()).toContain('shadow-2xl')
    })

    it('has accessible close button', () => {
      const wrapper = createWrapper({ modelValue: true })

      const closeButton = wrapper.find('button[aria-label="Close popup"]')
      expect(closeButton.exists()).toBe(true)
      expect(closeButton.attributes('aria-label')).toBe('Close popup')
    })

    it('includes boxing glove emoji for Mr. T theme', () => {
      const wrapper = createWrapper({ modelValue: true })
      expect(wrapper.text()).toContain('🥊')
    })
  })
})
