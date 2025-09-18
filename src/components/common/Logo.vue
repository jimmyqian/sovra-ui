<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex items-center gap-2">
    <LogoIcon
      :size="52"
      color="var(--color-brand-orange)"
    />
    <div class="relative">
      <span class="text-logo font-semibold text-text-primary">SOVRa</span>
      <div
        class="absolute bg-brand-orange"
        style="
          top: 16px;
          left: calc(100% - 1em - 6px);
          width: calc(1em + 4px);
          height: 3px;
        "
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LogoIcon from '@/components/icons/LogoIcon.vue'
</script>
