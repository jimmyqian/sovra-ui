<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.6361 9.62615L12.5661 3.55615L6.49609 9.62615"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.5659 20.5561V3.72607"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
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
