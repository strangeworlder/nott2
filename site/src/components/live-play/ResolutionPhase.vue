<script setup lang="ts">
/**
 * ResolutionPhase
 *
 * Philosophical:
 * The Resolution Phase is the crucible—where dice are rolled and fate is decided.
 * It distills the preceding narrative tension into cold, mechanical numbers. The
 * interface must balance the gravity of this moment (success vs. failure, life vs.
 * death) with clarity of information. Every element here—the difficulty display,
 * the dice input, the result card—works together to create a climactic reveal.
 *
 * Technical:
 * A phase component for rolling dice and determining the outcome of a scene.
 * Displays target difficulty, dice selectors, and the final result.
 *
 * Props:
 * (None - uses useLivePlay composable directly)
 *
 * Events:
 * - back: Emitted when the user wants to return to the previous phase.
 * - next: Emitted when the user proceeds to the next phase.
 */

import { computed, onMounted } from 'vue';
import { useLivePlay } from '../../composables/useLivePlay';
import { getResolutionPhaseContent } from '../../utils/contentLoader';
import ActionFooter from '../ActionFooter.vue';
import Card from '../Card.vue';
import DieSelector from '../DieSelector.vue';
import IngressText from '../IngressText.vue';
import SelectionButton from '../SelectionButton.vue';
import Text from '../Text.vue';
import Toggle from '../Toggle.vue';

const {
  rollMain,
  rollEffort,
  isFaceCard,
  selectedJoker,
  targetDifficulty,
  isSuccess,
  rollTotal,
  selectedRank,
  effortResult,
  isTrophyTopRandomized,
  availableTrophyRanks,
  trophyTop,
  setTrophyTop,
  playerGenrePoints,
  isGenrePointUsed,
  toggleGenrePointUsage,
  selectedPlayset,
  characters,
  selectedSuit,
} = useLivePlay();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'next'): void;
}>();

const content = computed(() => getResolutionPhaseContent(selectedPlayset.value));

onMounted(() => {
  // Reset dice when entering this phase
  rollMain.value = null;
  rollEffort.value = null;
  rollEffort.value = null;
});

const isAptitudeUnavailableDueToJoker = computed(() => !!selectedJoker.value);

const isAptitudeAvailable = computed(() => {
  // No aptitude advantage against a Joker
  if (selectedJoker.value) return false;
  if (!selectedSuit.value) return true;
  const char = characters.value.find((c) => c.id === selectedSuit.value);
  return char ? !char.isDead : true;
});

const aptitudeDeadText = computed(() => {
  return content.value.reminders.aptitude.deadMessage.replace('{suit}', selectedSuit.value || '');
});

