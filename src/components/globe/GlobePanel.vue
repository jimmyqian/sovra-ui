<template>
  <div class="flex-1 bg-bg-primary overflow-hidden">
    <D3Globe3D />
  </div>
</template>

<script setup lang="ts">
  import D3Globe3D from './D3Globe3D.vue'
</script>

<script lang="ts">
  export default {
    name: 'GlobePanel'
  }
</script>
