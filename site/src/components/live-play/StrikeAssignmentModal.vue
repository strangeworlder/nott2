<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import Card from '../Card.vue'
import Text from '../Text.vue'
import SelectionButton from '../SelectionButton.vue'
import ActionFooter from '../ActionFooter.vue'
import Icon from '../Icon.vue'
import { ref, computed } from 'vue'

const { characters, assignStrike, strikesToAssign } = useLivePlay()

const selectedSuit = ref<string | null>(null)
const assignAll = ref(false)

const confirmStrike = () => {
    if (selectedSuit.value) {
        const count = assignAll.value ? strikesToAssign.value : 1
        for (let i = 0; i < count; i++) {
            assignStrike(selectedSuit.value as any)
        }
        selectedSuit.value = null
        assignAll.value = false
    }
}

const getCharacterName = (suit: string) => {
    return characters.value.find(c => c.id === suit)?.name || ''
}

const getStrikes = (suit: string) => {
    return characters.value.find(c => c.id === suit)?.strikes || 0
}

const isDead = (suit: string) => {
    return characters.value.find(c => c.id === suit)?.isDead || false
}

</script>

<template>
  <div v-if="strikesToAssign > 0" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
    <Card class="w-full max-w-md border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
      <div class="text-center space-y-6">
        <div>
            <Text variant="h2" color="red" class="mb-2">
                ASSIGN {{ strikesToAssign }} STRIKE{{ strikesToAssign > 1 ? 'S' : '' }}
            </Text>
            <Text variant="body" color="white">The Active Player gains a Strike.</Text>
            <Text v-if="strikesToAssign > 1" variant="caption" color="red" class="mt-2 font-bold animate-pulse">
                PENDING STRIKES: {{ strikesToAssign }}
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
                    <Icon :name="char.id as any" class="w-6 h-6" />
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

                <Text v-if="char.isDead" variant="caption" color="red" class="font-bold uppercase">ELIMINATED</Text>
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
                Assign all {{ strikesToAssign }} strikes to this character?
            </label>
        </div>

        <ActionFooter 
            :label="assignAll ? `CONFIRM ${strikesToAssign} STRIKES` : 'CONFIRM STRIKE'"
            :disabled="!selectedSuit"
            @click="confirmStrike"
        />
      </div>
    </Card>
  </div>
</template>
