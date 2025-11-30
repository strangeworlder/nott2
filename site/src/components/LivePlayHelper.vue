<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fullPromptMatrix, faceCardPrompts, faceCardPrompt, falloutScale, basicRules } from '../data/rules'
import { useGameEngine, type Card as GameCard, type Suit, type Rank } from '../composables/useGameEngine'
import WizardStep from './WizardStep.vue'
import Card from './Card.vue'
import PlayingCard from './PlayingCard.vue'
import Button from './Button.vue'
import Checkbox from './Checkbox.vue'
import Text from './Text.vue'
import Toggle from './Toggle.vue'
import Badge from './Badge.vue'
import DieSelector from './DieSelector.vue'

// Local State for Physical Play
const currentCard = ref<GameCard | null>(null)
const strikes = ref(0)
const weaknessesFound = ref<Suit[]>([])
const isEndgame = ref(false)

// Manual Input State
const manualSuit = ref<Suit>('Spades')
const manualRank = ref<Rank>(1)
const manualJoker = ref<'Red' | 'Black' | null>(null)

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

// Deck Tracking State
const acesRemaining = ref(4)
// Middle Stack: 2s, 3s, 4s, and 1 Jack
const middleStack = ref<Record<number, number>>({ 2: 4, 3: 4, 4: 4, 11: 1 })
// Bottom Stack: Reserves (5-10) + Returned Cards + Added Face Cards
const bottomStack = ref<Record<number, number>>({ 
  2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 
  11: 0, 12: 0, 13: 0 
})
// Reserve Queue: The ordered list of cards waiting to be added to the Bottom Stack
// 5s, 6s, 7s, 8s, 9s, 10s (4 of each)
const reserveQueue = ref<number[]>([
  5,5,5,5, 
  6,6,6,6, 
  7,7,7,7, 
  8,8,8,8, 
  9,9,9,9, 
  10,10,10,10
])

const drawnCards = ref<Set<string>>(new Set())
const trophyPile = ref<GameCard[]>([])
const trophyTop = ref<GameCard | null>(null)

const isMiddleStackEmpty = computed(() => {
  return Object.values(middleStack.value).every(count => count === 0)
})

const isRankAvailable = (rank: Rank) => {
  // Phase 1: Aces Only
  if (acesRemaining.value > 0) {
    return rank === 1
  }

  // Phase 2: Middle Stack (2s, 3s, 4s, Jack)
  if (!isMiddleStackEmpty.value) {
    return middleStack.value[rank] > 0
  }

  // Phase 3: Bottom Stack
  return bottomStack.value[rank] > 0
}

const isSuitAvailable = (rank: Rank, suit: Suit) => {
  // Check if this specific card has already been drawn
  if (drawnCards.value.has(`${rank}-${suit}`)) return false
  return true
}

const updateDeckState = (rank: Rank, suit: Suit, action: 'draw' | 'add' | 'return') => {
  const cardId = `${rank}-${suit}`
  
  if (action === 'draw') {
    drawnCards.value.add(cardId)
    
    if (rank === 1) {
      acesRemaining.value--
    } else if (middleStack.value[rank] > 0) {
      // Drawn from Middle Stack
      middleStack.value[rank]--
    } else {
      // Drawn from Bottom Stack
      bottomStack.value[rank]--
    }
  } else if (action === 'add') {
    // Adding a NEW card to the deck (e.g. King/Queen/Jack from Fallout)
    // Adds to Bottom Stack
    if (rank >= 11 && rank <= 13) bottomStack.value[rank]++
  } else if (action === 'return') {
    // Returning a drawn card to the deck (shuffling back)
    drawnCards.value.delete(cardId)
    
    if (rank === 1) {
       if (!isMiddleStackEmpty.value && ((rank >= 2 && rank <= 4) || rank === 11)) {
         middleStack.value[rank]++
       } else {
         bottomStack.value[rank]++
       }
    }
    else if (!isMiddleStackEmpty.value && ((rank >= 2 && rank <= 4) || rank === 11)) {
      middleStack.value[rank]++
    }
    else {
      bottomStack.value[rank]++
    }
  }
}

const addNextReserve = () => {
  const nextRank = reserveQueue.value.shift()
  if (nextRank) {
    bottomStack.value[nextRank]++
  }
}

