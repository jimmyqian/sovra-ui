<template>
  <p :class="computedClasses">
    <template v-if="item.emphasis === 'strong'">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <strong v-html="sanitizeHtml(item.content)"></strong>
    </template>
    <template v-else>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="sanitizeHtml(item.content)"></span>
    </template>
  </p>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { sanitizeHtml } from '@/utils/sanitize'
  import type { TextParagraphItem } from '@/types/conversation'

  interface Props {
    item: TextParagraphItem
  }

  const props = defineProps<Props>()

  const computedClasses = computed(() => {
    const baseClasses = 'mb-4 leading-relaxed'
    const emphasisClasses = {
      normal: 'text-text-primary',
      strong: 'text-text-primary font-medium',
      secondary: 'text-text-secondary'
    }

    return [
      baseClasses,
      emphasisClasses[props.item.emphasis ?? 'normal'],
      props.item.className ?? ''
    ]
      .filter(Boolean)
      .join(' ')
  })
</script>
