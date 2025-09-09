<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 17 17" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.63346 10.8076V5.37428L5.90013 7.10762L4.9668 6.14095L8.30013 2.80762L11.6335 6.14095L10.7001 7.10762L8.9668 5.37428V10.8076H7.63346ZM4.30013 13.4743C3.93346 13.4743 3.61957 13.3437 3.35846 13.0826C3.09735 12.8215 2.9668 12.5076 2.9668 12.141V10.141H4.30013V12.141H12.3001V10.141H13.6335V12.141C13.6335 12.5076 13.5029 12.8215 13.2418 13.0826C12.9807 13.3437 12.6668 13.4743 12.3001 13.4743H4.30013Z"
      fill="currentColor"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
  strokeWidth?: number
}

withDefaults(defineProps<Props>(), {
  size: 20,
  strokeWidth: 2
})
</script>