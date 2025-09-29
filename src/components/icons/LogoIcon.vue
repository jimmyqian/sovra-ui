<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="LOGO_VIEWBOX"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Define gradients and filters for HAL 9000 eye -->
    <defs>
      <!-- Red gradient for the eye -->
      <radialGradient id="hal-eye-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ff0000" stop-opacity="1" />
        <stop offset="30%" stop-color="#cc0000" stop-opacity="0.9" />
        <stop offset="60%" stop-color="#990000" stop-opacity="0.7" />
        <stop offset="100%" stop-color="#660000" stop-opacity="0.4" />
      </radialGradient>

      <!-- Glowing effect filter -->
      <filter id="hal-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- Subtle inner shadow for depth -->
      <filter
        id="hal-inner-shadow"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
      >
        <feOffset dx="0" dy="1" />
        <feGaussianBlur stdDeviation="1" />
        <feComposite operator="over" />
      </filter>
    </defs>

    <!-- Original ring paths -->
    <path
      v-for="(path, index) in LOGO_PATHS"
      :key="index"
      :d="path"
      :fill="fillColor"
    />

    <!-- HAL 9000 Eye in the center -->
    <g class="hal-eye">
      <!-- Outer glow ring -->
      <circle
        cx="25.5"
        cy="26"
        r="8"
        fill="none"
        stroke="#ff0000"
        stroke-width="0.5"
        opacity="0.3"
        filter="url(#hal-glow)"
      />

      <!-- Main eye body -->
      <circle
        cx="25.5"
        cy="26"
        r="6"
        fill="url(#hal-eye-gradient)"
        filter="url(#hal-glow)"
      />

      <!-- Inner reflection/highlight -->
      <circle cx="24" cy="24" r="2" fill="#ff6666" opacity="0.6" />

      <!-- Central lens -->
      <circle
        cx="25.5"
        cy="26"
        r="3"
        fill="none"
        stroke="#ff3333"
        stroke-width="0.5"
        opacity="0.8"
      />

      <!-- Tiny highlight dot -->
      <circle cx="24.5" cy="24.5" r="0.8" fill="#ffaaaa" opacity="0.9" />
    </g>
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

<style scoped>
  /* HAL 9000 eye pulsing animation */
  .hal-eye {
    animation: hal-pulse 3s ease-in-out infinite;
    transform-origin: center;
  }

  @keyframes hal-pulse {
    0% {
      opacity: 1;
      filter: drop-shadow(0 0 3px #ff0000);
    }
    50% {
      opacity: 0.85;
      filter: drop-shadow(0 0 6px #ff0000) drop-shadow(0 0 9px #cc0000);
    }
    100% {
      opacity: 1;
      filter: drop-shadow(0 0 3px #ff0000);
    }
  }

  /* Subtle hover effect */
  svg:hover .hal-eye {
    animation-duration: 1.5s;
  }

  /* Reduce animation on reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .hal-eye {
      animation: none;
      filter: drop-shadow(0 0 3px #ff0000);
    }
  }
</style>
