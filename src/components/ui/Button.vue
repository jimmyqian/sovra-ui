<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled"
    v-bind="$attrs"
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
    active?: boolean
  }

  interface Emits {
    (_e: 'click', _event: MouseEvent): void
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    type: 'button'
  })

  defineEmits<Emits>()

  const buttonClasses = computed(() => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 rounded-search font-medium cursor-pointer transition-all transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

    const focusClasses =
      props.variant === 'outline'
        ? 'focus:outline-none focus:ring-0 focus:ring-offset-0'
        : 'focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2'

    const variantClasses = {
      primary: 'bg-brand-orange text-bg-card border-none hover:scale-110',
      outline: props.active
        ? 'bg-transparent-active border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-bg-card'
        : 'bg-transparent border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-bg-card',
      ghost:
        'bg-transparent border-none text-brand-orange hover:bg-brand-orange hover:text-bg-card'
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-8 py-3 text-base'
    }

    const widthClass = props.fullWidth ? 'w-full' : ''

    return [
      baseClasses,
      focusClasses,
      variantClasses[props.variant],
      sizeClasses[props.size],
      widthClass
    ]
      .filter(Boolean)
      .join(' ')
  })
</script>
