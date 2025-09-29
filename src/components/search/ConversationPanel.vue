<template>
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
        v-model="searchQuery"
        :placeholder="searchPlaceholder"
        @search="handleSearch"
        @file-upload="handleFileUpload"
        @speech-error="handleSpeechError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    computed,
    nextTick,
    watch,
    onMounted,
    onBeforeUnmount
  } from 'vue'
  import { useRoute } from 'vue-router'
  import { useSearchStore } from '@/stores/search'
  import { useConversationStore } from '@/stores/conversation'
  import { useUIStore } from '@/stores/ui'
  import AppHeader from '@/components/layout/AppHeader.vue'
  import SearchBar from '@/components/common/SearchBar.vue'
  import SearchConversation from '@/components/search/SearchConversation.vue'
  import ChevronUpIcon from '@/components/icons/ChevronUpIcon.vue'
  import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
  import type { ConversationMessage } from '@/types/conversation'

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

  const route = useRoute()
  const searchStore = useSearchStore()
  const conversationStore = useConversationStore()
  const uiStore = useUIStore()
  const conversationScrollContainer = ref<HTMLElement | null>(null)
  const searchQuery = ref('')

  // Conversation scroll state
  const canScrollUpConversation = ref(false)
  const canScrollDownConversation = ref(false)
  const hasScrollableContentConversation = ref(false)
  const isAutoScrolling = ref(false)
  const isRestoringPosition = ref(false)

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

      // Save scroll position to store (but not during restoration)
      if (!isRestoringPosition.value) {
        uiStore.saveConversationScrollPosition(scrollTop)
      }
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

  const handleSearch = async () => {
    if (searchQuery.value.trim()) {
      // Add user message to conversation
      const userMessageId = `user-message-${Date.now()}`
      const systemResponseId = `system-response-${Date.now()}`
      const thinkingPlaceholderId = `thinking-${Date.now()}`

      conversationStore.addMessage({
        id: userMessageId,
        sender: 'user',
        timestamp: new Date(),
        content: searchQuery.value
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
      const queryToSearch = searchQuery.value

      // Clear the search input
      searchQuery.value = ''

      // Emit search event for parent to handle
      emit('search', queryToSearch)

      // Wait 3 seconds before performing search and replacing thinking placeholder
      setTimeout(async () => {
        // Perform the search
        await searchStore.performSearch(queryToSearch)

        // Find and replace the thinking placeholder with a standard response
        const scriptedContent =
          "Based on the additional information you provided I have narrowed the list of potential matches. Would you like to provide additional details, or do you see the person you're looking for?"

        conversationStore.updateMessage(thinkingPlaceholderId, {
          id: systemResponseId,
          sender: 'system',
          timestamp: new Date(),
          items: [
            {
              id: `text-${Date.now()}`,
              type: 'text',
              content: scriptedContent,
              emphasis: 'normal'
            }
          ]
        })
        // Scroll to show new system response
        scrollToBottom()
      }, 3000)
    }
  }

  const handleFileUpload = (files: File[]) => {
    emit('fileUpload', files)
  }

  const handleSpeechError = (error: string) => {
    emit('speechError', error)
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

  // Auto-scroll is handled explicitly during search operations (handleSearch function)
  // This preserves scroll position when navigating between screens

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

  // Watch for route changes and restore scroll position
  watch(
    () => route?.path,
    () => {
      // Restore scroll position when route changes
      isRestoringPosition.value = true
      nextTick(() => {
        setTimeout(() => {
          if (conversationScrollContainer.value) {
            const savedPosition = uiStore.getConversationScrollPosition()
            const currentHeight = conversationScrollContainer.value.scrollHeight
            const containerHeight =
              conversationScrollContainer.value.clientHeight
            if (savedPosition > 0 && currentHeight > containerHeight) {
              conversationScrollContainer.value.scrollTop = savedPosition
            }
            // Restoration complete
            isRestoringPosition.value = false
            handleConversationScroll()
          }
        }, 200)
      })
    }
  )

  // Restore scroll position on mount
  onMounted(async () => {
    isRestoringPosition.value = true
    await nextTick()

    // Wait a bit longer for content to fully load
    setTimeout(() => {
      if (conversationScrollContainer.value) {
        const savedPosition = uiStore.getConversationScrollPosition()
        const currentHeight = conversationScrollContainer.value.scrollHeight
        const containerHeight = conversationScrollContainer.value.clientHeight
        if (savedPosition > 0 && currentHeight > containerHeight) {
          conversationScrollContainer.value.scrollTop = savedPosition

          // Double-check after a brief moment to ensure position sticks
          setTimeout(() => {
            if (conversationScrollContainer.value && savedPosition > 0) {
              const finalScrollTop = conversationScrollContainer.value.scrollTop
              if (finalScrollTop !== savedPosition) {
                conversationScrollContainer.value.scrollTop = savedPosition
              }
            }
            // Restoration complete
            isRestoringPosition.value = false
          }, 50)
        } else {
          // No restoration needed
          isRestoringPosition.value = false
        }
        // Update scroll state after restoring position
        handleConversationScroll()
      }
    }, 100)
  })

  // Save scroll position before unmount
  onBeforeUnmount(() => {
    if (conversationScrollContainer.value) {
      const currentPosition = conversationScrollContainer.value.scrollTop
      uiStore.saveConversationScrollPosition(currentPosition)
    }
  })

  // Expose properties for parent components and testing
  defineExpose({
    scrollToBottom,
    conversationScrollContainer,
    handleConversationScroll,
    scrollConversationToTop,
    scrollConversationToBottom,
    canScrollUpConversation,
    canScrollDownConversation,
    hasScrollableContentConversation,
    searchQuery,
    handleSearch,
    handleFileUpload,
    handleSpeechError,
    conversationMessages,
    isAutoScrolling
  })
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
    top: 92px; /* Moved up 1px more from 93px to 92px */
  }

  .conversation-scroll-chevron.scroll-chevron-bottom {
    bottom: 178px; /* Moved up 1px more from 177px to 178px (higher bottom value = moved up) */
  }
</style>
