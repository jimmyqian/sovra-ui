<template>
  <div class="results-container">
    <div class="results-header">
      <div class="results-info">
        <span class="results-count">Results ({{ results.length }})</span>
        <div class="filter-tags">
          <span class="filter-tag"
            >Johnson <button class="remove-tag">×</button></span
          >
          <span class="filter-tag"
            >who <button class="remove-tag">×</button></span
          >
          <span class="filter-tag"
            >is around <span class="dropdown">26 ▼</span></span
          >
          <span class="filter-tag"
            >years old, <span class="dropdown">Works ▼</span></span
          >
          <span class="filter-tag"
            >in a <span class="dropdown">Software ▼</span></span
          >
          <span class="filter-tag"
            >company in <span class="dropdown">California ▼</span></span
          >
          <button class="edit-btn">edit ✏️</button>
          <button class="create-criteria-btn">🔍 Create more criteria</button>
        </div>
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
  import ResultCard from './ResultCard.vue'

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

  const handleLoadMore = () => {
    emit('loadMore')
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

  .filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .filter-tag {
    background: #f8f9fa;
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .dropdown {
    cursor: pointer;
  }

  .remove-tag {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 1rem;
  }

  .edit-btn,
  .create-criteria-btn {
    background: none;
    border: 1px solid #ddd;
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .create-criteria-btn {
    color: #ff6b35;
    border-color: #ff6b35;
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
