<script setup lang="ts">
/**
 * StrikeAssignmentModal
 *
 * Philosophical:
 * The StrikeAssignmentModal represents a moment of consequence. When the horror finally
 * catches up, this modal demands attention—forcing the player to acknowledge the damage
 * and choose which character bears the brunt. Its urgency is reflected in its visual
 * prominence: a red-bordered overlay that cannot be ignored. It is the narrative beat
 * where survival becomes tangibly more difficult.
 *
 * Technical:
 * A modal overlay for assigning strikes to characters after a failed encounter.
 *
 * Props:
 * (None - uses useLivePlay composable directly)
 *
 * Internal State:
 * - selectedSuit: The currently selected character to receive the strike.
 * - assignAll: Whether to assign all pending strikes to one character.
 */

import { computed, ref } from 'vue';
import { useLivePlay } from '../../composables/useLivePlay';
import { getStrikeAssignmentContent } from '../../utils/contentLoader';
import ActionFooter from '../ActionFooter.vue';
import Card from '../Card.vue';
import Icon, { type IconName } from '../Icon.vue';
import SelectionButton from '../SelectionButton.vue';
import Text from '../Text.vue';

const { characters, assignStrike, strikesToAssign, selectedPlayset } = useLivePlay();
const content = getStrikeAssignmentContent(selectedPlayset.value);

const selectedSuit = ref<string | null>(null);
const assignAll = ref(false);

const confirmStrike = () => {
  if (selectedSuit.value) {
    const count = assignAll.value ? strikesToAssign.value : 1;
    for (let i = 0; i < count; i++) {
      assignStrike(selectedSuit.value as string);
    }
    selectedSuit.value = null;
    assignAll.value = false;
  }
};

const titleText = computed(() => {
  return content.title
    .replace('{count}', strikesToAssign.value.toString())
    .replace('{plural}', strikesToAssign.value > 1 ? 'S' : '');
});

const pendingText = computed(() => {
  return content.pendingLabel.replace('{count}', strikesToAssign.value.toString());
});

const assignAllText = computed(() => {
  return content.assignAllLabel.replace('{count}', strikesToAssign.value.toString());
});

const confirmButtonText = computed(() => {
  if (assignAll.value) {
    return content.confirmAllButton.replace('{count}', strikesToAssign.value.toString());
  }
  return content.confirmButton;
});
</script>

<template>
  <div v-if="strikesToAssign > 0" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
    <Card class="w-full max-w-md border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
      <div class="text-center space-y-6">
        <div>
            <Text variant="h2" color="red" class="mb-2">
                {{ titleText }}
            </Text>
            <Text variant="body" color="white">{{ content.subtitle }}</Text>
            <Text v-if="strikesToAssign > 1" variant="caption" color="red" class="mt-2 font-bold animate-pulse">
                {{ pendingText }}
            </Text>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <SelectionButton
                v-for="char in characters"
                :key="char.id"
                :selected="selectedSuit === char.id"
                :disabled="char.isDead"
                @click="selectedSuit = char.id"
                class="h-auto py-4 flex flex-col gap-2"
            >
                <div class="flex items-center justify-center gap-2">
                    <Icon :name="char.id as IconName" class="w-6 h-6" />
                    <Text variant="label" :color="char.isDead ? 'muted' : 'white'">{{ char.name }}</Text>
                </div>
                
                <div class="flex justify-center gap-1">
                    <div 
                        v-for="i in 3" 
                        :key="i"
                        class="w-3 h-3 rounded-full border border-nott-red transition-colors"
                        :class="{
                            'bg-nott-red': i <= char.strikes,
                            'bg-transparent': i > char.strikes
                        }"
                    ></div>
                </div>

                <Text v-if="char.isDead" variant="caption" color="red" class="font-bold uppercase">{{ content.eliminatedLabel }}</Text>
            </SelectionButton>
        </div>

        <div v-if="strikesToAssign > 1" class="flex items-center justify-center gap-2">
            <input 
                type="checkbox" 
                id="assignAll" 
                v-model="assignAll"
                class="w-4 h-4 text-nott-red bg-nott-black border-nott-gray focus:ring-nott-red rounded"
            >
            <label for="assignAll" class="text-white text-sm cursor-pointer select-none">
                {{ assignAllText }}
            </label>
        </div>

        <ActionFooter 
            :label="confirmButtonText"
            :disabled="!selectedSuit"
            @click="confirmStrike"
        />
      </div>
    </Card>
  </div>
</template>
