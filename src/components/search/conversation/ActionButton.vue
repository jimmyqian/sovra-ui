<template>
  <button :class="computedClasses" @click="handleClick">
    {{ item.text }}
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { ActionButtonItem } from '@/types/conversation'

  interface Props {
    item: ActionButtonItem
  }

  const props = defineProps<Props>()

  const computedClasses = computed(() => {
    const baseClasses =
      'px-4 py-2 rounded-search text-sm cursor-pointer transition-colors'

    const variantClasses = {
      primary: 'bg-brand-orange-dark text-bg-card hover:bg-brand-orange-light',
      secondary:
        'bg-bg-secondary border border-border-light hover:bg-border-hover',
      dashed:
        'bg-transparent border border-dashed border-border-dashed hover:bg-border-hover text-brand-orange-dark'
    }

    return [
      baseClasses,
      variantClasses[props.item.variant ?? 'dashed'],
      props.item.className ?? ''
    ]
      .filter(Boolean)
      .join(' ')
  })

  const handleClick = () => {
    if (props.item.onClick) {
      props.item.onClick()
    }
  }
</script>
