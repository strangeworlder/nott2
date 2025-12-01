<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import WizardStep from '../WizardStep.vue'
import Card from '../Card.vue'
import Text from '../Text.vue'
import Toggle from '../Toggle.vue'
import DieSelector from '../DieSelector.vue'
import SelectionButton from '../SelectionButton.vue'

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
  toggleGenrePointUsage
} = useLivePlay()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
}>()

import { onMounted } from 'vue'

onMounted(() => {
  // Reset dice when entering this phase
  rollMain.value = null
  rollEffort.value = null
})
</script>

<template>
  <WizardStep
    title="The Resolution"
    :step-number="5"
    :total-steps="6"
    :can-proceed="rollMain !== null && rollEffort !== null && ((isFaceCard || selectedJoker) ? targetDifficulty !== null : true)"
    show-back
    @back="emit('back')"
    @next="emit('next')"
  >
    <div class="mb-6 text-center">
      <Text variant="quote" color="muted" class="italic">"Roll the d13 (d10 + d4). Compare your total to the Difficulty. The d4 also determines your Effort—how well you succeed or how badly you fail."</Text>
    </div>

    <div class="max-w-2xl mx-auto space-y-8">
      
        <!-- Target Difficulty (Face Cards/Jokers only) -->
        <div v-if="isFaceCard || selectedJoker" class="space-y-4 animate-fade-in">
          <Text variant="label" class="text-center">Target Difficulty Calculation</Text>
          
          <div class="flex justify-center items-center gap-4">
             <!-- Base Difficulty -->
             <div class="text-center">
                <Text variant="caption" color="muted">Base</Text>
                
                <!-- If randomized, show button list -->
                <div v-if="isTrophyTopRandomized && availableTrophyRanks.length > 1" class="flex flex-col items-center gap-2">
                   <div class="flex flex-wrap justify-center gap-1 max-w-[200px]">
                     <SelectionButton 
                       v-for="rank in availableTrophyRanks" 
                       :key="rank"
                       @click="setTrophyTop(rank)"
                       :selected="trophyTop?.rank === rank"
                       variant="square"
                       class="!w-8 !h-8 !text-sm"
                     >
                       {{ rank }}
                     </SelectionButton>
                   </div>
                </div>
                <!-- Else show static number -->
                <div v-else class="text-2xl font-display text-nott-white">
                  {{ trophyTop?.rank || 10 }}
                </div>
             </div>

             <div class="text-nott-red font-bold text-xl">+</div>
             
             <!-- Modifier -->
             <div class="text-center">
                <Text variant="caption" color="muted">Mod</Text>
                <div class="text-2xl font-display text-nott-white">{{ (targetDifficulty || 0) - (trophyTop?.rank || 0) }}</div>
             </div>
             
             <div class="text-nott-red font-bold text-xl">=</div>
             
             <!-- Total -->
             <div class="text-center">
                <Text variant="caption" color="muted">Total</Text>
                <div class="text-4xl font-display text-nott-red font-bold">{{ targetDifficulty }}</div>
             </div>
          </div>
          
          <Text variant="caption" color="muted" class="text-center">Base + Modifier (J=1, Q=2, K=3)</Text>
        </div>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- d10 Input -->
        <DieSelector 
          :sides="10"
          v-model="rollMain"
          label="d10 (Main Die)"
        />

        <!-- d4 Input -->
        <DieSelector 
          :sides="4"
          v-model="rollEffort"
          label="d4 (Effort Die)"
          color="red"
        />
      </div>

      <!-- Result Display -->
      <div v-if="rollMain !== null && rollEffort !== null && ((isFaceCard || selectedJoker) ? targetDifficulty !== null : true)" class="space-y-6 animate-fade-in">
        <div 
          class="text-center p-8 rounded border-2 transition-all duration-500"
          :class="isSuccess ? 'bg-green-900/20 border-green-500/50' : 'bg-nott-red/20 border-nott-red/50'"
        >
          <Text variant="label" color="muted" class="mb-2">Total Result: {{ rollTotal }} vs {{ (isFaceCard || selectedJoker) ? targetDifficulty : selectedRank }}</Text>
          <div 
            class="text-6xl md:text-8xl font-display tracking-tighter mb-2"
            :class="isSuccess ? 'text-green-500 text-shadow-glow-green' : 'text-nott-red text-shadow-glow'"
          >
            {{ isSuccess ? 'SUCCESS' : 'FAILURE' }}
          </div>
        </div>

        <!-- Reminders -->
        <div class="grid grid-cols-2 gap-4">
          <Card class="text-center flex flex-col items-center justify-center gap-2 !p-4">
            <Text variant="label" color="red" class="mb-1">Genre Point?</Text>
            <div v-if="playerGenrePoints > 0 || isGenrePointUsed">
                <Toggle 
                    :model-value="isGenrePointUsed"
                    @update:model-value="toggleGenrePointUsage"
                    label-on="Used a genre point"
                    label-off="Didn't use a genre point"
                />
                <Text variant="caption" color="muted" class="mt-1">Tokens Available: {{ playerGenrePoints }}</Text>
            </div>
            <div v-else>
                <Text variant="caption" color="muted">No tokens available.</Text>
            </div>
          </Card>
          <Card class="text-center flex flex-col items-center justify-center !p-4">
            <Text variant="label" color="red" class="mb-1">Aptitude?</Text>
            <Text variant="caption" color="muted">If Suit matches Aptitude: +1 to Push (Risk), -1 for Safety (Control).</Text>
          </Card>
        </div>

        <!-- Effort Instruction Display -->
        <div v-if="effortResult" class="animate-fade-in">
          <Card class="border-nott-red/50 bg-nott-red/5">
            <div class="text-center space-y-2">
              <Text variant="h3" color="red">{{ effortResult.title }}</Text>
              <Text variant="label" class="text-nott-white">{{ effortResult.description }}</Text>
              <div class="h-px w-1/2 mx-auto bg-nott-red/30 my-2"></div>
              <Text variant="body" class="italic text-nott-white/80">"{{ effortResult.mechanic }}"</Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </WizardStep>
</template>
