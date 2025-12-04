<script setup lang="ts">
/**
 * IngressText
 * 
 * Philosophical:
 * IngressText serves as the narrative bridge into a scene or phase. It is the "flavor text" 
 * that sets the mood, provides diegetic context, or offers a brief quote before the 
 * mechanical interactions begin. It separates the "story" layer from the "game" layer.
 * 
 * Technical:
 * A specialized Text component wrapper for displaying centered, muted quote text.
 * 
 * Slots:
 * - default: The text content to display.
 */

import Text from '../Text.vue';
</script>

<template>
  <Text variant="quote" color="muted" align="center" class="mb-6">
    <slot />
  </Text>
</template>
