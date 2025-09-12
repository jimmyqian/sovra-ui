<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  type ButtonVariant = 'primary' | 'outline' | 'ghost'
  type ButtonSize = 'sm' | 'md' | 'lg'

  interface Props {
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    fullWidth?: boolean
  }

  interface Emits {
    (e: 'click', event: MouseEvent): void
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    type: 'button'
  })

  defineEmits<Emits>()

  const buttonClasses = computed(() => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
      primary: 'btn-primary',
      outline: 'btn-outline',
      ghost: 'btn-ghost'
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    }

    const widthClass = props.fullWidth ? 'w-full' : ''

    return [
      baseClasses,
      variantClasses[props.variant],
      sizeClasses[props.size],
      widthClass
    ]
      .filter(Boolean)
      .join(' ')
  })
</script>
