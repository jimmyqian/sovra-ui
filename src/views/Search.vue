<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen bg-bg-primary flex flex-col">
    <div
      class="flex-1 flex flex-col max-w-6xl mx-auto px-8 py-8 relative md:px-4"
    >
      <!-- Logo -->
      <div class="flex justify-center mb-12">
        <Logo />
      </div>

      <!-- Main Content -->
      <div
        class="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
      >
        <h1
          class="text-hero font-normal text-text-primary mb-2 md:text-3xl sm:text-2xl"
        >
          Hi! I am <span class="font-semibold">Sovra</span>...
        </h1>
        <h2
          class="text-hero font-normal text-text-primary mb-4 md:text-3xl sm:text-2xl"
        >
          What do you <strong>want to know</strong> today?
        </h2>
        <p class="text-text-secondary text-sm mb-12">
          Try adding more detail: works better when you give more context or
          share your goal
        </p>

        <!-- Search Bar -->
        <div class="w-full max-w-2xl">
          <SearchBar
            v-model="searchQuery"
            placeholder="enter keyword of the person you want to know or explain the person you are looking for....."
            :disabled="searchStore.isLoading"
            @search="handleSearch"
            @file-upload="handleFileUpload"
            @file-error="handleFileError"
            @speech-error="handleSpeechError"
          />

          <!-- Loading Spinner -->
          <div v-if="searchStore.isLoading" class="flex justify-center mt-4">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"
            ></div>
          </div>

          <!-- Error Message -->
          <div
            v-if="searchStore.error"
            class="mt-4 text-center text-red-600 text-sm"
          >
            {{ searchStore.error }}
          </div>
        </div>
      </div>
    </div>

    <!-- Page Footer -->
    <CopyrightFooter @pi-click="handlePiClick" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSearchStore } from '@/stores/search'
  import { useConversationStore } from '@/stores/conversation'
  import Logo from '@/components/common/Logo.vue'
  import SearchBar from '@/components/common/SearchBar.vue'
  import CopyrightFooter from '@/components/layout/CopyrightFooter.vue'

  const router = useRouter()
  const searchStore = useSearchStore()
  const conversationStore = useConversationStore()
  const searchQuery = ref('')

  const handleSearch = async () => {
    if (!searchQuery.value.trim()) {
      return
    }

    try {
      // Clear previous conversation when starting a new search from landing
      conversationStore.clearConversation()

      await searchStore.performSearch(searchQuery.value)
      await router.push('/search')
    } catch {
      // TODO: Implement proper error handling/logging
      // console.error('Search failed:', error)
    }
  }

  const handleFileUpload = (_files: File[]) => {
    // TODO: Implement file upload handling
    // console.log('Files uploaded:', files)
  }

  const handleFileError = (_error: string) => {
    // TODO: Implement proper error handling UI
    // TODO: Implement proper error handling UI instead of console.error
    // For now, you could show a toast notification or set an error state
  }

  const handleSpeechError = (_error: string) => {
    // TODO: Implement proper speech error handling UI
    // For now, errors are handled by the SearchBar component itself
    // In future, could show toast notifications or set error state
  }

  function handlePiClick() {
    // This function is kept for event binding compatibility but not used
  }
</script>
