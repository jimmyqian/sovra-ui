<template>
  <SearchLayout
    search-placeholder="Search network connections"
    @search="handleSearch"
    @file-upload="handleFileUpload"
    @speech-error="handleSpeechError"
  >
    <div class="flex-1 flex flex-col max-h-full overflow-hidden relative">
      <!-- Back Navigation -->
      <div class="flex items-center justify-between p-6 pb-4">
        <BackButton />
      </div>

      <!-- Network Panel -->
      <StarPanel ref="starPanelRef" :node-count="7" />
    </div>
  </SearchLayout>
</template>

<script setup lang="ts">
  import SearchLayout from '@/components/layouts/SearchLayout.vue'
  import StarPanel from '@/components/star/StarPanel.vue'
  import BackButton from '@/components/common/BackButton.vue'

  const handleSearch = async (query: string) => {
    // Handle network search functionality
    // The actual search logic is handled by ConversationPanel component
    if (query.trim()) {
      // Optional: Add any network-specific search logic here
    }
  }

  const handleFileUpload = (_files: File[]) => {
    // TODO: Implement network file upload functionality
  }

  const handleSpeechError = (_error: string) => {
    // TODO: Implement proper speech error handling UI for network
  }
</script>

<script lang="ts">
  export default {
    name: 'NetworkView'
  }
</script>
