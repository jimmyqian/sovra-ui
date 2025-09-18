import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ConversationMessage } from '@/types/conversation'
import {
  getConversationScript,
  getNextResponse,
  getScriptedResults
} from '@/utils/conversationScripts'
import type { SearchResult } from '@/types/search'

export const useConversationStore = defineStore('conversation', () => {
  // Response tracking for script-based conversations
  const currentScript = ref<ReturnType<typeof getConversationScript> | null>(
    null
  )
  const responseIndex = ref(0)
  const resultStage = ref(0) // Track which result stage we're on (0-3)
  const originalQuery = ref('')

  // Conversation history that persists across navigation
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
              onClick: () => {} // Will be set by components
            },
            {
              text: 'Which California tech hubs are most likely where Johnson works',
              onClick: () => {} // Will be set by components
            },
            {
              text: 'What skills Johnson has from his current software role',
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
          const hintTypes = [
            'software role',
            'California tech hubs',
            'software skills'
          ]
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

  // Reset script state
  const resetScript = () => {
    currentScript.value = null
    responseIndex.value = 0
    resultStage.value = 0
    originalQuery.value = ''
  }

  // Clear all conversation history
  const clearConversation = () => {
    conversationHistory.value = []
    resetScript()
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
    // Expose read-only state
    currentScript: computed(() => currentScript.value),
    responseIndex: computed(() => responseIndex.value),
    resultStage: computed(() => resultStage.value),
    originalQuery: computed(() => originalQuery.value)
  }
})
