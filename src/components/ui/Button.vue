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
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95'

    const focusClasses =
      props.variant === 'outline'
        ? 'focus:outline-none focus:ring-0 focus:ring-offset-0'
        : 'focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2'

    const variantClasses = {
      primary:
        'bg-gradient-to-r from-brand-accent to-purple-600 text-white border-none hover:from-brand-accent-dark hover:to-purple-700 hover:-translate-y-0.5',
      outline: props.active
        ? 'bg-slate-50 border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white'
        : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-brand-accent hover:text-brand-accent',
      ghost:
        'bg-transparent border-none text-brand-accent hover:bg-slate-50 shadow-none'
    }

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
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