const needsTrophySelection = computed(() => {
  // Only applies for face cards/jokers when the trophy top is randomized
  if (!isFaceCard.value && !selectedJoker.value) return false;
  if (!isTrophyTopRandomized.value) return false;
  if (availableTrophyRanks.value.length <= 1) return false;
  // Trophy selection needed if no rank is selected yet
  return !trophyTop.value?.rank;
});
</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in">
    <IngressText v-html="content.intro" />

    <div class="max-w-2xl mx-auto space-y-8 mb-12">
      
        <div v-if="isFaceCard || selectedJoker" class="space-y-4 animate-fade-in">
          <Text variant="label" align="center">{{ content.targetDifficulty.title }}</Text>
          
          <div class="flex justify-center items-center gap-4">
             <!-- Base Difficulty -->
             <div class="text-center">
                <Text variant="caption" color="muted">{{ content.targetDifficulty.base }}</Text>
                
                <!-- If randomized, show button list -->
                <div v-if="isTrophyTopRandomized && availableTrophyRanks.length > 1" class="flex flex-col items-center gap-2">
                     <div class="flex flex-wrap justify-center gap-1 max-w-[200px]">
                       <SelectionButton 
                         v-for="rank in availableTrophyRanks" 
                         :key="rank"
                         @click="setTrophyTop(rank)"
                         :selected="trophyTop?.rank === rank"
                         variant="square"
                         size="sm"
                       >
                         {{ rank }}
                       </SelectionButton>
                   </div>
                </div>
                 <!-- Else show static number -->
                <div v-else>
                  <Text variant="h2" color="white" leading="none">{{ trophyTop?.rank || 10 }}</Text>
                </div>
             </div>

             <Text variant="h3" color="red" class="font-bold">+</Text>
             
             <!-- Modifier -->
             <div class="text-center">
                <Text variant="caption" color="muted">{{ content.targetDifficulty.mod }}</Text>
                <Text variant="h2" color="white" leading="none">{{ (targetDifficulty || 0) - (trophyTop?.rank || 0) }}</Text>
             </div>
             
             <Text variant="h3" color="red" class="font-bold">=</Text>
             
             <!-- Total -->
             <div class="text-center">
                <Text variant="caption" color="muted">{{ content.targetDifficulty.total }}</Text>
                <Text variant="h1" color="red" class="font-bold" leading="none">{{ targetDifficulty }}</Text>
             </div>
          </div>
          
          <Text variant="caption" color="muted" class="text-center">{{ content.targetDifficulty.explanation }}</Text>
        </div>

        <!-- Target Difficulty (Number Cards) -->
        <div v-else class="space-y-4 animate-fade-in">
           <div class="flex flex-col items-center justify-center gap-2">
              <Text variant="label" align="center">{{ content.targetDifficulty.numberCardTitle }}</Text>
              <Text variant="h1" color="red" class="font-bold" leading="none">{{ selectedRank }}</Text>
              <Text variant="caption" color="muted">{{ content.targetDifficulty.numberCardExplanation }}</Text>
           </div>
        </div>

      <!-- Dice Blocked Message -->
      <div v-if="needsTrophySelection" class="text-center p-4 border border-nott-red/50 rounded bg-nott-red/10 animate-fade-in">
        <Text variant="label" color="red" class="mb-2">Identify Trophy Card First</Text>
        <Text variant="caption" color="muted">Select the card on top of the Trophy Pile above before entering dice results.</Text>
      </div>

      <div 
        class="grid md:grid-cols-2 gap-8 transition-opacity duration-300"
        :class="needsTrophySelection ? 'opacity-30 pointer-events-none' : ''"
      >
        <!-- d10 Input -->
        <DieSelector 
          :sides="10"
          v-model="rollMain"
          :label="content.dice.main"
        />

        <!-- d4 Input -->
        <DieSelector 
          :sides="4"
          v-model="rollEffort"
          :label="content.dice.effort"
          color="red"
        />
      </div>

        <!-- Reminders -->
        <div class="grid grid-cols-2 gap-4">
          <Card class="text-center flex flex-col items-center justify-center gap-2">
            <Text variant="label" color="red" class="mb-1">{{ content.reminders.genrePoint.title }}</Text>
            <div v-if="playerGenrePoints > 0 || isGenrePointUsed">
                <Toggle 
                    :model-value="isGenrePointUsed"
                    @update:model-value="toggleGenrePointUsage"
                    :label-on="content.reminders.genrePoint.labelOn"
                    :label-off="content.reminders.genrePoint.labelOff"
                    variant="switch"
                />
                <Text variant="caption" color="muted" class="mt-1">{{ content.reminders.genrePoint.countLabel }}{{ playerGenrePoints }}</Text>
            </div>
            <div v-else>
                <Text variant="caption" color="muted">{{ content.reminders.genrePoint.noneAvailable }}</Text>
            </div>
            <Text variant="caption" color="muted" class="mt-2">{{ content.reminders.genrePoint.description }}</Text>

          </Card>
          <Card class="text-center flex flex-col items-center justify-center">
            <Text variant="label" color="red" class="mb-1">{{ content.reminders.aptitude.title }}</Text>
            <div v-if="isAptitudeAvailable">
                <Text variant="caption" color="muted">{{ content.reminders.aptitude.description }}</Text>
            </div>
            <div v-else-if="isAptitudeUnavailableDueToJoker">
                <Text variant="caption" color="red" class="font-bold uppercase line-through decoration-2">{{ content.reminders.aptitude.unavailable }}</Text>
                <Text variant="caption" color="muted">{{ content.reminders.aptitude.jokerMessage }}</Text>
            </div>
            <div v-else>
                <Text variant="caption" color="red" class="font-bold uppercase line-through decoration-2">{{ content.reminders.aptitude.unavailable }}</Text>
                <Text variant="caption" color="muted">{{ aptitudeDeadText }}</Text>
            </div>
          </Card>
        </div>

      <!-- Result Display -->
      <div v-if="rollMain !== null && rollEffort !== null && ((isFaceCard || selectedJoker) ? targetDifficulty !== null : true)" class="space-y-6 animate-fade-in">
        <Card 
          class="text-center transition-all duration-500"
          :variant="isSuccess ? 'success' : 'failure'"
        >
          <Text variant="label" color="muted" class="mb-2">{{ content.results.totalResult }}{{ rollTotal }} vs {{ (isFaceCard || selectedJoker) ? targetDifficulty : selectedRank }}</Text>
          <Text 
            variant="quote"
            :color="isSuccess ? 'success' : 'red'"
            glow
            class="mb-2 tracking-tighter"
          >
            {{ isSuccess ? content.results.success : content.results.failure }}
          </Text>
        </Card>

        <!-- Effort Instruction Display -->
        <div v-if="effortResult" class="animate-fade-in">
          <Card class="border-nott-red/50 bg-nott-red/5">
            <div class="text-center space-y-2">
              <Text variant="h3" color="red">{{ effortResult.title }}</Text>
              <Text variant="label" color="white">{{ effortResult.description }}</Text>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- Action Footer -->
    <!-- ActionFooter -->
    <ActionFooter 
      :label="content.buttonText"
      :disabled="!(rollMain !== null && rollEffort !== null && ((isFaceCard || selectedJoker) ? targetDifficulty !== null : true))"
      @click="$emit('next')"
    />
  </div>
</template>
