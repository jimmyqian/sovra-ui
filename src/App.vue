<template>
  <div id="app" class="w-full min-h-screen">
    <router-view />

    <!-- Global Notification Container -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useTheme } from '@/composables/useTheme'
  import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
  import NotificationContainer from '@/components/common/NotificationContainer.vue'

  const { initializeTheme } = useTheme()

  // Setup keyboard shortcuts for subscription levels
  useKeyboardShortcuts()

  onMounted(() => {
    initializeTheme()
  })
</script>
