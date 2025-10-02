<template>
  <button
    :disabled="!canGoBack"
    class="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-text-secondary"
    @click="handleBack"
  >
    <ChevronLeftIcon />
    <span>Back</span>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue'

  const router = useRouter()

  // Check if there's browser history to go back to
  const canGoBack = computed(() => window.history.length > 1)

  const handleBack = () => {
    if (canGoBack.value) {
      router.back()
    }
  }
</script>

<script lang="ts">
  export default {
    name: 'BackButton'
  }
</script>
