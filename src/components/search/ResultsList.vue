<template>
  <div class="w-full bg-bg-primary flex flex-col md:flex-1 md:h-auto">
    <div class="px-8 py-4 bg-bg-primary md:px-4">
      <div class="flex flex-wrap items-start gap-4">
        <span class="text-xl font-semibold text-text-primary"
          >Results ({{ results.length }})</span
        >
        <div class="flex-1 min-w-96">
          <FilterCriteria
            :filters="filterCriteria"
            @remove-filter="handleRemoveFilter"
            @dropdown-click="handleDropdownClick"
            @edit="handleEdit"
            @create-more="handleCreateMore"
          />
        </div>
      </div>
    </div>

    <div class="flex-1 px-8 py-4 overflow-y-auto md:px-4">
      <!-- Error state -->
      <div v-if="error" class="flex items-center justify-center py-12">
        <div class="text-red-500">Error: {{ error }}</div>
      </div>

      <!-- Loading state for initial search -->
      <div
        v-else-if="isLoading && results.length === 0"
        class="flex items-center justify-center py-12"
      >
        <div class="text-text-secondary">Loading results...</div>
      </div>

      <!-- Results -->
      <div v-else-if="results.length > 0">
        <ResultCard
          v-for="result in results"
          :key="result.id"
          :result="result"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="flex items-center justify-center py-12">
        <div class="text-text-secondary">
          No results found. Try a different search.
        </div>
      </div>
    </div>

    <div v-if="hasMore" class="px-8 py-4 text-center md:px-4">
      <button
        class="bg-bg-button text-brand-orange border border-brand-orange px-8 py-3 rounded-search text-base cursor-pointer transition-colors hover:bg-brand-orange hover:text-bg-card flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLoading"
        @click="handleLoadMore"
      >
        {{ isLoading ? 'Loading...' : 'Load More Results' }}
        <MoreIcon v-if="!isLoading" />
      </button>
    </div>

    <CopyrightFooter />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ResultCard from './ResultCard.vue'
  import FilterCriteria from './FilterCriteria.vue'
  import CopyrightFooter from '@/components/layout/CopyrightFooter.vue'
  import MoreIcon from '@/components/icons/MoreIcon.vue'
  import type { SearchResult } from '@/types/search'

  interface Props {
    results: SearchResult[]
    isLoading?: boolean
    hasMore?: boolean
    error?: string | null
  }

  interface Emits {
    (e: 'loadMore'): void
    (e: 'load-more'): void
  }

  withDefaults(defineProps<Props>(), {
    error: null
  })
  const emit = defineEmits<Emits>()

  const filterCriteria = ref([
    { id: '1', text: 'Johnson', removable: true },
    { id: '2', text: 'who', removable: true },
    { id: '3', text: 'is around', hasDropdown: true, dropdownText: '26' },
    { id: '4', text: 'years old,', hasDropdown: true, dropdownText: 'Works' },
    { id: '5', text: 'in a', hasDropdown: true, dropdownText: 'Software' },
    {
      id: '6',
      text: 'company in',
      hasDropdown: true,
      dropdownText: 'California'
    }
  ])

  const handleLoadMore = () => {
    emit('loadMore')
  }

  const handleRemoveFilter = (filterId: string) => {
    // TODO: Implement filter removal
    filterCriteria.value = filterCriteria.value.filter(f => f.id !== filterId)
  }

  const handleDropdownClick = (_filterId: string) => {
    // TODO: Implement dropdown action
  }

  const handleEdit = () => {
    // TODO: Implement filter editing
  }

  const handleCreateMore = () => {
    // TODO: Implement criteria creation
  }
</script>
