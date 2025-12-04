<script setup lang="ts">
/**
 * Badge
 * 
 * Philosophical:
 * Badges are small, high-signal visual indicators used to categorize, label, or 
 * highlight specific attributes of an item. They are designed to be scanned quickly, 
 * providing immediate context without interrupting the flow of reading. In the game's 
 * UI, they often represent status effects, tags, or specific mechanical properties 
 * that need to stand out from body text.
 * 
 * Technical:
 * A small inline-flex component for displaying short labels.
 * 
 * Props:
 * - variant (string): The visual style ('default', 'outline', 'red', 'success', 'danger'). 
 *   Determines the color and border style. Defaults to 'default'.
 * 
 * Slots:
 * - default: The content of the badge (usually text).
 */

interface Props {
  variant?: 'default' | 'outline' | 'red' | 'success' | 'danger'
}

withDefaults(defineProps<Props>(), {
  variant: 'default'
})
</script>

<template>
  <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-display uppercase tracking-widest"
    :class="{
      'bg-nott-white/10 text-nott-white/60': variant === 'default',
      'border border-nott-white/30 text-nott-white/60': variant === 'outline',
      'bg-nott-red/10 text-nott-red border border-nott-red/30': variant === 'red' || variant === 'danger',
      'bg-nott-green/10 text-nott-green border border-nott-green/30': variant === 'success'
    }"
  >
    <slot />
  </span>
</template>
