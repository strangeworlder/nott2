<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import WizardStep from '../WizardStep.vue'
import Card from '../Card.vue'
import Text from '../Text.vue'
import Badge from '../Badge.vue'

const { 
  isSuccess, 
  cardName, 
  isFaceCard, 
  isFirstTime, 
  selectedSuit, 
  effortResult,
  startNextScene
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
                  <Text variant="label" color="red" class="mb-1">3. The Killer Retaliates:</Text>
                  <div v-if="effortResult">
                    <Text variant="body"><strong>{{ effortResult.title }} ({{ effortResult.level }})</strong></Text>
                    <Text v-if="effortResult.level <= 2" variant="body" class="mt-1">Add a random <strong>Jack</strong> to the Threat Deck.</Text>
                    <Text v-else variant="body" class="mt-1">Add a random <strong>Queen</strong> to the Threat Deck.</Text>
                  </div>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <div class="w-8"></div>
                <div>
                  <Text variant="label" color="red" class="mb-1">4. The Threat Remains:</Text>
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
                  <Text variant="label" color="red" class="mb-1">2. The Killer Strikes:</Text>
                  <Text variant="body">Mark 1 Strike on your character sheet.</Text>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8"></div>
                <div>
                  <Text variant="label" color="red" class="mb-1">3. The Horror Grows:</Text>
                  <Text variant="body">Add a random <strong>King</strong> to the bottom of the Threat Deck.</Text>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8"></div>
                <div>
                  <Text variant="label" color="red" class="mb-1">4. The Threat Remains:</Text>
                  <Text variant="body"><strong>Shuffle the entire Threat Deck and Trophy Pile.</strong></Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </WizardStep>
</template>
