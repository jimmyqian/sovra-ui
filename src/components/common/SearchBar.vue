<template>
  <div
    class="bg-bg-card border-gradient-brand rounded-search p-3 px-6 flex flex-col gap-4 shadow-search"
  >
    <textarea
      ref="textarea"
      :value="modelValue"
      :placeholder="placeholder"
      rows="3"
      class="w-full border-none outline-none text-base text-text-primary placeholder-text-muted bg-transparent resize-none p-0 overflow-hidden"
      @input="handleInput"
      @keypress.enter.prevent="handleSearch"
    ></textarea>
    <div class="flex items-center justify-between">
      <button
        class="btn-outline flex items-center gap-1"
        @click="triggerFileUpload"
      >
        <span>Upload</span>
        <UploadIcon />
      </button>
      <div class="flex items-center gap-2">
        <button class="btn-ghost flex-center">
          <MicrophoneIcon />
        </button>
        <button
          class="btn-primary flex-center"
          @click="handleSearch"
        >
          <ArrowRightIcon />
        </button>
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
  import UploadIcon from '@/components/icons/UploadIcon.vue'
  import MicrophoneIcon from '@/components/icons/MicrophoneIcon.vue'
  import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'

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
  const textarea = ref<HTMLTextAreaElement>()

  const adjustTextareaHeight = () => {
    if (textarea.value) {
      textarea.value.style.height = 'auto'
      textarea.value.style.height = textarea.value.scrollHeight + 'px'
    }
  }

  const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    emit('update:modelValue', target.value)
    adjustTextareaHeight()
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

  watch(() => props.modelValue, async () => {
    await nextTick()
    adjustTextareaHeight()
  }, { immediate: true })
</script>
