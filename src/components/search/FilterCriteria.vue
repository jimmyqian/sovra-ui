<template>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="filter in filters"
      :key="filter.id"
      class="bg-bg-secondary px-3 py-1 rounded-tag text-sm flex items-center gap-1 border border-brand-orange-light"
      :class="{ 'cursor-pointer': filter.hasDropdown }"
    >
      {{ filter.text }}
      <button
        v-if="filter.removable"
        class="bg-transparent border-none text-text-muted cursor-pointer text-base p-0 ml-1 hover:text-brand-orange transition-colors"
        @click="handleRemoveFilter(filter.id)"
      >
        ×
      </button>
      <span
        v-if="filter.hasDropdown"
        class="cursor-pointer font-medium hover:text-brand-orange transition-colors"
        @click="handleDropdownClick(filter.id)"
      >
        {{ filter.dropdownText }} ▼
      </span>
    </span>
    <button
      class="bg-transparent border border-gray-300 px-3 py-1 rounded-tag text-sm cursor-pointer transition-all duration-200 hover:border-text-muted hover:bg-bg-secondary"
      @click="handleEdit"
    >
      edit ✏️
    </button>
    <button
      class="text-brand-orange border-brand-orange bg-transparent border px-3 py-1 rounded-tag text-sm cursor-pointer transition-all duration-200 hover:bg-brand-orange hover:text-bg-card"
      @click="handleCreateMore"
    >
      🔍 Create more criteria
    </button>
  </div>
</template>

<script setup lang="ts">
  interface FilterItem {
    id: string
    text: string
    removable?: boolean
    hasDropdown?: boolean
    dropdownText?: string
  }

  interface Props {
    filters: FilterItem[]
  }

  interface Emits {
    (_e: 'removeFilter', _filterId: string): void
    (_e: 'dropdownClick', _filterId: string): void
    (_e: 'edit'): void
    (_e: 'createMore'): void
  }

  defineProps<Props>()
  const emit = defineEmits<Emits>()

  const handleRemoveFilter = (filterId: string) => {
    emit('removeFilter', filterId)
  }

  const handleDropdownClick = (filterId: string) => {
    emit('dropdownClick', filterId)
  }

  const handleEdit = () => {
    emit('edit')
  }

  const handleCreateMore = () => {
    emit('createMore')
  }
</script>
