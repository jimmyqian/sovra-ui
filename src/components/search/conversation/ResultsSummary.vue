<template>
  <p class="mb-4 leading-relaxed text-text-secondary">
    <strong>{{ summaryText }}</strong>
  </p>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { ResultsSummaryItem } from '@/types/conversation'

  interface Props {
    item: ResultsSummaryItem
  }

  const props = defineProps<Props>()

  const summaryText = computed(() => {
    if (props.item.template !== undefined) {
      return props.item.template
        .replace(/\{count\}/g, props.item.resultCount.toString())
        .replace(/\{searchTerm\}/g, props.item.searchTerm ?? '')
    }

    return `${props.item.resultCount} persons were found in the results. Please provide additional information about the person you're looking for.`
  })
</script>
