<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fullPromptMatrix, faceCardPrompts, faceCardPrompt, falloutScale, basicRules } from '../data/rules'
import { useGameEngine, type Card as GameCard } from '../composables/useGameEngine'
import WizardStep from './WizardStep.vue'
import Card from './Card.vue'
import PlayingCard from './PlayingCard.vue'
import Button from './Button.vue'
import Checkbox from './Checkbox.vue'
import Text from './Text.vue'
import Toggle from './Toggle.vue'
import Badge from './Badge.vue'
import DieSelector from './DieSelector.vue'

// Engine
const { 
  threatDeck, 
  numberReserve, 
  trophyPile, 
  currentCard, 
  strikes, 
  weaknessesFound, 
  isEndgame,
  initializeGame,
  drawCard,
  addCardToBottom,
  addNextReserveToBottom,
  addRandomFaceCard,
  addKingToBottom,
  shuffleDeck,
  resetCurrentCard
} = useGameEngine()

// Local UI State
const currentStep = ref(1)
const selectedJoker = ref<'Red' | 'Black' | null>(null)
const consequenceConfirmed = ref(false)
const rollMain = ref<number | null>(null)
const rollFallout = ref<number | null>(null)
const targetDifficulty = ref<number | null>(null)
const manualOverride = ref(false) // For manually selecting a card if needed

