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
      <ResultCard v-for="result in results" :key="result.id" :result="result" />
    </div>

    <div class="px-8 py-4 text-center md:px-4">
      <button
        class="bg-brand-orange text-bg-card border-none px-8 py-3 rounded-search text-base cursor-pointer transition-colors hover:bg-brand-orange-light"
        @click="handleLoadMore"
      >
        Load More Results
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

  interface SearchResult {
    id: number
    name: string
    age: number
    gender: string
    maritalStatus: string
    location: string
    rating: number
    references: number
    companies: number
    contacts: number
  }

  interface Props {
    results: SearchResult[]
  }

  interface Emits {
    (e: 'loadMore'): void
  }

  defineProps<Props>()
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
    console.log('Remove filter:', filterId)
    filterCriteria.value = filterCriteria.value.filter(f => f.id !== filterId)
  }

  const handleDropdownClick = (filterId: string) => {
    console.log('Dropdown clicked:', filterId)
  }

  const handleEdit = () => {
    console.log('Edit filters')
  }

  const handleCreateMore = () => {
    console.log('Create more criteria')
  }
</script>
