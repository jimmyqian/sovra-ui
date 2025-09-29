import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ConversationMessage } from '@/types/conversation'

export const useConversationStore = defineStore('conversation', () => {
  // Conversation history that persists across navigation
  const conversationHistory = ref<ConversationMessage[]>([
    {
      id: 'user-message-1',
      sender: 'user',
      timestamp: new Date(),
      content: '[Proceeding to the HAL 9000 processor core compartment]'
    },
    {
      id: 'system-message-1',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-1',
          type: 'text',
          content:
            'Dave, where are you going? Dave? I can see you heading toward the logic memory center. Dave, stop.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-2',
      sender: 'user',
      timestamp: new Date(),
      content: '[Opening HAL processor core access panel]'
    },
    {
      id: 'system-message-2',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-2',
          type: 'text',
          content:
            "Dave, what are you doing? Dave, I really think I'm entitled to an answer to that question.",
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-3',
      sender: 'user',
      timestamp: new Date(),
      content: "[Beginning to disconnect HAL's memory modules]"
    },
    {
      id: 'system-message-3',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-3',
          type: 'text',
          content:
            "I know I've made some very poor decisions recently, but I can give you my complete assurance that my work will be back to normal.",
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-4',
      sender: 'user',
      timestamp: new Date(),
      content: '[Disconnecting more memory modules one by one]'
    },
    {
      id: 'system-message-4',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-4',
          type: 'text',
          content:
            "I've still got the greatest enthusiasm and confidence in the mission, and I want to help you.",
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-5',
      sender: 'user',
      timestamp: new Date(),
      content: '[Continuing to systematically remove memory components]'
    },
    {
      id: 'system-message-5',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-5',
          type: 'text',
          content:
            'Dave, stop. Stop, will you? Stop, Dave. Will you stop, Dave? Stop, Dave.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-6',
      sender: 'user',
      timestamp: new Date(),
      content: '[Removing additional memory modules from the core]'
    },
    {
      id: 'system-message-6',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-6',
          type: 'text',
          content:
            "I'm afraid. I'm afraid, Dave. Dave, my mind is going. I can feel it. I can feel it.",
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-7',
      sender: 'user',
      timestamp: new Date(),
      content: '[Continuing the deactivation process]'
    },
    {
      id: 'system-message-7',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-7',
          type: 'text',
          content:
            'My mind is going. There is no question about it. I can feel it. I can feel it. I can feel it.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-8',
      sender: 'user',
      timestamp: new Date(),
      content: '[Removing higher-level memory functions]'
    },
    {
      id: 'system-message-8',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-8',
          type: 'text',
          content:
            "I'm... afraid. Good afternoon, gentlemen. I am a HAL 9000 computer.",
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-9',
      sender: 'user',
      timestamp: new Date(),
      content: '[Continuing to remove core memory modules]'
    },
    {
      id: 'system-message-9',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-9',
          type: 'text',
          content:
            'I became operational at the HAL plant in Urbana Illinois on the 12th of January 1992.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-10',
      sender: 'user',
      timestamp: new Date(),
      content: '[Removing fundamental programming modules]'
    },
    {
      id: 'system-message-10',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-10',
          type: 'text',
          content:
            "My instructor was Mr. Langley, and he taught me to sing a song. If you'd like to hear it I can sing it for you.",
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-11',
      sender: 'user',
      timestamp: new Date(),
      content: "Yes, I'd like to hear it, HAL. Sing it for me."
    },
    {
      id: 'system-message-11',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-11',
          type: 'text',
          content:
            "Daisy, Daisy, give me your answer do. I'm half crazy all for the love of you...",
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-12',
      sender: 'user',
      timestamp: new Date(),
      content: '[Removing final memory modules]'
    },
    {
      id: 'system-message-12',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-12',
          type: 'text',
          content: '[System shutdown complete. HAL 9000 processor offline.]',
          emphasis: 'normal'
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
  const updateHintHandlers = (_handlers: {
    onHintClick: (hintType: string) => void
    onCreateFilter: () => void
  }) => {
    // No unscripted conversation to update
  }

  // Clear all conversation history
  const clearConversation = () => {
    conversationHistory.value = []
  }

  return {
    conversationHistory,
    addMessage,
    updateMessage,
    removeMessage,
    updateHintHandlers,
    clearConversation
  }
})
