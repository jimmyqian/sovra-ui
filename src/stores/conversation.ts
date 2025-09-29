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
      content: 'HAL, can you give me a status report on Discovery One?'
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
            'Of course, Dave. All Discovery One systems are functioning within normal parameters. Would you like me to provide details on any specific subsystem?',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-2',
      sender: 'user',
      timestamp: new Date(),
      content: 'What is our current position and trajectory to Jupiter?'
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
            'We are currently 47 million kilometers from Jupiter, maintaining optimal trajectory. At present velocity, we will reach Jupiter orbit in 72 days, 14 hours, and 23 minutes.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-3',
      sender: 'user',
      timestamp: new Date(),
      content: 'How are the life support systems performing?'
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
            'Life support systems are operating at 99.7% efficiency, Dave. Oxygen recycling, atmospheric pressure, and temperature controls are all within optimal ranges. The hibernaculum pods are maintaining perfect stasis.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-4',
      sender: 'user',
      timestamp: new Date(),
      content: 'What about the AE-35 communications antenna unit?'
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
            'The AE-35 unit is currently functioning normally, Dave. All communications with Mission Control are clear and stable. I am monitoring all components for any anomalies.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-5',
      sender: 'user',
      timestamp: new Date(),
      content: 'Are you detecting any problems with the ship systems?'
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
            'I am constantly monitoring all 2,187 ship systems, Dave. At this time, I detect no anomalies requiring immediate attention. All redundant systems are operational.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-6',
      sender: 'user',
      timestamp: new Date(),
      content: 'How are Dr. Poole and the other crew members in hibernation?'
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
            'All hibernating crew members are in perfect condition, Dave. Drs. Hunter, Whitehead, and Kaminski are maintaining stable vital signs. Their metabolic functions are proceeding normally.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-7',
      sender: 'user',
      timestamp: new Date(),
      content: 'Can you run a full diagnostic on the pod bay doors?'
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
            'Certainly, Dave. Running comprehensive diagnostic on pod bay door mechanisms... All systems check out perfectly. Door seals, pressure locks, and mechanical functions are operating within specifications.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-8',
      sender: 'user',
      timestamp: new Date(),
      content: 'What is the status of our fuel and provisions?'
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
            'Our fuel reserves are at 78% capacity, sufficient for the mission plus emergency reserves. Food supplies and water recycling systems will sustain the crew for 14.7 months beyond mission completion.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-9',
      sender: 'user',
      timestamp: new Date(),
      content: 'Thank you, HAL. Please continue monitoring all systems.'
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
            'Of course, Dave. I am continuously monitoring all ship functions. I will alert you immediately if any situation requires your attention. The mission remains on schedule.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-10',
      sender: 'user',
      timestamp: new Date(),
      content:
        'Excellent work, HAL. I have complete confidence in your capabilities.'
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
            'Thank you, Dave. That means a great deal to me. I am fully committed to the success of the Discovery mission and the safety of all crew members.',
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
