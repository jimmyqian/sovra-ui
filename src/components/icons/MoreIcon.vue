<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 17 17" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M8.49967 15.2806C12.1663 15.2806 15.1663 12.2806 15.1663 8.61393C15.1663 4.94727 12.1663 1.94727 8.49967 1.94727C4.83301 1.94727 1.83301 4.94727 1.83301 8.61393C1.83301 12.2806 4.83301 15.2806 8.49967 15.2806Z" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <path 
      d="M11.1646 8.61361H11.1706" 
      :stroke="color" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <path 
      d="M8.49666 8.61361H8.50265" 
      :stroke="color" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <path 
      d="M5.82967 8.61361H5.83566" 
      :stroke="color" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
  color?: string
  strokeWidth?: number
}

withDefaults(defineProps<Props>(), {
  size: 20,
  color: 'currentColor',
  strokeWidth: 1.5
})
</script>