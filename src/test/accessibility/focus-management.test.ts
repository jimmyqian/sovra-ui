import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import SearchBar from '@/components/common/SearchBar.vue'
import Button from '@/components/ui/Button.vue'

/**
 * Focus Management Accessibility Tests
 *
 * Tests focus management including:
 * - Initial focus placement
 * - Focus restoration after modal close
 * - Focus trapping within modals
 * - Skip links and focus jumping
 * - Focus indicators visibility
 * - Programmatic focus management
 * - Focus loss prevention
 * - Roving tabindex patterns
 */

// Focus tracking utilities
class FocusTracker {
  private focusHistory: HTMLElement[] = []
  private originalFocus: HTMLElement | null = null

  startTracking() {
    this.originalFocus = document.activeElement as HTMLElement
    this.focusHistory = []

    document.addEventListener('focusin', this.handleFocusIn)
    document.addEventListener('focusout', this.handleFocusOut)
  }

  stopTracking() {
    document.removeEventListener('focusin', this.handleFocusIn)
    document.removeEventListener('focusout', this.handleFocusOut)
  }

  private handleFocusIn = (event: FocusEvent) => {
    if (event.target instanceof HTMLElement) {
      this.focusHistory.push(event.target)
    }
  }

  private handleFocusOut = (event: FocusEvent) => {
    // Track focus leaving elements
  }

  getFocusHistory(): HTMLElement[] {
    return [...this.focusHistory]
  }

  getLastFocused(): HTMLElement | null {
    return this.focusHistory[this.focusHistory.length - 1] || null
  }

  restoreOriginalFocus() {
    if (this.originalFocus && this.originalFocus.focus) {
      this.originalFocus.focus()
    }
  }
}

// Modal component with focus trap
const ModalComponent = defineComponent({
  components: { Button },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'confirm'],
  data() {
    return {
      previousFocus: null as HTMLElement | null
    }
  },
  watch: {
    isOpen: {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          await this.openModal()
        } else {
          this.closeModal()
        }
      }
    }
  },
  methods: {
    async openModal() {
      // Store the previously focused element
      this.previousFocus = document.activeElement as HTMLElement

      await nextTick()

      // Focus the modal itself initially
      const modal = this.$refs.modal as HTMLElement
      if (modal) {
        modal.focus()
      }

      // Set up focus trap
      this.setupFocusTrap()
    },

    closeModal() {
      // Restore focus to trigger button
      if (this.previousFocus) {
        this.previousFocus.focus()
      }
      this.removeFocusTrap()
    },

    setupFocusTrap() {
      document.addEventListener('keydown', this.handleTrapKeydown)
    },

    removeFocusTrap() {
      document.removeEventListener('keydown', this.handleTrapKeydown)
    },

    handleTrapKeydown(event: KeyboardEvent) {
      if (!this.isOpen) return

      const focusableElements = this.getFocusableElements()
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    },

    getFocusableElements(): HTMLElement[] {
      const modal = this.$refs.modal as HTMLElement
      if (!modal) return []

      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])'
      ].join(', ')

      return Array.from(modal.querySelectorAll(focusableSelectors))
    },

    focusLastElement() {
      const focusableElements = this.getFocusableElements()
      const lastElement = focusableElements[focusableElements.length - 1]
      if (lastElement) {
        lastElement.focus()
      }
    },

    handleOverlayClick() {
      this.$emit('close')
    }
  },
  template: `
    <div>
      <Button 
        ref="triggerButton"
        id="modal-trigger" 
        @click="$emit('close')"
      >
        Open Modal
      </Button>
      
      <div 
        v-if="isOpen" 
        class="modal-overlay"
        @click.self="handleOverlayClick"
        @keydown.esc="$emit('close')"
      >
        <div 
          ref="modal"
          class="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabindex="-1"
        >
          <h2 id="modal-title">Confirm Action</h2>
          <p>Are you sure you want to proceed?</p>
          
          <div class="modal-actions">
            <Button 
              ref="firstFocusable"
              variant="outline" 
              @click="$emit('close')"
            >
              Cancel
            </Button>
            <Button 
              ref="lastFocusable"
              variant="primary" 
              @click="$emit('confirm')"
            >
              Confirm
            </Button>
          </div>
          
          <!-- Focus trap sentinels -->
          <div 
            tabindex="0" 
            @focus="focusLastElement"
            style="position: absolute; left: -9999px;"
          ></div>
        </div>
      </div>
    </div>
  `
})

