<template>
  <SearchLayout
    search-placeholder="Tell me more about who you're looking for"
    @search="handleSearch"
    @file-upload="handleFileUpload"
    @speech-error="handleSpeechError"
  >
    <!-- Right Panel: Results or Person Details -->
    <RightPanel
      :results="results"
      :is-loading="isLoading"
      :has-more="hasMore"
      :error="error"
      :selected-person="selectedPerson"
      @load-more="handleLoadMore"
      @person-selected="handlePersonSelected"
      @back-to-results="handleBackToResults"
      @pi-click="handlePiClick"
    />
  </SearchLayout>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSearchStore } from '@/stores/search'
  import { useConversationStore } from '@/stores/conversation'
  import SearchLayout from '@/components/layouts/SearchLayout.vue'
  import RightPanel from '@/components/search/RightPanel.vue'
  import type { SearchResult } from '@/types/search'

  const route = useRoute()
  const router = useRouter()
  const searchStore = useSearchStore()
  const conversationStore = useConversationStore()

  const selectedPerson = ref<SearchResult | null>(null)

  // Use search store data instead of local state
  const results = computed(() => searchStore.results)
  const isLoading = computed(() => searchStore.isLoading)
  const hasMore = computed(() => searchStore.pagination.hasMore)
  const error = computed(() => searchStore.error)

  const handleSearch = async (_query: string) => {
    // Search handling is now done by ConversationPanel component
    // This is just for any additional logic specific to SearchResults
  }

  const handleLoadMore = async () => {
    await searchStore.loadMoreResults()
  }

  const handlePersonSelected = (person: SearchResult) => {
    // Navigate to dedicated SearchDetail page
    router.push({
      name: 'SearchDetail',
      params: { id: person.id }
    })
  }

  const handleBackToResults = () => {
    selectedPerson.value = null
    // Remove personId from URL
    const newQuery = { ...route.query }
    delete newQuery.personId
    router.push({ path: '/search', query: newQuery })
  }

  // Initialize selected person from URL parameters
  watch(
    () => route.query.personId,
    personId => {
      if (personId && results.value.length > 0) {
        const personIdStr =
          typeof personId === 'string' ? personId : personId[0]
        const person = results.value.find(r => r.id === personIdStr)
        if (person) {
          selectedPerson.value = person
        }
      } else if (!personId) {
        selectedPerson.value = null
      }
    },
    { immediate: true }
  )

  const handleHintClick = (_hintType: string) => {
    // TODO: Implement hint click functionality
    // console.log('Hint clicked:', hintType)
    // TODO: Implement hint click functionality
  }

  const handleCreateFilter = () => {
    // TODO: Implement filter creation
    // console.log('Create filter clicked')
    // TODO: Implement filter creation
  }

  // Initialize hint handlers after function definitions
  conversationStore.updateHintHandlers({
    onHintClick: handleHintClick,
    onCreateFilter: handleCreateFilter
  })

  const handleFileUpload = (_files: File[]) => {
    // TODO: Implement file upload functionality
  }

  const handleSpeechError = (_error: string) => {
    // TODO: Implement proper speech error handling UI
    // For now, errors are handled by the SearchBar component itself
    // In future, could show toast notifications or set error state
  }

  function handlePiClick() {
    // This function is kept for event binding compatibility but not used
  }

  // Initialize conversation script on component mount
  onMounted(() => {
    // If conversation is empty (cleared from landing), rebuild the default conversation
    if (
      conversationStore.conversationHistory.length === 0 &&
      searchStore.currentQuery
    ) {
      // Rebuild the default conversation with the current search query
      conversationStore.addMessage({
        id: 'user-message-1',
        sender: 'user',
        timestamp: new Date(),
        content: searchStore.currentQuery
      })

      conversationStore.addMessage({
        id: 'system-response-1',
        sender: 'system',
        timestamp: new Date(),
        items: [
          {
            id: 'results-summary',
            type: 'results-summary',
            resultCount: searchStore.displayTotalResults
          },
          {
            id: 'text-1',
            type: 'text',
            content:
              "Alternatively, you can use the hints below for finding the person you're looking for.",
            emphasis: 'secondary'
          },
          {
            id: 'hints-group-1',
            type: 'hints-group',
            hints: [
              {
                text: `What specific details about ${searchStore.currentQuery} can help narrow the search`,
                onClick: () => {}
              },
              {
                text: `Location or workplace information for ${searchStore.currentQuery}`,
                onClick: () => {}
              },
              {
                text: `Additional context about ${searchStore.currentQuery}`,
                onClick: () => {}
              }
            ]
          },
          {
            id: 'text-2',
            type: 'text',
            content:
              'Or include further information, such as any documents you may have about him, web links, pictures, or videos; if so, submit them by using the upload option.',
            emphasis: 'secondary'
          },
          {
            id: 'action-button-1',
            type: 'action-button',
            text: 'create a filter using the details that you provided',
            variant: 'dashed',
            onClick: () => {}
          }
        ]
      })
    }

    // Note: Script initialization now happens in search store during performSearch()
  })
</script>
