<template>
  <div class="landing">
    <div class="container">
      <!-- Logo -->
      <div class="logo-section">
        <Logo />
      </div>

      <!-- Main Content -->
      <div class="content">
        <h1 class="greeting">Hi! I am <span class="brand">Sovra</span>...</h1>
        <h2 class="question">
          What do you <strong>want to know</strong> today?
        </h2>
        <p class="tip">
          Try adding more detail: works better when you give more context or
          share your goal
        </p>

        <!-- Search Bar -->
        <div class="search-container">
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

<style scoped>
  .landing {
    min-height: 100vh;
    background-color: #f9f7f5;
    display: flex;
    flex-direction: column;
  }

  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    position: relative;
  }

  .logo-section {
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .greeting {
    font-size: 2.5rem;
    font-weight: 400;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .brand {
    font-weight: 600;
  }

  .question {
    font-size: 2.5rem;
    font-weight: 400;
    color: #333;
    margin-bottom: 1rem;
  }

  .tip {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 3rem;
  }

  .search-container {
    width: 100%;
    max-width: 600px;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .greeting,
    .question {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 480px) {
    .greeting,
    .question {
      font-size: 1.5rem;
    }

    .search-bar {
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .search-input {
      min-width: 200px;
    }
  }
</style>
