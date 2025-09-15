/**
 * Unit tests for lightbox store
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLightboxStore } from '../lightbox'

// Mock Math.random for consistent testing
const mockMath = Object.create(globalThis.Math)
mockMath.random = vi.fn()
globalThis.Math = mockMath

describe('useLightboxStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('initializes with correct default values', () => {
      const store = useLightboxStore()

      expect(store.isVisible).toBe(false)
      expect(store.videoUrl).toBe('https://youtu.be/3MH54ewvcWo')
      expect(store.searchCount).toBe(0)
    })

    it('provides correct lightbox state getter', () => {
      const store = useLightboxStore()
      const state = store.lightboxState

      expect(state).toEqual({
        isVisible: false,
        videoUrl: 'https://youtu.be/3MH54ewvcWo',
        searchCount: 0
      })
    })
  })

  describe('Basic Actions', () => {
    it('shows lightbox', () => {
      const store = useLightboxStore()
      expect(store.isVisible).toBe(false)

      store.showLightbox()

      expect(store.isVisible).toBe(true)
    })

    it('hides lightbox', () => {
      const store = useLightboxStore()
      store.showLightbox()
      expect(store.isVisible).toBe(true)

      store.hideLightbox()

      expect(store.isVisible).toBe(false)
    })

    it('shows lightbox with custom video URL', () => {
      const store = useLightboxStore()
      const customUrl = 'https://youtu.be/customvideo'

      store.showLightboxWithVideo(customUrl)

      expect(store.isVisible).toBe(true)
      expect(store.videoUrl).toBe(customUrl)
    })
  })

  describe('Random Video Selection', () => {
    it('selects first available video when random returns 0 (excluding current)', () => {
      const store = useLightboxStore()
      mockMath.random.mockReturnValue(0)

      const selectedVideo = store.selectRandomVideo()

      // Should select first video from filtered list (current video is excluded)
      // Current video is 'https://youtu.be/3MH54ewvcWo', so first available is second video
      expect(selectedVideo).toBe('https://www.youtube.com/watch?v=cNAdtkSjSps')
    })

    it('selects second video when random returns 0.17', () => {
      const store = useLightboxStore()
      mockMath.random.mockReturnValue(0.17) // 0.17 * 5 = 0.85, floor = 0 (first available video excluding current)

      const selectedVideo = store.selectRandomVideo()

      // Current video is 'https://youtu.be/3MH54ewvcWo', so first available is second video
      expect(selectedVideo).toBe('https://www.youtube.com/watch?v=cNAdtkSjSps')
    })

    it('selects last video when random returns close to 1', () => {
      const store = useLightboxStore()
      mockMath.random.mockReturnValue(0.99) // 0.99 * 5 = 4.95, floor = 4 (last available video excluding current)

      const selectedVideo = store.selectRandomVideo()

      // Current video is 'https://youtu.be/3MH54ewvcWo', so last available is last video
      expect(selectedVideo).toBe(
        'https://youtu.be/QbC6dLG_dQY?list=RDQbC6dLG_dQY'
      )
    })

    it('selects different videos for different random values', () => {
      const store = useLightboxStore()

      // Test selecting from available videos (excluding current video)
      // Current video is 'https://youtu.be/3MH54ewvcWo', so available videos are the other 5
      const availableVideos = [
        'https://www.youtube.com/watch?v=cNAdtkSjSps',
        'https://www.youtube.com/watch?v=km5YVF5x_CU',
        'https://www.youtube.com/watch?v=zInV4hJFq_w',
        'https://youtu.be/QFgcqB8-AxE',
        'https://youtu.be/QbC6dLG_dQY?list=RDQbC6dLG_dQY'
      ]

      availableVideos.forEach((expectedVideo, index) => {
        // Mock random to select specific index from available videos (5 total)
        mockMath.random.mockReturnValue(index / 5) // 0/5=0, 1/5=0.2, etc.

        const selectedVideo = store.selectRandomVideo()
        expect(selectedVideo).toBe(expectedVideo)
      })
    })
  })

  describe('Search Action Handling', () => {
    it('triggers lightbox on first search (odd search count) with random video', () => {
      const store = useLightboxStore()
      mockMath.random.mockReturnValue(0.5) // Should select middle video from available videos

      expect(store.searchCount).toBe(0)
      expect(store.isVisible).toBe(false)

      const wasTriggered = store.handleSearchAction()

      expect(wasTriggered).toBe(true)
      expect(store.isVisible).toBe(true)
      expect(store.searchCount).toBe(1)
      // Should have set a random video (0.5 * 5 = 2.5, floor = 2, which is 3rd available video)
      // Current video is excluded, so 3rd available is 'https://www.youtube.com/watch?v=zInV4hJFq_w'
      expect(store.videoUrl).toBe('https://www.youtube.com/watch?v=zInV4hJFq_w')
    })

    it('does not trigger lightbox on second search (even search count)', () => {
      const store = useLightboxStore()
      // First search (should trigger)
      store.handleSearchAction()
      store.hideLightbox()
      expect(store.searchCount).toBe(1)

      // Second search (should not trigger)
      const wasTriggered = store.handleSearchAction()

      expect(wasTriggered).toBe(false)
      expect(store.isVisible).toBe(false)
      expect(store.searchCount).toBe(2)
    })

    it('triggers lightbox on third search (odd search count)', () => {
      const store = useLightboxStore()
      mockMath.random.mockReturnValue(0.2)

      // First and second searches
      store.handleSearchAction() // search count 1 - should trigger
      store.hideLightbox()
      store.handleSearchAction() // search count 2 - should not trigger

      // Third search
      const wasTriggered = store.handleSearchAction()

      expect(wasTriggered).toBe(true)
      expect(store.isVisible).toBe(true)
      expect(store.searchCount).toBe(3)
    })

    it('can reset search count', () => {
      const store = useLightboxStore()
      store.handleSearchAction()
      store.handleSearchAction()
      expect(store.searchCount).toBe(2)

      store.resetSearchCount()

      expect(store.searchCount).toBe(0)
    })

    it('uses different random video each time lightbox is triggered', () => {
      const store = useLightboxStore()

      // First search with one random value
      mockMath.random.mockReturnValue(0.1)
      store.handleSearchAction()
      const firstVideo = store.videoUrl
      store.hideLightbox()

      // Skip second search (won't trigger)
      store.handleSearchAction()

      // Third search with different random value
      mockMath.random.mockReturnValue(0.8)
      store.handleSearchAction()
      const secondVideo = store.videoUrl

      // Should be different videos
      expect(firstVideo).not.toBe(secondVideo)
      // First: 0.1 * 5 = 0.5, floor = 0 (first available excluding default)
      expect(firstVideo).toBe('https://www.youtube.com/watch?v=cNAdtkSjSps')
      // Second: 0.8 * 4 = 3.2, floor = 3 (4th available excluding firstVideo)
      expect(secondVideo).toBe(
        'https://youtu.be/QbC6dLG_dQY?list=RDQbC6dLG_dQY'
      )
    })

    it('follows every-other-search pattern correctly over multiple searches', () => {
      const store = useLightboxStore()

      // Test first 6 searches to verify the pattern
      const results = []
      for (let i = 0; i < 6; i++) {
        const wasTriggered = store.handleSearchAction()
        results.push(wasTriggered)
        if (wasTriggered) {
          store.hideLightbox()
        }
      }

      // Should trigger on odd search counts: 1st, 3rd, 5th (not 2nd, 4th, 6th)
      expect(results).toEqual([true, false, true, false, true, false])
      expect(store.searchCount).toBe(6)
    })
  })
})
