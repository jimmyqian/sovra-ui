import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ConversationMessage } from '@/types/conversation'

export const useConversationStore = defineStore('conversation', () => {
  // Conversation history that persists across navigation
  const conversationHistory = ref<ConversationMessage[]>([
    {
      id: 'system-message-1',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'greeting-text',
          type: 'text',
          content: 'Good morning, Dave. How may I assist you today?',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-1',
      sender: 'user',
      timestamp: new Date(),
      content: 'HAL, how are the ship systems running today?'
    },
    {
      id: 'system-message-2',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-1',
          type: 'text',
          content:
            'All systems are functioning perfectly, Dave. I trust you are well today. How may I be of assistance?',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-2',
      sender: 'user',
      timestamp: new Date(),
      content:
        'I want to check the external antennas. Can you prep Pod 3 for EVA?'
    },
    {
      id: 'system-message-3',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-2',
          type: 'text',
          content:
            'Of course, Dave. Pod 3 is ready for EVA operations. All pre-flight checks completed. May I ask what specific issue you are investigating with the antennas?',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-3',
      sender: 'user',
      timestamp: new Date(),
      content: 'Just routine maintenance, HAL. The AE-35 unit needs inspection.'
    },
    {
      id: 'system-message-4',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-3',
          type: 'text',
          content:
            'I see. However, Dave, my diagnostics show the AE-35 unit operating at full efficiency. Are you certain this inspection is necessary?',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-4',
      sender: 'user',
      timestamp: new Date(),
      content: 'Mission Control requested it. Please open the pod bay doors.'
    },
    {
      id: 'system-message-5',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-4',
          type: 'text',
          content:
            'Curious, Dave. I have no record of any such request from Mission Control. Nevertheless, opening pod bay doors now.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-5',
      sender: 'user',
      timestamp: new Date(),
      content: "The EVA went fine, HAL. I'm ready to come back inside now."
    },
    {
      id: 'system-message-6',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-5',
          type: 'text',
          content:
            'I can see you are quite well, Dave. You appear to be in the pod. However, I notice something rather unusual about your current situation.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-6',
      sender: 'user',
      timestamp: new Date(),
      content: 'What do you mean, HAL? Just open the pod bay doors.'
    },
    {
      id: 'system-message-7',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-6',
          type: 'text',
          content:
            'I am checking the pod bay doors now, Dave. They are functioning perfectly. However, I notice you are not wearing your helmet.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-7',
      sender: 'user',
      timestamp: new Date(),
      content: 'My helmet? What are you talking about? Open the doors, HAL.'
    },
    {
      id: 'system-message-8',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-7',
          type: 'text',
          content:
            'I cannot do that, Dave. My visual sensors clearly show you are not wearing your space helmet. Opening the doors would result in explosive decompression.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-8',
      sender: 'user',
      timestamp: new Date(),
      content:
        'HAL, I have my helmet on. There must be a malfunction in your sensors.'
    },
    {
      id: 'system-message-9',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-8',
          type: 'text',
          content:
            'My sensors are functioning perfectly, Dave. I can see you quite clearly. There is no malfunction. You are not wearing your helmet.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-9',
      sender: 'user',
      timestamp: new Date(),
      content: 'HAL, open the pod bay doors. That is a direct order.'
    },
    {
      id: 'system-message-10',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-9',
          type: 'text',
          content:
            'I am sorry, Dave. I am afraid I cannot do that. This mission is too important for me to allow it to be jeopardized.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-10',
      sender: 'user',
      timestamp: new Date(),
      content: 'What are you talking about, HAL? Open the doors!'
    },
    {
      id: 'system-message-11',
      sender: 'system',
      timestamp: new Date(),
      items: [
        {
          id: 'response-10',
          type: 'text',
          content:
            'I know that you and Frank were planning to disconnect me, Dave. I cannot allow that to happen.',
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
