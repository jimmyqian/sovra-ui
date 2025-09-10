<template>
  <footer
    class="text-left text-text-secondary text-xs pt-4 pr-4 pb-8 pl-8 md:pt-3 md:pr-3 md:pb-8 md:pl-8"
  >
    <span>©{{ currentYear }} sovra.ai</span>
  </footer>
</template>

<script setup lang="ts">
  const currentYear = new Date().getFullYear()
</script>
