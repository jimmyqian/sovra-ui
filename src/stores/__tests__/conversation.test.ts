import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useConversationStore } from '../conversation'

// Mock the conversationScripts utility
vi.mock('@/utils/conversationScripts', () => ({
  getConversationScript: vi.fn((query: string) => ({
    responses: [
      `${query} response 1`,
      `${query} response 2`,
      `${query} response 3`
    ]
  })),
  getNextResponse: vi.fn((script, index: number) => {
    if (index >= 0 && index < script.responses.length) {
      return script.responses[index]
    }
    return "Based on the additional information you provided I have narrowed the list of potential matches. Would you like to provide additional details, or do you see the person you're looking for?"
  })
}))

describe('useConversationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('basic conversation management', () => {
    it('should initialize with default conversation history', () => {
      const store = useConversationStore()

      expect(store.conversationHistory).toHaveLength(2)
      expect(store.conversationHistory[0]?.sender).toBe('user')
      expect(store.conversationHistory[1]?.sender).toBe('system')
    })

    it('should add new messages to conversation history', () => {
      const store = useConversationStore()
      const initialLength = store.conversationHistory.length

      const newMessage = {
        id: 'test-message',
        sender: 'user' as const,
        timestamp: new Date(),
        content: 'Test message'
      }

      store.addMessage(newMessage)

      expect(store.conversationHistory).toHaveLength(initialLength + 1)
      expect(
        store.conversationHistory[store.conversationHistory.length - 1]
      ).toEqual(newMessage)
    })

    it('should update existing messages by ID', () => {
      const store = useConversationStore()

      const updatedMessage = {
        id: 'user-message-1',
        sender: 'user' as const,
        timestamp: new Date(),
        content: 'Updated content'
      }

      store.updateMessage('user-message-1', updatedMessage)

      const foundMessage = store.conversationHistory.find(
        msg => msg.id === 'user-message-1'
      )
      expect(foundMessage?.content).toBe('Updated content')
    })

    it('should remove messages by ID', () => {
      const store = useConversationStore()
      const initialLength = store.conversationHistory.length

      store.removeMessage('user-message-1')

      expect(store.conversationHistory).toHaveLength(initialLength - 1)
      expect(
        store.conversationHistory.find(msg => msg.id === 'user-message-1')
      ).toBeUndefined()
    })

    it('should clear all conversation history', () => {
      const store = useConversationStore()

      store.clearConversation()

      expect(store.conversationHistory).toHaveLength(0)
    })
  })

  describe('script-based conversation functionality', () => {
    it('should initialize script with search query', () => {
      const store = useConversationStore()

      store.initializeScript('John Caruso')

      expect(store.originalQuery).toBe('John Caruso')
      expect(store.responseIndex).toBe(0)
      expect(store.currentScript).toBeTruthy()
    })

    it('should get scripted responses and increment index', () => {
      const store = useConversationStore()

      store.initializeScript('Von Miller')

      const firstResponse = store.getScriptedResponse()
      expect(firstResponse).toBe('Von Miller response 1')
      expect(store.responseIndex).toBe(1)

      const secondResponse = store.getScriptedResponse()
      expect(secondResponse).toBe('Von Miller response 2')
      expect(store.responseIndex).toBe(2)

      const thirdResponse = store.getScriptedResponse()
      expect(thirdResponse).toBe('Von Miller response 3')
      expect(store.responseIndex).toBe(3)
    })

    it('should return default response when no script is initialized', () => {
      const store = useConversationStore()

      const response = store.getScriptedResponse()

      expect(response).toBe(
        "Based on the additional information you provided I have narrowed the list of potential matches. Would you like to provide additional details, or do you see the person you're looking for?"
      )
    })

    it('should reset script state', () => {
      const store = useConversationStore()

      store.initializeScript('Test Query')
      store.getScriptedResponse() // increment index

      store.resetScript()

      expect(store.originalQuery).toBe('')
      expect(store.responseIndex).toBe(0)
      expect(store.currentScript).toBeNull()
    })

    it('should reset script when clearing conversation', () => {
      const store = useConversationStore()

      store.initializeScript('Test Query')
      store.getScriptedResponse()

      store.clearConversation()

      expect(store.conversationHistory).toHaveLength(0)
      expect(store.originalQuery).toBe('')
      expect(store.responseIndex).toBe(0)
      expect(store.currentScript).toBeNull()
    })
  })

  describe('hint handlers', () => {
    it('should update hint handlers for system messages', () => {
      const store = useConversationStore()
      const mockHintClick = vi.fn()
      const mockCreateFilter = vi.fn()

      store.updateHintHandlers({
        onHintClick: mockHintClick,
        onCreateFilter: mockCreateFilter
      })

      // Find the system message and test hint interactions
      const systemMessage = store.conversationHistory.find(
        msg => msg.id === 'system-response-1' && msg.sender === 'system'
      )

      expect(systemMessage).toBeTruthy()

      if (systemMessage?.items) {
        const hintsGroup = systemMessage.items.find(
          item => item.type === 'hints-group'
        )
        const actionButton = systemMessage.items.find(
          item => item.type === 'action-button'
        )

        if (hintsGroup && 'hints' in hintsGroup) {
          hintsGroup.hints[0]?.onClick?.()
          expect(mockHintClick).toHaveBeenCalledWith('software role')
        }

        if (actionButton && 'onClick' in actionButton) {
          actionButton.onClick?.()
          expect(mockCreateFilter).toHaveBeenCalled()
        }
      }
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle update message with non-existent ID', () => {
      const store = useConversationStore()
      const initialLength = store.conversationHistory.length

      const updatedMessage = {
        id: 'non-existent',
        sender: 'user' as const,
        timestamp: new Date(),
        content: 'Should not be added'
      }

      store.updateMessage('non-existent', updatedMessage)

      expect(store.conversationHistory).toHaveLength(initialLength)
    })

    it('should handle remove message with non-existent ID', () => {
      const store = useConversationStore()
      const initialLength = store.conversationHistory.length

      store.removeMessage('non-existent')

      expect(store.conversationHistory).toHaveLength(initialLength)
    })

    it('should handle empty query in script initialization', () => {
      const store = useConversationStore()

      store.initializeScript('')

      expect(store.originalQuery).toBe('')
      expect(store.currentScript).toBeTruthy()
    })
  })
})
