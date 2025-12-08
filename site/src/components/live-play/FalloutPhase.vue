<script setup lang="ts">
/**
 * FalloutPhase
 *
 * Philosophical:
 * The Fallout Phase is the aftermath—where victories are consolidated and defeats
 * exact their toll. It serves as the mechanical housekeeping phase, but narratively
 * it's the moment of reckoning. Trophy cards are claimed, threats grow stronger,
 * and the deck state shifts. This phase turns abstract outcomes into tangible
 * changes in game state, preparing the world for the next scene.
 *
 * Technical:
 * A phase component that guides players through post-resolution deck management.
 * Displays different instructions based on success/failure and card type.
 *
 * Props:
 * (None - uses useLivePlay composable directly)
 *
 * Events:
 * - back: Emitted when the user wants to return to the previous phase.
 */

import { computed, ref, watch } from 'vue';
import { useLivePlay } from '../../composables/useLivePlay';
import { getFalloutPhaseContent } from '../../utils/contentLoader';
import ActionFooter from '../ActionFooter.vue';
import Card from '../Card.vue';
import ProcessStep from '../ProcessStep.vue';
import Text from '../Text.vue';
import Toggle from '../Toggle.vue';
import StrikeAssignmentModal from './StrikeAssignmentModal.vue';

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
  getRankName,
  selectedJoker,
  selectedPlayset,
  selectedRank,
  pendingFalloutRank,
  strikesToAssign,
} = useLivePlay();

const emit = defineEmits<(e: 'back') => void>();

const content = computed(() => getFalloutPhaseContent(selectedPlayset.value));

const isAssigningStrikes = ref(false);

const hasStrikesToAssign = computed(() => (strikesToAssign.value || 0) > 0);

const buttonLabel = computed(() => {
  if (selectedJoker.value === 'Red' && isSuccess.value) {
    return content.value.buttons.finish;
  }

  if (hasStrikesToAssign.value) {
    return content.value.buttons.assignStrikes;
  }

  return content.value.buttons.next;
});

const handleAction = () => {
  if (hasStrikesToAssign.value) {
    isAssigningStrikes.value = true;
  } else {
    startNextScene();
  }
};

// Auto-proceed to next scene after all strikes are assigned
watch(hasStrikesToAssign, (hasStrikes) => {
  if (!hasStrikes && isAssigningStrikes.value) {
    isAssigningStrikes.value = false;
    startNextScene();
  }
});

const genrePointCaption = computed(() => {
  return content.value.genrePoint.caption
    .replace('{table}', tableGenrePoints.value.toString())
    .replace('{player}', playerGenrePoints.value.toString());
});

const trophyText = computed(() => {
  return content.value.standard.success.trophy.body.replace('{card}', cardName.value);
});

const isAce = computed(() => selectedRank.value === 1);

const threatText = computed(() => {
  return content.value.standard.failure.threat.body.replace('{card}', cardName.value);
});

const weaknessFoundCaption = computed(() => {
  return content.value.standard.success.weakness.found.caption.replace(
    '{suit}',
    selectedSuit.value || ''
  );
});

const weaknessKnownCaption = computed(() => {
  return content.value.standard.success.weakness.known.caption.replace(
    '{suit}',
    selectedSuit.value || ''
  );
});

const retaliateText = computed(() => {
  if (!pendingFalloutRank.value) return '';
  return content.value.standard.success.retaliate.add.replace(
    '{rank}',
    getRankName(pendingFalloutRank.value)
  );
});

const growText = computed(() => {
  if (!pendingFalloutRank.value) return '';
  return content.value.standard.failure.grow.add.replace(
    '{rank}',
    getRankName(pendingFalloutRank.value)
  );
});