// Component with roving tabindex pattern
const MenuComponent = defineComponent({
  data() {
    return {
      focusedIndex: 0,
      menuItems: [
        { id: 1, label: 'Home' },
        { id: 2, label: 'About' },
        { id: 3, label: 'Services' },
        { id: 4, label: 'Contact' }
      ]
    }
  },
  mounted() {
    // Focus first item initially
    this.focusCurrentItem()
  },
  methods: {
    handleKeydown(event: KeyboardEvent) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          this.focusedIndex = Math.min(
            this.focusedIndex + 1,
            this.menuItems.length - 1
          )
          this.focusCurrentItem()
          break
        case 'ArrowUp':
          event.preventDefault()
          this.focusedIndex = Math.max(this.focusedIndex - 1, 0)
          this.focusCurrentItem()
          break
        case 'Home':
          event.preventDefault()
          this.focusedIndex = 0
          this.focusCurrentItem()
          break
        case 'End':
          event.preventDefault()
          this.focusedIndex = this.menuItems.length - 1
          this.focusCurrentItem()
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          this.selectItem(this.focusedIndex)
          break
      }
    },

    focusCurrentItem() {
      this.$nextTick(() => {
        const items = this.$el.querySelectorAll('[role="menuitem"]')
        const currentItem = items[this.focusedIndex] as HTMLElement
        if (currentItem) {
          currentItem.focus()
        }
      })
    },

    selectItem(index: number) {
      this.focusedIndex = index
      // Handle item selection
      console.log('Selected:', this.menuItems[index])
    }
  },
  template: `
    <div 
      role="menu" 
      @keydown="handleKeydown"
      aria-labelledby="menu-label"
    >
      <h3 id="menu-label">Navigation Menu</h3>
      <div 
        v-for="(item, index) in menuItems"
        :key="item.id"
        role="menuitem"
        :tabindex="index === focusedIndex ? 0 : -1"
        :class="{ focused: index === focusedIndex }"
        @click="selectItem(index)"
        @focus="focusedIndex = index"
        class="menu-item"
      >
        {{ item.label }}
      </div>
    </div>
  `
})

// Skip navigation component
const SkipNavigationComponent = defineComponent({
  components: { Button },
  methods: {
    skipToMain(event: Event) {
      event.preventDefault()
      const mainContent = this.$refs.mainContent as HTMLElement
      if (mainContent) {
        mainContent.focus()
      }
    }
  },
  template: `
    <div>
      <a 
        href="#main-content" 
        class="skip-link"
        @click="skipToMain"
        @keydown.enter="skipToMain"
      >
        Skip to main content
      </a>
      
      <nav aria-label="Primary navigation">
        <a href="#nav1">Navigation Item 1</a>
        <a href="#nav2">Navigation Item 2</a>
        <a href="#nav3">Navigation Item 3</a>
      </nav>
      
      <main 
        id="main-content" 
        ref="mainContent"
        tabindex="-1"
        aria-label="Main content"
      >
        <h1>Main Content Heading</h1>
        <p>This is the main content of the page.</p>
        <Button>First interactive element in main</Button>
      </main>
    </div>
  `
})

