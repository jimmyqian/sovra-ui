<template>
  <footer
    class="flex justify-between items-end text-text-secondary text-xs pt-4 pr-4 pb-8 pl-8 md:pt-3 md:pr-3 md:pb-8 md:pl-8"
  >
    <span>©{{ currentYear }} sovra.ai</span>

    <!-- Pi Symbol Button -->
    <button
      class="text-border-dashed hover:text-text-primary transition-colors duration-200 text-xxs font-mono cursor-pointer select-none"
      style="font-size: 0.65rem"
      aria-label="Developer actions"
      @click="handlePiClick"
    >
      π
    </button>
  </footer>
</template>

<script setup lang="ts">
  import { useLightboxStore } from '@/stores/lightbox'

  interface Emits {
    /** Emitted when pi symbol is clicked */
    (e: 'piClick'): void
  }

  const emit = defineEmits<Emits>()
  const currentYear = new Date().getFullYear()
  const lightboxStore = useLightboxStore()

  const handlePiClick = () => {
    // Secret easter egg: trigger lightbox with random video
    // Always selects a fresh random video without caching
    lightboxStore.showLightboxWithRandomVideo()
    emit('piClick')
  }
</script>
