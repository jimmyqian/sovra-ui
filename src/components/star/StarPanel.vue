<template>
  <div class="flex-1 flex flex-col max-h-full overflow-hidden bg-bg-primary">
    <div class="flex-1 p-4">
      <D3StarGraph :node-count="props.nodeCount" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import D3StarGraph from './D3StarGraph.vue'

  interface Props {
    nodeCount?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    nodeCount: 7
  })
</script>

<script lang="ts">
  export default {
    name: 'StarPanel'
  }
</script>
