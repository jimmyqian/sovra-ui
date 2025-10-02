<template>
  <SearchLayout
    search-placeholder="Search timeline events and activities"
    @search="handleSearch"
    @file-upload="handleFileUpload"
    @speech-error="handleSpeechError"
  >
    <div class="flex-1 flex flex-col max-h-full overflow-hidden relative">
      <!-- Back Navigation and Keyboard Shortcuts -->
      <div class="flex items-center justify-between p-6 pb-4">
        <!-- Back Button -->
        <button
          class="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          @click="handleBack"
        >
          <ChevronLeftIcon />
          <span>Back</span>
        </button>

        <!-- Hotkey Display -->
        <div class="bg-gray-800 text-white p-3 rounded-lg shadow-lg text-sm">
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
    </div>
  </SearchLayout>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import SearchLayout from '@/components/layouts/SearchLayout.vue'
  import TimelinePanel from '@/components/timeline/TimelinePanel.vue'
  import StarPanel from '@/components/star/StarPanel.vue'
  import GlobePanel from '@/components/globe/GlobePanel.vue'
  import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue'

  const router = useRouter()

  const timelinePanelRef = ref<InstanceType<typeof TimelinePanel> | null>(null)
  const starPanelRef = ref<InstanceType<typeof StarPanel> | null>(null)
  const globePanelRef = ref<InstanceType<typeof GlobePanel> | null>(null)
  const orientation = ref<'horizontal' | 'vertical'>('horizontal')
  const displayMode = ref<'timeline' | 'star' | 'globe'>('star')

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

  const handleBack = () => {
    // Navigate back to previous screen
    router.back()
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

    // 'v' key to cycle through star, timeline, and globe display modes
    if (event.key === 'v' || event.key === 'V') {
      event.preventDefault()
      event.stopPropagation()
      const modes: Array<'timeline' | 'star' | 'globe'> = [
        'star',
        'timeline',
        'globe'
      ]
      const currentIndex = modes.indexOf(displayMode.value)
      const nextIndex = (currentIndex + 1) % modes.length
      displayMode.value = modes[nextIndex] ?? 'star'
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
