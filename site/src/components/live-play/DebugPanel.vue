<script setup lang="ts">
/**
 * DebugPanel.vue
 *
 * Philosophical:
 * The DebugPanel is the omnipresent observer, revealing the hidden machinations
 * of the game state to the developer-gods. It provides transparency into cards,
 * points, and phase transitions that are normally veiled from the player.
 *
 * Technical:
 * Displays all critical game state variables including deck stacks, tracking lists,
 * and numeric scores. Toggled via the debug button in LivePlayHelper.
 *
 * Props:
 * (None - uses useLivePlay directly)
 */

import { computed } from 'vue';
import { useLivePlay } from '../../composables/useLivePlay';

const {
  currentPhase,
  middleStack,
  bottomStack,
  reserveQueue,
  trophyPile,
  weaknessesFound,
  strikes,
  getRankName,
  tableGenrePoints,
  playerGenrePoints,
  unknownThreatCards,
  unknownBottomStack,
  identifiedCards,
  knownBottomStackCards,
  drawnCards,
  faceCardReserves,
  removedFaceCards,
} = useLivePlay();

const activeKnownThreats = computed(() => {
  const active: string[] = [];
  identifiedCards.value.forEach((id) => {
    if (!drawnCards.value.has(id) && !knownBottomStackCards.value.has(id)) {
      active.push(id);
    }
  });
  return active.sort();
});
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 bg-black/90 text-xs text-nott-green p-2 font-mono border-t border-nott-green/30 overflow-x-auto z-50">
    <div class="flex gap-8 whitespace-nowrap">
      <div>
        <strong class="text-white">Phase:</strong> {{ currentPhase }}
      </div>
      <div>
        <strong class="text-white">Reserves:</strong> J:{{ faceCardReserves[11] }} Q:{{ faceCardReserves[12] }} K:{{ faceCardReserves[13] }}
      </div>
      <div>
        <strong class="text-white">Graveyard:</strong> J:{{ removedFaceCards[11] }} Q:{{ removedFaceCards[12] }} K:{{ removedFaceCards[13] }}
      </div>
      <div>
        <strong class="text-white">Known Threat (Middle) ({{ Object.values(middleStack).reduce((a, b) => a + b, 0) }}):</strong>
        <span v-for="(count, rank) in middleStack" :key="rank" class="ml-2">
          {{ rank }}:{{ count }}
        </span>
      </div>
      <div>
        <strong class="text-white">Known Bottom ({{ Object.values(bottomStack).reduce((a, b) => a + b, 0) }}):</strong>
        <span v-for="(count, rank) in bottomStack" :key="rank" class="ml-2">
          <span v-if="count > 0">{{ rank }}:{{ count }}</span>
        </span>
      </div>
      <div>
        <strong class="text-white">Unknown Threat ({{ Object.values(unknownThreatCards).reduce((a, b) => a + b, 0) }}):</strong>
        <span v-for="(count, rank) in unknownThreatCards" :key="`ut-${rank}`" class="ml-2">
          <span v-if="count > 0">{{ rank }}:{{ count }}</span>
        </span>
      </div>
      <div>
        <strong class="text-white">Unknown Bottom ({{ Object.values(unknownBottomStack).reduce((a, b) => a + b, 0) }}):</strong>
        <span v-for="(count, rank) in unknownBottomStack" :key="`ub-${rank}`" class="ml-2">
          <span v-if="count > 0">{{ rank }}:{{ count }}</span>
        </span>
      </div>
      <div>
        <strong class="text-white">Active Identified ({{ activeKnownThreats.length }}):</strong>
        <span v-for="cardId in activeKnownThreats" :key="cardId" class="ml-1 text-xs">
          {{ cardId }}
        </span>
      </div>
      <div>
        <strong class="text-white">Identified (Total) ({{ identifiedCards.size }}):</strong>
        <span v-for="cardId in identifiedCards" :key="cardId" class="ml-1 text-xs text-gray-500">
          {{ cardId }}
        </span>
      </div>
      <div>
        <strong class="text-white">Known Bottom IDs ({{ knownBottomStackCards.size }}):</strong>
        <span v-for="cardId in knownBottomStackCards" :key="cardId" class="ml-1 text-xs">
          {{ cardId }}
        </span>
      </div>
      <div>
        <strong class="text-white">Reserve Queue ({{ reserveQueue.length }}):</strong>
        {{ reserveQueue.join(', ') }}
      </div>
      <div>
        <strong class="text-white">Trophy Pile ({{ trophyPile.length }}):</strong>
        <span v-for="card in trophyPile" :key="card.id" class="ml-1">
          {{ getRankName(card.rank) }}{{ card.suit[0] }}
        </span>
      </div>
      <div>
        <strong class="text-white">Weaknesses:</strong>
        {{ weaknessesFound.join(', ') }}
      </div>
      <div>
        <strong class="text-white">Strikes:</strong> {{ strikes }}
      </div>
      <div>
        <strong class="text-white">Table GP:</strong> {{ tableGenrePoints }}
      </div>
      <div>
        <strong class="text-white">Player GP:</strong> {{ playerGenrePoints }}
      </div>
    </div>
  </div>
</template>
