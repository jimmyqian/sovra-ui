<template>
  <div class="flex gap-4 mb-4 items-start">
    <div
      class="w-9 h-9 border border-black rounded-search flex items-center justify-center flex-shrink-0 ml-0.5 overflow-hidden"
    >
      <img
        src="https://raw.githubusercontent.com/imcnaney/donkey/main/img/helmet.jpg"
        alt="Discovery One Space Helmet"
        class="w-full h-full object-cover"
      />
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

  /**
   * User Message Component
   * Displays user input messages in the conversation
   * Features authentic Discovery One space helmet image representing the crew member
   */
</script>
