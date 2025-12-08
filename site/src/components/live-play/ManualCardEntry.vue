<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import Card from '../Card.vue'
import Text from '../Text.vue'
import Button from '../Button.vue'
import SelectionButton from '../SelectionButton.vue'
import Separator from '../defaults/Separator.vue'
import type { Suit, Rank } from '../../composables/useGameEngine'
import { getManualCardEntryContent } from '../../utils/contentLoader'
import { useLivePlay } from '../../composables/useLivePlay'

const props = defineProps<{
  manualRank: Rank
  manualSuit: Suit
  manualJoker: 'Red' | 'Black' | null
  isEndgame: boolean
  isBlackJokerRemoved: boolean
  areJokersAvailable: boolean
  isValidAddition: boolean
  isRankAvailable: (rank: Rank) => boolean
  isSuitAvailable: (rank: Rank, suit: Suit) => boolean
}>()

const emit = defineEmits<{
  (e: 'update:manualRank', value: Rank): void
  (e: 'update:manualSuit', value: Suit): void
  (e: 'update:manualJoker', value: 'Red' | 'Black' | null): void
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const { selectedPlayset } = useLivePlay()
const content = computed(() => getManualCardEntryContent(selectedPlayset.value))

const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds']
const ranks: { label: string, value: Rank }[] = [
  { label: 'A', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: 'J', value: 11 },
  { label: 'Q', value: 12 },
  { label: 'K', value: 13 },
]

const suitIcons: Record<string, string> = {
  'Spades': '♠', 'Hearts': '♥', 'Clubs': '♣', 'Diamonds': '♦',
}
</script>

<template>
  <div class="w-full max-w-md animate-fade-in">
    <Card>
      <div class="space-y-6">
        <div class="space-y-2">
          <Text variant="label">{{ content.title }}</Text>
          
          <!-- Rank Grid -->
          <div class="grid grid-cols-5 gap-2">
            <SelectionButton 
              v-for="r in ranks" 
              :key="r.value"
              @click="emit('update:manualRank', r.value)"
              :selected="manualRank === r.value"
              :disabled="!isRankAvailable(r.value) || !!manualJoker"
              variant="square"
              color="red"
            >
              {{ r.label }}
            </SelectionButton>
          </div>

          <!-- Suit Grid -->
          <div class="grid grid-cols-4 gap-2 mt-4">
            <SelectionButton 
              v-for="s in suits" 
              :key="s"
              @click="emit('update:manualSuit', s)"
              :selected="manualSuit === s"
              :disabled="!isSuitAvailable(manualRank, s) || !!manualJoker"
              variant="default"
              :color="(s === 'Hearts' || s === 'Diamonds') ? 'red' : 'default'"
            >
              {{ suitIcons[s] }}
            </SelectionButton>
          </div>
        </div>

        <Separator v-if="areJokersAvailable" />
        <div v-if="areJokersAvailable">
          <Text variant="label" class="mb-2">{{ content.joker.title }}</Text>
          <div class="flex gap-4 justify-center">
            <SelectionButton
              @click="emit('update:manualJoker', 'Red')"
              :selected="manualJoker === 'Red'"
              color="red"
              class="flex-1"
            >
              {{ content.joker.red }}
            </SelectionButton>
            <SelectionButton
              @click="emit('update:manualJoker', 'Black')"
              :selected="manualJoker === 'Black'"
              :disabled="isBlackJokerRemoved"
              color="default"
              class="flex-1"
            >
              {{ content.joker.black }}
            </SelectionButton>
            <SelectionButton
              @click="emit('update:manualJoker', null)"
              :selected="manualJoker === null"
              color="default"
              class="flex-1 text-nott-gray"
            >
              {{ content.joker.none }}
            </SelectionButton>
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <Button variant="secondary" class="flex-1" @click="emit('cancel')">{{ content.buttons.cancel }}</Button>
          <Button 
            variant="primary"
            class="flex-1"
            @click="emit('confirm')"
            :disabled="!isValidAddition"
          >
            {{ content.buttons.add }}
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>
