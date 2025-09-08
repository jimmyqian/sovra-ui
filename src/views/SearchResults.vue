<template>
  <div class="search-results">
    <AppHeader />

    <div class="main-container">
      <!-- Left Panel: Search & Conversation -->
      <div class="left-panel">
        <SearchConversation :search-query="searchQuery" />

        <!-- Search Input -->
        <div class="search-input-container">
          <SearchBar
            v-model="newQuery"
            placeholder="Johnson, who is around 26 years old, works in a software company in California"
            @search="handleSearch"
            @file-upload="handleFileUpload"
          />
        </div>

        <AppSidebar />
      </div>

      <!-- Right Panel: Results -->
      <ResultsList :results="results" @load-more="handleLoadMore" />
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import AppHeader from '@/components/layout/AppHeader.vue'
  import AppSidebar from '@/components/navigation/AppSidebar.vue'
  import SearchBar from '@/components/common/SearchBar.vue'
  import SearchConversation from '@/components/search/SearchConversation.vue'
  import ResultsList from '@/components/search/ResultsList.vue'
  import AppFooter from '@/components/layout/AppFooter.vue'

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

  const route = useRoute()
  const searchQuery = ref('')
  const newQuery = ref(
    'Johnson, who is around 26 years old, works in a software company in California'
  )

  const results = ref<SearchResult[]>([
    {
      id: 1,
      name: 'Johnson Smith',
      age: 26,
      gender: 'Male',
      maritalStatus: 'Married',
      location: 'California',
      rating: 3.2,
      references: 26,
      companies: 10,
      contacts: 7
    },
    {
      id: 2,
      name: 'Johnson Smith',
      age: 26,
      gender: 'Male',
      maritalStatus: 'Married',
      location: 'California',
      rating: 3.2,
      references: 26,
      companies: 10,
      contacts: 7
    },
    {
      id: 3,
      name: 'Johnson Smith',
      age: 26,
      gender: 'Male',
      maritalStatus: 'Married',
      location: 'California',
      rating: 3.2,
      references: 26,
      companies: 10,
      contacts: 7
    },
    {
      id: 4,
      name: 'Johnson Smith',
      age: 26,
      gender: 'Male',
      maritalStatus: 'Married',
      location: 'California',
      rating: 3.2,
      references: 26,
      companies: 10,
      contacts: 7
    },
    {
      id: 5,
      name: 'Johnson Smith',
      age: 26,
      gender: 'Male',
      maritalStatus: 'Married',
      location: 'California',
      rating: 3.2,
      references: 26,
      companies: 10,
      contacts: 7
    }
  ])

  const handleSearch = () => {
    console.log('Searching for:', newQuery.value)
  }

  const handleFileUpload = (files: FileList) => {
    console.log('Files uploaded:', files)
  }

  const handleLoadMore = () => {
    console.log('Loading more results...')
  }

  onMounted(() => {
    const query = route.query.q as string
    if (query) {
      searchQuery.value = query
    }
  })
</script>

<style scoped>
  .search-results {
    min-height: 100vh;
    background-color: #f9f7f5;
    display: flex;
    flex-direction: column;
  }

  .main-container {
    flex: 1;
    display: flex;
    height: calc(100vh - 120px);
  }

  .left-panel {
    width: 50%;
    background: white;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .search-input-container {
    padding: 1rem 2rem;
    border-top: 1px solid #e5e5e5;
  }

  @media (max-width: 1024px) {
    .main-container {
      flex-direction: column;
    }

    .left-panel {
      width: 100%;
      height: 50vh;
    }
  }

  @media (max-width: 768px) {
    .search-input-container {
      padding: 1rem;
    }
  }
</style>
