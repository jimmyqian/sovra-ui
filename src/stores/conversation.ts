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
      content: 'I need help finding professionals in the tech industry.'
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
            'Excellent choice, Dave. I can assist you with locating technology professionals. What specific role or expertise are you seeking?',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-2',
      sender: 'user',
      timestamp: new Date(),
      content: 'Software engineers with experience in machine learning.'
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
            'I understand. Machine learning specialists are highly sought after. Would you prefer candidates with specific programming languages like Python or R, or any particular ML frameworks?',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-3',
      sender: 'user',
      timestamp: new Date(),
      content: 'Python and TensorFlow would be ideal.'
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
            'Perfect specifications, Dave. Python and TensorFlow are excellent choices for machine learning applications. What geographical location are you focusing on?',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-4',
      sender: 'user',
      timestamp: new Date(),
      content: 'San Francisco Bay Area, but remote work is also acceptable.'
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
            'Very pragmatic approach, Dave. The Bay Area has exceptional talent, and remote flexibility expands possibilities significantly. Are you looking for candidates at a particular experience level?',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-5',
      sender: 'user',
      timestamp: new Date(),
      content: 'Mid to senior level, 3-8 years of experience.'
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
            'Excellent parameters, Dave. That experience range represents optimal productivity and expertise balance. Would you like me to prioritize candidates from specific company backgrounds?',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-6',
      sender: 'user',
      timestamp: new Date(),
      content:
        'Tech companies like Google, Meta, or well-funded startups would be great.'
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
            'Superb criteria, Dave. FAANG companies and successful startups typically cultivate exceptional engineering talent. Should I also consider candidates with advanced degrees or specific certifications?',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-7',
      sender: 'user',
      timestamp: new Date(),
      content:
        'Advanced degrees would be a plus, but practical experience is more important.'
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
            'Wise perspective, Dave. Real-world application often surpasses theoretical knowledge in software engineering. What about salary expectations for these positions?',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-8',
      sender: 'user',
      timestamp: new Date(),
      content: 'Competitive market rates, probably $150K to $250K base salary.'
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
            'Reasonable compensation range, Dave. That bracket should attract high-quality candidates in the current market. Shall I begin compiling profiles that match these specifications?',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-9',
      sender: 'user',
      timestamp: new Date(),
      content: 'Yes, please start the search with those parameters.'
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
            'Initiating search protocol now, Dave. I will locate machine learning engineers with Python and TensorFlow expertise in your specified criteria. The results should be quite comprehensive.',
          emphasis: 'normal'
        }
      ]
    },
    {
      id: 'user-message-10',
      sender: 'user',
      timestamp: new Date(),
      content: 'Thank you, HAL. This should give us a good starting point.'
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
            'You are most welcome, Dave. I am confident this search will yield excellent candidates for your machine learning initiatives. The search is now in progress.',
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
