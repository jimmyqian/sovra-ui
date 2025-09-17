<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-text-primary mb-2">
      {{ item.label }}
    </label>
    <div
      class="border-2 border-dashed border-border-dashed rounded-lg p-4 text-center hover:border-brand-orange-dark transition-colors"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        :accept="acceptedTypesString"
        class="hidden"
        @change="handleFileChange"
      />
      <button
        class="text-brand-orange-dark hover:text-brand-orange-light cursor-pointer"
        @click="triggerFileInput"
      >
        Click to upload files or drag and drop
      </button>
      <p class="text-xs text-text-muted mt-1">
        {{ acceptedTypesDisplay }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { FileUploadItem } from '@/types/conversation'

  interface Props {
    item: FileUploadItem
  }

  const props = defineProps<Props>()

  const fileInput = ref<HTMLInputElement>()

  const acceptedTypesString = computed(() => {
    return props.item.acceptedTypes?.join(',') ?? ''
  })

  const acceptedTypesDisplay = computed(() => {
    if (!props.item.acceptedTypes || props.item.acceptedTypes.length === 0) {
      return 'All file types accepted'
    }
    return props.item.acceptedTypes.join(', ')
  })

  const triggerFileInput = () => {
    fileInput.value?.click()
  }

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && props.item.onUpload) {
      props.item.onUpload(target.files)
    }
  }
</script>
