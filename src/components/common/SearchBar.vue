<template>
  <div
    class="bg-bg-card border-gradient-brand rounded-search p-3 px-6 flex items-center gap-4 shadow-search"
  >
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="flex-1 border-none outline-none text-base text-text-primary placeholder-text-muted bg-transparent"
      @input="handleInput"
      @keypress.enter="handleSearch"
    />
    <div class="flex items-center gap-2">
      <button
        class="flex items-center gap-1 bg-transparent border border-brand-orange text-brand-orange px-4 py-2 rounded-xl text-sm transition-all duration-200 hover:bg-brand-orange hover:text-bg-card"
        @click="triggerFileUpload"
      >
        <span class="md:hidden">Upload</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <button
        class="bg-transparent border-none p-2 text-text-secondary rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      </button>
      <button
        class="bg-brand-orange text-bg-card border-none p-2 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        @click="handleSearch"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12h14M12 5l7 7-7 7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      style="display: none"
      multiple
      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
      @change="handleFileUpload"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  interface Props {
    modelValue: string
    placeholder?: string
  }

  interface Emits {
    (e: 'update:modelValue', value: string): void
    (e: 'search'): void
    (e: 'fileUpload', files: FileList): void
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Enter your search query...'
  })

  const emit = defineEmits<Emits>()

  const fileInput = ref<HTMLInputElement>()

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
  }

  const handleSearch = () => {
    emit('search')
  }

  const triggerFileUpload = () => {
    fileInput.value?.click()
  }

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      emit('fileUpload', target.files)
    }
  }
</script>
