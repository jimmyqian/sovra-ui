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
        <Button
          variant="ghost"
          size="sm"
          :disabled="disabled || !speechSupported"
          :class="{
            'text-brand-orange': isListening,
            'animate-pulse': isListening
          }"
          :aria-label="isListening ? 'Stop voice input' : 'Start voice input'"
          @click="toggleSpeechRecognition"
        >
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
  import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue'
  import Button from '@/components/ui/Button.vue'
  import UploadIcon from '@/components/icons/UploadIcon.vue'
  import MicrophoneIcon from '@/components/icons/MicrophoneIcon.vue'
  import SearchButtonIcon from '@/components/icons/SearchButtonIcon.vue'
  import { validateFiles } from '@/utils/fileValidation'
  import type {
    SpeechRecognition,
    SpeechRecognitionEvent,
    SpeechRecognitionErrorEvent
  } from '@/types/speech'

  interface Props {
    modelValue: string
    placeholder?: string
    disabled?: boolean
  }

  interface Emits {
    (_e: 'update:modelValue', _value: string): void
    (_e: 'search'): void
    (_e: 'fileUpload', _files: File[]): void
    (_e: 'fileError', _error: string): void
    (_e: 'speechError', _error: string): void
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Enter your search query...'
  })

  const emit = defineEmits<Emits>()

  const fileInput = ref<HTMLInputElement>()
  const textarea = ref<HTMLTextAreaElement>()

  // Speech recognition state
  const isListening = ref(false)
  const speechSupported = ref(false)
  let recognition: SpeechRecognition | null = null

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

  // Speech Recognition Functions
  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition ?? window.webkitSpeechRecognition
      if (SpeechRecognition) {
        speechSupported.value = true
        recognition = new SpeechRecognition()

        // Configure speech recognition
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onstart = () => {
          isListening.value = true
        }

        recognition.onend = () => {
          isListening.value = false
        }

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          if (event.results.length > 0) {
            const transcript = event.results[0]?.[0]?.transcript ?? ''
            if (transcript.trim()) {
              emit('update:modelValue', transcript.trim())
              // Auto-submit the search after speech input
              setTimeout(() => {
                emit('search')
              }, 100)
            }
          }
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          isListening.value = false
          let errorMessage = 'Speech recognition error occurred'

          switch (event.error) {
            case 'no-speech':
              errorMessage = 'No speech was detected. Please try again.'
              break
            case 'audio-capture':
              errorMessage =
                'No microphone was found. Please check your microphone settings.'
              break
            case 'not-allowed':
              errorMessage =
                'Microphone access was denied. Please allow microphone access and try again.'
              break
            case 'network':
              errorMessage = 'Network error occurred during speech recognition.'
              break
            default:
              errorMessage = `Speech recognition error: ${event.error}`
          }

          emit('speechError', errorMessage)
        }
      }
    }
  }

  const toggleSpeechRecognition = () => {
    if (!recognition || props.disabled) {
      return
    }

    if (isListening.value) {
      recognition.stop()
    } else {
      try {
        recognition.start()
      } catch {
        emit(
          'speechError',
          'Failed to start speech recognition. Please try again.'
        )
      }
    }
  }

  // Lifecycle hooks
  onMounted(() => {
    initializeSpeechRecognition()
  })

  onUnmounted(() => {
    if (recognition && isListening.value) {
      recognition.stop()
    }
  })

  watch(
    () => props.modelValue,
    async () => {
      await nextTick()
      adjustTextareaHeight()
    },
    { immediate: true }
  )
</script>
