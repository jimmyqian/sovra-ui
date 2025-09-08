<template>
  <div id="app" class="w-full min-h-screen">
    <!-- Theme Switcher for testing -->
    <div class="fixed top-4 right-4 z-50">
      <button
        class="bg-brand-orange text-bg-card px-3 py-1 rounded-lg text-sm shadow-lg hover:scale-105 transition-transform"
        @click="toggleTheme"
      >
        Theme: {{ theme }}
      </button>
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useTheme } from '@/composables/useTheme'

  const { theme, initializeTheme, toggleTheme } = useTheme()

  onMounted(() => {
    initializeTheme()
  })
</script>
