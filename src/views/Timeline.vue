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
          <kbd class="px-2 py-1 bg-gray-700 rounded text-xs">V</kbd>
        </div>
        <div
          v-if="displayMode === 'timeline'"
          class="flex justify-between items-center gap-4"
        >
          <span class="text-gray-300">Rotate timeline:</span>
          <kbd class="px-2 py-1 bg-gray-700 rounded text-xs">R</kbd>
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
    <GlobePanel v-else-if="displayMode === 'globe'" ref="globePanelRef" />
  </SearchLayout>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import SearchLayout from '@/components/layouts/SearchLayout.vue'
  import TimelinePanel from '@/components/timeline/TimelinePanel.vue'
  import StarPanel from '@/components/star/StarPanel.vue'
  import GlobePanel from '@/components/globe/GlobePanel.vue'

  const timelinePanelRef = ref<InstanceType<typeof TimelinePanel> | null>(null)
  const starPanelRef = ref<InstanceType<typeof StarPanel> | null>(null)
  const globePanelRef = ref<InstanceType<typeof GlobePanel> | null>(null)
  const orientation = ref<'horizontal' | 'vertical'>('horizontal')
  const displayMode = ref<'timeline' | 'star' | 'globe'>('timeline')

  const handleSearch = async (query: string) => {
    // Handle timeline search functionality
    // The actual search logic is handled by ConversationPanel component
    // This handler is called after ConversationPanel processes the search
    // and automatically triggers auto-scroll via the conversation store watchers
    if (query.trim()) {
      // Optional: Add any timeline-specific search logic here
      // For now, the ConversationPanel handles the core search functionality
      // and auto-scroll is triggered automatically when new messages are added
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
    // 'r' key for timeline orientation
    if (event.key === 'r' || event.key === 'R') {
      event.preventDefault()
      event.stopPropagation()
      orientation.value =
        orientation.value === 'horizontal' ? 'vertical' : 'horizontal'
      return
    }

    // 'v' key to cycle through timeline, star, and globe display modes
    if (event.key === 'v' || event.key === 'V') {
      event.preventDefault()
      event.stopPropagation()
      const modes: Array<'timeline' | 'star' | 'globe'> = [
        'timeline',
        'star',
        'globe'
      ]
      const currentIndex = modes.indexOf(displayMode.value)
      const nextIndex = (currentIndex + 1) % modes.length
      displayMode.value = modes[nextIndex] ?? 'timeline'
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)

    // Note: Conversation panel scroll position should be preserved when navigating
    // between screens. Auto-scroll only happens during search request/response cycles.
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
