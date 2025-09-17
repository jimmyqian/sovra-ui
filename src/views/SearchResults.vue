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
            class="flex-1 overflow-y-auto smooth-scroll conversation-scroll"
            @scroll="handleConversationScroll"
          >
            <div class="pb-40">
              <SearchConversation :messages="conversationMessages" />
            </div>
          </div>

          <!-- Conversation Scroll Control Buttons -->
          <ChevronUpIcon
            v-if="
              hasScrollableContentConversation &&
              canScrollUpConversation &&
              !isAutoScrolling
            "
            class="scroll-chevron scroll-chevron-top conversation-scroll-chevron cursor-pointer"
            aria-label="Scroll conversation to top"
            @click="scrollConversationToTop"
          />
          <ChevronDownIcon
            v-if="
              hasScrollableContentConversation &&
              canScrollDownConversation &&
              !isAutoScrolling
            "
            class="scroll-chevron scroll-chevron-bottom conversation-scroll-chevron cursor-pointer"
            aria-label="Scroll conversation to bottom"
            @click="scrollConversationToBottom"
          />

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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSearchStore } from '@/stores/search'
  import { useConversationStore } from '@/stores/conversation'
  import AppHeader from '@/components/layout/AppHeader.vue'
  import AppSidebar from '@/components/navigation/AppSidebar.vue'
  import SearchBar from '@/components/common/SearchBar.vue'
  import SearchConversation from '@/components/search/SearchConversation.vue'
  import RightPanel from '@/components/search/RightPanel.vue'
  import ChevronUpIcon from '@/components/icons/ChevronUpIcon.vue'
  import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
  import type { ConversationMessage } from '@/types/conversation'
  import type { SearchResult } from '@/types/search'

  const route = useRoute()
  const router = useRouter()
  const searchStore = useSearchStore()
  const conversationStore = useConversationStore()
  const conversationScrollContainer = ref<HTMLElement | null>(null)

  const newQuery = ref('')
  const selectedPerson = ref<SearchResult | null>(null)

  // Conversation scroll state
  const canScrollUpConversation = ref(false)
  const canScrollDownConversation = ref(false)
  const hasScrollableContentConversation = ref(false)
  const isAutoScrolling = ref(false)

  // Use search store data instead of local state
  const results = computed(() => searchStore.results)
  const isLoading = computed(() => searchStore.isLoading)
  const hasMore = computed(() => searchStore.pagination.hasMore)
  const error = computed(() => searchStore.error)

  // Auto-scroll to bottom function with 1-second smooth animation
  const scrollToBottom = async () => {
    await nextTick()
    if (conversationScrollContainer.value) {
      isAutoScrolling.value = true
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
        } else {
          // Animation complete, allow buttons to show again
          isAutoScrolling.value = false
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

      conversationStore.addMessage({
        id: userMessageId,
        sender: 'user',
        timestamp: new Date(),
        content: newQuery.value
      })

      // Scroll to show new user message
      scrollToBottom()

      // Add thinking placeholder immediately
      conversationStore.addMessage({
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

      // Store the query before clearing input
      const queryToSearch = newQuery.value

      // Clear the search input
      newQuery.value = ''

      // Wait 3 seconds before performing search and replacing thinking placeholder
      setTimeout(async () => {
        // Perform the search
        await searchStore.performSearch(queryToSearch)

        // Find and replace the thinking placeholder
        conversationStore.updateMessage(thinkingPlaceholderId, {
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
        })
        // Scroll to show new system response
        scrollToBottom()
      }, 3000)
    }
  }

  const handleLoadMore = async () => {
    await searchStore.loadMoreResults()
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

  const handleConversationScroll = () => {
    if (conversationScrollContainer.value) {
      const container = conversationScrollContainer.value
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight

      // Update conversation scroll button states
      canScrollUpConversation.value = scrollTop > 0
      canScrollDownConversation.value = scrollTop < scrollHeight - clientHeight
      hasScrollableContentConversation.value = scrollHeight > clientHeight
    }
  }

  const scrollConversationToTop = () => {
    if (conversationScrollContainer.value) {
      const currentScroll = conversationScrollContainer.value.scrollTop
      const scrollAmount = 200 // Same scroll amount as results
      conversationScrollContainer.value.scrollTo({
        top: Math.max(0, currentScroll - scrollAmount),
        behavior: 'smooth'
      })
    }
  }

  const scrollConversationToBottom = () => {
    if (conversationScrollContainer.value) {
      const currentScroll = conversationScrollContainer.value.scrollTop
      const scrollAmount = 200 // Same scroll amount as results
      const maxScroll =
        conversationScrollContainer.value.scrollHeight -
        conversationScrollContainer.value.clientHeight
      conversationScrollContainer.value.scrollTo({
        top: Math.min(maxScroll, currentScroll + scrollAmount),
        behavior: 'smooth'
      })
    }
  }

  // Generate conversation data based on search state
  const conversationMessages = computed<ConversationMessage[]>(() => {
    const totalResults = searchStore.displayTotalResults
    const messages = [...conversationStore.conversationHistory]

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

  // Watch for changes in conversation messages to update scroll state
  watch(
    conversationMessages,
    () => {
      // Check scroll state after conversation update
      nextTick(() => {
        handleConversationScroll()
      })
    },
    { deep: true, immediate: true }
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

  /* Hide scrollbars on conversation panel */
  .conversation-scroll {
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  /* Scroll control chevrons */
  .scroll-chevron {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 24px;
    color: var(--color-brand-orange);
    transition: all 0.2s ease;
    z-index: 20;
  }

  .scroll-chevron:hover {
    color: #e55a2e; /* darker orange on hover */
    transform: translateX(-50%) scale(1.1);
  }

  .scroll-chevron:active {
    transform: translateX(-50%) scale(0.95);
  }

  .scroll-chevron-top {
    top: 16px;
  }

  .scroll-chevron-bottom {
    bottom: 190px; /* Above search input area */
  }

  /* Conversation scroll chevrons - positioned differently */
  .conversation-scroll-chevron.scroll-chevron-top {
    top: 80px; /* Below header */
  }

  .conversation-scroll-chevron.scroll-chevron-bottom {
    bottom: 190px; /* Move down 10px from previous position */
  }
</style>
