<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import WizardStep from '../WizardStep.vue'
import Toggle from '../Toggle.vue'
import Text from '../Text.vue'

const { 
  isSuccess, 
  cardName, 
  isFaceCard, 
  isFirstTime, 
  selectedSuit, 
  effortResult,
  startNextScene,
  toggleGenrePointAward,
  isGenrePointAwarded,
  tableGenrePoints,
  playerGenrePoints
} = useLivePlay()

const emit = defineEmits<{
  (e: 'back'): void
}>()
</script>

<template>
  <WizardStep
    title="Update Game State"
    :step-number="6"
    :total-steps="6"
    :can-proceed="true"
    next-label="Start Next Scene"
    show-back
    @back="emit('back')"
    @next="startNextScene"
  >
    <div class="mb-6 text-center">
      <Text variant="quote" color="muted" class="italic">"The dust settles. The game state changes. Update the decks and prepare for what comes next."</Text>
    </div>

    <div class="space-y-8">
      <Card title="Genre Point Checkpoint">
        <div class="flex flex-col items-center text-center gap-4">
            <Text variant="body">Did a player play into a trope, make a great roleplay choice, or terrify the table?</Text>
            <div class="flex items-center gap-4">
                <Toggle 
                    :model-value="isGenrePointAwarded"
                    @update:model-value="toggleGenrePointAward"
                    label-on="Genre Point Awarded"
                    label-off="Award Genre Point?"
                    :disabled="!isGenrePointAwarded && tableGenrePoints === 0"
                />
            </div>
            <Text variant="caption" color="muted">Tokens on Table: {{ tableGenrePoints }} | Tokens Held: {{ playerGenrePoints }}</Text>
        </div>
      </Card>

      <Card title="Update Physical Decks">
        <div class="space-y-8">
          <div v-if="isSuccess" class="animate-fade-in">
            <div class="text-center mb-8 border-b border-green-500/30 pb-4">
              <Text variant="h2" class="text-green-500 text-shadow-glow-green mb-2">SUCCESS</Text>
              <Text variant="caption" color="muted">The characters prevail... for now.</Text>
            </div>

            <div class="space-y-6 relative">
              <!-- Vertical Line -->
              <div class="absolute left-[15px] top-2 bottom-2 w-0.5 bg-nott-gray/30"></div>

              <!-- Step 1 -->
              <div class="relative flex gap-6">
                <div class="w-8 h-8 rounded-full bg-nott-black border border-green-500/50 flex items-center justify-center shrink-0 z-10 text-green-500 font-display">1</div>
                <div class="flex-1">
                  <Text variant="label" color="success" class="mb-1">Update Trophy Pile</Text>
                  <Text variant="body">Move the <strong>{{ cardName }}</strong> to the top of the Trophy Pile.</Text>
                  <Text variant="caption" color="muted" class="mt-1 block">This becomes the new Base Difficulty.</Text>
                </div>
              </div>
              
              <!-- Step 2 (Number Card) -->
              <div v-if="!isFaceCard" class="relative flex gap-6">
                <div class="w-8 h-8 rounded-full bg-nott-black border border-green-500/50 flex items-center justify-center shrink-0 z-10 text-green-500 font-display">2</div>
                <div class="flex-1">
                  <Text variant="label" color="success" class="mb-1">Add Reserve</Text>
                  <Text variant="body">Take the next card from the <strong>Number Reserve</strong> and add it to the bottom of the Threat Deck.</Text>
                </div>
              </div>

              <!-- Face Card Steps -->
              <template v-else>
                <!-- Step 2 -->
                <div class="relative flex gap-6">
                  <div class="w-8 h-8 rounded-full bg-nott-black border border-green-500/50 flex items-center justify-center shrink-0 z-10 text-green-500 font-display">2</div>
                  <div class="flex-1">
                    <Text variant="label" color="success" class="mb-1">Check for Weakness</Text>
                    <div v-if="isFirstTime" class="bg-green-900/10 border border-green-500/30 p-3 rounded mt-1">
                      <Text variant="body" class="text-green-400 font-bold mb-1">Weakness Found!</Text>
                      <Text variant="caption" class="block mb-2">This is the first time you've defeated a {{ selectedSuit }} Face Card.</Text>
                      <Text variant="body"><strong>Remove this card from the game.</strong></Text>
                    </div>
                    <div v-else class="bg-nott-red/10 border border-nott-red/30 p-3 rounded mt-1">
                      <Text variant="body" class="text-nott-red font-bold mb-1">Weakness Already Known</Text>
                      <Text variant="caption" class="block mb-2">You have already found the weakness for {{ selectedSuit }}.</Text>
                      <Text variant="body"><strong>Shuffle this card back into the physical Threat Deck.</strong></Text>
                    </div>
                  </div>
                </div>

                <!-- Step 3 -->
                <div class="relative flex gap-6">
                  <div class="w-8 h-8 rounded-full bg-nott-black border border-green-500/50 flex items-center justify-center shrink-0 z-10 text-green-500 font-display">3</div>
                  <div class="flex-1">
                    <Text variant="label" color="success" class="mb-1">The Killer Retaliates</Text>
                    <div v-if="effortResult" class="bg-nott-white/5 p-3 rounded mt-1 border border-nott-white/10">
                      <Text variant="body" class="mb-1"><strong>{{ effortResult.title }} ({{ effortResult.level }})</strong></Text>
                      <Text v-if="effortResult.level <= 2" variant="body">Add a random <strong>Jack</strong> to the Threat Deck.</Text>
                      <Text v-else variant="body">Add a random <strong>Queen</strong> to the Threat Deck.</Text>
                    </div>
                  </div>
                </div>
                
                <!-- Step 4 -->
                <div class="relative flex gap-6">
                  <div class="w-8 h-8 rounded-full bg-nott-black border border-green-500/50 flex items-center justify-center shrink-0 z-10 text-green-500 font-display">4</div>
                  <div class="flex-1">
                    <Text variant="label" color="success" class="mb-1">The Threat Remains</Text>
                    <Text variant="body"><strong>Shuffle the entire Threat Deck and Trophy Pile.</strong></Text>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div v-else class="animate-fade-in">
            <div class="text-center mb-8 border-b border-nott-red/30 pb-4">
              <Text variant="h2" class="text-nott-red text-shadow-glow mb-2">FAILURE</Text>
              <Text variant="caption" color="muted">The horror deepens...</Text>
            </div>

            <div class="space-y-6 relative">
              <!-- Vertical Line -->
              <div class="absolute left-[15px] top-2 bottom-2 w-0.5 bg-nott-gray/30"></div>

              <!-- Step 1 -->
              <div class="relative flex gap-6">
                <div class="w-8 h-8 rounded-full bg-nott-black border border-nott-red/50 flex items-center justify-center shrink-0 z-10 text-nott-red font-display">1</div>
                <div class="flex-1">
                  <Text variant="label" color="red" class="mb-1">Threat Deck</Text>
                  <Text variant="body">Place the <strong>{{ cardName }}</strong> at the bottom of the Threat Deck.</Text>
                </div>
              </div>

              <!-- Step 2 (Number Card) -->
              <div v-if="!isFaceCard" class="relative flex gap-6">
                <div class="w-8 h-8 rounded-full bg-nott-black border border-nott-red/50 flex items-center justify-center shrink-0 z-10 text-nott-red font-display">2</div>
                <div class="flex-1">
                  <Text variant="label" color="red" class="mb-1">Add Reserve</Text>
                  <Text variant="body">Take the next card from the <strong>Number Reserve</strong> and add it to the bottom of the Threat Deck.</Text>
                </div>
              </div>

              <!-- Face Card Steps -->
              <template v-else>
                <div class="relative flex gap-6">
                  <div class="w-8 h-8 rounded-full bg-nott-black border border-nott-red/50 flex items-center justify-center shrink-0 z-10 text-nott-red font-display">2</div>
                  <div class="flex-1">
                    <Text variant="label" color="red" class="mb-1">The Killer Strikes</Text>
                    <Text variant="body">Mark 1 Strike on your character sheet.</Text>
                  </div>
                </div>
                <div class="relative flex gap-6">
                  <div class="w-8 h-8 rounded-full bg-nott-black border border-nott-red/50 flex items-center justify-center shrink-0 z-10 text-nott-red font-display">3</div>
                  <div class="flex-1">
                    <Text variant="label" color="red" class="mb-1">The Horror Grows</Text>
                    <Text variant="body">Add a random <strong>King</strong> to the bottom of the Threat Deck.</Text>
                  </div>
                </div>
                <div class="relative flex gap-6">
                  <div class="w-8 h-8 rounded-full bg-nott-black border border-nott-red/50 flex items-center justify-center shrink-0 z-10 text-nott-red font-display">4</div>
                  <div class="flex-1">
                    <Text variant="label" color="red" class="mb-1">The Threat Remains</Text>
                    <Text variant="body"><strong>Shuffle the entire Threat Deck and Trophy Pile.</strong></Text>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </WizardStep>
</template>
