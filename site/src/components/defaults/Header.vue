<script setup lang="ts">
/**
 * Header
 *
 * Philosophical:
 * The Header is the masthead of the experience. It establishes the game's identity
 * immediately upon loading. Its consistent presence (or deliberate absence) grounds
 * the user in the "Night of the Thirteenth" universe. The pulsing text shadow adds
 * a subtle, eerie life to the title, hinting at the supernatural themes.
 *
 * Technical:
 * A layout component displaying the game title and optional subtitle/content.
 *
 * Slots:
 * - default: Optional content to display below the main title.
 */

import { getHeaderContent } from '../../utils/contentLoader';

const content = getHeaderContent();
</script>

<template>
  <header class="mx-auto mb-12 text-center">
    <h1 class="text-5xl md:text-7xl font-display text-nott-red mb-2 tracking-tighter animate-pulse-slow text-shadow-glow">
      {{ content.title }}
    </h1>
    <slot />
  </header>
</template>
