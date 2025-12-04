<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: 'clock' | 'users' | 'supplies'
  size?: number | string
  color?: 'white' | 'red' | 'muted' | 'success'
}>()

const iconSize = computed(() => props.size || 24)

const classes = computed(() => {
  const base = ['inline-block']
  if (props.color === 'white') base.push('text-nott-white')
  if (props.color === 'red') base.push('text-nott-red')
  if (props.color === 'muted') base.push('text-nott-white/60')
  if (props.color === 'success') base.push('text-nott-green')
  return base.join(' ')
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="iconSize"
    :height="iconSize"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="classes"
  >
    <!-- Clock -->
    <template v-if="name === 'clock'">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </template>

    <!-- Users -->
    <template v-else-if="name === 'users'">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </template>

    <!-- Supplies (Grid) -->
    <template v-else-if="name === 'supplies'">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
      <line x1="7" y1="2" x2="7" y2="22"></line>
      <line x1="17" y1="2" x2="17" y2="22"></line>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <line x1="2" y1="7" x2="7" y2="7"></line>
      <line x1="2" y1="17" x2="7" y2="17"></line>
      <line x1="17" y1="17" x2="22" y2="17"></line>
      <line x1="17" y1="7" x2="22" y2="7"></line>
    </template>
  </svg>
</template>
