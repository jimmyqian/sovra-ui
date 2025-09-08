<template>
  <div class="search-section">
    <div class="user-avatar">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle
          cx="12"
          cy="7"
          r="4"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <div class="search-content">
      <div class="search-query">{{ searchQuery }}</div>

      <div class="ai-response">
        <div class="ai-avatar">
          <div class="ai-icon"></div>
        </div>
        <div class="response-content">
          <p>
            <strong>Fantastic!</strong> 56 persons were found in the results.
            Please provide additional information about the person you're
            looking for.
          </p>
          <p>
            Alternatively, you can use the hints below for finding the person
            you're looking for.
          </p>

          <div class="suggestions">
            <p class="suggestion-item">
              What specific software role does Johnson hold in his California
            </p>
            <p class="suggestion-item">
              Which California tech hubs are most likely where Johnson works
            </p>
            <p class="suggestion-item">
              What skills Johnson is from his current software role
            </p>
          </div>

          <p>
            Or include further information, such as any documents you may have
            about him, web links, pictures, or videos; if so, submit them by
            using the upload option.
          </p>

          <button class="filter-btn">
            construct a filter string using the details that you provided
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    searchQuery: string
  }

  defineProps<Props>()
</script>

<style scoped>
  .search-section {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    background: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .search-query {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    font-weight: 500;
  }

  .ai-response {
    display: flex;
    gap: 1rem;
  }

  .ai-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ai-icon {
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
  }

  .response-content {
    flex: 1;
  }

  .response-content p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  .suggestions {
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  .suggestion-item {
    color: #ff6b35;
    margin-bottom: 0.5rem;
    cursor: pointer;
  }

  .filter-btn {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    cursor: pointer;
  }
</style>
