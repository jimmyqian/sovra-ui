<template>
  <div class="notification-container">
    <TransitionGroup
      name="notification"
      tag="div"
      class="fixed top-4 right-4 z-50 space-y-2"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
        :class="getNotificationClasses(notification.type)"
        @click="removeNotification(notification.id)"
      >
        <div class="flex items-start gap-3">
          <div class="notification-icon">
            <CheckCircleIcon v-if="notification.type === 'success'" />
            <InformationCircleIcon v-else />
          </div>
          <div class="flex-1 min-w-0">
            <div class="notification-title">
              {{ notification.title }}
            </div>
            <div v-if="notification.message" class="notification-message">
              {{ notification.message }}
            </div>
          </div>
          <button
            class="notification-close"
            @click.stop="removeNotification(notification.id)"
          >
            <span class="sr-only">Close</span>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useNotificationStore } from '@/stores/notifications'
  import type { Notification } from '@/stores/notifications'
  import CheckCircleIcon from '@/components/icons/CheckCircleIcon.vue'
  import InformationCircleIcon from '@/components/icons/InformationCircleIcon.vue'

  const notificationStore = useNotificationStore()
  const notifications = computed(() => notificationStore.notifications)

  const removeNotification = (id: string) => {
    notificationStore.removeNotification(id)
  }

  const getNotificationClasses = (type: Notification['type']) => {
    const baseClasses = 'notification-base'

    switch (type) {
      case 'success':
        return `${baseClasses} notification-success`
      case 'error':
        return `${baseClasses} notification-error`
      case 'warning':
        return `${baseClasses} notification-warning`
      case 'info':
      default:
        return `${baseClasses} notification-info`
    }
  }
</script>

<style scoped>
  .notification-base {
    @apply bg-white border border-border-light rounded-lg shadow-lg p-4 max-w-sm cursor-pointer;
    @apply hover:shadow-xl transition-all duration-200;
  }

  .notification-success {
    @apply border-l-4 border-l-green-500;
  }

  .notification-error {
    @apply border-l-4 border-l-red-500;
  }

  .notification-warning {
    @apply border-l-4 border-l-yellow-500;
  }

  .notification-info {
    @apply border-l-4 border-l-blue-500;
  }

  .notification-icon {
    @apply flex-shrink-0 text-text-secondary;
  }

  .notification-success .notification-icon {
    @apply text-green-500;
  }

  .notification-error .notification-icon {
    @apply text-red-500;
  }

  .notification-warning .notification-icon {
    @apply text-yellow-500;
  }

  .notification-info .notification-icon {
    @apply text-blue-500;
  }

  .notification-title {
    @apply text-sm font-medium text-text-primary;
  }

  .notification-message {
    @apply text-xs text-text-secondary mt-1;
  }

  .notification-close {
    @apply flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors;
  }

  /* Transition animations */
  .notification-enter-active {
    transition: all 0.3s ease-out;
  }

  .notification-leave-active {
    transition: all 0.2s ease-in;
  }

  .notification-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }

  .notification-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }

  .notification-move {
    transition: transform 0.3s ease;
  }
</style>
