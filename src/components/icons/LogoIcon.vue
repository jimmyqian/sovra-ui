<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="LOGO_VIEWBOX"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      v-for="(path, index) in LOGO_PATHS"
      :key="index"
      :d="path"
      :fill="fillColor"
    />
  </svg>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { LOGO_VIEWBOX, LOGO_PATHS } from '@/assets/logo-paths'

  interface Props {
    size?: number | string
    color?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 24,
    color: 'var(--color-brand-orange)'
  })

  // Use the provided color prop, defaulting to brand orange
  const fillColor = computed(() => {
    return props.color
  })
</script>
