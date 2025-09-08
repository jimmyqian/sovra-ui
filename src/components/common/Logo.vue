<template>
  <div class="flex items-center gap-2">
    <div
      class="logo-icon w-8 h-8 rounded-full bg-gradient-brand relative"
    ></div>
    <span class="text-logo font-semibold text-text-primary">SOVRa</span>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  .logo-icon::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border: 2px solid white;
    border-radius: 50%;
  }
</style>
