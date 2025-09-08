<template>
  <div id="app" class="w-full min-h-screen">
    <router-view />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useTheme } from '@/composables/useTheme'

  const { initializeTheme } = useTheme()

  onMounted(() => {
    initializeTheme()
  })
</script>
