<script setup lang="ts">
/**
 * FalloutReference
 *
 * Philosophical:
 * FalloutReference displays the Effort Scale—the price of survival. Every push
 * of effort carries a narrative cost, escalating from controlled composure to
 * a fatal Breaking Point.
 *
 * Technical:
 * Renders a 2-column grid of Cards for the 4 Effort Scale levels loaded via
 * contentLoader.
 *
 * Props:
 * (None - uses useLivePlay and contentLoader directly)
 */

import { computed } from 'vue';
import { useLivePlay } from '../../composables/useLivePlay';
import { getRulesContent } from '../../utils/contentLoader';
import Card from '../Card.vue';
import Text from '../Text.vue';

const { selectedPlayset } = useLivePlay();
const effortScale = computed(() => getRulesContent(selectedPlayset.value).effortScale);
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2">
    <Card
      v-for="effort in effortScale"
      :key="effort.level"
      :title="`${effort.level}. ${effort.title}`"
      class="h-full"
    >
      <div class="space-y-3">
        <Text variant="label" color="red" border="bottom">
          {{ effort.description }}
        </Text>
        <Text variant="body" color="white">
          {{ effort.mechanic }}
        </Text>
      </div>
    </Card>
  </div>
</template>
