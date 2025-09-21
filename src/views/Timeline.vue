<template>
  <SearchLayout
    search-placeholder="Search timeline events and activities"
    @search="handleSearch"
    @file-upload="handleFileUpload"
    @speech-error="handleSpeechError"
  >
    <!-- Right Panel: Timeline Panel -->
    <TimelinePanel ref="timelinePanelRef" :orientation="orientation" />
  </SearchLayout>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import SearchLayout from '@/components/layouts/SearchLayout.vue'
  import TimelinePanel from '@/components/timeline/TimelinePanel.vue'

  const timelinePanelRef = ref<InstanceType<typeof TimelinePanel> | null>(null)
  const orientation = ref<'horizontal' | 'vertical'>('horizontal')

  const handleSearch = async (query: string) => {
    // Handle timeline search functionality
    if (query.trim()) {
      // TODO: Implement timeline search functionality
    }
  }

  const handleFileUpload = (_files: File[]) => {
    // TODO: Implement timeline file upload functionality
  }

  const handleSpeechError = (_error: string) => {
    // TODO: Implement proper speech error handling UI for timeline
  }

  /**
   * Handles keyboard shortcuts for timeline orientation toggle
   */
  const handleKeyDown = (event: KeyboardEvent): void => {
    // Ctrl+V combination
    if (event.ctrlKey && (event.key === 'v' || event.key === 'V')) {
      event.preventDefault()
      event.stopPropagation()
      orientation.value =
        orientation.value === 'horizontal' ? 'vertical' : 'horizontal'
      return
    }

    // Simple 't' key as backup
    if (event.key === 't' || event.key === 'T') {
      event.preventDefault()
      event.stopPropagation()
      orientation.value =
        orientation.value === 'horizontal' ? 'vertical' : 'horizontal'
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
</script>

<script lang="ts">
  export default {
    name: 'TimelineView'
  }
</script>
