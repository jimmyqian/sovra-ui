<template>
  <div
    class="w-15 bg-bg-card border-r border-border-light flex flex-col items-center py-8 gap-4 flex-shrink-0"
  >
    <!-- Search Icon with Popout -->
    <div class="relative">
      <div
        class="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors bg-brand-orange text-bg-card"
        @click="toggleSearchPopout"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="11"
            cy="11"
            r="8"
            stroke="currentColor"
            stroke-width="2"
          />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" />
        </svg>
      </div>

      <!-- Search Popout -->
      <transition name="fade-slide">
        <div
          v-if="showSearchPopout"
          class="absolute left-full ml-4 top-0 w-80 bg-bg-card border border-border-light rounded-lg shadow-xl p-4 z-50"
        >
          <div class="flex items-center gap-2 mb-3">
            <h3 class="text-sm font-semibold text-text-primary">
              Quick Search
            </h3>
            <button
              class="ml-auto text-text-secondary hover:text-text-primary"
              @click="closeSearchPopout"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Search for people"
            class="w-full px-3 py-2 border border-border-light rounded-lg bg-bg-primary text-text-primary placeholder-text-secondary focus:outline-none focus:border-brand-orange"
            @keyup.enter="handleSearch"
            @keyup.esc="closeSearchPopout"
          />
          <button
            class="w-full mt-3 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
            @click="handleSearch"
          >
            Search
          </button>
        </div>
      </transition>
    </div>
    <div
      class="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-border-hover text-text-secondary hover:text-text-primary"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 12h16M4 6h16M4 18h16"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    </div>
    <div
      class="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-border-hover text-text-secondary hover:text-text-primary"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    </div>
    <div
      class="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-border-hover text-text-secondary hover:text-text-primary"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
        <path
          d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    </div>
    <div
      class="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-border-hover text-text-secondary hover:text-text-primary"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          stroke-width="2"
        />
        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSearchStore } from '@/stores/search'
  import { useConversationStore } from '@/stores/conversation'

  const router = useRouter()
  const searchStore = useSearchStore()
  const conversationStore = useConversationStore()
  const showSearchPopout = ref(false)
  const searchQuery = ref('')
  const searchInputRef = ref<HTMLInputElement | null>(null)

  const toggleSearchPopout = () => {
    showSearchPopout.value = !showSearchPopout.value
    if (showSearchPopout.value) {
      nextTick(() => {
        searchInputRef.value?.focus()
      })
    }
  }

  const closeSearchPopout = () => {
    showSearchPopout.value = false
    searchQuery.value = ''
  }

  const handleSearch = async () => {
    if (!searchQuery.value.trim()) {
      return
    }

    try {
      // Clear previous conversation when starting a new search from sidebar
      conversationStore.clearConversation()

      await searchStore.performSearch(searchQuery.value)
      await router.push('/search')
      closeSearchPopout()
    } catch {
      // TODO: Implement proper error handling/logging
    }
  }

  // Close popout when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (showSearchPopout.value) {
      const target = event.target as HTMLElement
      const popout = target.closest('.absolute.left-full')
      const searchIcon = target.closest('.bg-brand-orange')

      if (!popout && !searchIcon) {
        closeSearchPopout()
      }
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<style scoped>
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateX(-10px);
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-10px);
  }
</style>
