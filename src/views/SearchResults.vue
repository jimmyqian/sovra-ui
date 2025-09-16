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
        <div
          class="w-full bg-bg-card flex flex-col md:w-2/5 max-h-full relative overflow-hidden"
        >
          <AppHeader />

          <!-- Scrollable Conversation Area -->
          <div
            ref="conversationScrollContainer"
            class="flex-1 overflow-y-auto smooth-scroll"
          >
            <div class="pb-40">
              <SearchConversation :messages="conversationMessages" />
            </div>
          </div>

          <!-- Fixed Search Input -->
          <div
            class="absolute bottom-0 left-0 right-0 px-8 py-4 md:px-4 bg-bg-card border-t border-border-light"
          >
            <SearchBar
              v-model="newQuery"
              placeholder="Tell me more about who you're looking for"
              @search="handleSearch"
              @speech-error="handleSpeechError"
            />
          </div>
        </div>

        <!-- Right Panel: Results -->
        <div class="flex-1 flex flex-col max-h-full overflow-hidden">
          <div class="flex-1 overflow-y-auto max-h-full">
            <ResultsList
              :results="results"
              :is-loading="isLoading"
              :has-more="hasMore"
              :error="error"
              @load-more="handleLoadMore"
            />
          </div>
          <!-- Page Footer -->
          <CopyrightFooter @pi-click="handlePiClick" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick, watch } from 'vue'
  import { useSearchStore } from '@/stores/search'
  import AppHeader from '@/components/layout/AppHeader.vue'
  import AppSidebar from '@/components/navigation/AppSidebar.vue'
  import SearchBar from '@/components/common/SearchBar.vue'
  import SearchConversation from '@/components/search/SearchConversation.vue'
  import ResultsList from '@/components/search/ResultsList.vue'
  import CopyrightFooter from '@/components/layout/CopyrightFooter.vue'
  import type { ConversationMessage } from '@/types/conversation'

  const searchStore = useSearchStore()
  const conversationScrollContainer = ref<HTMLElement | null>(null)

  const newQuery = ref('')

  // Initialize conversation history with the first user query and system response
  const conversationHistory = ref<ConversationMessage[]>([
    {
      id: 'user-message-1',
      sender: 'user',
      timestamp: new Date(),
      content:
        'Johnson, who is around 26 years old, works in a software company in California'
    },
    {
      id: 'system-response-1',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'results-summary',
          type: 'results-summary',
          resultCount: 0 // Will be updated by computed property
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
          id: 'action-button-1',
          type: 'action-button',
          text: 'create a filter using the details that you provided',
          variant: 'dashed',
          onClick: () => handleCreateFilter()
        }
      ]
    }
  ])

  // Use search store data instead of local state
  const results = computed(() => searchStore.results)
  const isLoading = computed(() => searchStore.isLoading)
  const hasMore = computed(() => searchStore.pagination.hasMore)
  const error = computed(() => searchStore.error)

  // Auto-scroll to bottom function with 1-second smooth animation
  const scrollToBottom = async () => {
    await nextTick()
    if (conversationScrollContainer.value) {
      const container = conversationScrollContainer.value
      const startPosition = container.scrollTop
      const targetPosition = container.scrollHeight - container.clientHeight
      const distance = targetPosition - startPosition
      const duration = 1000 // 1 second
      let startTime: number | null = null

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / duration, 1)

        // Easing function for smooth animation (ease-in-out)
        const easeInOut =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2

        container.scrollTop = startPosition + distance * easeInOut

        if (progress < 1) {
          globalThis.requestAnimationFrame(animateScroll)
        }
      }

      globalThis.requestAnimationFrame(animateScroll)
    }
  }

  const handleSearch = async () => {
    if (newQuery.value.trim()) {
      // Add user message to conversation
      const userMessageId = `user-message-${Date.now()}`
      const systemResponseId = `system-response-${Date.now()}`
      const thinkingPlaceholderId = `thinking-${Date.now()}`

      conversationHistory.value.push({
        id: userMessageId,
        sender: 'user',
        timestamp: new Date(),
        content: newQuery.value
      })

      // Scroll to show new user message
      scrollToBottom()

      // Add thinking placeholder immediately
      conversationHistory.value.push({
        id: thinkingPlaceholderId,
        sender: 'system',
        timestamp: new Date(),
        items: [
          {
            id: `thinking-text-${Date.now()}`,
            type: 'text',
            content: 'thinking...',
            emphasis: 'normal',
            isThinking: true
          }
        ]
      })

      // Scroll to show thinking placeholder
      scrollToBottom()

      // Perform the search
      await searchStore.performSearch(newQuery.value)

      // Clear the search input
      newQuery.value = ''

      // Wait 3 seconds before replacing thinking placeholder with actual response
      setTimeout(() => {
        // Find and replace the thinking placeholder
        const thinkingIndex = conversationHistory.value.findIndex(
          msg => msg.id === thinkingPlaceholderId
        )
        if (thinkingIndex !== -1) {
          conversationHistory.value[thinkingIndex] = {
            id: systemResponseId,
            sender: 'system',
            timestamp: new Date(),
            items: [
              {
                id: `text-${Date.now()}`,
                type: 'text',
                content:
                  "Based on the additional information you provided I have narrowed the list of potential matches. Would you like to provide additional details, or do you see the person you're looking for?",
                emphasis: 'normal'
              }
            ]
          }
          // Scroll to show new system response
          scrollToBottom()
        }
      }, 3000)
    }
  }

  const handleLoadMore = async () => {
    await searchStore.loadMoreResults()
  }

  // Generate conversation data based on search state

  const conversationMessages = computed<ConversationMessage[]>(() => {
    const totalResults = searchStore.displayTotalResults
    const messages = [...conversationHistory.value]

    // Update the result count in the initial system response if it exists
    if (messages.length >= 2 && messages[1]?.sender === 'system') {
      const systemMessage = messages[1]
      const resultsSummaryItem = systemMessage.items?.find(
        item => item.type === 'results-summary'
      )
      if (resultsSummaryItem && 'resultCount' in resultsSummaryItem) {
        resultsSummaryItem.resultCount = totalResults
      }
    }

    return messages
  })

  // Watch for changes in conversation messages and auto-scroll
  watch(
    conversationMessages,
    () => {
      scrollToBottom()
    },
    { deep: true }
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

<style scoped>
  .smooth-scroll {
    scroll-behavior: smooth;
  }
</style>
