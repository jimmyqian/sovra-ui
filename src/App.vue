<template>
  <div id="app" class="w-full min-h-screen">
    <router-view />

    <!-- Global Video Lightbox -->
    <VideoLightbox
      :is-visible="lightboxStore.isVisible"
      :video-url="lightboxStore.videoUrl"
      autoplay
      video-title="Sovra Introduction Video"
      @close="lightboxStore.hideLightbox"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useTheme } from '@/composables/useTheme'
  import { useLightboxStore } from '@/stores/lightbox'
  import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
  import VideoLightbox from '@/components/common/VideoLightbox.vue'

  const { initializeTheme } = useTheme()
  const lightboxStore = useLightboxStore()

  // Setup keyboard shortcuts for subscription levels
  useKeyboardShortcuts()

  onMounted(() => {
    initializeTheme()
  })
</script>
