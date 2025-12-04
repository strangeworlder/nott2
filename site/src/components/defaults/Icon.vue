<script setup lang="ts">
/**
 * Icon
 * 
 * Philosophical:
 * Icons serve as visual shorthand, reducing cognitive load by replacing text with 
 * universally (or contextually) recognized symbols. They allow for denser information 
 * display and quicker scanning. In this text-heavy game, icons provide necessary 
 * visual relief and immediate semantic cues.
 * 
 * Technical:
 * A wrapper component for rendering SVG icons.
 * 
 * Props:
 * - name (string): The name of the icon to render ('clock', 'users', 'supplies').
 * - size (number | string): The size of the icon in pixels. Defaults to 24.
 * - color (string): The color of the icon ('white', 'red', 'muted', 'success').
 */

import { computed } from 'vue'

const props = defineProps<{
  name: 'clock' | 'users' | 'supplies' | 'Spades' | 'Hearts' | 'Clubs' | 'Diamonds'
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

    <!-- Suits -->
    <template v-else-if="name === 'Spades'">
      <path d="M12 22s5-3 5-8a5 5 0 0 0-10 0c0 5 5 8 5 8z" fill="currentColor"></path>
      <path d="M12 22v-4" stroke="currentColor"></path>
    </template>

    <template v-else-if="name === 'Hearts'">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" stroke="none"></path>
    </template>

    <template v-else-if="name === 'Clubs'">
      <path d="M12 2C9 2 7 4 7 6c0 1.5 1 2.5 2 3-2 0-3 2-3 4 0 3 3 4 6 4s6-1 6-4c0-2-1-4-3-4 1-.5 2-1.5 2-3 0-2-2-4-5-4z" fill="currentColor"></path>
      <path d="M12 17v5" stroke="currentColor"></path>
    </template>

    <template v-else-if="name === 'Diamonds'">
      <path d="M12 2l-8 10 8 10 8-10z" fill="currentColor" stroke="none"></path>
    </template>
  </svg>
</template>
