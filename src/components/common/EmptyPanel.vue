<template>
  <div class="flex-1 flex flex-col max-h-full overflow-hidden bg-bg-primary">
    <div class="flex-1 flex items-center justify-center">
      <div class="text-center space-y-4 p-8">
        <div class="text-6xl text-text-muted">📋</div>
        <h2 class="text-xl font-semibold text-text-primary">New Panel</h2>
        <p class="text-text-secondary max-w-md">
          This is a new empty panel. Content will be added here in future
          updates.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Empty panel component for new screen layout
</script>

<script lang="ts">
  export default {
    name: 'EmptyPanel'
  }
</script>
