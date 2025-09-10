<template>
  <div class="min-h-screen bg-bg-primary flex flex-col">
    <div class="flex-1 flex h-screen">
      <!-- Left Navigation Sidebar -->
      <AppSidebar />
      
      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col md:flex-row">
        <!-- Left Panel: Search & Conversation -->
        <div class="w-full bg-bg-card flex flex-col md:w-2/5 md:h-full">
          <AppHeader />
          <SearchConversation :search-query="searchQuery" />

          <!-- Search Input -->
          <div class="px-8 py-4 md:px-4">
            <SearchBar
              v-model="newQuery"
              placeholder="Johnson, who is around 26 years old, works in a software company in California"
              @search="handleSearch"
              @file-upload="handleFileUpload"
            />
          </div>

          <!-- Spacer to push content up and search box immediately after content -->
          <div class="flex-1"></div>
        </div>

        <!-- Right Panel: Results -->
        <ResultsList :results="results" @load-more="handleLoadMore" />
      </div>
    </div>

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
  import type { SearchResult } from '@/types/search'

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
