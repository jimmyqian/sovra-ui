<template>
  <div class="flex gap-4 mb-8 items-start">
    <div
      class="w-9 h-9 border border-black rounded-search flex items-center justify-center flex-shrink-0 ml-0.5"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle
          cx="12"
          cy="7"
          r="4"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <div class="flex-1">
      <div class="rounded-lg font-medium">
        {{ content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    content: string
  }

  defineProps<Props>()
</script>
