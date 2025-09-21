<template>
  <SearchLayout
    search-placeholder="Search timeline events and activities"
    @search="handleSearch"
    @file-upload="handleFileUpload"
    @speech-error="handleSpeechError"
  >
    <!-- Right Panel: Timeline Panel -->
    <TimelinePanel />
  </SearchLayout>
</template>

<script setup lang="ts">
  import SearchLayout from '@/components/layouts/SearchLayout.vue'
  import TimelinePanel from '@/components/timeline/TimelinePanel.vue'

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
</script>

<script lang="ts">
  export default {
    name: 'TimelineView'
  }
</script>
