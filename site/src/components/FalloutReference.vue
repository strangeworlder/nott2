<script setup lang="ts">
import { falloutScale } from '../data/rules'
import Card from './Card.vue'
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2">
    <Card
      v-for="fallout in falloutScale"
      :key="fallout.level"
      :title="`${fallout.level}. ${fallout.title}`"
      class="h-full"
    >
      <div class="space-y-3">
        <p class="text-nott-red font-display tracking-wider text-sm uppercase border-b border-nott-gray/30 pb-1">
          {{ fallout.description }}
        </p>
        <p class="text-sm leading-relaxed text-nott-white/90">
          {{ fallout.mechanic }}
        </p>
      </div>
    </Card>
  </div>
</template>
