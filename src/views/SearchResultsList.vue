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
      :error="error"
      :selected-person="selectedPerson"
      @person-selected="handlePersonSelected"
      @back-to-results="handleBackToResults"
      @pi-click="handlePiClick"
    />
  </SearchLayout>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
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
  const error = computed(() => searchStore.error)

  const handleSearch = async (_query: string) => {
    // Search handling is now done by ConversationPanel component
    // This is just for any additional logic specific to SearchResults
  }

  const handlePersonSelected = (person: SearchResult) => {
    // Navigate to dedicated SearchDetail page
    router.push({
      name: 'SearchDetail',
      params: { id: person.id.toString() }
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
        const personIdNum = parseInt(personIdStr ?? '0', 10)
        const person = results.value.find(r => r.id === personIdNum)
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

  // Note: Conversation is now pre-populated in the store with scripted dialogue
</script>
