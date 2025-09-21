<template>
  <SearchLayout
    search-placeholder="Search timeline events and activities"
    @search="handleSearch"
    @file-upload="handleFileUpload"
    @speech-error="handleSpeechError"
  >
    <!-- Hotkey Display -->
    <div
      class="absolute top-4 right-4 z-10 bg-gray-800 text-white p-3 rounded-lg shadow-lg text-sm"
    >
      <div class="font-semibold mb-2">Keyboard Shortcuts</div>
      <div class="space-y-1">
        <div class="flex justify-between items-center gap-4">
          <span class="text-gray-300">Toggle view:</span>
          <kbd class="px-2 py-1 bg-gray-700 rounded text-xs">R</kbd>
        </div>
        <div
          v-if="displayMode === 'timeline'"
          class="flex justify-between items-center gap-4"
        >
          <span class="text-gray-300">Rotate timeline:</span>
          <div class="flex gap-1">
            <kbd class="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+V</kbd>
            <span class="text-gray-500">or</span>
            <kbd class="px-2 py-1 bg-gray-700 rounded text-xs">T</kbd>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel: Timeline or Star Panel -->
    <TimelinePanel
      v-if="displayMode === 'timeline'"
      ref="timelinePanelRef"
      :orientation="orientation"
    />
    <StarPanel
      v-else-if="displayMode === 'star'"
      ref="starPanelRef"
      :node-count="7"
    />
  </SearchLayout>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import SearchLayout from '@/components/layouts/SearchLayout.vue'
  import TimelinePanel from '@/components/timeline/TimelinePanel.vue'
  import StarPanel from '@/components/star/StarPanel.vue'

  const timelinePanelRef = ref<InstanceType<typeof TimelinePanel> | null>(null)
  const starPanelRef = ref<InstanceType<typeof StarPanel> | null>(null)
  const orientation = ref<'horizontal' | 'vertical'>('horizontal')
  const displayMode = ref<'timeline' | 'star'>('timeline')

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
   * Handles keyboard shortcuts for timeline orientation toggle and display mode switching
   */
  const handleKeyDown = (event: KeyboardEvent): void => {
    // Ctrl+V combination for timeline orientation
    if (event.ctrlKey && (event.key === 'v' || event.key === 'V')) {
      event.preventDefault()
      event.stopPropagation()
      orientation.value =
        orientation.value === 'horizontal' ? 'vertical' : 'horizontal'
      return
    }

    // Simple 't' key for timeline orientation
    if (event.key === 't' || event.key === 'T') {
      event.preventDefault()
      event.stopPropagation()
      orientation.value =
        orientation.value === 'horizontal' ? 'vertical' : 'horizontal'
      return
    }

    // 'r' key to toggle between timeline and star display
    if (event.key === 'r' || event.key === 'R') {
      event.preventDefault()
      event.stopPropagation()
      displayMode.value = displayMode.value === 'timeline' ? 'star' : 'timeline'
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
