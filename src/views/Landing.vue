<template>
  <div class="min-h-screen bg-bg-primary flex flex-col">
    <div
      class="flex-1 flex flex-col max-w-6xl mx-auto px-8 py-8 relative md:px-4"
    >
      <!-- Logo -->
      <div class="flex justify-center mb-12">
        <Logo />
      </div>

      <!-- Main Content -->
      <div
        class="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
      >
        <h1
          class="text-hero font-normal text-text-primary mb-2 md:text-3xl sm:text-2xl"
        >
          Hi! I am <span class="font-semibold">Sovra</span>...
        </h1>
        <h2
          class="text-hero font-normal text-text-primary mb-4 md:text-3xl sm:text-2xl"
        >
          What do you <strong>want to know</strong> today?
        </h2>
        <p class="text-text-secondary text-sm mb-12">
          Try adding more detail: works better when you give more context or
          share your goal
        </p>

        <!-- Search Bar -->
        <div class="w-full max-w-2xl">
          <SearchBar
            v-model="searchQuery"
            placeholder="enter keyword of the person you want to know or explain the person you are looking for....."
            @search="handleSearch"
            @file-upload="handleFileUpload"
          />
        </div>
      </div>

      <!-- Footer -->
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Logo from '@/components/common/Logo.vue'
  import SearchBar from '@/components/common/SearchBar.vue'
  import AppFooter from '@/components/layout/AppFooter.vue'

  const router = useRouter()
  const searchQuery = ref('')

  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      router.push({
        path: '/search',
        query: { q: searchQuery.value }
      })
    }
  }

  const handleFileUpload = (files: FileList) => {
    console.log('Files uploaded:', files)
  }
</script>
