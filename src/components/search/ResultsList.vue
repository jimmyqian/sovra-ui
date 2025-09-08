<template>
  <div class="results-container">
    <div class="results-header">
      <div class="results-info">
        <span class="results-count">Results ({{ results.length }})</span>
        <FilterCriteria
          :filters="filterCriteria"
          @remove-filter="handleRemoveFilter"
          @dropdown-click="handleDropdownClick"
          @edit="handleEdit"
          @create-more="handleCreateMore"
        />
      </div>
    </div>

    <div class="results-list">
      <ResultCard v-for="result in results" :key="result.id" :result="result" />
    </div>

    <div class="load-more">
      <button class="load-more-btn" @click="handleLoadMore">
        Load More Results
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ResultCard from './ResultCard.vue'
  import FilterCriteria from './FilterCriteria.vue'

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

<style scoped>
  .results-container {
    width: 50%;
    background: #f9f7f5;
    display: flex;
    flex-direction: column;
  }

  .results-header {
    padding: 1rem 2rem;
    background: white;
    border-bottom: 1px solid #e5e5e5;
  }

  .results-count {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
  }

  .results-list {
    flex: 1;
    padding: 1rem 2rem;
    overflow-y: auto;
  }

  .load-more {
    padding: 1rem 2rem;
    text-align: center;
  }

  .load-more-btn {
    background: #ff6b35;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 24px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .load-more-btn:hover {
    background: #e55a2b;
  }

  @media (max-width: 1024px) {
    .results-container {
      width: 100%;
      height: 50vh;
    }
  }

  @media (max-width: 768px) {
    .results-header {
      padding: 1rem;
    }

    .results-list {
      padding: 1rem;
    }
  }
</style>