const shuffleThreatDeck = () => {
  // Merge Middle Stack into Bottom Stack
  for (const rank in middleStack.value) {
    const r = Number(rank)
    bottomStack.value[r] += middleStack.value[r]
    middleStack.value[r] = 0
  }
  // Now all available cards are in Bottom Stack (Phase 3 logic applies)
}

const shuffleTrophyPile = () => {
  if (trophyPile.value.length === 0) return
  const randomIndex = Math.floor(Math.random() * trophyPile.value.length)
  trophyTop.value = trophyPile.value[randomIndex]
  isTrophyTopRandomized.value = true
}

const setManualCard = () => {
  if (manualJoker.value) {
    selectedJoker.value = manualJoker.value
    currentCard.value = null
  } else {
    selectedJoker.value = null
    currentCard.value = {
      id: 'manual',
      suit: manualSuit.value,
      rank: manualRank.value
    }
    // Update Deck State
    updateDeckState(manualRank.value, manualSuit.value, 'draw')
  }
}

// Local UI State
const currentStep = ref(1)
const selectedJoker = ref<'Red' | 'Black' | null>(null)
const consequenceConfirmed = ref(false)
const rollMain = ref<number | null>(null)
const rollFallout = ref<number | null>(null)
const targetDifficulty = ref<number | null>(null)

const manualOverride = ref(false) // For manually selecting a card if needed
const isTrophyTopRandomized = ref(true)
const debugMode = ref(true)

// Computed Helpers
const selectedSuit = computed(() => currentCard.value?.suit || null)
const selectedRank = computed(() => currentCard.value?.rank || null)
const isFaceCard = computed(() => (selectedRank.value || 0) > 10)
const isFirstTime = computed(() => {
  if (!selectedSuit.value || !isFaceCard.value) return true
  // Check if we have already found the weakness for this suit
  return !weaknessesFound.value.includes(selectedSuit.value)
})

const cardName = computed(() => {
  if (selectedJoker.value) return `${selectedJoker.value} Joker`
  if (!currentCard.value) return 'Unknown Card'
  const rankName = getRankName(currentCard.value.rank)
  return `${rankName} of ${currentCard.value.suit}`
})

const getRankName = (rank: number) => {
  if (rank === 1) return 'Ace'
  if (rank === 11) return 'Jack'
  if (rank === 12) return 'Queen'
  if (rank === 13) return 'King'
  return rank.toString()
}

const currentPrompt = computed(() => {
  if (selectedJoker.value === 'Red') return "THE FINAL TEST. The Killer has you dead to rights. How do you escape death?"
  if (selectedJoker.value === 'Black') return "THE TWIST. One last desperate attempt. What do you sacrifice to survive?"
  
  if (!currentCard.value) return null

  if (isFaceCard.value) {
    const faceData = faceCardPrompts.find(s => s.suit === currentCard.value!.suit)
    if (!faceData) return null
    
    if (currentCard.value.rank === 11) return `${faceCardPrompt} ${isFirstTime.value ? faceData.jack.firstTime : faceData.jack.recurring}`
    if (currentCard.value.rank === 12) return `${faceCardPrompt} ${isFirstTime.value ? faceData.queen.firstTime : faceData.queen.recurring}`
    if (currentCard.value.rank === 13) return `${faceCardPrompt} ${isFirstTime.value ? faceData.king.firstTime : faceData.king.recurring}`
    
    return faceCardPrompt
  }

  const suitData = fullPromptMatrix.find(s => s.suit === currentCard.value!.suit)
  return suitData?.prompts.find(p => p.rank === currentCard.value.rank)?.prompt
})

const rollTotal = computed(() => {
  if (rollMain.value === null || rollFallout.value === null) return 0
  return rollMain.value + rollFallout.value
})

const isSuccess = computed(() => {
  if (rollMain.value === null || rollFallout.value === null) return false
  
  const total = rollMain.value + rollFallout.value
  
  if (isFaceCard.value || selectedJoker.value) {
    if (targetDifficulty.value === null) return false
    return total >= targetDifficulty.value
  } else {
    if (selectedRank.value === null) return false
    return total >= selectedRank.value
  }
})

const falloutResult = computed(() => {
  if (!rollFallout.value) return null
  return falloutScale.find(f => f.level === rollFallout.value)
})

const availableTrophyRanks = computed(() => {
  const ranks = trophyPile.value.map(c => c.rank)
  // Return unique ranks sorted descending
  return [...new Set(ranks)].sort((a, b) => b - a)
})

