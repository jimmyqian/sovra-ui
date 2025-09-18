<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="LOGO_VIEWBOX"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      v-for="(path, index) in activePaths"
      :key="index"
      :d="path"
      :fill="fillColor"
    />
  </svg>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import {
    LOGO_VIEWBOX,
    LOGO_PATHS,
    EASTER_EGG_LOGO_PATHS
  } from '@/assets/logo-paths'

  interface Props {
    size?: number | string
    color?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 24,
    color: 'var(--color-brand-orange)'
  })

  // Easter egg state
  const isEasterEggActive = ref(false)

  // Use the provided color prop, defaulting to brand orange
  const fillColor = computed(() => {
    return props.color
  })

  // Choose which logo paths to use based on easter egg state
  const activePaths = computed(() => {
    return isEasterEggActive.value ? EASTER_EGG_LOGO_PATHS : LOGO_PATHS
  })

  // Handle Ctrl+S keyboard shortcut
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault() // Prevent browser save dialog
      isEasterEggActive.value = !isEasterEggActive.value
    }
  }

  // Set up keyboard listener
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  // Clean up keyboard listener
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
</script>
