import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useConversationStore } from '../conversation'

describe('useConversationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('basic conversation management', () => {
    it('should initialize with scripted conversation history', () => {
      const store = useConversationStore()

      expect(store.conversationHistory).toHaveLength(36)
      expect(store.conversationHistory[0]?.sender).toBe('system')
      expect(store.conversationHistory[0]?.items?.[0]?.type).toBe('text')
      const firstItem = store.conversationHistory[0]?.items?.[0]
      if (firstItem && 'content' in firstItem) {
        expect(firstItem.content).toBe(
          'Good morning, Dave. How may I assist you today?'
        )
      }

      // Check that we have both user and system messages including HAL deactivation sequence
      const userMessages = store.conversationHistory.filter(
        msg => msg.sender === 'user'
      )
      const systemMessages = store.conversationHistory.filter(
        msg => msg.sender === 'system'
      )
      expect(userMessages).toHaveLength(17)
      expect(systemMessages).toHaveLength(19)

      // Verify the conversation includes the HAL deactivation sequence
      const lastSystemMessage =
        store.conversationHistory[store.conversationHistory.length - 1]
      expect(lastSystemMessage.sender).toBe('system')
      const lastItem = lastSystemMessage.items?.[0]
      if (lastItem && 'content' in lastItem) {
        expect(lastItem.content).toContain('HAL 9000 processor offline')
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

      // Add a message first with a unique ID
      const originalMessage = {
        id: 'test-update-message',
        sender: 'user' as const,
        timestamp: new Date(),
        content: 'Original content'
      }
      store.addMessage(originalMessage)

      const updatedMessage = {
        id: 'test-update-message',
        sender: 'user' as const,
        timestamp: new Date(),
        content: 'Updated content'
      }

      store.updateMessage('test-update-message', updatedMessage)

      const foundMessage = store.conversationHistory.find(
        msg => msg.id === 'test-update-message'
      )
      expect(foundMessage?.content).toBe('Updated content')
    })

    it('should remove messages by ID', () => {
      const store = useConversationStore()

      // Add a message first with a unique ID
      const testMessage = {
        id: 'test-remove-message',
        sender: 'user' as const,
        timestamp: new Date(),
        content: 'Test content'
      }
      store.addMessage(testMessage)

      const initialLength = store.conversationHistory.length

      store.removeMessage('test-remove-message')

      expect(store.conversationHistory).toHaveLength(initialLength - 1)
      expect(
        store.conversationHistory.find(msg => msg.id === 'test-remove-message')
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
