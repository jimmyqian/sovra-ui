<template>
  <footer class="footer">
    <span>©2025 sovra.ai</span>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped>
  .footer {
    text-align: center;
    color: #666;
    font-size: 0.8rem;
    padding: 1rem;
    background: white;
    border-top: 1px solid #e5e5e5;
  }

  @media (max-width: 768px) {
    .footer {
      padding: 0.75rem;
    }
  }
</style>
