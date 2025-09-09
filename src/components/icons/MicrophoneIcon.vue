<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
      stroke="currentColor"
      :stroke-width="strokeWidth"
    />
    <path
      d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"
      stroke="currentColor"
      :stroke-width="strokeWidth"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
  strokeWidth?: number
}

withDefaults(defineProps<Props>(), {
  size: 16,
  strokeWidth: 2
})
</script>