<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click="handleOverlayClick"
  >
    <div
      class="bg-bg-card border border-border-light rounded-xl p-8 mx-4 max-w-md w-full shadow-2xl transform transition-all duration-300"
      @click.stop
    >
      <!-- Header with Mr. T attitude -->
      <div class="text-center mb-6">
        <div class="text-4xl mb-2">🥊</div>
        <h2 class="text-2xl font-bold text-text-primary mb-2">
          Hold Up There, Fool!
        </h2>
        <p class="text-text-secondary text-sm">
          You're about to access some serious intel
        </p>
      </div>

      <!-- Mr. T themed content -->
      <div class="space-y-4 mb-6">
        <p class="text-text-primary leading-relaxed">
          "I pity the fool who thinks premium data comes free! You want the REAL
          details? The financial dirt? The family secrets? Then you better step
          up and
          <strong>PAY SOME MONEY, FOOL!</strong>"
        </p>

        <div class="bg-bg-muted rounded-lg p-4">
          <h3 class="font-semibold text-text-primary mb-2">
            What you're missing out on:
          </h3>
          <ul class="text-sm text-text-secondary space-y-1">
            <li>💰 Full financial breakdowns</li>
            <li>🏠 Complete property details</li>
            <li>👨‍👩‍👧‍👦 Extended family networks</li>
            <li>📊 Professional history deep-dive</li>
            <li>⚖️ Legal records & background</li>
          </ul>
        </div>

        <p class="text-text-primary text-sm italic">
          "Don't be a jibber-jabber cheapskate! Upgrade now and get the WHOLE
          truth, not just the appetizer!"
        </p>
      </div>

      <!-- Action buttons -->
      <div class="space-y-3">
        <button
          class="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          @click="handleUpgrade"
        >
          Upgrade to Premium - Mr. T Approved! 💪
        </button>

        <button
          class="w-full bg-transparent border border-border-light text-text-secondary hover:text-text-primary hover:border-text-primary py-2 px-4 rounded-lg transition-colors duration-200"
          @click="handleMaybeLater"
        >
          Maybe later (but Mr. T won't be happy)
        </button>
      </div>

      <!-- Close button -->
      <button
        class="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors duration-200"
        aria-label="Close popup"
        @click="handleClose"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  interface Props {
    modelValue: boolean
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'upgrade'): void
    (e: 'maybeLater'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const isVisible = ref(props.modelValue)

  // Watch for prop changes
  watch(
    () => props.modelValue,
    newValue => {
      isVisible.value = newValue
    }
  )

  const handleClose = () => {
    isVisible.value = false
    emit('update:modelValue', false)
  }

  const handleOverlayClick = () => {
    handleClose()
  }

  const handleUpgrade = () => {
    emit('upgrade')
    handleClose()
  }

  const handleMaybeLater = () => {
    emit('maybeLater')
    handleClose()
  }

  // Handle escape key
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isVisible.value) {
      handleClose()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
</script>

<script lang="ts">
  import { watch, onMounted, onUnmounted } from 'vue'

  export default {
    name: 'UpsellPopup'
  }
</script>