const isBreakingPoint = computed(() => {
  return effortResult.value?.level === 4;
});
</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in">
    <Text class="mb-8" variant="quote" align="center" color="muted">
      <span v-html="content.intro"></span>
    </Text>

    <div class="space-y-8 mb-12">
      <Card :title="content.genrePoint.title">
        <Text align="center" variant="body">{{ content.genrePoint.body }}</Text>
        <div class="mb-4 mt-4 text-center">
          <Toggle 
            :model-value="isGenrePointAwarded"
            @update:model-value="toggleGenrePointAward"
            :label-on="content.genrePoint.labelOn"
            :label-off="content.genrePoint.labelOff"
            :disabled="!isGenrePointAwarded && tableGenrePoints === 0"
            variant="switch"
          />
        </div>
        <Text align="center" variant="caption" color="muted">{{ genrePointCaption }}</Text>
      </Card>

      <Card :title="content.decks.title">
        <div class="space-y-8">
          <div v-if="isSuccess" class="animate-fade-in">
            <div class="text-center mb-8">
              <Text variant="h2" color="success" glow class="mb-2 border-b border-nott-green/30 pb-4 inline-block w-full">{{ content.decks.success.title }}</Text>
              <Text variant="caption" color="muted">{{ content.decks.success.caption }}</Text>
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
                    :title="content.jokers.red.victory.title"
                  >
                    <Text variant="body"><span v-html="content.jokers.red.victory.body"></span></Text>
                    <Text variant="caption" color="muted" class="mt-2"><span v-html="content.jokers.red.victory.caption"></span></Text>
                  </ProcessStep>

                  <!-- Black Joker Success -->
                  <div v-else-if="selectedJoker === 'Black'" class="space-y-6">
                    <ProcessStep step="1" variant="success" :title="content.jokers.black.remove.title">
                        <Text variant="body"><span v-html="content.jokers.black.remove.body"></span></Text>
                    </ProcessStep>
                    <ProcessStep step="2" variant="success" :title="content.jokers.black.success.title">
                        <Text variant="body"><span v-html="content.jokers.black.success.body"></span></Text>
                    </ProcessStep>
                  </div>
              </template>

              <!-- Standard Card Success Handling -->
              <template v-else>
                  <!-- Ace Success -->
                  <template v-if="isAce">
                      <ProcessStep step="1" variant="success" :title="content.standard.success.ace?.title">
                          <Text variant="body"><span v-html="content.standard.success.ace?.body"></span></Text>
                      </ProcessStep>
                  </template>

                  <!-- Number Card Success -->
                  <template v-else-if="!isFaceCard">
                      <ProcessStep step="1" variant="success" :title="content.standard.success.trophy.title">
                          <Text variant="body"><span v-html="trophyText"></span></Text>
                          <Text variant="caption" color="muted" class="mt-1 block"><span v-html="content.standard.success.trophy.caption"></span></Text>
                      </ProcessStep>
                      
                      <ProcessStep step="2" variant="success" :title="content.standard.success.reserve.title">
                          <Text variant="body"><span v-html="content.standard.success.reserve.body"></span></Text>
                      </ProcessStep>
                  </template>

                  <!-- Face Card Success -->
                  <template v-else>
                      <ProcessStep step="1" variant="success" :title="content.standard.success.weakness.title">
                          <Card v-if="isFirstTime" variant="success" :interactive="false" class="p-1 mt-1">
                            <Text variant="body" color="success" class="mb-1"><strong><span v-html="content.standard.success.weakness.found.title"></span></strong></Text>
                            <Text variant="caption" class="block mb-2"><span v-html="weaknessFoundCaption"></span></Text>
                            <Text variant="body"><strong><span v-html="content.standard.success.weakness.found.action"></span></strong></Text>
                          </Card>
                          <Card v-else variant="failure" :interactive="false" class="p-1 mt-1">
                            <Text variant="body" color="red" class="mb-1"><strong><span v-html="content.standard.success.weakness.known.title"></span></strong></Text>
                            <Text variant="caption" class="block mb-2"><span v-html="weaknessKnownCaption"></span></Text>
                            <Text variant="body"><strong><span v-html="content.standard.success.weakness.known.action"></span></strong></Text>
                          </Card>
                      </ProcessStep>

                      <ProcessStep step="2" variant="success" :title="content.standard.success.retaliate.title">
                          <Card v-if="effortResult" variant="instruction" :interactive="false" class="mt-1">
                            <Text variant="body" class="mb-1"><strong>{{ effortResult.title }} ({{ effortResult.level }})</strong></Text>
                            <Text v-if="pendingFalloutRank" variant="body"><span v-html="retaliateText"></span></Text>
                            <Text v-else variant="body" color="muted">{{ content.standard.success.retaliate.empty }}</Text>
                          </Card>
                      </ProcessStep>
                      
                      <ProcessStep step="3" variant="success" :title="content.standard.success.remains.title">
                          <Text variant="body"><strong><span v-html="content.standard.success.remains.body"></span></strong></Text>
                      </ProcessStep>
                  </template>

                  <!-- Breaking Point Step (Success) -->
                  <ProcessStep 
                    v-if="isBreakingPoint" 
                    step="!" 
                    variant="failure" 
                    :title="content.breakingPoint.title"
                  >
                      <Text variant="body"><span v-html="content.breakingPoint.body"></span></Text>
                  </ProcessStep>
              </template>
            </div>
          </div>

          <div v-else class="animate-fade-in">
            <div class="text-center mb-8">
              <Text variant="h2" color="red" glow class="mb-2 border-b border-nott-red/30 pb-4 inline-block w-full">{{ content.decks.failure.title }}</Text>
              <Text variant="caption" color="muted">{{ content.decks.failure.caption }}</Text>
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
                        :title="content.jokers.red.victory.title"
                    >
                        <Text variant="body"><span v-html="content.jokers.red.victory.body"></span></Text>
                    </ProcessStep>
                    <ProcessStep 
                        v-else 
                        step="!" 
                        variant="failure" 
                        :title="content.jokers.red.defeat.title"
                    >
                        <Text variant="body"><strong><span v-html="content.jokers.red.defeat.body"></span></strong></Text>
                        <Text variant="body" class="mt-2"><span v-html="content.jokers.red.defeat.shuffle"></span></Text>
                    </ProcessStep>
                 </template>

                 <!-- Black Joker -->
                 <template v-else-if="selectedJoker === 'Black'">
                    <ProcessStep step="1" variant="failure" :title="content.jokers.black.remove.title">
                        <Text variant="body"><span v-html="content.jokers.black.remove.body"></span></Text>
                    </ProcessStep>
                    <ProcessStep 
                        v-if="isSuccess" 
                        step="2" 
                        variant="failure" 
                        :title="content.jokers.black.success.title"
                    >
                        <Text variant="body"><span v-html="content.jokers.black.success.body"></span></Text>
                    </ProcessStep>
                    <ProcessStep 
                        v-else 
                        step="2" 
                        variant="failure" 
                        :title="content.jokers.black.failure.title"
                    >
                        <Text variant="body"><span v-html="content.jokers.black.failure.body"></span></Text>
                    </ProcessStep>
                 </template>
              </template>

              <!-- Standard Card Steps (Face or Number) -->
              <template v-else>
                  <!-- Step 1: Place Card -->
                  <ProcessStep step="1" variant="failure" :title="content.standard.failure.threat.title">
                      <Text variant="body"><span v-html="threatText"></span></Text>
                  </ProcessStep>

                  <!-- Step 2 (Number Card) -->
                  <ProcessStep 
                    v-if="!isFaceCard" 
                    step="2" 
                    variant="failure" 
                    :title="content.standard.failure.reserve.title"
                  >
                      <Text variant="body"><span v-html="content.standard.failure.reserve.body"></span></Text>
                  </ProcessStep>

                  <!-- Face Card Steps -->
                  <template v-else>
                    <ProcessStep step="2" variant="failure" :title="content.standard.failure.strikes.title">
                        <Text variant="body"><span v-html="content.standard.failure.strikes.body"></span></Text>
                    </ProcessStep>
                    <ProcessStep step="3" variant="failure" :title="content.standard.failure.grow.title">
                        <Text v-if="pendingFalloutRank" variant="body"><span v-html="growText"></span></Text>
                        <Text v-else variant="body" color="muted">{{ content.standard.failure.grow.empty }}</Text>
                    </ProcessStep>
                    <ProcessStep step="4" variant="failure" :title="content.standard.failure.remains.title">
                        <Text variant="body"><strong><span v-html="content.standard.failure.remains.body"></span></strong></Text>
                    </ProcessStep>
                  </template>

                  <!-- Breaking Point Step (Failure) -->
                  <ProcessStep 
                    v-if="isBreakingPoint" 
                    step="!" 
                    variant="failure" 
                    :title="content.breakingPoint.title"
                  >
                      <Text variant="body"><span v-html="content.breakingPoint.body"></span></Text>
                  </ProcessStep>
              </template>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Action Footer -->
    <ActionFooter 
      :label="buttonLabel"
      @click="handleAction"
    />

    <StrikeAssignmentModal v-if="isAssigningStrikes && hasStrikesToAssign" />
  </div>
</template>