const setTrophyTop = (rank: number) => {
  const card = trophyPile.value.find(c => c.rank === rank)
  if (card) {
    trophyTop.value = card
    // Recalculate Target Difficulty
    if (isFaceCard.value) {
      let modifier = 0
      const currentRank = currentCard.value?.rank || 0
      if (currentRank === 11) modifier = 1
      if (currentRank === 12) modifier = 2
      if (currentRank === 13) modifier = 3
      targetDifficulty.value = card.rank + modifier
    } else {
      targetDifficulty.value = card.rank
    }
  }
}

// Actions
const startGame = () => {
  // Reset Local State
  strikes.value = 0
  weaknessesFound.value = []
  
  // Reset Deck State
  acesRemaining.value = 4
  middleStack.value = { 2: 4, 3: 4, 4: 4, 11: 1 }
  bottomStack.value = { 
    2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 
    11: 0, 12: 0, 13: 0 
  }
  reserveQueue.value = [
    5,5,5,5, 6,6,6,6, 7,7,7,7, 8,8,8,8, 9,9,9,9, 10,10,10,10
  ]
  drawnCards.value = new Set()
  
  // Trophy Pile starts with a random 10
  // We don't know the suit, but rank is 10.
  const initialTrophy: GameCard = { id: 'initial-trophy', suit: 'Spades', rank: 10 }
  trophyPile.value = [initialTrophy]
  trophyPile.value = [initialTrophy]
  trophyTop.value = initialTrophy
  isTrophyTopRandomized.value = true

  // isEndgame is toggled in Step 1
  currentStep.value = 2
}

const resetCurrentCard = () => {
  currentCard.value = null
  selectedJoker.value = null
  manualJoker.value = null
  // Reset manual inputs to default
  manualSuit.value = 'Spades'
  // Auto-select Ace if in Phase 1
  manualRank.value = acesRemaining.value > 0 ? 1 : 2
}

const confirmCardSelection = () => {
  setManualCard()
}

