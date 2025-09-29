import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useConversationStore } from '../conversation'

describe('useConversationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('basic conversation management', () => {
    it('should initialize with default HAL 9000 greeting from system', () => {
      const store = useConversationStore()

      expect(store.conversationHistory).toHaveLength(1)
      expect(store.conversationHistory[0]?.sender).toBe('system')
      expect(store.conversationHistory[0]?.items?.[0]?.type).toBe('text')
      const firstItem = store.conversationHistory[0]?.items?.[0]
      if (firstItem && 'content' in firstItem) {
        expect(firstItem.content).toBe(
          'Good morning, Dave. How may I assist you today?'
        )
      }
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

      // Add a message first
      const originalMessage = {
        id: 'user-message-1',
        sender: 'user' as const,
        timestamp: new Date(),
        content: 'Original content'
      }
      store.addMessage(originalMessage)

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

      // Add a message first
      const testMessage = {
        id: 'user-message-1',
        sender: 'user' as const,
        timestamp: new Date(),
        content: 'Test content'
      }
      store.addMessage(testMessage)

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

  describe('hint handlers', () => {
    it('should handle hint handlers with no unscripted conversation', () => {
      const store = useConversationStore()
      const mockHintClick = vi.fn()
      const mockCreateFilter = vi.fn()

      // Should not throw an error when called with empty conversation
      expect(() => {
        store.updateHintHandlers({
          onHintClick: mockHintClick,
          onCreateFilter: mockCreateFilter
        })
      }).not.toThrow()

      // No system message should exist in empty conversation
      const systemMessage = store.conversationHistory.find(
        msg => msg.id === 'system-response-1' && msg.sender === 'system'
      )
      expect(systemMessage).toBeUndefined()
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
  })
})
