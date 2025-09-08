<template>
  <div class="sidebar">
    <div class="sidebar-item active">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
        <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" />
      </svg>
    </div>
    <div class="sidebar-item">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 12h16M4 6h16M4 18h16"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    </div>
    <div class="sidebar-item">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    </div>
    <div class="sidebar-item">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
        <path
          d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    </div>
    <div class="sidebar-item">
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
        />
        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
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

  @media (max-width: 768px) {
    .sidebar {
      display: none;
    }
  }
</style>