const nextStep = () => {
  if (currentStep.value < 6) {
    currentStep.value++
    // If entering Resolution step (5), auto-set difficulty
    if (currentStep.value === 5) {
      if (trophyTop.value) {
        if (isFaceCard.value) {
          // Face Card Difficulty = Base (Trophy) + Modifier
          // Jack +1, Queen +2, King +3
          const rank = currentCard.value?.rank || 0
          let modifier = 0
          if (rank === 11) modifier = 1
          if (rank === 12) modifier = 2
          if (rank === 13) modifier = 3
          
          targetDifficulty.value = trophyTop.value.rank + modifier
        } else if (selectedJoker.value) {
          // Joker Difficulty = Base (Trophy)
          targetDifficulty.value = trophyTop.value.rank
        } else {
          // Number Card Difficulty = Rank
          targetDifficulty.value = currentCard.value?.rank || 0
        }
      } else {
        // Fallback if no trophy (shouldn't happen)
        targetDifficulty.value = currentCard.value?.rank || 0
      }
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const startNextScene = () => {
  // Apply Game State Updates based on the result of the previous scene
  applyGameStateUpdates()
  
  // Reset scene-specific state
  resetCurrentCard()
  currentStep.value = 2 // Go to Scene Setup
  selectedJoker.value = null
  consequenceConfirmed.value = false
  rollMain.value = null
  rollFallout.value = null
  targetDifficulty.value = null
}

const applyGameStateUpdates = () => {
  // In Physical Mode, we just track strikes/weaknesses locally
  // The UI in Step 6 tells the user what to do with the physical deck
  
  if (isSuccess.value) {
    if (isFaceCard.value) {
      if (isFirstTime.value) {
        if (currentCard.value) {
           weaknessesFound.value.push(currentCard.value.suit)
           // Check for Endgame
           if (weaknessesFound.value.length === 4) {
             isEndgame.value = true
           }
        }
      } else {
        // Shuffle back: Return to deck count
        if (currentCard.value) updateDeckState(currentCard.value.rank, currentCard.value.suit, 'return')
      }
      
      // Fallout: Add Face Cards
      if (rollFallout.value && rollFallout.value <= 2) {
        // Add Jack
        updateDeckState(11, 'Spades', 'add') 
      } else if (rollFallout.value && rollFallout.value >= 3) {
        // Add Queen
        updateDeckState(12, 'Spades', 'add')
      }
      
      // SHUFFLE EVERYTHING (Threat Deck & Trophy Pile)
      shuffleThreatDeck()
      shuffleTrophyPile()
    } else {
      // Number Card Success: Add Reserve
      if (!isEndgame.value) addNextReserve()
      // Update Trophy Pile
      if (currentCard.value) {
        trophyPile.value.push(currentCard.value)
        trophyTop.value = currentCard.value
        isTrophyTopRandomized.value = false
      }
    }
  } else {
    if (isFaceCard.value) {
      strikes.value++
      // Add King
      updateDeckState(13, 'Spades', 'add')
      // Shuffle back
      if (currentCard.value) updateDeckState(currentCard.value.rank, currentCard.value.suit, 'return')
      
      // SHUFFLE EVERYTHING (Threat Deck & Trophy Pile)
      shuffleThreatDeck()
      shuffleTrophyPile()
    } else {
      // Number Card Failure: Return to bottom + Add Reserve
      if (currentCard.value) updateDeckState(currentCard.value.rank, currentCard.value.suit, 'return')
      if (!isEndgame.value) addNextReserve()
    }
  }
}

const triggerEndgame = () => {
  isEndgame.value = true
  reset()
}

const reset = () => {
  currentStep.value = 1
  selectedJoker.value = null
  consequenceConfirmed.value = false
  rollMain.value = null
  rollFallout.value = null
  targetDifficulty.value = null
}

const fullReset = () => {
  if (confirm('Are you sure you want to reset the entire game? This will clear all progress.')) {
    strikes.value = 0
    weaknessesFound.value = []
    isEndgame.value = false
    acesRemaining.value = 4
    middleStack.value = { 2: 4, 3: 4, 4: 4, 11: 1 }
    bottomStack.value = { 
      2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 
      11: 0, 12: 0, 13: 0 
    }
    reserveQueue.value = [
      5,5,5,5, 6,6,6,6, 7,7,7,7, 8,8,8,8, 9,9,9,9, 10,10,10,10
    ]
    drawnCards.value = new Set()
    trophyPile.value = []
    trophyTop.value = null
    reset()
  }
}

const suitIcons: Record<string, string> = {
  'Spades': '♠', 'Hearts': '♥', 'Clubs': '♣', 'Diamonds': '♦',
}
const suitColors: Record<string, string> = {
  'Spades': '', 'Hearts': 'text-nott-red', 'Clubs': '', 'Diamonds': 'text-nott-red',
}
</script>

<template>
  <div class="min-h-screen bg-nott-black text-nott-white flex flex-col items-center p-4 md:p-8">
    <!-- Header -->
    <div class="w-full max-w-4xl flex justify-between items-center mb-8">
      <div class="flex flex-col">
        <Text variant="h3" color="red">Live Play Helper</Text>
        <Text v-if="trophyTop" variant="caption" color="muted">Base Difficulty: <span class="text-nott-white font-bold">{{ trophyTop.rank }}</span></Text>
      </div>
      <Button variant="secondary" @click="fullReset" class="text-xs px-3 py-1 h-8">Reset Game</Button>
    </div>

    <!-- Step 1: Game Setup / Endgame Setup -->
    <WizardStep
      v-if="currentStep === 1"
      :title="isEndgame ? 'Endgame Setup' : 'Game Setup'"
      :step-number="1"
      :total-steps="6"
      :can-proceed="true"
      :next-label="isEndgame ? 'Start the Endgame' : 'Start the Night'"
      @next="startGame"
    >
      <div class="mb-6 text-center">
        <Text variant="quote" color="muted" class="italic">"You are no heroes. You are just in the wrong place at the wrong time. The horror starts small, but it will escalate."</Text>
      </div>

      <div v-if="!isEndgame" class="grid gap-6 md:grid-cols-2">
        <Card title="Build the Decks">
          <Text variant="body" color="muted" class="mb-4">Manually build the deck:</Text>
          <ul class="space-y-4 text-nott-white/80">
            <li class="flex items-start gap-2">
              <Text variant="label" color="red">1.</Text>
              <Text variant="body"><strong>Threat Deck:</strong> 4 Aces on top, then 2s-4s + 1 Jack shuffled.</Text>
            </li>
            <li class="flex items-start gap-2">
              <Text variant="label" color="red">2.</Text>
              <Text variant="body"><strong>Reserves:</strong> Keep 5s-10s and Face Cards nearby.</Text>
            </li>
            <li class="flex items-start gap-2">
              <Text variant="label" color="red">3.</Text>
              <Text variant="body"><strong>Trophy Pile:</strong> Place a random 10 face up.</Text>
            </li>
          </ul>
        </Card>
        <Card title="Create Characters">
          <ul class="space-y-4 text-nott-white/80">
            <li class="flex items-start gap-2">
              <Text variant="label" color="red">1.</Text>
              <Text variant="body">Choose a Name and Archetype.</Text>
            </li>
            <li class="flex items-start gap-2">
              <Text variant="label" color="red">2.</Text>
              <Text variant="body">Answer: "Why are you here?"</Text>
            </li>
            <li class="flex items-start gap-2">
              <Text variant="label" color="red">3.</Text>
              <Text variant="body">Select an Aptitude (Power, Resolve, Intellect, Finesse).</Text>
            </li>
          </ul>
        </Card>
      </div>
      <div v-else class="max-w-2xl mx-auto">
        <Card title="Prepare for the End">
          <ul class="space-y-4 text-nott-white/80">
            <li class="flex items-start gap-2">
              <Text variant="label" color="red">1.</Text>
              <Text variant="body"><strong>Remove Number Cards:</strong> Take all Number Cards out of the Threat Deck.</Text>
            </li>
            <li class="flex items-start gap-2">
              <Text variant="label" color="red">2.</Text>
              <Text variant="body"><strong>Add Jokers:</strong> Shuffle both the Red and Black Jokers into the remaining Face Cards.</Text>
            </li>
            <li class="flex items-start gap-2">
              <Text variant="label" color="red">3.</Text>
              <Text variant="body"><strong>The Goal:</strong> Survive until the Red Joker appears, then defeat it to win.</Text>
            </li>
          </ul>
        </Card>
      </div>
    </WizardStep>

    <!-- Step 2: Scene Setup (Draw Threat) -->
    <WizardStep
      v-if="currentStep === 2"
      title="Scene Setup"
      :step-number="2"
      :total-steps="6"
      :can-proceed="!!currentCard"
      show-back
      @back="prevStep"
      @next="nextStep"
    >
      <div class="mb-6 text-center">
        <Text variant="quote" color="muted" class="italic">"Reveal the top card of the Threat Deck. This is the Threat Card. It tells you what the next challenge is. The Suit is the nature of the threat, the Number is the severity."</Text>
      </div>

      <div class="space-y-8">
        <div v-if="!currentCard && !selectedJoker" class="text-center py-12">
          <Text variant="quote" class="mb-8">Draw a card from your physical deck...</Text>
          
          <div class="max-w-md mx-auto bg-nott-white/5 p-6 rounded border border-nott-gray/50 space-y-6">
            <div class="space-y-2">
              <Text variant="label">Select Card</Text>
              
              <!-- Rank Grid -->
              <div class="grid grid-cols-5 gap-2">
                <button 
                  v-for="r in ranks" 
                  :key="r.value"
                  @click="manualRank = r.value"
                  :disabled="!isRankAvailable(r.value)"
                  class="h-10 rounded border font-display text-lg transition-all duration-200 flex items-center justify-center"
                  :class="[
                    manualRank === r.value 
                      ? 'bg-nott-red border-nott-red text-white' 
                      : 'bg-nott-black border-nott-gray text-nott-white hover:border-nott-red/50',
                    !isRankAvailable(r.value) ? 'opacity-20 cursor-not-allowed' : ''
                  ]"
                >
                  {{ r.label }}
                </button>
              </div>

              <!-- Suit Grid -->
              <div class="grid grid-cols-4 gap-2 mt-4">
                <button 
                  v-for="s in suits" 
                  :key="s"
                  @click="manualSuit = s"
                  class="h-12 rounded border font-display text-2xl transition-all duration-200 flex items-center justify-center"
                  :class="[
                    manualSuit === s 
                      ? 'bg-nott-white border-nott-white text-nott-black' 
                      : 'bg-nott-black border-nott-gray hover:border-nott-white/50',
                    suitColors[s],
                    !isSuitAvailable(manualRank, s) ? 'opacity-20 cursor-not-allowed' : ''
                  ]"
                  :disabled="!isSuitAvailable(manualRank, s)"
                >
                  {{ suitIcons[s] }}
                </button>
              </div>
            </div>

            <div v-if="isEndgame" class="border-t border-nott-gray/30 pt-4">
              <Text variant="label" class="mb-2">Or Joker?</Text>
              <div class="flex gap-4 justify-center">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="manualJoker" value="Red" class="text-nott-red focus:ring-nott-red bg-nott-black border-nott-gray">
                  <span class="text-nott-red font-display">Red</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="manualJoker" value="Black" class="text-nott-white focus:ring-nott-white bg-nott-black border-nott-gray">
                  <span class="text-nott-white font-display">Black</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="manualJoker" :value="null" class="text-nott-gray focus:ring-nott-gray bg-nott-black border-nott-gray">
                  <span class="text-nott-gray font-display">None</span>
                </label>
              </div>
            </div>

            <Button 
              variant="primary"
              class="w-full mt-4"
              @click="confirmCardSelection"
            >
              REVEAL PROMPT
            </Button>
          </div>
        </div>

        <div v-else class="space-y-6 animate-fade-in">
          <!-- Card Display -->
          <div class="flex justify-center">
            <PlayingCard 
              :suit="currentCard.suit"
              :rank="currentCard.rank"
            />
          </div>

          <!-- Prompt Display -->
          <div v-if="currentPrompt" class="max-w-2xl mx-auto">
            <Card class="text-center py-8 border-nott-red/50">
              <Text variant="quote">"{{ currentPrompt }}"</Text>
            </Card>
          </div>
        </div>
      </div>
    </WizardStep>

    <!-- Step 3: Conversation -->
    <WizardStep
      v-if="currentStep === 3"
      title="The Conversation"
      :step-number="3"
      :total-steps="6"
      :can-proceed="true"
      show-back
      @back="prevStep"
      @next="nextStep"
    >
      <div class="mb-6 text-center">
        <Text variant="quote" color="muted" class="italic">"Narrate the events leading up to this moment. Ask questions. Describe the world. Sooner or later, you'll try something risky."</Text>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <Card title="Focus the Camera">
          <Text variant="body" color="muted" class="mb-4">Ask the Active Player one sensory question:</Text>
          <ul class="list-disc list-inside text-nott-white/60 space-y-2 italic">
            <li>"What does it smell like?"</li>
            <li>"How close is the Killer?"</li>
            <li>"Is it pitch black?"</li>
          </ul>
        </Card>
        <Card title="Escalate">
          <Text variant="body" color="muted" class="mb-4">Once per scene, anyone can interject:</Text>
          <Text variant="h3" color="red" class="text-center my-4">"Something's not right..."</Text>
          <Text variant="caption">Add a terrifying detail that makes the situation worse. The Active Player must accept it.</Text>
        </Card>
      </div>
    </WizardStep>

    <!-- Step 4: Stakes -->
    <WizardStep
      v-if="currentStep === 4"
      title="The Stakes"
      :step-number="4"
      :total-steps="6"
      :can-proceed="consequenceConfirmed"
      show-back
      @back="prevStep"
      @next="nextStep"
    >
      <div class="mb-6 text-center">
        <Text variant="quote" color="muted" class="italic">"Success can have a price, failure more so. Before you roll, we must agree: If this goes wrong, what is the Consequence?"</Text>
      </div>

      <div class="max-w-2xl mx-auto space-y-8">
        <div class="text-center space-y-4">
          <Text variant="h2">Define the Consequence</Text>
          <Text variant="body" color="muted">Before rolling, ask the Active Player:</Text>
          <Text variant="quote" color="red">"If this goes wrong, what is the Consequence?"</Text>
        </div>

        <Card class="bg-nott-red/5 border-nott-red/30">
          <Checkbox 
            v-model="consequenceConfirmed"
            label="We have agreed on a specific, terrible Consequence (Fallout 3)."
          />
        </Card>
      </div>
    </WizardStep>

    <!-- Step 5: Resolution -->
    <WizardStep
      v-if="currentStep === 5"
      title="The Resolution"
      :step-number="5"
      :total-steps="6"
      :can-proceed="rollMain !== null && rollFallout !== null && ((isFaceCard || selectedJoker) ? targetDifficulty !== null : true)"
      show-back
      @back="prevStep"
      @next="nextStep"
    >
      <div class="mb-6 text-center">
        <Text variant="quote" color="muted" class="italic">"Roll the d13 (d10 + d4). Compare your total to the Difficulty. The d4 also determines your Fallout—how well you succeed or how badly you fail."</Text>
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
                       <button 
                         v-for="rank in availableTrophyRanks" 
                         :key="rank"
                         @click="setTrophyTop(rank)"
                         class="w-8 h-8 rounded border font-display text-sm transition-all duration-200 flex items-center justify-center"
                         :class="[
                           trophyTop?.rank === rank
                             ? 'bg-nott-white border-nott-white text-nott-black' 
                             : 'bg-nott-black border-nott-gray text-nott-white hover:border-nott-white/50'
                         ]"
                       >
                         {{ rank }}
                       </button>
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
            v-model="rollFallout"
            label="d4 (Fallout Die)"
            color="red"
          />
        </div>

        <!-- Result Display -->
        <div v-if="rollMain !== null && rollFallout !== null && ((isFaceCard || selectedJoker) ? targetDifficulty !== null : true)" class="space-y-6 animate-fade-in">
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
            <div class="p-4 border border-nott-gray/30 rounded bg-nott-black/50 text-center">
              <Text variant="label" color="red" class="mb-1">Genre Point?</Text>
              <Text variant="caption" color="muted">Spend 1 GP to reroll. You must keep the new result.</Text>
            </div>
            <div class="p-4 border border-nott-gray/30 rounded bg-nott-black/50 text-center">
              <Text variant="label" color="red" class="mb-1">Aptitude?</Text>
              <Text variant="caption" color="muted">If Suit matches your Aptitude, you may +/- 1 to Fallout Die.</Text>
            </div>
          </div>

          <!-- Fallout Instruction Display -->
          <div v-if="falloutResult" class="animate-fade-in">
            <Card class="border-nott-red/50 bg-nott-red/5">
              <div class="text-center space-y-2">
                <Text variant="h3" color="red">{{ falloutResult.title }}</Text>
                <Text variant="label" class="text-nott-white">{{ falloutResult.description }}</Text>
                <div class="h-px w-1/2 mx-auto bg-nott-red/30 my-2"></div>
                <Text variant="body" class="italic text-nott-white/80">"{{ falloutResult.mechanic }}"</Text>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </WizardStep>

    <!-- Step 6: Update Game State -->
    <WizardStep
      v-if="currentStep === 6"
      title="Update Game State"
      :step-number="6"
      :total-steps="6"
      :can-proceed="true"
      next-label="Start Next Scene"
      show-back
      @back="prevStep"
      @next="startNextScene"
    >
      <div class="mb-6 text-center">
        <Text variant="quote" color="muted" class="italic">"The dust settles. The game state changes. Update the decks and prepare for what comes next."</Text>
      </div>

      <div class="space-y-8">
        <Card title="Update Physical Decks">
          <div class="space-y-6">
            <div v-if="isSuccess">
              <div class="flex items-start gap-3">
                <Badge variant="success">SUCCESS</Badge>
                <div>
                  <Text variant="label" color="red" class="mb-1">1. Update Trophy Pile:</Text>
                  <Text variant="body">Move the <strong>{{ cardName }}</strong> to the top of the Trophy Pile.</Text>
                  <Text variant="caption" color="muted">This becomes the new Base Difficulty.</Text>
                </div>
              </div>
              
              <div v-if="!isFaceCard" class="flex items-start gap-3 mt-4">
                <div class="w-8"></div>
                <div>
                  <Text variant="label" color="red" class="mb-1">2. Add Reserve:</Text>
                  <Text variant="body">Take the next card from the <strong>Number Reserve</strong> and add it to the bottom of the Threat Deck.</Text>
                </div>
              </div>

              <div v-else class="mt-4 space-y-4">
                <div class="flex items-start gap-3">
                  <div class="w-8"></div>
                  <div>
                    <Text variant="label" color="red" class="mb-1">2. Check for Weakness:</Text>
                    <div v-if="isFirstTime">
                      <Text variant="body" class="text-green-400 font-bold">Weakness Found!</Text>
                      <Text variant="caption">This is the first time you've defeated a {{ selectedSuit }} Face Card.</Text>
                      <Text variant="body" class="mt-2"><strong>Remove this card from the game.</strong></Text>
                    </div>
                    <div v-else>
                      <Text variant="body" class="text-nott-red font-bold">Weakness Already Known</Text>
                      <Text variant="caption">You have already found the weakness for {{ selectedSuit }}.</Text>
                      <Text variant="body" class="mt-2"><strong>Shuffle this card back into the physical Threat Deck.</strong></Text>
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-8"></div>
                  <div>
                    <Text variant="label" color="red" class="mb-1">3. Fallout (Face Card Added):</Text>
                    <div v-if="falloutResult">
                      <Text variant="body"><strong>{{ falloutResult.title }} ({{ falloutResult.level }})</strong></Text>
                      <Text v-if="falloutResult.level <= 2" variant="body" class="mt-1">Add a random <strong>Jack</strong> to the Threat Deck.</Text>
                      <Text v-else variant="body" class="mt-1">Add a random <strong>Queen</strong> to the Threat Deck.</Text>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <div class="w-8"></div>
                  <div>
                    <Text variant="label" color="red" class="mb-1">4. Shuffle:</Text>
                    <Text variant="body"><strong>Shuffle the entire Threat Deck and Trophy Pile.</strong></Text>
                  </div>
                </div>
              </div>
            </div>

            <div v-else>
              <div class="flex items-start gap-3">
                <Badge variant="danger">FAILURE</Badge>
                <div>
                  <Text variant="label" color="red" class="mb-1">1. Threat Deck:</Text>
                  <Text variant="body">Place the <strong>{{ cardName }}</strong> at the bottom of the Threat Deck.</Text>
                </div>
              </div>

              <div v-if="!isFaceCard" class="flex items-start gap-3 mt-4">
                <div class="w-8"></div>
                <div>
                  <Text variant="label" color="red" class="mb-1">2. Add Reserve:</Text>
                  <Text variant="body">Take the next card from the <strong>Number Reserve</strong> and add it to the bottom of the Threat Deck.</Text>
                </div>
              </div>

              <div v-else class="mt-4 space-y-4">
                <div class="flex items-start gap-3">
                  <div class="w-8"></div>
                  <div>
                    <Text variant="label" color="red" class="mb-1">2. Strike:</Text>
                    <Text variant="body">Mark 1 Strike on your character sheet.</Text>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-8"></div>
                  <div>
                    <Text variant="label" color="red" class="mb-1">3. Add King:</Text>
                    <Text variant="body">Add a random <strong>King</strong> to the bottom of the Threat Deck.</Text>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-8"></div>
                  <div>
                    <Text variant="label" color="red" class="mb-1">4. Shuffle:</Text>
                    <Text variant="body"><strong>Shuffle the entire Threat Deck and Trophy Pile.</strong></Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <!-- Endgame Trigger (Automated now, but keep manual just in case?) -->
        <!-- <div v-if="!isEndgame" class="flex flex-col items-center pt-8 border-t border-nott-gray/30 space-y-4">
          <div class="text-center space-y-2 max-w-md">
             <Text variant="caption"><strong class="text-nott-red">TRIGGER:</strong> The Endgame begins when the group has defeated a Face Card of all 4 suits.</Text>
             <Text variant="caption" color="muted" class="text-xs">If you have collected a Jack or Queen of Spades, Hearts, Clubs, AND Diamonds in the Trophy Pile, the Night is ending.</Text>
          </div>
          <button 
            @click="triggerEndgame"
            class="text-nott-red hover:text-nott-white border border-nott-red/50 hover:bg-nott-red hover:border-nott-red px-6 py-2 rounded transition-all duration-300 font-display uppercase tracking-widest text-sm"
          >
            Trigger Endgame
          </button>
        </div> -->
      </div>
    </WizardStep>

    <!-- Debug Toggle -->
    <button 
      @click="debugMode = !debugMode"
      class="fixed bottom-4 right-4 z-50 bg-black/80 text-green-400 border border-green-500/30 px-2 py-1 text-xs font-mono rounded hover:bg-green-900/50"
      :class="{ 'mb-24': debugMode }"
    >
      {{ debugMode ? 'Hide Debug' : 'Show Debug' }}
    </button>
    <div v-if="debugMode" class="fixed bottom-0 left-0 right-0 bg-black/90 text-xs text-green-400 p-2 font-mono border-t border-green-500/30 overflow-x-auto z-50">
      <div class="flex gap-8 whitespace-nowrap">
        <div>
          <strong class="text-white">Middle Stack ({{ Object.values(middleStack).reduce((a, b) => a + b, 0) }}):</strong>
          <span v-for="(count, rank) in middleStack" :key="rank" class="ml-2">
            {{ rank }}:{{ count }}
          </span>
        </div>
        <div>
          <strong class="text-white">Bottom Stack ({{ Object.values(bottomStack).reduce((a, b) => a + b, 0) }}):</strong>
          <span v-for="(count, rank) in bottomStack" :key="rank" class="ml-2">
            <span v-if="count > 0">{{ rank }}:{{ count }}</span>
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
      </div>
    </div>
  </div>
</template>