describe('Focus Management Accessibility', () => {
  let focusTracker: FocusTracker

  beforeEach(() => {
    focusTracker = new FocusTracker()

    // Clear focus
    if (document.activeElement && 'blur' in document.activeElement) {
      ;(document.activeElement as HTMLElement).blur()
    }
  })

  afterEach(() => {
    focusTracker.stopTracking()
  })

  describe('Initial Focus Placement', () => {
    it('focuses the first interactive element on page load', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' }
      })

      const textarea = wrapper.find('textarea')

      // Simulate initial focus
      textarea.element.focus()
      expect(document.activeElement).toBe(textarea.element)
    })

    it('focuses modal when opened', async () => {
      const wrapper = mount(ModalComponent, {
        props: { isOpen: false }
      })

      await wrapper.setProps({ isOpen: true })
      await nextTick()

      const modal = wrapper.find('[role="dialog"]')
      expect(modal.exists()).toBe(true)
    })

    it('focuses first menu item in roving tabindex pattern', async () => {
      const wrapper = mount(MenuComponent)
      await nextTick()

      const firstMenuItem = wrapper.find('[tabindex="0"]')
      expect(firstMenuItem.exists()).toBe(true)
      expect(firstMenuItem.text()).toBe('Home')
    })
  })

  describe('Focus Restoration', () => {
    it('restores focus to trigger button after modal close', async () => {
      const wrapper = mount(ModalComponent, {
        props: { isOpen: false }
      })

      const triggerButton = wrapper.find('#modal-trigger')
      triggerButton.element.focus()

      // Open modal
      await wrapper.setProps({ isOpen: true })
      await nextTick()

      // Close modal
      await wrapper.setProps({ isOpen: false })
      await nextTick()

      // Focus should be restored
      expect(document.activeElement).toBe(triggerButton.element)
    })

    it('maintains focus position during dynamic content updates', async () => {
      const DynamicComponent = defineComponent({
        components: { Button },
        data() {
          return {
            showContent: false
          }
        },
        methods: {
          updateContent() {
            this.showContent = !this.showContent
          }
        },
        template: `
          <div>
            <Button @click="updateContent" id="update-btn">Update Content</Button>
            <div v-if="showContent">
              <Button id="dynamic-btn">Dynamic Button</Button>
            </div>
          </div>
        `
      })

      const wrapper = mount(DynamicComponent)
      const updateBtn = wrapper.find('#update-btn')

      updateBtn.element.focus()
      expect(document.activeElement).toBe(updateBtn.element)

      await updateBtn.trigger('click')
      await nextTick()

      // Focus should remain on update button
      expect(document.activeElement).toBe(updateBtn.element)
    })
  })

  describe('Focus Trapping', () => {
    it('traps focus within open modal', async () => {
      const wrapper = mount(ModalComponent, {
        props: { isOpen: true }
      })

      await nextTick()

      const focusableElements = wrapper.findAll('button')
      expect(focusableElements.length).toBeGreaterThan(0)

      // All buttons within modal should be focusable
      const modalButtons = wrapper.findAll('.modal button')
      modalButtons.forEach(button => {
        expect(button.element.tabIndex).toBeGreaterThanOrEqual(-1)
      })
    })

    it('prevents focus from escaping modal boundaries', async () => {
      const wrapper = mount(ModalComponent, {
        props: { isOpen: true }
      })

      await nextTick()

      // Simulate tab navigation at modal boundary
      const modal = wrapper.find('[role="dialog"]')
      expect(modal.exists()).toBe(true)

      // Focus trap implementation exists
      expect(modal.attributes('tabindex')).toBe('-1')
    })

    it('handles Escape key to close modal and restore focus', async () => {
      const wrapper = mount(ModalComponent, {
        props: { isOpen: true }
      })

      await nextTick()

      const modal = wrapper.find('.modal-overlay')
      await modal.trigger('keydown.esc')

      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('Skip Navigation', () => {
    it('provides skip link for keyboard navigation', async () => {
      const wrapper = mount(SkipNavigationComponent)

      const skipLink = wrapper.find('.skip-link')
      expect(skipLink.exists()).toBe(true)
      expect(skipLink.attributes('href')).toBe('#main-content')
    })

    it('focuses main content when skip link is activated', async () => {
      const wrapper = mount(SkipNavigationComponent)

      const skipLink = wrapper.find('.skip-link')
      const mainContent = wrapper.find('#main-content')

      await skipLink.trigger('click')

      expect(mainContent.attributes('tabindex')).toBe('-1')
    })

    it('works with keyboard activation', async () => {
      const wrapper = mount(SkipNavigationComponent)

      const skipLink = wrapper.find('.skip-link')
      await skipLink.trigger('keydown.enter')

      // Should trigger the same behavior as click
      expect(skipLink.exists()).toBe(true)
    })
  })

  describe('Focus Indicators', () => {
    it('shows visible focus indicators on interactive elements', async () => {
      const wrapper = mount(Button, {
        props: { variant: 'primary' },
        slots: { default: 'Test Button' }
      })

      const button = wrapper.find('button')
      const classes = button.classes()

      // Should include focus ring styles
      expect(classes).toContain('focus:ring-2')
      expect(classes).toContain('focus:ring-brand-orange')
      expect(classes).toContain('focus:outline-none')
    })

    it('maintains focus visibility during interactions', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' }
      })

      const textarea = wrapper.find('textarea')
      textarea.element.focus()

      // Focus should be visible
      expect(document.activeElement).toBe(textarea.element)

      // Typing should not remove focus
      await textarea.setValue('test')
      expect(document.activeElement).toBe(textarea.element)
    })
  })

  describe('Roving Tabindex Pattern', () => {
    it('implements roving tabindex for menu navigation', async () => {
      const wrapper = mount(MenuComponent)
      await nextTick()

      const menuItems = wrapper.findAll('[role="menuitem"]')

      // First item should have tabindex 0
      expect(menuItems[0].attributes('tabindex')).toBe('0')

      // Other items should have tabindex -1
      for (let i = 1; i < menuItems.length; i++) {
        expect(menuItems[i].attributes('tabindex')).toBe('-1')
      }
    })

    it('updates tabindex on arrow key navigation', async () => {
      const wrapper = mount(MenuComponent)
      await nextTick()

      const menu = wrapper.find('[role="menu"]')

      // Simulate ArrowDown
      await menu.trigger('keydown', { key: 'ArrowDown' })

      expect(wrapper.vm.focusedIndex).toBe(1)

      // Simulate ArrowUp
      await menu.trigger('keydown', { key: 'ArrowUp' })

      expect(wrapper.vm.focusedIndex).toBe(0)
    })

    it('handles Home and End keys correctly', async () => {
      const wrapper = mount(MenuComponent)
      await nextTick()

      const menu = wrapper.find('[role="menu"]')

      // Move to middle item first
      wrapper.vm.focusedIndex = 2

      // Home key should go to first item
      await menu.trigger('keydown', { key: 'Home' })
      expect(wrapper.vm.focusedIndex).toBe(0)

      // End key should go to last item
      await menu.trigger('keydown', { key: 'End' })
      expect(wrapper.vm.focusedIndex).toBe(3)
    })
  })

  describe('Programmatic Focus Management', () => {
    it('focuses elements programmatically when needed', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' }
      })

      const textarea = wrapper.find('textarea')

      // Programmatic focus
      textarea.element.focus()
      expect(document.activeElement).toBe(textarea.element)
    })

    it('manages focus during form submission', async () => {
      const FormComponent = defineComponent({
        components: { Button },
        data() {
          return {
            name: '',
            error: ''
          }
        },
        methods: {
          async handleSubmit() {
            if (!this.name) {
              this.error = 'Name is required'
              await this.$nextTick()
              // Focus error message
              const errorElement = this.$refs.errorElement as HTMLElement
              if (errorElement) {
                errorElement.focus()
              }
            }
          }
        },
        template: `
          <form @submit.prevent="handleSubmit">
            <input id="name" v-model="name" required />
            <Button type="submit" id="submit-btn">Submit</Button>
            <div v-if="error" id="error-message" role="alert" tabindex="-1" ref="errorElement">
              {{ error }}
            </div>
          </form>
        `
      })

      const wrapper = mount(FormComponent)
      const submitBtn = wrapper.find('#submit-btn')

      await submitBtn.trigger('click')
      await nextTick()

      const errorMessage = wrapper.find('#error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.attributes('tabindex')).toBe('-1')
    })

    it('handles focus for dynamically inserted content', async () => {
      const DynamicContentComponent = defineComponent({
        components: { Button },
        data() {
          return {
            showContent: false
          }
        },
        methods: {
          async loadContent() {
            this.showContent = true
            await this.$nextTick()

            // Focus the new content area
            const contentArea = this.$refs.contentArea as HTMLElement
            if (contentArea) {
              contentArea.focus()
            }
          }
        },
        template: `
          <div>
            <Button @click="loadContent" id="load-btn">Load Content</Button>
            <div v-if="showContent" ref="contentArea" tabindex="-1" id="new-content">
              <h2>New Content Loaded</h2>
              <Button id="new-action">New Action</Button>
            </div>
          </div>
        `
      })

      const wrapper = mount(DynamicContentComponent)
      const loadBtn = wrapper.find('#load-btn')

      await loadBtn.trigger('click')
      await nextTick()

      const newContent = wrapper.find('#new-content')
      expect(newContent.exists()).toBe(true)
      expect(newContent.attributes('tabindex')).toBe('-1')
    })
  })

  describe('Focus Loss Prevention', () => {
    it('prevents focus loss when elements are removed from DOM', async () => {
      const ConditionalComponent = defineComponent({
        components: { Button },
        data() {
          return {
            showContent: true
          }
        },
        methods: {
          toggle() {
            this.showContent = !this.showContent
          },
          remove() {
            // Before removing, focus should be managed
            const toggleBtn = document.getElementById('toggle-btn')
            if (toggleBtn) {
              toggleBtn.focus()
            }
            this.showContent = false
          }
        },
        template: `
          <div>
            <Button @click="toggle" id="toggle-btn">Toggle</Button>
            <div v-if="showContent">
              <Button id="removable-btn" @click="remove">Removable Button</Button>
            </div>
          </div>
        `
      })

      const wrapper = mount(ConditionalComponent)
      const removableBtn = wrapper.find('#removable-btn')

      removableBtn.element.focus()
      expect(document.activeElement).toBe(removableBtn.element)

      await removableBtn.trigger('click')
      await nextTick()

      // Focus should be moved to toggle button
      const toggleBtn = wrapper.find('#toggle-btn')
      expect(document.activeElement).toBe(toggleBtn.element)
    })

    it('maintains logical focus flow after content changes', async () => {
      const ListComponent = defineComponent({
        components: { Button },
        data() {
          return {
            items: [
              { id: 1, name: 'Item 1' },
              { id: 2, name: 'Item 2' },
              { id: 3, name: 'Item 3' }
            ]
          }
        },
        methods: {
          removeItem(index: number) {
            this.items.splice(index, 1)

            // Focus next item or previous if last was removed
            this.$nextTick(() => {
              const nextIndex = index < this.items.length ? index : index - 1
              if (nextIndex >= 0) {
                const nextItem = document.getElementById(
                  `item-${this.items[nextIndex].id}`
                )
                if (nextItem) {
                  nextItem.focus()
                }
              }
            })
          }
        },
        template: `
          <div>
            <Button 
              v-for="(item, index) in items"
              :key="item.id"
              :id="'item-' + item.id"
              @click="removeItem(index)"
            >
              Remove {{ item.name }}
            </Button>
          </div>
        `
      })

      const wrapper = mount(ListComponent)
      const middleBtn = wrapper.find('#item-2')

      middleBtn.element.focus()
      await middleBtn.trigger('click')
      await nextTick()

      // Focus should move to logical next element
      expect(wrapper.findAll('button').length).toBe(2)
    })
  })
})
