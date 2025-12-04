<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import Card from '../Card.vue'
import Text from '../Text.vue'
import IngressText from '../IngressText.vue'
import Toggle from '../Toggle.vue'
import DieSelector from '../DieSelector.vue'
import SelectionButton from '../SelectionButton.vue'
import ActionFooter from '../ActionFooter.vue'
import { computed, onMounted } from 'vue'
import { getResolutionPhaseContent } from '../../utils/contentLoader'

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
  selectedPlayset
} = useLivePlay()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
}>()

const content = computed(() => getResolutionPhaseContent(selectedPlayset.value))

onMounted(() => {
  // Reset dice when entering this phase
  rollMain.value = null
  rollEffort.value = null
})
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
                <div v-else class="text-2xl font-display text-nott-white">
                  {{ trophyTop?.rank || 10 }}
                </div>
             </div>

             <div class="text-nott-red font-bold text-xl">+</div>
             
             <!-- Modifier -->
             <div class="text-center">
                <Text variant="caption" color="muted">{{ content.targetDifficulty.mod }}</Text>
                <div class="text-2xl font-display text-nott-white">{{ (targetDifficulty || 0) - (trophyTop?.rank || 0) }}</div>
             </div>
             
             <div class="text-nott-red font-bold text-xl">=</div>
             
             <!-- Total -->
             <div class="text-center">
                <Text variant="caption" color="muted">{{ content.targetDifficulty.total }}</Text>
                <div class="text-4xl font-display text-nott-red font-bold">{{ targetDifficulty }}</div>
             </div>
          </div>
          
          <Text variant="caption" color="muted" class="text-center">{{ content.targetDifficulty.explanation }}</Text>
        </div>

        <!-- Target Difficulty (Number Cards) -->
        <div v-else class="space-y-4 animate-fade-in">
           <div class="flex flex-col items-center justify-center gap-2">
              <Text variant="label" align="center">{{ content.targetDifficulty.numberCardTitle }}</Text>
              <div class="text-6xl font-display text-nott-red font-bold">{{ selectedRank }}</div>
              <Text variant="caption" color="muted">{{ content.targetDifficulty.numberCardExplanation }}</Text>
           </div>
        </div>

      <div class="grid md:grid-cols-2 gap-8">
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
            <Text variant="caption" color="muted">{{ content.reminders.aptitude.description }}</Text>
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
