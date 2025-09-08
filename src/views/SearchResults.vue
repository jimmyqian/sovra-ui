<template>
  <div class="search-results">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <div class="logo-icon"></div>
        <span class="logo-text">SOVRa</span>
      </div>
    </header>

    <div class="main-container">
      <!-- Left Panel: Search & Conversation -->
      <div class="left-panel">
        <div class="search-section">
          <div class="user-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <div class="search-content">
            <div class="search-query">{{ searchQuery }}</div>
            
            <div class="ai-response">
              <div class="ai-avatar">
                <div class="ai-icon"></div>
              </div>
              <div class="response-content">
                <p><strong>Fantastic!</strong> 56 persons were found in the results. Please provide additional information about the person you're looking for.</p>
                <p>Alternatively, you can use the hints below for finding the person you're looking for.</p>
                
                <div class="suggestions">
                  <p class="suggestion-item">What specific software role does Johnson hold in his California</p>
                  <p class="suggestion-item">Which California tech hubs are most likely where Johnson works</p>
                  <p class="suggestion-item">What skills Johnson is from his current software role</p>
                </div>
                
                <p>Or include further information, such as any documents you may have about him, web links, pictures, or videos; if so, submit them by using the upload option.</p>
                
                <button class="filter-btn">construct a filter string using the details that you provided</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Input -->
        <div class="search-input-container">
          <div class="search-bar">
            <input
              v-model="newQuery"
              type="text"
              placeholder="Johnson, who is around 26 years old, works in a software company in California"
              class="search-input"
              @keypress.enter="handleSearch"
            />
            <div class="search-actions">
              <button class="upload-btn" @click="triggerFileUpload">
                <span>Upload</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="voice-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              <button class="submit-btn" @click="handleSearch">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <input 
            ref="fileInput"
            type="file" 
            @change="handleFileUpload" 
            style="display: none"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
          />
        </div>

        <!-- Sidebar Navigation -->
        <div class="sidebar">
          <div class="sidebar-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="sidebar-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12h16M4 6h16M4 18h16" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="sidebar-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="sidebar-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="sidebar-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Right Panel: Results -->
      <div class="right-panel">
        <div class="results-header">
          <div class="results-info">
            <span class="results-count">Results ({{ results.length }})</span>
            <div class="filter-tags">
              <span class="filter-tag">Johnson <button class="remove-tag">×</button></span>
              <span class="filter-tag">who <button class="remove-tag">×</button></span>
              <span class="filter-tag">is around <span class="dropdown">26 ▼</span></span>
              <span class="filter-tag">years old, <span class="dropdown">Works ▼</span></span>
              <span class="filter-tag">in a <span class="dropdown">Software ▼</span></span>
              <span class="filter-tag">company in <span class="dropdown">California ▼</span></span>
              <button class="edit-btn">edit ✏️</button>
              <button class="create-criteria-btn">🔍 Create more criteria</button>
            </div>
          </div>
        </div>

        <div class="results-list">
          <div 
            v-for="result in results" 
            :key="result.id"
            class="result-item"
          >
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
                  <div class="rating-fill" :style="{ width: (result.rating / 5) * 100 + '%' }"></div>
                </div>
                <span class="rating-value">{{ result.rating }}</span>
              </div>
            </div>
            <div class="result-stats">
              <div class="stat">
                <span class="stat-number">{{ result.references }}</span>
                <span class="stat-label">References<br>across Web</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ result.companies }}</span>
                <span class="stat-label">companies<br>associated with</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ result.contacts }}</span>
                <span class="stat-label">Contacts<br>available</span>
              </div>
            </div>
          </div>
        </div>

        <div class="load-more">
          <button class="load-more-btn">Load More Results</button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <span>©2025 sovra.ai</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

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
const newQuery = ref('Johnson, who is around 26 years old, works in a software company in California')
const fileInput = ref<HTMLInputElement>()

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

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    console.log('Files uploaded:', target.files)
  }
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

.header {
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e5e5;
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

.search-input-container {
  padding: 1rem 2rem;
  border-top: 1px solid #e5e5e5;
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

.sidebar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 60px;
  background: #fff;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  gap: 1rem;
}

.sidebar-item {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.sidebar-item.active {
  background: #ff6b35;
  color: white;
}

.sidebar-item:hover {
  background: #f0f0f0;
}

.sidebar-item.active:hover {
  background: #ff6b35;
}

.right-panel {
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

.footer {
  text-align: center;
  color: #666;
  font-size: 0.8rem;
  padding: 1rem;
  background: white;
  border-top: 1px solid #e5e5e5;
}

@media (max-width: 1024px) {
  .main-container {
    flex-direction: column;
  }
  
  .left-panel,
  .right-panel {
    width: 100%;
  }
  
  .left-panel {
    height: 50vh;
  }
  
  .right-panel {
    height: 50vh;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }
  
  .search-section {
    padding: 1rem;
  }
  
  .search-input-container {
    padding: 1rem;
  }
  
  .results-list {
    padding: 1rem;
  }
  
  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .result-stats {
    gap: 1rem;
  }
  
  .upload-btn span {
    display: none;
  }
  
  .sidebar {
    display: none;
  }
}
</style>