<script setup lang="ts">
/**
 * List
 *
 * Philosophical:
 * The List imposes order on chaos. It groups related items—rules, inventory, options—into
 * a coherent structure. Whether ordered (sequential steps) or unordered (collections),
 * it allows the user to parse multiple distinct pieces of information as a single unit.
 *
 * Technical:
 * A flexible list container component supporting various styles and spacing.
 *
 * Props:
 * - as (string): The HTML tag to render ('ul', 'ol'). Defaults to 'ul'.
 * - variant (string): Visual style ('disc', 'decimal', 'none').
 * - color (string): Text color ('muted', 'white', 'red'). Defaults to 'muted'.
 * - spacing (string): Vertical spacing between items ('sm', 'md', 'lg'). Defaults to 'sm'.
 * - inside (boolean): Whether list markers are inside the content flow. Defaults to true.
 *
 * Slots:
 * - default: The list items (usually ListItem components).
 */

import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    as?: 'ul' | 'ol';
    variant?: 'disc' | 'decimal' | 'none';
    color?: 'muted' | 'white' | 'red';
    spacing?: 'sm' | 'md' | 'lg';
    inside?: boolean;
  }>(),
  {
    as: 'ul',
    color: 'muted',
    spacing: 'sm',
    inside: true,
  }
);

const classes = computed(() => {
  const base = [props.inside ? 'list-inside' : 'list-outside'];

  // Variant
  if (props.variant) {
    base.push(`list-${props.variant}`);
  } else {
    base.push(props.as === 'ol' ? 'list-decimal' : 'list-disc');
  }

  // Color
  switch (props.color) {
    case 'white':
      base.push('text-nott-white');
      break;
    case 'red':
      base.push('text-nott-red');
      break;
    default:
      base.push('text-nott-white/80');
      break;
  }

  // Spacing
  switch (props.spacing) {
    case 'md':
      base.push('space-y-2');
      break;
    case 'lg':
      base.push('space-y-4');
      break;
    default:
      base.push('space-y-1');
      break;
  }

  return base.join(' ');
});
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
