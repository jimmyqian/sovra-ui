<template>
  <header
    class="bg-white/80 backdrop-blur-md px-8 py-5 border-b border-slate-200/60 shadow-sm sticky top-0 z-50"
  >
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <Logo />
      <div class="flex items-center gap-4">
        <!-- Add any navigation items here in the future -->
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import Logo from '@/components/common/Logo.vue'
</script>
