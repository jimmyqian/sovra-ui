<template>
  <div class="result-item">
    <div class="result-avatar"></div>
    <div class="result-info">
      <h3 class="result-name">{{ result.name }}</h3>
      <div class="result-details">
        <span class="age">{{ result.age }} Years</span>
        <span class="gender">{{ result.gender }}</span>
        <span class="status">{{ result.maritalStatus }}</span>
        <span class="location">{{ result.location }}</span>
      </div>
      <div class="rating-bar">
        <span class="rating-label">Sovra Rating</span>
        <div class="rating-progress">
          <div
            class="rating-fill"
            :style="{ width: (result.rating / 5) * 100 + '%' }"
          ></div>
        </div>
        <span class="rating-value">{{ result.rating }}</span>
      </div>
    </div>
    <div class="result-stats">
      <div class="stat">
        <span class="stat-number">{{ result.references }}</span>
        <span class="stat-label">References<br />across Web</span>
      </div>
      <div class="stat">
        <span class="stat-number">{{ result.companies }}</span>
        <span class="stat-label">companies<br />associated with</span>
      </div>
      <div class="stat">
        <span class="stat-number">{{ result.contacts }}</span>
        <span class="stat-label">Contacts<br />available</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
    result: SearchResult
  }

  defineProps<Props>()
</script>

<style scoped>
  .result-item {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .result-avatar {
    width: 60px;
    height: 60px;
    background: #e9ecef;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .result-info {
    flex: 1;
  }

  .result-name {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .result-details {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: #666;
  }

  .rating-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .rating-label {
    font-size: 0.85rem;
    color: #666;
  }

  .rating-progress {
    width: 100px;
    height: 4px;
    background: #e9ecef;
    border-radius: 2px;
    overflow: hidden;
  }

  .rating-fill {
    height: 100%;
    background: #ff6b35;
    transition: width 0.3s;
  }

  .rating-value {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .result-stats {
    display: flex;
    gap: 2rem;
  }

  .stat {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #666;
    line-height: 1.2;
  }

  @media (max-width: 768px) {
    .result-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .result-stats {
      gap: 1rem;
    }
  }
</style>
