<template>
  <div class="w-36 h-2 bg-border-lighter rounded overflow-hidden relative">
    <div
      class="h-full bg-score-bar transition-all duration-300"
      :style="{ width: (rating / 5) * 100 + '%' }"
    ></div>
    <!-- Vertical divider lines -->
    <div class="absolute top-0 h-full bg-bg-card" style="width: 1px; left: calc(20% - 0.5px);"></div>
    <div class="absolute top-0 h-full bg-bg-card" style="width: 1px; left: calc(40% - 0.5px);"></div>
    <div class="absolute top-0 h-full bg-bg-card" style="width: 1px; left: calc(60% - 0.5px);"></div>
    <div class="absolute top-0 h-full bg-bg-card" style="width: 1px; left: calc(80% - 0.5px);"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  rating: number
}

defineProps<Props>()
</script>