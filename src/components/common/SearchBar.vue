<template>
  <div class="search-bar">
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="search-input"
      @input="handleInput"
      @keypress.enter="handleSearch"
    />
    <div class="search-actions">
      <button class="upload-btn" @click="triggerFileUpload">
        <span>Upload</span>
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
      <button class="voice-btn">
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
      <button class="submit-btn" @click="handleSearch">
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

<style scoped>
  .search-bar {
    background: white;
    border: 2px solid;
    border-image: linear-gradient(135deg, #4285f4, #ff6b35) 1;
    border-radius: 24px;
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 1rem;
    color: #333;
  }

  .search-input::placeholder {
    color: #999;
  }

  .search-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .upload-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: 1px solid #ff6b35;
    color: #ff6b35;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .upload-btn:hover {
    background: #ff6b35;
    color: white;
  }

  .voice-btn,
  .submit-btn {
    background: none;
    border: none;
    padding: 0.5rem;
    color: #666;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .submit-btn {
    background: #ff6b35;
    color: white;
  }

  .voice-btn:hover,
  .submit-btn:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    .upload-btn span {
      display: none;
    }
  }
</style>
