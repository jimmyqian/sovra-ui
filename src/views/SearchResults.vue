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
          <SearchConversation
            :messages="conversationMessages"
            :user-query="currentQuery"
          />

          <!-- Search Input -->
          <div class="px-8 py-4 md:px-4">
            <SearchBar
              v-model="newQuery"
              placeholder="Johnson, who is around 26 years old, works in a software company in California"
              @search="handleSearch"
              @file-upload="handleFileUpload"
              @speech-error="handleSpeechError"
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

    <!-- Page Footer -->
    <CopyrightFooter @pi-click="handlePiClick" />
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
  import CopyrightFooter from '@/components/layout/CopyrightFooter.vue'
  import type { ConversationMessage } from '@/types/conversation'

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

  const handleFileUpload = (_files: File[]) => {
    // TODO: Implement file upload functionality
    // console.log('Files uploaded:', files)
    // TODO: Implement file upload functionality
  }

  const handleLoadMore = async () => {
    await searchStore.loadMoreResults()
  }

  // Generate conversation data based on search state
  const currentQuery = computed(() => searchStore.currentQuery)

  const conversationMessages = computed<ConversationMessage[]>(() => {
    const totalResults = searchStore.displayTotalResults

    return [
      {
        id: 'system-response-1',
        sender: 'system',
        timestamp: new Date(),
        items: [
          {
            id: 'results-summary',
            type: 'results-summary',
            resultCount: totalResults
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
                text: 'What specific software role does Johnson hold in his California job',
                onClick: () => handleHintClick('software role')
              },
              {
                text: 'Which California tech hubs are most likely where Johnson works',
                onClick: () => handleHintClick('California tech hubs')
              },
              {
                text: 'What skills Johnson has from his current software role',
                onClick: () => handleHintClick('software skills')
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
            id: 'refinement-age',
            type: 'refinement',
            label: 'Only show results with ages from:',
            inputType: 'age-range',
            value: { min: '', max: '' },
            onChange: (
              value: string | { min: string; max: string } | string[] | boolean
            ) => {
              if (
                typeof value === 'object' &&
                value !== null &&
                !Array.isArray(value)
              ) {
                handleAgeRangeChange(value)
              }
            }
          },
          {
            id: 'action-button-1',
            type: 'action-button',
            text: 'create a filter using the details that you provided',
            variant: 'dashed',
            onClick: () => handleCreateFilter()
          },
          {
            id: 'file-upload-1',
            type: 'file-upload',
            label: 'Upload additional documents',
            acceptedTypes: [
              '.pdf',
              '.doc',
              '.docx',
              '.jpg',
              '.jpeg',
              '.png',
              '.gif'
            ],
            onUpload: (files: FileList) => handleFileUpload(Array.from(files))
          }
        ]
      }
    ]
  })

  const handleHintClick = (_hintType: string) => {
    // TODO: Implement hint click functionality
    // console.log('Hint clicked:', hintType)
    // TODO: Implement hint click functionality
  }

  const handleAgeRangeChange = (_ageRange: { min: string; max: string }) => {
    // TODO: Implement age range filtering
    // console.log('Age range changed:', ageRange)
    // TODO: Implement age range filtering
  }

  const handleCreateFilter = () => {
    // TODO: Implement filter creation
    // console.log('Create filter clicked')
    // TODO: Implement filter creation
  }

  const handleSpeechError = (_error: string) => {
    // TODO: Implement proper speech error handling UI
    // For now, errors are handled by the SearchBar component itself
    // In future, could show toast notifications or set error state
  }

  function handlePiClick() {
    // This function is kept for event binding compatibility but not used
    // The pi symbol now directly triggers lightbox from the footer component
  }
</script>
