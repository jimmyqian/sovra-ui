<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="11"
      cy="11"
      r="8"
      stroke="currentColor"
      :stroke-width="strokeWidth"
    />
    <path
      d="M21 21l-4.35-4.35"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup lang="ts">
  interface Props {
    size?: number | string
    strokeWidth?: number
  }

  withDefaults(defineProps<Props>(), {
    size: 20,
    strokeWidth: 2
  })
</script>
