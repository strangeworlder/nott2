<script setup lang="ts">
/**
 * Navigation
 * 
 * Philosophical:
 * The Navigation component acts as the compass for the user, holding the available 
 * paths (NavButtons) they can traverse. It groups these options centrally, offering 
 * a clear menu of potential destinations without cluttering the main stage.
 * 
 * Technical:
 * A flex container component for grouping NavButton components.
 * 
 * Slots:
 * - default: The navigation items (NavButtons).
 */
</script>

<template>
  <nav class="flex justify-center gap-4 mt-8 flex-wrap">
    <slot />
  </nav>
</template>
