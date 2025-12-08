<script setup lang="ts">
/**
 * LivePlayHeader
 *
 * Philosophical:
 * The Live Play Header is the HUD (Heads-Up Display) for the ongoing narrative. It anchors
 * the player in the current moment (Act, Phase) and provides immediate access to critical
 * game state information (Current Threat, Trophy Pile). It is the dashboard from which
 * the player navigates the chaos.
 *
 * Technical:
 * Displays the current Act, Phase, Reset button, and context-sensitive game state info.
 *
 * Props:
 * - currentAct (number): The current Act number.
 * - currentPhase (string): The current Phase identifier.
 * - trophyTop (Card | null): The top card of the trophy pile.
 * - isTrophyTopRandomized (boolean): Whether the trophy pile top is unknown.
 * - cardName (string): The name of the active card.
 * - activeCard (Card | null): The currently active card.
 * - selectedJoker ('Red' | 'Black' | null): The currently selected Joker.
 * - fullReset (function): Function to reset the game state.
 */

import { computed } from 'vue';
import { getLivePlayHeaderContent } from '../../utils/contentLoader';
import Button from '../Button.vue';
import CurrentThreat from '../CurrentThreat.vue';
import Text from '../Text.vue';
import TrophyPileTop from '../TrophyPileTop.vue';
import Separator from './Separator.vue';

interface Card {
  suit: string;
  rank: number;
}

interface Props {
  currentAct: number;
  currentPhase: string;
  trophyTop?: Card | null;
  isTrophyTopRandomized?: boolean;
  cardName?: string;
  activeCard?: Card | null;
  selectedJoker?: 'Red' | 'Black' | null;
  act3Countdown?: number;
  acesRemaining?: number;
  fullReset: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  trophyTop: null,
  isTrophyTopRandomized: false,
  cardName: '',
  activeCard: null,
  selectedJoker: null,
});

const content = getLivePlayHeaderContent();

const act3CountdownText = computed(() => {
  return content.act3CountdownLabel.replace('{count}', (props.act3Countdown ?? 0).toString());
});

const phaseName = computed(() => {
  switch (props.currentPhase) {
    case 'game-setup':
      return 'Game Setup';
    case 'scene-setup':
      return 'Scene Setup';
    case 'conversation-stakes':
      return 'The Conversation & Setting The Stakes';
    case 'resolution':
      return 'Resolution';
    case 'resolve-scene':
      return 'Narrate The Results';
    case 'fallout':
      return 'Deck Management';
    case 'trophy-setup':
      return 'Trophy Pile Setup';
    case 'win':
      return 'Victory';
    default:
      return '';
  }
});

const showContext = computed(() => {
  return ['conversation-stakes', 'resolution', 'resolve-scene', 'fallout'].includes(
    props.currentPhase
  );
});
</script>

<template>
  <div class="w-full mb-8 animate-fade-in border-b border-nott-red/30 pb-4">
    <!-- Top Bar: Act & Reset -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-4">
        <Text variant="caption" color="red" class="uppercase tracking-widest">
          <strong>Act {{ currentAct }}</strong>
        </Text>
        <Separator orientation="vertical" class="h-4 mx-0" />
        <Text variant="caption" color="muted" class="uppercase tracking-wider">
          {{ phaseName }}
        </Text>
        <template v-if="act3Countdown !== undefined && acesRemaining === 0 && currentAct < 3">
          <Separator orientation="vertical" class="h-4 mx-0" />
          <Text variant="caption" color="muted" class="uppercase tracking-wider">
            {{ act3CountdownText }}
          </Text>
        </template>
      </div>
      <Button variant="ghost" @click="fullReset" class="text-xs px-2 py-1 h-auto text-nott-gray hover:text-nott-red">
        {{ content.resetButton }}
      </Button>
    </div>

    <!-- Context Bar (Active Card & Difficulty) -->
    <div v-if="showContext" class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      
      <!-- Active Card Info -->
      <CurrentThreat 
        :active-card="activeCard" 
        :selected-joker="selectedJoker" 
        :card-name="cardName" 
      />

      <!-- Difficulty Info -->
      <TrophyPileTop 
        :trophy-top="trophyTop" 
        :is-randomized="isTrophyTopRandomized" 
      />

    </div>
  </div>
</template>
