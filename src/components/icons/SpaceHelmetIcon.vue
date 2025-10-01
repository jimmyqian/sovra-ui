<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="space-helmet-icon"
  >
    <!-- Helmet neck collar/seal (wide base) -->
    <ellipse
      cx="12"
      cy="19"
      rx="8"
      ry="2.5"
      :fill="collarColor"
      :stroke="strokeColor"
      stroke-width="1"
    />

    <!-- Main helmet visor (flattened dome shape) -->
    <ellipse
      cx="12"
      cy="12"
      rx="9"
      ry="6"
      :fill="visorFill"
      :stroke="strokeColor"
      stroke-width="1.2"
    />

    <!-- Inner helmet structure rim -->
    <ellipse
      cx="12"
      cy="16"
      rx="7.5"
      ry="1"
      fill="none"
      :stroke="strokeColor"
      stroke-width="1"
      opacity="0.6"
    />

    <!-- Helmet top curve definition -->
    <path
      d="M4 12 Q12 6 20 12"
      fill="none"
      :stroke="strokeColor"
      stroke-width="0.8"
      opacity="0.4"
    />

    <!-- Primary reflection (horizontal band) -->
    <ellipse
      cx="12"
      cy="10"
      rx="6"
      ry="1.5"
      :fill="reflectionColor"
      opacity="0.3"
    />

    <!-- Secondary highlight reflection -->
    <ellipse
      cx="9"
      cy="8"
      rx="2.5"
      ry="0.8"
      :fill="reflectionColor"
      opacity="0.5"
    />

    <!-- Face silhouette inside helmet -->
    <ellipse cx="12" cy="13" rx="2.5" ry="2" :fill="faceFill" opacity="0.2" />

    <!-- Collar connection points -->
    <circle
      cx="6"
      cy="17"
      r="0.8"
      :fill="collarColor"
      :stroke="strokeColor"
      stroke-width="0.5"
    />
    <circle
      cx="18"
      cy="17"
      r="0.8"
      :fill="collarColor"
      :stroke="strokeColor"
      stroke-width="0.5"
    />
  </svg>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    size?: number | string
    color?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 24,
    color: 'currentColor'
  })

  // Color scheme for the Discovery One space helmet
  const strokeColor = computed(() => props.color)
  const visorFill = computed(() => 'rgba(220, 240, 255, 0.08)') // Very subtle blue tint for glass
  const collarColor = computed(() => 'rgba(180, 180, 190, 0.9)') // Metallic collar base
  const reflectionColor = computed(() => 'rgba(255, 255, 255, 0.9)') // Bright white reflection
  const faceFill = computed(() => 'rgba(80, 80, 100, 0.4)') // Subtle face silhouette

  /**
   * Discovery One Space Helmet Icon Component
   * Represents the iconic space helmet worn by Discovery One crew members from 2001: A Space Odyssey
   * Features the characteristic flattened dome visor with wide collar seal
   * Authentic proportions matching the film's distinctive helmet design
   */
</script>

<style scoped>
  .space-helmet-icon {
    /* Subtle glass-like effect for the visor */
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1));
  }
</style>
