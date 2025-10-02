/**
 * Unit tests for ConversationPanel component
 * Tests conversation display, scroll functionality, and search handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ConversationPanel from '../ConversationPanel.vue'
import { useSearchStore } from '@/stores/search'
import { useConversationStore } from '@/stores/conversation'

describe('ConversationPanel', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(async () => {
    setActivePinia(createPinia())

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/search', component: { template: '<div>Search</div>' } }
      ]
    })

    await router.push('/')
    await router.isReady()
  })

  const createWrapper = (props = {}) => {
    return mount(ConversationPanel, {
      props: {
        searchPlaceholder: "Tell me more about who you're looking for",
        ...props
      },
      global: {
        plugins: [router],
        stubs: {
          AppHeader: {
            template: '<div class="app-header">Header</div>'
          },
          SearchBar: {
            template:
              '<div class="search-bar"><textarea :placeholder="placeholder" @search="$emit(\'search\', $event)" @file-upload="$emit(\'file-upload\', $event)" @speech-error="$emit(\'speech-error\', $event)" /></div>',
            props: ['placeholder', 'modelValue'],
            emits: ['search', 'file-upload', 'speech-error']
          },
          SearchConversation: {
            template: '<div class="search-conversation">Conversation</div>',
            props: ['messages']
          },
          ChevronUpIcon: {
            template:
              '<div class="chevron-up scroll-chevron scroll-chevron-top conversation-scroll-chevron cursor-pointer" aria-label="Scroll conversation to top" @click="$emit(\'click\')">↑</div>',
            emits: ['click']
          },
          ChevronDownIcon: {
            template:
              '<div class="chevron-down scroll-chevron scroll-chevron-bottom conversation-scroll-chevron cursor-pointer" aria-label="Scroll conversation to bottom" @click="$emit(\'click\')">↓</div>',
            emits: ['click']
          }
        }
      }
    })
  }

  describe('Component Structure', () => {
    it('renders with correct layout classes', () => {
      const wrapper = createWrapper()

      expect(wrapper.classes()).toContain('w-full')
      expect(wrapper.classes()).toContain('bg-bg-card')
      expect(wrapper.classes()).toContain('flex')
      expect(wrapper.classes()).toContain('flex-col')
      expect(wrapper.classes()).toContain('md:w-2/5')
      expect(wrapper.classes()).toContain('max-h-full')
      expect(wrapper.classes()).toContain('relative')
      expect(wrapper.classes()).toContain('overflow-hidden')
    })

    it('renders app header element', () => {
      const wrapper = createWrapper()
      const header = wrapper.find('.app-header')
      expect(header.exists()).toBe(true)
    })

    it('renders search conversation component area', () => {
      const wrapper = createWrapper()
      const conversationArea = wrapper.find('.conversation-scroll')
      expect(conversationArea.exists()).toBe(true)
      expect(conversationArea.classes()).toContain('overflow-y-auto')
      expect(conversationArea.classes()).toContain('smooth-scroll')
    })

    it('renders search bar area with correct structure', () => {
      const wrapper = createWrapper()
      const searchInputArea = wrapper.find('.absolute.bottom-0')
      expect(searchInputArea.exists()).toBe(true)

      const textarea = wrapper.find('textarea')
      expect(textarea.exists()).toBe(true)
    })
  })

  describe('Chevron Positioning CSS Classes', () => {
    it('has correct CSS classes defined for conversation chevrons', () => {
      const wrapper = createWrapper()

      // Test that the component has the CSS structure for chevron positioning
      // The actual CSS rules are tested in the component's scoped styles
      expect(wrapper.element).toBeDefined()

      // Test that the component structure supports chevron positioning
      const conversationArea = wrapper.find('.conversation-scroll')
      expect(conversationArea.exists()).toBe(true)

      // Test that the component has the relative positioning for chevron overlay
      expect(wrapper.classes()).toContain('relative')
    })

    it('supports chevron positioning within scroll container', () => {
      const wrapper = createWrapper()

      // Verify the scroll container exists and has proper classes
      const scrollContainer = wrapper.find('.conversation-scroll')
      expect(scrollContainer.exists()).toBe(true)
      expect(scrollContainer.classes()).toContain('flex-1')
      expect(scrollContainer.classes()).toContain('overflow-y-auto')
    })
  })

  describe('Scroll Functionality', () => {
    it('handles conversation scroll events properly', async () => {
      const wrapper = createWrapper()
      const mockScrollContainer = {
        scrollTop: 100,
        scrollHeight: 1000,
        clientHeight: 500
      }

      // Mock the ref to return our mock container
      wrapper.vm.conversationScrollContainer =
        mockScrollContainer as HTMLElement

      // Trigger scroll handler
      wrapper.vm.handleConversationScroll()

      expect(wrapper.vm.canScrollUpConversation).toBe(true)
      expect(wrapper.vm.canScrollDownConversation).toBe(true)
      expect(wrapper.vm.hasScrollableContentConversation).toBe(true)
    })

    it('calculates scroll state correctly at top position', async () => {
      const wrapper = createWrapper()
      const mockScrollContainer = {
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 500
      }

      wrapper.vm.conversationScrollContainer =
        mockScrollContainer as HTMLElement
      wrapper.vm.handleConversationScroll()

      expect(wrapper.vm.canScrollUpConversation).toBe(false)
      expect(wrapper.vm.canScrollDownConversation).toBe(true)
      expect(wrapper.vm.hasScrollableContentConversation).toBe(true)
    })

    it('calculates scroll state correctly at bottom position', async () => {
      const wrapper = createWrapper()
      const mockScrollContainer = {
        scrollTop: 500,
        scrollHeight: 1000,
        clientHeight: 500
      }

      wrapper.vm.conversationScrollContainer =
        mockScrollContainer as HTMLElement
      wrapper.vm.handleConversationScroll()

      expect(wrapper.vm.canScrollUpConversation).toBe(true)
      expect(wrapper.vm.canScrollDownConversation).toBe(false)
      expect(wrapper.vm.hasScrollableContentConversation).toBe(true)
    })
  })

  describe('Search Functionality', () => {
    it('emits search event when search is performed', async () => {
      const wrapper = createWrapper()
      const searchQuery = 'test search query'

      wrapper.vm.searchQuery = searchQuery
      await wrapper.vm.handleSearch()

      expect(wrapper.emitted('search')).toBeTruthy()
      expect(wrapper.emitted('search')![0]).toEqual([searchQuery])
    })

    it('clears search input after search is performed', async () => {
      const wrapper = createWrapper()
      const searchQuery = 'test search query'

      wrapper.vm.searchQuery = searchQuery
      await wrapper.vm.handleSearch()

      expect(wrapper.vm.searchQuery).toBe('')
    })

    it('adds user message to conversation store when search is performed', async () => {
      const wrapper = createWrapper()
      const conversationStore = useConversationStore()
      const addMessageSpy = vi.spyOn(conversationStore, 'addMessage')

      wrapper.vm.searchQuery = 'test query'
      await wrapper.vm.handleSearch()

      expect(addMessageSpy).toHaveBeenCalled()
      expect(addMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          sender: 'user',
          content: 'test query'
        })
      )
    })

    it('emits file upload event when files are uploaded', () => {
      const wrapper = createWrapper()
      const mockFiles = [new File(['test'], 'test.txt')]

      wrapper.vm.handleFileUpload(mockFiles)

      expect(wrapper.emitted('fileUpload')).toBeTruthy()
      expect(wrapper.emitted('fileUpload')![0]).toEqual([mockFiles])
    })

    it('emits speech error event when speech error occurs', () => {
      const wrapper = createWrapper()
      const errorMessage = 'Speech recognition failed'

      wrapper.vm.handleSpeechError(errorMessage)

      expect(wrapper.emitted('speechError')).toBeTruthy()
      expect(wrapper.emitted('speechError')![0]).toEqual([errorMessage])
    })
  })

  describe('Conversation Messages', () => {
    it('computes conversation messages from store', () => {
      const wrapper = createWrapper()
      const conversationStore = useConversationStore()

      // Clear any existing messages first
      conversationStore.conversationHistory = []

      // Add a test message
      conversationStore.addMessage({
        id: 'test-message',
        sender: 'user',
        timestamp: new Date(),
        content: 'Test message'
      })

      expect(wrapper.vm.conversationMessages).toHaveLength(1)
      expect(wrapper.vm.conversationMessages[0]?.content).toBe('Test message')
    })

    it('updates result count in system messages', () => {
      const wrapper = createWrapper()
      const conversationStore = useConversationStore()
      const searchStore = useSearchStore()

      // Mock the computed property by setting the underlying data
      vi.spyOn(searchStore, 'displayTotalResults', 'get').mockReturnValue(42)

      // Add messages to trigger computation
      conversationStore.addMessage({
        id: 'user-msg',
        sender: 'user',
        timestamp: new Date(),
        content: 'Search query'
      })

      conversationStore.addMessage({
        id: 'system-msg',
        sender: 'system',
        timestamp: new Date(),
        items: [
          {
            id: 'results-item',
            type: 'results-summary',
            resultCount: 0
          }
        ]
      })

      // The computed property should update the result count
      const messages = wrapper.vm.conversationMessages
      const systemMessage = messages.find(m => m.sender === 'system')
      const resultsSummaryItem = systemMessage?.items?.find(
        item => item.type === 'results-summary'
      )

      expect(resultsSummaryItem).toBeTruthy()
      if (resultsSummaryItem && 'resultCount' in resultsSummaryItem) {
        expect(resultsSummaryItem.resultCount).toBe(42)
      }
    })
  })

  describe('Fixed Search Input', () => {
    it('renders fixed search input at bottom', () => {
      const wrapper = createWrapper()

      const searchInputContainer = wrapper.find(
        '.absolute.bottom-0.left-0.right-0'
      )
      expect(searchInputContainer.exists()).toBe(true)
      expect(searchInputContainer.classes()).toContain('px-8')
      expect(searchInputContainer.classes()).toContain('py-4')
      expect(searchInputContainer.classes()).toContain('md:px-4')
      expect(searchInputContainer.classes()).toContain('bg-bg-card')
      expect(searchInputContainer.classes()).toContain('border-t')
      expect(searchInputContainer.classes()).toContain('border-border-light')
    })
  })

  describe('Error Handling', () => {
    it('handles missing scroll container gracefully', async () => {
      const wrapper = createWrapper()

      // Set scroll container to null to test error handling
      wrapper.vm.conversationScrollContainer = null

      // These operations should not throw errors
      expect(() => {
        wrapper.vm.handleConversationScroll()
        wrapper.vm.scrollConversationToTop()
        wrapper.vm.scrollConversationToBottom()
      }).not.toThrow()
    })

    it('maintains component stability with invalid props', () => {
      const wrapper = createWrapper({ searchPlaceholder: null })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Auto-scroll Functionality', () => {
    it('has scroll to bottom method available', () => {
      const wrapper = createWrapper()
      expect(typeof wrapper.vm.scrollToBottom).toBe('function')
    })

    it('manages auto-scroll state properly', () => {
      const wrapper = createWrapper()

      // Initial state should be false
      expect(wrapper.vm.isAutoScrolling).toBe(false)

      // Should have the reactive property available
      expect(
        Object.prototype.hasOwnProperty.call(wrapper.vm, 'isAutoScrolling')
      ).toBe(true)
    })
  })
})
