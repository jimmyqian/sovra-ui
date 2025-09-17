<template>
  <div class="my-6">
    <div
      v-for="(hint, index) in item.hints"
      :key="index"
      class="text-brand-orange-dark pb-2 cursor-pointer hover:text-brand-orange-dark border-t border-dashed border-border-dashed pt-2"
      :class="{
        'border-b': index === item.hints.length - 1,
        [hint.className || '']: hint.className
      }"
      @click="handleHintClick(hint)"
    >
      {{ hint.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import type {
    SearchHintsGroupItem,
    SearchHintItem
  } from '@/types/conversation'

  interface Props {
    item: SearchHintsGroupItem
  }

  defineProps<Props>()

  const handleHintClick = (hint: Omit<SearchHintItem, 'id' | 'type'>) => {
    if (hint.onClick) {
      hint.onClick()
    }
  }
</script>
