<template>
  <div class="subscription-indicator">
    <div
      class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border"
      :style="{
        backgroundColor: `${tierColor}20`,
        color: tierColor,
        borderColor: tierColor
      }"
      :class="{ 'cursor-pointer': clickable }"
      @click="handleClick"
    >
      <div
        class="w-2 h-2 rounded-full"
        :style="{ backgroundColor: tierColor }"
      ></div>
      <span>{{ tierName }} ({{ currentLevel }})</span>
      <kbd v-if="props.showShortcut" class="text-xs opacity-60"
        >Ctrl+{{ currentLevel }}</kbd
      >
    </div>

    <!-- Tooltip with tier features -->
    <div
      v-if="showTooltip"
      class="absolute top-full left-0 mt-2 w-64 p-3 bg-white border border-border-light rounded-lg shadow-lg z-50"
    >
      <div class="font-medium text-sm mb-2">{{ tierName }} Features:</div>
      <ul class="text-xs space-y-1">
        <li
          v-for="feature in tierFeatures"
          :key="feature"
          class="flex items-start gap-1"
        >
          <span class="text-green-500 mt-0.5">✓</span>
          <span>{{ feature }}</span>
        </li>
      </ul>
      <div class="mt-2 text-xs text-text-secondary">
        Press Ctrl+1, Ctrl+2, or Ctrl+3 to switch levels
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useSubscriptionStore } from '@/stores/subscription'

  interface Props {
    clickable?: boolean
    showShortcut?: boolean
    showTooltipOnHover?: boolean
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    click: []
  }>()

  const subscriptionStore = useSubscriptionStore()
  const showTooltip = ref(false)

  const currentLevel = computed(() => subscriptionStore.currentLevel)
  const tierName = computed(() => subscriptionStore.tierName)
  const tierColor = computed(() => subscriptionStore.tierColor)
  const tierFeatures = computed(() => subscriptionStore.tierFeatures)

  const handleClick = () => {
    if (props.clickable) {
      emit('click')
    }
    if (props.showTooltipOnHover) {
      showTooltip.value = !showTooltip.value
    }
  }
</script>

<style scoped>
  .subscription-indicator {
    position: relative;
    display: inline-block;
  }

  kbd {
    background: rgba(0, 0, 0, 0.1);
    padding: 1px 4px;
    border-radius: 3px;
    font-family: monospace;
  }
</style>
