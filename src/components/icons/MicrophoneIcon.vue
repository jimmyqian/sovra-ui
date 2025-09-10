<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.5659 15.5562C14.7759 15.5562 16.5659 13.7662 16.5659 11.5562V6.05615C16.5659 3.84615 14.7759 2.05615 12.5659 2.05615C10.3559 2.05615 8.56592 3.84615 8.56592 6.05615V11.5562C8.56592 13.7662 10.3559 15.5562 12.5659 15.5562Z"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4.91602 9.70605V11.4061C4.91602 15.6261 8.34602 19.0561 12.566 19.0561C16.786 19.0561 20.216 15.6261 20.216 11.4061V9.70605"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.1758 6.48627C12.0758 6.15627 13.0558 6.15627 13.9558 6.48627"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.7661 8.60598C12.2961 8.46598 12.8461 8.46598 13.3761 8.60598"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.5659 19.0562V22.0562"
      stroke="currentColor"
      :stroke-width="strokeWidth"
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
