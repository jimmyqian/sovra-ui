<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
    @click.self="closeLightbox"
  >
    <div
      class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      role="dialog"
      aria-modal="true"
      :aria-label="ariaLabel"
    >
      <!-- Close Button -->
      <button
        class="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white rounded-full p-2 shadow-md"
        aria-label="Close video"
        @click="closeLightbox"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Video Container -->
      <div class="relative w-full" :style="{ paddingBottom: '56.25%' }">
        <iframe
          v-if="isVisible && videoId"
          :src="embedUrl"
          class="absolute top-0 left-0 w-full h-full"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          :title="videoTitle"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'

  interface Props {
    /** Controls whether the lightbox is visible */
    isVisible: boolean
    /** YouTube video URL or video ID */
    videoUrl: string
    /** Whether video should autoplay */
    autoplay?: boolean
    /** Video title for accessibility */
    videoTitle?: string
  }

  interface Emits {
    /** Emitted when lightbox should be closed */
    (e: 'close'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    videoTitle: 'Video content'
  })

  const emit = defineEmits<Emits>()

  /**
   * Extract YouTube video ID from various URL formats
   * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
   */
  const videoId = computed(() => {
    const url = props.videoUrl
    if (!url) return null

    // Handle youtu.be/ID format
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
    if (shortMatch) return shortMatch[1]

    // Handle youtube.com/watch?v=ID format
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/)
    if (watchMatch) return watchMatch[1]

    // Handle youtube.com/embed/ID format
    const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]+)/)
    if (embedMatch) return embedMatch[1]

    // If it's just an ID
    if (url.match(/^[a-zA-Z0-9_-]{11}$/)) return url

    return null
  })

  /**
   * Generate YouTube embed URL with autoplay and other parameters
   */
  const embedUrl = computed(() => {
    if (!videoId.value) return ''

    const params = new URLSearchParams({
      ...(props.autoplay && { autoplay: '1' }),
      rel: '0', // Don't show related videos
      modestbranding: '1', // Minimal YouTube branding
      iv_load_policy: '3' // Hide annotations
    })

    return `https://www.youtube.com/embed/${videoId.value}?${params.toString()}`
  })

  /**
   * ARIA label for the dialog
   */
  const ariaLabel = computed(() => `Video lightbox: ${props.videoTitle}`)

  /**
   * Close the lightbox
   */
  const closeLightbox = () => {
    emit('close')
  }

  /**
   * Handle escape key press to close lightbox
   */
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeLightbox()
    }
  }

  // Watch for visibility changes to handle keyboard events
  watch(
    () => props.isVisible,
    isVisible => {
      if (isVisible) {
        document.addEventListener('keydown', handleKeyPress)
        // Prevent body scroll when lightbox is open
        document.body.style.overflow = 'hidden'
      } else {
        document.removeEventListener('keydown', handleKeyPress)
        // Restore body scroll
        document.body.style.overflow = ''
      }
    },
    { immediate: true }
  )
</script>
