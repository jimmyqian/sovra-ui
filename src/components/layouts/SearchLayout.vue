<template>
  <div
    class="h-screen bg-bg-primary flex flex-col max-h-screen overflow-hidden"
  >
    <div class="flex-1 flex max-h-full overflow-hidden">
      <!-- Left Navigation Sidebar -->
      <AppSidebar />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col md:flex-row max-h-full overflow-hidden">
        <!-- Left Panel: Search & Conversation -->
        <ConversationPanel
          :search-placeholder="searchPlaceholder"
          @search="handleSearch"
          @file-upload="handleFileUpload"
          @speech-error="handleSpeechError"
        />

        <!-- Right Panel: Variable Content -->
        <div class="flex-1 flex flex-col max-h-full overflow-hidden">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppSidebar from '@/components/navigation/AppSidebar.vue'
  import ConversationPanel from '@/components/search/ConversationPanel.vue'

  interface Props {
    searchPlaceholder?: string
  }

  withDefaults(defineProps<Props>(), {
    searchPlaceholder: "Tell me more about who you're looking for"
  })

  const emit = defineEmits<{
    search: [query: string]
    fileUpload: [files: File[]]
    speechError: [error: string]
  }>()

  const handleSearch = (query: string) => {
    emit('search', query)
  }

  const handleFileUpload = (files: File[]) => {
    emit('fileUpload', files)
  }

  const handleSpeechError = (error: string) => {
    emit('speechError', error)
  }
</script>
