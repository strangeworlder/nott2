<script setup lang="ts">
/**
 * Card
 *
 * Philosophical:
 * The Card is the fundamental unit of containment for distinct game concepts. It mimics
 * the physical metaphor of a card or a dossier, grouping related information (like a
 * character profile, a rule explanation, or a game event) into a single, digestible
 * entity. It separates "figure" from "ground," allowing the user to focus on specific
 * pieces of content one at a time. The optional glow effects add a layer of liveliness
 * and importance, suggesting the card is an active element in the game world.
 *
 * Technical:
 * A flexible container component with optional title, styling variants, and hover effects.
 *
 * Props:
 * - title (string): Optional title displayed at the top of the card.
 * - interactive (boolean): Whether the card shows hover effects. Defaults to true.
 * - variant (string): Visual style ('default', 'muted', 'highlighted', 'success', 'failure', 'instruction', 'ghost'). Defaults to 'default'.
 * - noPadding (boolean): Removes default padding if true. Defaults to false.
 * - center (boolean): Centers the content if true. Defaults to false.
 *
 * Slots:
 * - default: The main content of the card.
 */

import { computed } from 'vue';

interface Props {
  title?: string;
  interactive?: boolean;
  variant?: 'default' | 'muted' | 'highlighted' | 'success' | 'failure' | 'instruction' | 'ghost';
  noPadding?: boolean;
  center?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  interactive: true,
  variant: 'default',
  noPadding: false,
  center: false,
});

const containerClasses = computed(() => {
  const base =
    'relative bg-nott-black border rounded-lg h-full flex flex-col transition-colors duration-300';
  const padding = props.noPadding ? '' : 'p-6';
  const align = props.center ? 'items-center text-center' : '';

  const variants = {
    default: 'border-nott-gray',
    muted: 'border-nott-gray/50 bg-nott-black/50',
    highlighted: 'border-nott-red shadow-[0_0_15px_rgba(220,38,38,0.2)]',
    success: 'border-nott-green/30 bg-green-900/10',
    failure: 'border-nott-red/30 bg-nott-red/5',
    instruction: 'border-nott-white/10 bg-nott-white/5',
    ghost: 'border-transparent bg-transparent',
  };

  return `${base} ${padding} ${align} ${variants[props.variant]}`;
});

const glowClasses = computed(() => {
  const base = 'absolute -inset-0.5 rounded-lg blur opacity-25 transition duration-1000';

  const variants = {
    default: 'bg-gradient-to-r from-nott-red to-nott-gray',
    muted: 'bg-nott-gray hidden',
    highlighted: 'bg-nott-red opacity-50',
    success: 'bg-nott-green',
    failure: 'bg-nott-red',
    instruction: 'bg-nott-white hidden',
    ghost: 'hidden',
  };

  return `${base} ${variants[props.variant]}`;
});

const titleClasses = computed(() => {
  const base = 'text-xl font-display mb-4 border-b pb-2';

  const variants = {
    default: 'text-nott-white border-nott-red/30',
    muted: 'text-nott-white/60 border-nott-gray/30',
    highlighted: 'text-nott-white border-nott-red',
    success: 'text-nott-green border-nott-green/30',
    failure: 'text-nott-red border-nott-red/30',
    instruction: 'text-nott-white border-nott-white/10',
    ghost: 'text-nott-white border-nott-gray/30',
  };

  return `${base} ${variants[props.variant]}`;
});
</script>

<template>
  <div class="relative group">
    <!-- Card Border/Glow -->
    <div 
      :class="[glowClasses, { 'group-hover:opacity-50 group-hover:duration-200': interactive && variant !== 'muted' }]"
    ></div>
    
    <!-- Card Content -->
    <div :class="containerClasses">
      <h3 v-if="title" :class="titleClasses">
        {{ title }}
      </h3>
      <div class="text-nott-white/80 font-body flex-grow">
        <slot />
      </div>
    </div>
  </div>
</template>
