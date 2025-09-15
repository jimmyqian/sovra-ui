<template>
  <div
    class="bg-bg-card border-gradient-brand rounded-search p-3 px-6 flex flex-col gap-4 shadow-search"
  >
    <textarea
      ref="textarea"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      rows="3"
      class="w-full border-none outline-none text-base text-text-primary placeholder-text-muted bg-transparent resize-none p-0 overflow-hidden focus:outline-none focus:ring-0 focus:border-none"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
      @input="handleInput"
      @keypress.enter.prevent="handleSearch"
    ></textarea>
    <div class="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        :disabled="disabled"
        @click="triggerFileUpload"
      >
        <span>Upload</span>
        <UploadIcon />
      </Button>
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="sm" :disabled="disabled">
          <MicrophoneIcon />
        </Button>
        <Button
          variant="primary"
          size="sm"
          :disabled="disabled"
          aria-label="Search"
          data-testid="search-button"
          @click="handleSearch"
        >
          <SearchButtonIcon />
        </Button>
      </div>
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
  import { ref, nextTick, watch } from 'vue'
  import Button from '@/components/ui/Button.vue'
  import UploadIcon from '@/components/icons/UploadIcon.vue'
  import MicrophoneIcon from '@/components/icons/MicrophoneIcon.vue'
  import SearchButtonIcon from '@/components/icons/SearchButtonIcon.vue'
  import { validateFiles } from '@/utils/fileValidation'

  interface Props {
    modelValue: string
    placeholder?: string
    disabled?: boolean
  }

  interface Emits {
    (e: 'update:modelValue', value: string): void
    (e: 'search'): void
    (e: 'fileUpload', files: File[]): void
    (e: 'fileError', error: string): void
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Enter your search query...'
  })

  const emit = defineEmits<Emits>()

  const fileInput = ref<HTMLInputElement>()
  const textarea = ref<HTMLTextAreaElement>()

  const adjustTextareaHeight = () => {
    if (textarea.value) {
      textarea.value.style.height = 'auto'
      textarea.value.style.height = `${textarea.value.scrollHeight}px`
    }
  }

  const handleInput = (event: Event) => {
    if (!props.disabled) {
      const target = event.target as HTMLTextAreaElement
      emit('update:modelValue', target.value)
      adjustTextareaHeight()
    }
  }

  const handleSearch = () => {
    if (!props.disabled) {
      emit('search')
    }
  }

  const triggerFileUpload = () => {
    if (!props.disabled) {
      fileInput.value?.click()
    }
  }

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement

    if (!target.files || target.files.length === 0) {
      return
    }

    // Validate files for security
    const validation = validateFiles(target.files)

    if (!validation.isValid) {
      emit('fileError', validation.error ?? 'Invalid file selected')
      // Clear the input to prevent resubmission
      target.value = ''
      return
    }

    if (validation.validFiles) {
      emit('fileUpload', validation.validFiles)
    }

    // Clear the input for security (prevents file path disclosure)
    target.value = ''
  }

  watch(
    () => props.modelValue,
    async () => {
      await nextTick()
      adjustTextareaHeight()
    },
    { immediate: true }
  )
</script>
