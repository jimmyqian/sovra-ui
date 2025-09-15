/**
 * Lightbox store for managing video lightbox state and triggers
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface LightboxState {
  /** Whether the lightbox is currently visible */
  isVisible: boolean
  /** Current video URL to display */
  videoUrl: string
  /** Count of searches performed */
  searchCount: number
}

export const useLightboxStore = defineStore('lightbox', () => {
  // Available video URLs for random selection
  const videoUrls = ['https://youtu.be/QbC6dLG_dQY?list=RDQbC6dLG_dQY']

  // State
  const isVisible = ref<boolean>(false)
  const videoUrl = ref<string>(videoUrls[0] ?? '') // Default to first video
  const searchCount = ref<number>(0)

  // Getters
  const lightboxState = computed(
    (): LightboxState => ({
      isVisible: isVisible.value,
      videoUrl: videoUrl.value,
      searchCount: searchCount.value
    })
  )

  // Actions
  /**
   * Show the lightbox with the default video
   */
  const showLightbox = () => {
    isVisible.value = true
  }

  /**
   * Show the lightbox with a custom video URL
   */
  const showLightboxWithVideo = (url: string) => {
    videoUrl.value = url
    isVisible.value = true
  }

  /**
   * Show the lightbox with a randomly selected video
   * Always selects a DIFFERENT video than the current one, ensuring variety
   */
  const showLightboxWithRandomVideo = () => {
    const currentVideoUrl = videoUrl.value
    const availableVideos = videoUrls.filter(url => url !== currentVideoUrl)

    // If we somehow have no other videos available, use all videos
    const videosToChooseFrom =
      availableVideos.length > 0 ? availableVideos : videoUrls

    // Generate random selection from available videos (excluding current one)
    const timestamp = Date.now()
    const randomSeed = Math.random() * timestamp
    const randomIndex = Math.floor(randomSeed % videosToChooseFrom.length)

    videoUrl.value = videosToChooseFrom[randomIndex] ?? videoUrls[0] ?? ''
    isVisible.value = true
  }

  /**
   * Hide the lightbox
   */
  const hideLightbox = () => {
    isVisible.value = false
  }

  /**
   * Select a random video URL from the available videos
   * Excludes the currently playing video to ensure variety
   */
  const selectRandomVideo = (): string => {
    const currentVideoUrl = videoUrl.value
    const availableVideos = videoUrls.filter(url => url !== currentVideoUrl)

    // If we somehow have no other videos available, use all videos
    const videosToChooseFrom =
      availableVideos.length > 0 ? availableVideos : videoUrls

    const randomIndex = Math.floor(Math.random() * videosToChooseFrom.length)
    return videosToChooseFrom[randomIndex] ?? videoUrls[0] ?? ''
  }

  /**
   * Handle search action - shows lightbox on every other search (1st, 3rd, 5th, etc.) with random video
   * Only shows if running on localhost
   * @returns true if lightbox was triggered, false otherwise
   */
  const handleSearchAction = (): boolean => {
    searchCount.value++

    // Only trigger lightbox on localhost and on odd search counts (1st, 3rd, 5th, etc.)
    if (
      searchCount.value % 2 === 1 &&
      window.location.hostname === 'localhost'
    ) {
      // Always select a fresh random video each time
      const randomVideoUrl = selectRandomVideo()
      videoUrl.value = randomVideoUrl
      isVisible.value = true
      return true
    }
    return false
  }

  /**
   * Navigate to the previous video in the list
   */
  const navigateToPreviousVideo = () => {
    const currentIndex = videoUrls.indexOf(videoUrl.value)
    if (currentIndex === -1) {
      // If current video not in list, go to last video
      videoUrl.value = videoUrls[videoUrls.length - 1] ?? ''
    } else if (currentIndex === 0) {
      // If at first video, wrap to last video
      videoUrl.value = videoUrls[videoUrls.length - 1] ?? ''
    } else {
      // Go to previous video
      videoUrl.value = videoUrls[currentIndex - 1] ?? ''
    }
  }

  /**
   * Navigate to the next video in the list
   */
  const navigateToNextVideo = () => {
    const currentIndex = videoUrls.indexOf(videoUrl.value)
    if (currentIndex === -1) {
      // If current video not in list, go to first video
      videoUrl.value = videoUrls[0] ?? ''
    } else if (currentIndex === videoUrls.length - 1) {
      // If at last video, wrap to first video
      videoUrl.value = videoUrls[0] ?? ''
    } else {
      // Go to next video
      videoUrl.value = videoUrls[currentIndex + 1] ?? ''
    }
  }

  /**
   * Reset the search count (useful for testing)
   */
  const resetSearchCount = () => {
    searchCount.value = 0
  }

  return {
    // State
    isVisible,
    videoUrl,
    searchCount,

    // Getters
    lightboxState,

    // Actions
    showLightbox,
    showLightboxWithVideo,
    showLightboxWithRandomVideo,
    hideLightbox,
    handleSearchAction,
    selectRandomVideo,
    navigateToPreviousVideo,
    navigateToNextVideo,
    resetSearchCount
  }
})
