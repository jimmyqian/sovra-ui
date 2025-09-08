<template>
  <div class="logo">
    <div class="logo-icon"></div>
    <span class="logo-text">SOVRa</span>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
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
</style>
