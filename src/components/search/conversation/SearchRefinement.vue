<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-text-primary mb-2">
      {{ item.label }}
    </label>

    <!-- Age Range Input -->
    <div v-if="item.inputType === 'age-range'" class="flex gap-2 items-center">
      <input
        v-model="(localValue as { min: string; max: string }).min"
        type="number"
        placeholder="Min age"
        class="px-3 py-2 border border-border-light rounded-md text-sm w-20"
        @input="handleAgeRangeChange"
      />
      <span class="text-text-secondary">to</span>
      <input
        v-model="(localValue as { min: string; max: string }).max"
        type="number"
        placeholder="Max age"
        class="px-3 py-2 border border-border-light rounded-md text-sm w-20"
        @input="handleAgeRangeChange"
      />
    </div>

    <!-- Text Input -->
    <input
      v-else-if="item.inputType === 'text'"
      v-model="localValue"
      type="text"
      :placeholder="item.placeholder"
      class="px-3 py-2 border border-border-light rounded-md text-sm w-full"
      @input="handleTextChange"
    />

    <!-- Select Input -->
    <select
      v-else-if="item.inputType === 'select'"
      v-model="localValue"
      class="px-3 py-2 border border-border-light rounded-md text-sm w-full"
      @change="handleSelectChange"
    >
      <option value="">{{ item.placeholder || 'Select an option' }}</option>
      <option v-for="option in item.options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>

    <!-- Checkbox Input -->
    <label
      v-else-if="item.inputType === 'checkbox'"
      class="flex items-center gap-2 cursor-pointer"
    >
      <input
        v-model="localValue"
        type="checkbox"
        class="rounded border-border-light"
        @change="handleCheckboxChange"
      />
      <span class="text-sm text-text-secondary">{{ item.placeholder }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import type { SearchRefinementItem } from '@/types/conversation'

  interface Props {
    item: SearchRefinementItem
  }

  const props = defineProps<Props>()

  const localValue = ref(
    props.item.value ??
      (props.item.inputType === 'age-range' ? { min: '', max: '' } : '')
  )

  const handleAgeRangeChange = () => {
    if (props.item.onChange) {
      props.item.onChange(localValue.value)
    }
  }

  const handleTextChange = () => {
    if (props.item.onChange) {
      props.item.onChange(localValue.value)
    }
  }

  const handleSelectChange = () => {
    if (props.item.onChange) {
      props.item.onChange(localValue.value)
    }
  }

  const handleCheckboxChange = () => {
    if (props.item.onChange) {
      props.item.onChange(localValue.value)
    }
  }

  watch(
    () => props.item.value,
    newValue => {
      localValue.value =
        newValue ??
        (props.item.inputType === 'age-range' ? { min: '', max: '' } : '')
    },
    { immediate: true }
  )
</script>
