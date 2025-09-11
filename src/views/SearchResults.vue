<template>
  <div class="min-h-screen bg-bg-primary flex flex-col">
    <div class="flex-1 flex h-screen">
      <!-- Left Navigation Sidebar -->
      <AppSidebar />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col md:flex-row">
        <!-- Left Panel: Search & Conversation -->
        <div class="w-full bg-bg-card flex flex-col md:w-2/5 md:h-full">
          <AppHeader />
          <SearchConversation />

          <!-- Search Input -->
          <div class="px-8 py-4 md:px-4">
            <SearchBar
              v-model="newQuery"
              placeholder="Johnson, who is around 26 years old, works in a software company in California"
              @search="handleSearch"
              @file-upload="handleFileUpload"
            />
          </div>

          <!-- Spacer to push content up and search box immediately after content -->
          <div class="flex-1"></div>
        </div>

        <!-- Right Panel: Results -->
        <ResultsList
          :results="results"
          :is-loading="isLoading"
          :has-more="hasMore"
          :error="error"
          @load-more="handleLoadMore"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useSearchStore } from '@/stores/search'
  import AppHeader from '@/components/layout/AppHeader.vue'
  import AppSidebar from '@/components/navigation/AppSidebar.vue'
  import SearchBar from '@/components/common/SearchBar.vue'
  import SearchConversation from '@/components/search/SearchConversation.vue'
  import ResultsList from '@/components/search/ResultsList.vue'

  const searchStore = useSearchStore()

  const newQuery = ref(
    'Johnson, who is around 26 years old, works in a software company in California'
  )

  // Use search store data instead of local state
  const results = computed(() => searchStore.results)
  const isLoading = computed(() => searchStore.isLoading)
  const hasMore = computed(() => searchStore.pagination.hasMore)
  const error = computed(() => searchStore.error)

  const handleSearch = async () => {
    if (newQuery.value.trim()) {
      await searchStore.performSearch(newQuery.value)
    }
  }

  const handleFileUpload = (files: FileList) => {
    console.log('Files uploaded:', files)
    // TODO: Implement file upload functionality
  }

  const handleLoadMore = async () => {
    await searchStore.loadMoreResults()
  }
</script>