// Computed Helpers
const selectedSuit = computed(() => currentCard.value?.suit || null)
const selectedRank = computed(() => currentCard.value?.rank || null)
const isFaceCard = computed(() => (selectedRank.value || 0) > 10)
const isFirstTime = computed(() => {
  if (!selectedSuit.value || !isFaceCard.value) return true
  // Check if we have already found the weakness for this suit
  // Actually, the prompt asks "Is this the first time?". 
  // We can track this in `weaknessesFound`.
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

// Actions
const startGame = () => {
  initializeGame()
  currentStep.value = 2
}

const drawNextCard = () => {
  drawCard()
}

const nextStep = () => {
  if (currentStep.value < 6) currentStep.value++
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
  if (!currentCard.value) return

  if (isSuccess.value) {
    // Success Logic
    // 1. Move current card to Trophy Pile
    trophyPile.value.push(currentCard.value)
    
    // 2. Add Number Reserve (if not Endgame)
    if (!isEndgame.value) {
      addNextReserveToBottom()
    }

    // 3. Face Card Specifics
    if (isFaceCard.value) {
      // Fallout 1-2: Add Jack, 3-4: Add Queen
      if (rollFallout.value && rollFallout.value <= 2) {
        addRandomFaceCard(11) // Jack
      } else if (rollFallout.value && rollFallout.value >= 3) {
        addRandomFaceCard(12) // Queen
      }

      // Weakness Found?
      if (isFirstTime.value) {
        weaknessesFound.value.push(currentCard.value.suit)
      } else {
        trophyPile.value.pop() // Remove from trophy
        addCardToBottom(currentCard.value) // Put back in deck
        shuffleDeck() 
      }
    }
  } else {
    // Failure Logic
    // 1. Move current card to bottom of Threat Deck
    addCardToBottom(currentCard.value)
    
    // 2. Add Number Reserve (if not Endgame)
    if (!isEndgame.value) {
      addNextReserveToBottom()
    }

    // 3. Face Card Specifics
    if (isFaceCard.value) {
      strikes.value++
      addKingToBottom()
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
    initializeGame()
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
      <Text variant="h3" color="red">Online Play Tool</Text>
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
      <div v-if="!isEndgame" class="grid gap-6 md:grid-cols-2">
        <Card title="Build the Decks">
          <Text variant="body" color="muted" class="mb-4">The app will automatically build the deck for you:</Text>
          <ul class="space-y-4 text-nott-white/80">
            <li class="flex items-start gap-2">
              <Text variant="label" color="red">1.</Text>
              <Text variant="body"><strong>Threat Deck:</strong> 4 Aces on top, then 2s-4s + 1 Jack shuffled.</Text>
            </li>
            <li class="flex items-start gap-2">
              <Text variant="label" color="red">2.</Text>
              <Text variant="body"><strong>Reserves:</strong> 5s-10s and Face Cards ready to be added.</Text>
            </li>
            <li class="flex items-start gap-2">
              <Text variant="label" color="red">3.</Text>
              <Text variant="body"><strong>Trophy Pile:</strong> A random 10 is already placed.</Text>
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
      <div class="space-y-8">
        <div v-if="!currentCard" class="text-center py-12">
          <Text variant="quote" class="mb-8">The Night continues...</Text>
          <Button 
            variant="primary"
            class="w-48 h-16 text-xl animate-pulse"
            @click="drawNextCard"
          >
            DRAW THREAT
          </Button>
          <div class="mt-8">
            <Badge variant="outline">Cards in Deck: {{ threatDeck.length }}</Badge>
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
          
          <!-- First Time Toggle for Face Cards -->
          <div v-if="isFaceCard" class="flex justify-center animate-fade-in">
            <Toggle 
              v-model="isFirstTime"
              labelOn="First Encounter"
              labelOff="Recurring Nightmare"
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
      <div class="max-w-2xl mx-auto space-y-8">
        
        <!-- Target Difficulty (Face Cards/Jokers only) -->
        <div v-if="isFaceCard || selectedJoker" class="space-y-4 animate-fade-in">
          <Text variant="label" class="text-center">Target Difficulty (Trophy Pile Top)</Text>
          <div class="flex justify-center">
            <input 
              type="number" 
              v-model="targetDifficulty"
              class="bg-nott-black border border-nott-red text-nott-white text-4xl font-display text-center w-24 h-24 rounded focus:ring-nott-red focus:border-nott-red"
              placeholder="?"
            >
          </div>
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

          <Card :title="falloutResult?.title" class="border-nott-red">
            <Text variant="body" class="mb-2">{{ falloutResult?.description }}</Text>
            <Text variant="caption">{{ falloutResult?.mechanic }}</Text>
          </Card>
        </div>
      </div>
    </WizardStep>

    <!-- Step 6: Update -->
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
      <div class="max-w-2xl mx-auto space-y-6">
        
        <!-- Result Card -->
        <Card v-if="isSuccess" title="You Succeeded" class="border-green-500/50">
          <div class="space-y-4 text-nott-white/80">
            <div v-if="selectedJoker === 'Red'">
              <Text variant="h3" color="success" class="text-center">SURVIVORS WIN</Text>
              <Text variant="body" class="text-center">You have defeated the Killer and survived the night.</Text>
            </div>
            <div v-else-if="selectedJoker === 'Black'">
              <Text variant="h3">The Twist Succeeded</Text>
              <Text variant="body">Remove the highest Face Card from the Threat Deck.</Text>
              <Text variant="caption" color="muted" class="mt-2">Remove the Black Joker from the game.</Text>
            </div>
            <div v-else>
              <!-- Face Card Success -->
              <div v-if="isFaceCard" class="space-y-4">
                <div>
                  <Text variant="label" color="red" class="mb-1">1. The Killer Retaliates:</Text>
                  <Text variant="body" v-if="rollFallout && rollFallout <= 2">Add a random <strong>Jack</strong> to the Threat Deck.</Text>
                  <Text variant="body" v-if="rollFallout && rollFallout >= 3">Add a random <strong>Queen</strong> to the Threat Deck.</Text>
                </div>
                <div>
                  <Text variant="label" color="red" class="mb-1">2. Check for Weakness:</Text>
                  <Text variant="body"><strong>Is this the first time you've defeated a {{ selectedSuit }} Face Card?</strong></Text>
                  <ul class="list-disc list-inside text-nott-white/80 ml-2 mt-1">
                    <li><Text variant="body" as="span"><strong>Yes:</strong> Remove this card from the game (Weakness Found).</Text></li>
                    <li><Text variant="body" as="span"><strong>No:</strong> Shuffle this card back into the Threat Deck.</Text></li>
                  </ul>
                </div>
              </div>

              <!-- Number Card Success -->
              <div v-else class="space-y-4">
                <Text variant="body" class="flex gap-2"><span class="text-green-500 font-bold">1.</span> Move <strong>{{ cardName }}</strong> to <strong>Trophy Pile</strong> (sets new Base Difficulty).</Text>
                <Text variant="body" v-if="!isEndgame" class="flex gap-2"><span class="text-green-500 font-bold">2.</span> Add next <strong>Number Reserve</strong> card to bottom of Threat Deck.</Text>
              </div>
            </div>
          </div>
        </Card>

        <Card v-else title="You Failed" class="border-nott-red">
          <div class="space-y-4 text-nott-white/80">
            <div v-if="selectedJoker === 'Red'">
              <Text variant="h3" color="red" class="text-center">CHARACTER DIES</Text>
              <Text variant="body" class="text-center">Reshuffle the Red Joker into the deck.</Text>
            </div>
            <div v-else-if="selectedJoker === 'Black'">
              <Text variant="h3" color="red">The Twist Failed</Text>
              <Text variant="body">Add another King to the Threat Deck.</Text>
              <Text variant="caption" color="muted" class="mt-2">Remove the Black Joker from the game.</Text>
            </div>
            <div v-else>
              <!-- Face Card Failure -->
              <div v-if="isFaceCard" class="space-y-4">
                <div>
                  <Text variant="label" color="red" class="mb-1">1. The Killer Strikes:</Text>
                  <Text variant="body">Gain a <strong>Strike</strong>.</Text>
                </div>
                <div>
                  <Text variant="label" color="red" class="mb-1">2. The Horror Grows:</Text>
                  <Text variant="body">Add a random <strong>King</strong> to the bottom of the Threat Deck.</Text>
                </div>
                <div>
                  <Text variant="label" color="red" class="mb-1">3. The Threat Remains:</Text>
                  <Text variant="body">Shuffle this card back into the Threat Deck.</Text>
                </div>
              </div>

              <!-- Number Card Failure -->
              <div v-else class="space-y-4">
                <Text variant="body" class="flex gap-2"><span class="text-nott-red font-bold">1.</span> Move <strong>{{ cardName }}</strong> to <strong>bottom of Threat Deck</strong>.</Text>
                <Text variant="body" v-if="!isEndgame" class="flex gap-2"><span class="text-nott-red font-bold">2.</span> Add next <strong>Number Reserve</strong> card to bottom of Threat Deck.</Text>
              </div>
            </div>
          </div>
        </Card>

        <!-- Endgame Trigger -->
        <div v-if="!isEndgame" class="flex flex-col items-center pt-8 border-t border-nott-gray/30 space-y-4">
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
        </div>
      </div>
    </WizardStep>
  </div>
</template>
