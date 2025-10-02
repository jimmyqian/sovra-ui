import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ConversationMessage } from '@/types/conversation'
import {
  getConversationScript,
  getNextResponse,
  getScriptedResults,
  getDetailScript,
  getDetailResponse
} from '@/utils/conversationScripts'
import type { DetailScript } from '@/utils/conversationScripts'
import type { SearchResult } from '@/types/search'

export const useConversationStore = defineStore('conversation', () => {
  // Response tracking for script-based conversations (search screen)
  const currentScript = ref<ReturnType<typeof getConversationScript> | null>(
    null
  )
  const responseIndex = ref(0)
  const resultStage = ref(0) // Track which result stage we're on (0-3)
  const originalQuery = ref('')

  // Response tracking for search detail script (separate from search screen)
  const detailScript = ref<DetailScript | null>(null)
  const detailResponseIndex = ref(0)
  const detailResultStage = ref(0) // Track detail screen script stage

  // Conversation history that persists across navigation
  const conversationHistory = ref<ConversationMessage[]>([
    {
      id: 'user-message-1',
      sender: 'user',
      timestamp: new Date(),
      content: 'Robert Schmidt'
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
              text: 'What specific details about Robert Schmidt can help narrow the search',
              onClick: () => {} // Will be set by components
            },
            {
              text: 'Location or workplace information for Robert Schmidt',
              onClick: () => {} // Will be set by components
            },
            {
              text: 'Additional context about Robert Schmidt',
              onClick: () => {} // Will be set by components
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
          onClick: () => {} // Will be set by components
        }
      ]
    }
  ])

  // Add a new message to the conversation
  const addMessage = (message: ConversationMessage) => {
    conversationHistory.value.push(message)
  }

  // Update an existing message by ID
  const updateMessage = (
    messageId: string,
    updatedMessage: ConversationMessage
  ) => {
    const index = conversationHistory.value.findIndex(
      msg => msg.id === messageId
    )
    if (index !== -1) {
      conversationHistory.value[index] = updatedMessage
    }
  }

  // Remove a message by ID
  const removeMessage = (messageId: string) => {
    const index = conversationHistory.value.findIndex(
      msg => msg.id === messageId
    )
    if (index !== -1) {
      conversationHistory.value.splice(index, 1)
    }
  }

  // Update hint onClick handlers (called by components that need to set these)
  const updateHintHandlers = (handlers: {
    onHintClick: (hintType: string) => void
    onCreateFilter: () => void
  }) => {
    const systemMessage = conversationHistory.value.find(
      msg => msg.id === 'system-response-1' && msg.sender === 'system'
    )

    if (systemMessage?.items) {
      // Update hints group onClick handlers
      const hintsGroup = systemMessage.items.find(
        item => item.type === 'hints-group'
      )
      if (hintsGroup && 'hints' in hintsGroup) {
        hintsGroup.hints.forEach((hint, index) => {
          const hintTypes = ['details', 'location or workplace', 'context']
          hint.onClick = () =>
            handlers.onHintClick(hintTypes[index] ?? 'unknown')
        })
      }

      // Update action button onClick handler
      const actionButton = systemMessage.items.find(
        item => item.type === 'action-button'
      )
      if (actionButton && 'onClick' in actionButton) {
        actionButton.onClick = handlers.onCreateFilter
      }
    }
  }

  // Initialize conversation script based on search query
  const initializeScript = (searchQuery: string) => {
    originalQuery.value = searchQuery
    currentScript.value = getConversationScript(searchQuery)
    responseIndex.value = 0
    resultStage.value = 0 // Start with initial results
  }

  // Get the next scripted response (without advancing result stage)
  const getScriptedResponse = (): string => {
    if (!currentScript.value) {
      // Fallback to default if no script is initialized
      return "Based on the additional information you provided I have narrowed the list of potential matches. Would you like to provide additional details, or do you see the person you're looking for?"
    }

    const response = getNextResponse(currentScript.value, responseIndex.value)
    responseIndex.value++
    // Note: resultStage advancement is now handled separately
    return response
  }

  // Advance to the next result stage (called when user provides new information)
  const advanceResultStage = (): void => {
    resultStage.value++
  }

  // Get the current scripted results for the current stage
  const getCurrentScriptedResults = (): SearchResult[] => {
    if (!currentScript.value) {
      return []
    }

    return getScriptedResults(currentScript.value, resultStage.value)
  }

  // Initialize detail script based on search query
  const initializeDetailScript = (searchQuery: string) => {
    detailScript.value = getDetailScript(searchQuery)
    detailResponseIndex.value = 0
    detailResultStage.value = 0
  }

  // Get the next scripted response for detail screen
  const getDetailScriptedResponse = (): string => {
    if (!detailScript.value) {
      // Fallback if no detail script is initialized
      return 'Search detail response 1'
    }

    const response = getDetailResponse(
      detailScript.value,
      detailResponseIndex.value
    )
    detailResponseIndex.value++
    return response
  }

  // Advance to the next detail result stage
  const advanceDetailResultStage = (): void => {
    detailResultStage.value++
  }

  // Reset script state
  const resetScript = () => {
    currentScript.value = null
    responseIndex.value = 0
    resultStage.value = 0
    originalQuery.value = ''
  }

  // Reset detail script state
  const resetDetailScript = () => {
    detailScript.value = null
    detailResponseIndex.value = 0
    detailResultStage.value = 0
  }

  // Clear all conversation history
  const clearConversation = () => {
    conversationHistory.value = []
    resetScript()
    resetDetailScript()
  }

  return {
    conversationHistory,
    addMessage,
    updateMessage,
    removeMessage,
    updateHintHandlers,
    clearConversation,
    initializeScript,
    getScriptedResponse,
    getCurrentScriptedResults,
    advanceResultStage,
    resetScript,
    // Detail script functions
    initializeDetailScript,
    getDetailScriptedResponse,
    advanceDetailResultStage,
    resetDetailScript,
    // Expose read-only state
    currentScript: computed(() => currentScript.value),
    responseIndex: computed(() => responseIndex.value),
    resultStage: computed(() => resultStage.value),
    originalQuery: computed(() => originalQuery.value),
    // Detail script state
    detailScript: computed(() => detailScript.value),
    detailResponseIndex: computed(() => detailResponseIndex.value),
    detailResultStage: computed(() => detailResultStage.value)
  }
})
