<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import Toggle from '../Toggle.vue'
import Text from '../Text.vue'
import Card from '../Card.vue'
import Button from '../Button.vue'
import ProcessStep from '../ProcessStep.vue'

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
  playerGenrePoints,
  pendingFalloutRank,
  getRankName,
  selectedJoker
} = useLivePlay()

const emit = defineEmits<{
  (e: 'back'): void
}>()
</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in">
    <Text class="mb-8" variant="quote" align="center" color="muted">
      The dust settles. The game state changes. Update the decks and prepare for what comes next.
    </Text>

    <div class="space-y-8 mb-12">
      <Card title="Genre Point Checkpoint">
        <Text align="center" variant="body">Did a player play into a trope, make a great roleplay choice, or terrify the table?</Text>
        <div class="mb-4 mt-4 text-center">
          <Toggle 
            :model-value="isGenrePointAwarded"
            @update:model-value="toggleGenrePointAward"
            label-on="Genre Point Awarded"
            label-off="Award Genre Point?"
            :disabled="!isGenrePointAwarded && tableGenrePoints === 0"
          />
        </div>
        <Text align="center" variant="caption" color="muted">Tokens on Table: {{ tableGenrePoints }} | Tokens Held: {{ playerGenrePoints }}</Text>
      </Card>

      <Card title="Update Physical Decks">
        <div class="space-y-8">
          <div v-if="isSuccess" class="animate-fade-in">
            <div class="text-center mb-8 border-b border-nott-green/30 pb-4">
              <Text variant="h2" color="success" glow class="mb-2">SUCCESS</Text>
              <Text variant="caption" color="muted">The character manages to accomplish their goal.</Text>
            </div>

            <div class="space-y-6 relative">
              <!-- Vertical Line -->
              <div class="absolute left-[15px] top-2 bottom-2 w-0.5 bg-nott-gray/30"></div>

              <!-- Joker Success Handling -->
              <template v-if="selectedJoker">
                  <!-- Red Joker Success -->
                  <ProcessStep 
                    v-if="selectedJoker === 'Red'" 
                    step="!" 
                    variant="success" 
                    title="Victory"
                  >
                    <Text variant="body">The Red Joker is defeated. You have survived the night.</Text>
                    <Text variant="caption" color="muted" class="mt-2">Proceed to see your final score.</Text>
                  </ProcessStep>

                  <!-- Black Joker Success -->
                  <div v-else-if="selectedJoker === 'Black'" class="space-y-6">
                    <ProcessStep step="1" variant="success" title="One Last Chance">
                        <Text variant="body">Remove the <strong>Black Joker</strong> from the game.</Text>
                    </ProcessStep>
                    <ProcessStep step="2" variant="success" title="A Small Victory">
                        <Text variant="body">Remove the highest Face Card from the Threat Deck.</Text>
                    </ProcessStep>
                  </div>
              </template>

              <!-- Standard Card Success Handling -->
              <template v-else>
                  <!-- Step 1 -->
                  <ProcessStep step="1" variant="success" title="Update Trophy Pile">
                      <Text variant="body">Move the <strong>{{ cardName }}</strong> to the top of the Trophy Pile.</Text>
                      <Text variant="caption" color="muted" class="mt-1 block">This becomes the new Base Difficulty for the next Face Card the characters face.</Text>
                  </ProcessStep>
                  
                  <!-- Step 2 (Number Card) -->
                  <ProcessStep 
                    v-if="!isFaceCard" 
                    step="2" 
                    variant="success" 
                    title="Add Reserve"
                  >
                      <Text variant="body">Take the next card from the <strong>Number Reserve</strong> and add it to the bottom of the Threat Deck.</Text>
                  </ProcessStep>

                  <!-- Face Card Steps -->
                  <template v-else>
                    <!-- Step 2 -->
                    <ProcessStep step="2" variant="success" title="Check for Weakness">
                        <Card v-if="isFirstTime" variant="success" :interactive="false" class="p-1 mt-1">
                          <Text variant="body" color="success" class="mb-1"><strong>Weakness Found!</strong></Text>
                          <Text variant="caption" class="block mb-2">This is the first time you've defeated a {{ selectedSuit }} Face Card.</Text>
                          <Text variant="body"><strong>Remove this card from the game.</strong></Text>
                        </Card>
                        <Card v-else variant="failure" :interactive="false" class="p-1 mt-1">
                          <Text variant="body" color="red" class="mb-1"><strong>Weakness Already Known</strong></Text>
                          <Text variant="caption" class="block mb-2">You have already found the weakness for {{ selectedSuit }}.</Text>
                          <Text variant="body"><strong>Shuffle this card back into the physical Threat Deck.</strong></Text>
                        </Card>
                    </ProcessStep>

                    <!-- Step 3 -->
                    <ProcessStep step="3" variant="success" title="The Killer Retaliates">
                        <div v-if="effortResult" class="bg-nott-white/5 p-3 rounded mt-1 border border-nott-white/10">
                          <Text variant="body" class="mb-1"><strong>{{ effortResult.title }} ({{ effortResult.level }})</strong></Text>
                          <Text v-if="pendingFalloutRank" variant="body">Add a random <strong>{{ getRankName(pendingFalloutRank) }}</strong> to the Threat Deck.</Text>
                          <Text v-else variant="body" color="muted">No Face Cards left in reserve!</Text>
                        </div>
                    </ProcessStep>
                    
                    <!-- Step 4 -->
                    <ProcessStep step="4" variant="success" title="The Threat Remains">
                        <Text variant="body"><strong>Shuffle the entire Threat Deck and Trophy Pile.</strong></Text>
                    </ProcessStep>
                  </template>
              </template>
            </div>
          </div>

          <div v-else class="animate-fade-in">
            <div class="text-center mb-8 border-b border-nott-red/30 pb-4">
              <Text variant="h2" color="red" glow class="mb-2">FAILURE</Text>
              <Text variant="caption" color="muted">The horror deepens...</Text>
            </div>

            <div class="space-y-6 relative">
              <!-- Vertical Line -->
              <div class="absolute left-[15px] top-2 bottom-2 w-0.5 bg-nott-gray/30"></div>

              <!-- Joker Steps -->
              <template v-if="selectedJoker">
                 <!-- Red Joker -->
                 <template v-if="selectedJoker === 'Red'">
                    <ProcessStep 
                        v-if="isSuccess" 
                        step="!" 
                        variant="failure" 
                        title="Victory"
                    >
                        <Text variant="body">The Red Joker is defeated. You have survived.</Text>
                    </ProcessStep>
                    <ProcessStep 
                        v-else 
                        step="!" 
                        variant="failure" 
                        title="The End"
                    >
                        <Text variant="body"><strong>Your character is killed.</strong></Text>
                        <Text variant="body" class="mt-2">Shuffle the <strong>Red Joker</strong> back into the Threat Deck.</Text>
                    </ProcessStep>
                 </template>

                 <!-- Black Joker -->
                 <template v-else-if="selectedJoker === 'Black'">
                    <ProcessStep step="1" variant="failure" title="One Last Chance">
                        <Text variant="body">Remove the <strong>Black Joker</strong> from the game.</Text>
                    </ProcessStep>
                    <ProcessStep 
                        v-if="isSuccess" 
                        step="2" 
                        variant="failure" 
                        title="A Small Victory"
                    >
                        <Text variant="body">Remove the highest Face Card from the Threat Deck.</Text>
                    </ProcessStep>
                    <ProcessStep 
                        v-else 
                        step="2" 
                        variant="failure" 
                        title="The Horror Grows"
                    >
                        <Text variant="body">Add a random <strong>King</strong> to the Threat Deck.</Text>
                    </ProcessStep>
                 </template>
              </template>

              <!-- Standard Card Steps (Face or Number) -->
              <template v-else>
                  <!-- Step 1: Place Card -->
                  <ProcessStep step="1" variant="failure" title="Threat Deck">
                      <Text variant="body">Place the <strong>{{ cardName }}</strong> at the bottom of the Threat Deck.</Text>
                  </ProcessStep>

                  <!-- Step 2 (Number Card) -->
                  <ProcessStep 
                    v-if="!isFaceCard" 
                    step="2" 
                    variant="failure" 
                    title="Add Reserve"
                  >
                      <Text variant="body">Take the next card from the <strong>Number Reserve</strong> and add it to the bottom of the Threat Deck.</Text>
                  </ProcessStep>

                  <!-- Face Card Steps -->
                  <template v-else>
                    <ProcessStep step="2" variant="failure" title="The Killer Strikes">
                        <Text variant="body">Mark 1 Strike on your character sheet.</Text>
                    </ProcessStep>
                    <ProcessStep step="3" variant="failure" title="The Horror Grows">
                        <Text v-if="pendingFalloutRank" variant="body">Add a random <strong>{{ getRankName(pendingFalloutRank) }}</strong> to the bottom of the Threat Deck.</Text>
                        <Text v-else variant="body" color="muted">No Face Cards left in reserve!</Text>
                    </ProcessStep>
                    <ProcessStep step="4" variant="failure" title="The Threat Remains">
                        <Text variant="body"><strong>Shuffle the entire Threat Deck and Trophy Pile.</strong></Text>
                    </ProcessStep>
                  </template>
              </template>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Action Footer -->
    <div class="flex justify-center pt-8 border-t border-nott-gray/30">
      <Button 
        size="lg"
        variant="primary" 
        @click="startNextScene"
        class="px-12"
      >
        {{ (selectedJoker === 'Red' && isSuccess) ? 'Finish Game' : 'Start Next Scene →' }}
      </Button>
    </div>
  </div>
</template>
