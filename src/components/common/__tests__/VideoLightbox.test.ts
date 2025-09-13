/**
 * Unit tests for VideoLightbox component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import VideoLightbox from '../VideoLightbox.vue'

// Mock document methods
Object.defineProperty(document, 'addEventListener', {
  value: vi.fn(),
  writable: true
})

Object.defineProperty(document, 'removeEventListener', {
  value: vi.fn(),
  writable: true
})

// Mock document.body.style
Object.defineProperty(document.body, 'style', {
  value: { overflow: '' },
  writable: true
})

describe('VideoLightbox', () => {
  let wrapper: VueWrapper<any>

  const defaultProps = {
    isVisible: false,
    videoUrl: 'https://youtu.be/3MH54ewvcWo',
    autoplay: true,
    videoTitle: 'Test Video'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = (props = {}) => {
    return mount(VideoLightbox, {
      props: { ...defaultProps, ...props }
    })
  }

  describe('Rendering', () => {
    it('renders nothing when not visible', () => {
      wrapper = createWrapper({ isVisible: false })
      expect(wrapper.find('.fixed').exists()).toBe(false)
    })

    it('renders lightbox when visible', () => {
      wrapper = createWrapper({ isVisible: true })
      expect(wrapper.find('.fixed').exists()).toBe(true)
      expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    })

    it('renders close button when visible', () => {
      wrapper = createWrapper({ isVisible: true })
      const closeButton = wrapper.find('button[aria-label="Close video"]')
      expect(closeButton.exists()).toBe(true)
    })

    it('renders iframe with correct properties when visible', () => {
      wrapper = createWrapper({ isVisible: true })
      const iframe = wrapper.find('iframe')
      expect(iframe.exists()).toBe(true)
      expect(iframe.attributes('title')).toBe('Test Video')
      expect(iframe.attributes('allowfullscreen')).toBeDefined()
    })
  })

  describe('Video URL Processing', () => {
    it('correctly processes youtu.be URL', () => {
      wrapper = createWrapper({
        isVisible: true,
        videoUrl: 'https://youtu.be/3MH54ewvcWo'
      })
      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toContain('3MH54ewvcWo')
    })

    it('correctly processes youtube.com/watch URL', () => {
      wrapper = createWrapper({
        isVisible: true,
        videoUrl: 'https://www.youtube.com/watch?v=3MH54ewvcWo'
      })
      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toContain('3MH54ewvcWo')
    })

    it('correctly processes youtube.com/embed URL', () => {
      wrapper = createWrapper({
        isVisible: true,
        videoUrl: 'https://www.youtube.com/embed/3MH54ewvcWo'
      })
      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toContain('3MH54ewvcWo')
    })

    it('handles direct video ID', () => {
      wrapper = createWrapper({
        isVisible: true,
        videoUrl: '3MH54ewvcWo'
      })
      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toContain('3MH54ewvcWo')
    })

    it('includes autoplay parameter when enabled', () => {
      wrapper = createWrapper({
        isVisible: true,
        autoplay: true
      })
      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toContain('autoplay=1')
    })

    it('excludes autoplay parameter when disabled', () => {
      wrapper = createWrapper({
        isVisible: true,
        autoplay: false
      })
      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).not.toContain('autoplay=1')
    })
  })

  describe('User Interactions', () => {
    it('emits close event when close button is clicked', async () => {
      wrapper = createWrapper({ isVisible: true })
      const closeButton = wrapper.find('button[aria-label="Close video"]')

      await closeButton.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('emits close event when overlay is clicked', async () => {
      wrapper = createWrapper({ isVisible: true })
      const overlay = wrapper.find('.fixed')

      await overlay.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('does not emit close event when modal content is clicked', async () => {
      wrapper = createWrapper({ isVisible: true })
      const modalContent = wrapper.find('[role="dialog"]')

      await modalContent.trigger('click')

      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      wrapper = createWrapper({ isVisible: true })
      const dialog = wrapper.find('[role="dialog"]')

      expect(dialog.exists()).toBe(true)
      expect(dialog.attributes('aria-modal')).toBe('true')
      expect(dialog.attributes('aria-label')).toContain('Test Video')
    })

    it('has accessible close button', () => {
      wrapper = createWrapper({ isVisible: true })
      const closeButton = wrapper.find('button[aria-label="Close video"]')

      expect(closeButton.exists()).toBe(true)
      expect(closeButton.attributes('aria-label')).toBe('Close video')
    })
  })

  describe('Keyboard Events', () => {
    it('sets up keyboard event listener when visible', () => {
      wrapper = createWrapper({ isVisible: true })
      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )
    })

    it('removes keyboard event listener when hidden', async () => {
      wrapper = createWrapper({ isVisible: true })
      await wrapper.setProps({ isVisible: false })
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )
    })

    it('manages body overflow when visible', async () => {
      wrapper = createWrapper({ isVisible: false })

      await wrapper.setProps({ isVisible: true })
      expect(document.body.style.overflow).toBe('hidden')

      await wrapper.setProps({ isVisible: false })
      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('Props Validation', () => {
    it('uses default video title when not provided', () => {
      wrapper = createWrapper({
        isVisible: true,
        videoTitle: undefined
      })
      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('title')).toBe('Video content')
    })

    it('uses custom video title when provided', () => {
      wrapper = createWrapper({
        isVisible: true,
        videoTitle: 'Custom Video Title'
      })
      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('title')).toBe('Custom Video Title')
    })
  })
})
