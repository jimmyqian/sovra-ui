<template>
  <div class="landing">
    <div class="container">
      <!-- Logo -->
      <div class="logo-section">
        <div class="logo">
          <div class="logo-icon"></div>
          <span class="logo-text">SOVRa</span>
        </div>
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
          <div class="search-bar">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="enter keyword of the person you want to know or explain the person you are looking for....."
              class="search-input"
              @keypress.enter="handleSearch"
            />
            <div class="search-actions">
              <button class="upload-btn" @click="triggerFileUpload">
                <span>Upload</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button class="voice-btn">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </button>
              <button class="submit-btn" @click="handleSearch">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <input
            ref="fileInput"
            type="file"
            style="display: none"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            @change="handleFileUpload"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <span>©2025 sovra.ai</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const searchQuery = ref('')
  const fileInput = ref<HTMLInputElement>()

  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      router.push({
        path: '/search',
        query: { q: searchQuery.value }
      })
    }
  }

  const triggerFileUpload = () => {
    fileInput.value?.click()
  }

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      console.log('Files uploaded:', target.files)
    }
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

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    position: relative;
  }

  .logo-icon::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border: 2px solid white;
    border-radius: 50%;
  }

  .logo-text {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
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

  .search-bar {
    background: white;
    border: 2px solid;
    border-image: linear-gradient(135deg, #4285f4, #ff6b35) 1;
    border-radius: 24px;
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 1rem;
    color: #333;
  }

  .search-input::placeholder {
    color: #999;
  }

  .search-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .upload-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: 1px solid #ff6b35;
    color: #ff6b35;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .upload-btn:hover {
    background: #ff6b35;
    color: white;
  }

  .voice-btn,
  .submit-btn {
    background: none;
    border: none;
    padding: 0.5rem;
    color: #666;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .submit-btn {
    background: #ff6b35;
    color: white;
  }

  .voice-btn:hover,
  .submit-btn:hover {
    transform: scale(1.1);
  }

  .footer {
    text-align: center;
    color: #666;
    font-size: 0.8rem;
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .greeting,
    .question {
      font-size: 1.8rem;
    }

    .search-bar {
      padding: 0.6rem 1rem;
    }

    .upload-btn span {
      display: none;
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
