<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-50 flex items-start justify-start p-4"
      @click="handleBackdropClick"
    >
      <!-- Backdrop overlay -->
      <div
        class="absolute inset-0 bg-black bg-opacity-25 transition-opacity duration-200"
        @click="close"
      ></div>

      <!-- Search popup positioned near the sidebar -->
      <div
        ref="popoutContainer"
        class="relative ml-20 mt-20 w-96 max-w-sm"
        @click.stop
      >
        <!-- Search container with enhanced styling -->
        <div
          class="bg-bg-card border border-border-light rounded-lg shadow-xl p-4 backdrop-blur-sm"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-text-primary">
              Quick Search
            </h3>
            <button
              class="p-1 hover:bg-border-hover rounded-full transition-colors"
              aria-label="Close search"
              @click="close"
            >
              <CloseIcon />
            </button>
          </div>

          <!-- Search form -->
          <div class="space-y-4">
            <div class="relative">
              <textarea
                ref="searchInput"
                v-model="searchQuery"
                placeholder="What are you looking for?"
                rows="3"
                class="w-full p-3 border border-border-light rounded-lg resize-none bg-bg-primary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                @keydown.enter.prevent="handleSearch"
                @keydown.escape="close"
              ></textarea>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" @click="triggerFileUpload">
                <UploadIcon />
                <span>Upload</span>
              </Button>

              <div class="flex gap-2">
                <Button variant="ghost" size="sm" @click="close">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  :disabled="!searchQuery.trim()"
                  @click="handleSearch"
                >
                  <SearchIcon />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden file input for upload functionality -->
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*,.pdf,.doc,.docx,.txt"
      class="hidden"
      @change="handleFileUpload"
    />
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, nextTick, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import Button from '@/components/ui/Button.vue'
  import CloseIcon from '@/components/icons/CloseIcon.vue'
  import SearchIcon from '@/components/icons/SearchIcon.vue'
  import UploadIcon from '@/components/icons/UploadIcon.vue'

  interface Props {
    isVisible: boolean
  }

  interface Emits {
    (_e: 'close'): void
    (_e: 'search', _query: string): void
    (_e: 'fileUpload', _files: FileList): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const router = useRouter()
  const searchInput = ref<HTMLTextAreaElement | null>(null)
  const fileInput = ref<HTMLInputElement | null>(null)
  const popoutContainer = ref<HTMLElement | null>(null)
  const searchQuery = ref('')

  // Focus the input when the popout becomes visible
  watch(
    () => props.isVisible,
    isVisible => {
      if (isVisible) {
        nextTick(() => {
          searchInput.value?.focus()
        })
      } else {
        // Clear search query when closed
        searchQuery.value = ''
      }
    }
  )

  const close = () => {
    emit('close')
  }

  const handleBackdropClick = (event: MouseEvent) => {
    // Only close if clicking the backdrop, not the popout container
    if (event.target === event.currentTarget) {
      close()
    }
  }

  const handleSearch = () => {
    const query = searchQuery.value.trim()
    if (!query) return

    emit('search', query)

    // Navigate to search results page with the query
    router.push('/search-results')

    close()
  }

  const triggerFileUpload = () => {
    fileInput.value?.click()
  }

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files

    if (files && files.length > 0) {
      emit('fileUpload', files)
      // Reset the file input
      target.value = ''
    }
  }

  // Expose methods for testing
  defineExpose({
    close,
    handleSearch,
    handleBackdropClick,
    handleFileUpload,
    searchQuery
  })
</script>

<style scoped>
  /* Custom animations for smooth appearance */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* Ensure the popout appears above everything */
  .z-50 {
    z-index: 50;
  }
</style>
