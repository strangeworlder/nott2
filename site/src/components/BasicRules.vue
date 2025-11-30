<script setup lang="ts">
import { basicRules, characterRules } from '../data/rules'
import Card from './Card.vue'
</script>

<template>
  <div class="space-y-8">
    <!-- The d13 -->
    <Card :title="basicRules.d13.title">
      <p class="text-lg mb-2">{{ basicRules.d13.description }}</p>
      <p class="text-nott-red italic text-sm">{{ basicRules.d13.note }}</p>
    </Card>

    <!-- Deck Rules -->
    <section>
      <h3 class="text-2xl font-display text-nott-white mb-4 border-l-4 border-nott-red pl-4">{{ basicRules.deckRules.title }}</h3>
      <div class="grid gap-6 md:grid-cols-3">
        <Card :title="basicRules.deckRules.threat.title">
          <div class="space-y-2 text-nott-white/80">
            <p><strong class="text-nott-red">Setup:</strong> {{ basicRules.deckRules.threat.setup }}</p>
            <p>{{ basicRules.deckRules.threat.mechanic }}</p>
          </div>
        </Card>
        <Card :title="basicRules.deckRules.reserves.title">
          <ul class="list-disc list-inside text-nott-white/80 space-y-1">
            <li v-for="pile in basicRules.deckRules.reserves.piles" :key="pile">{{ pile }}</li>
          </ul>
        </Card>
        <Card :title="basicRules.deckRules.trophy.title">
          <div class="space-y-2 text-nott-white/80">
            <p><strong class="text-nott-red">Setup:</strong> {{ basicRules.deckRules.trophy.setup }}</p>
            <p>{{ basicRules.deckRules.trophy.mechanic }}</p>
          </div>
        </Card>
      </div>
    </section>

    <!-- Deck Updates -->
    <section>
      <h3 class="text-2xl font-display text-nott-white mb-4 border-l-4 border-nott-red pl-4">{{ basicRules.deckUpdates.title }}</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <Card :title="basicRules.deckUpdates.numberCards.title">
          <div class="space-y-4 text-nott-white/80">
            <div>
              <strong class="text-nott-red block mb-1">Success</strong>
              <p>{{ basicRules.deckUpdates.numberCards.success }}</p>
            </div>
            <div>
              <strong class="text-nott-red block mb-1">Failure</strong>
              <p>{{ basicRules.deckUpdates.numberCards.failure }}</p>
            </div>
          </div>
        </Card>
        <Card :title="basicRules.deckUpdates.faceCards.title">
          <div class="space-y-4 text-nott-white/80">
            <div>
              <strong class="text-nott-red block mb-1">Success</strong>
              <p>{{ basicRules.deckUpdates.faceCards.success }}</p>
            </div>
            <div>
              <strong class="text-nott-red block mb-1">Failure</strong>
              <p>{{ basicRules.deckUpdates.faceCards.failure }}</p>
            </div>
          </div>
        </Card>
      </div>
    </section>

    <!-- Game Loop -->
    <section>
      <h3 class="text-2xl font-display text-nott-white mb-4 border-l-4 border-nott-red pl-4">The Game Loop</h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div 
          v-for="step in basicRules.gameLoop" 
          :key="step.step"
          class="bg-nott-gray/10 p-4 rounded border border-nott-gray/30"
        >
          <h4 class="text-nott-red font-display uppercase mb-2">{{ step.step }}</h4>
          <p class="text-sm text-nott-white/80">{{ step.description }}</p>
        </div>
      </div>
    </section>

    <!-- Endgame -->
    <section>
      <h3 class="text-2xl font-display text-nott-white mb-4 border-l-4 border-nott-red pl-4">{{ basicRules.endgame.title }}</h3>
      <Card class="mb-6">
        <div class="text-nott-white/90 text-lg text-center">
          <p class="mb-2"><strong class="text-nott-red">Trigger:</strong> {{ basicRules.endgame.trigger }}</p>
          <p><strong class="text-nott-red">Setup:</strong> {{ basicRules.endgame.setup }}</p>
        </div>
      </Card>
      <div class="grid gap-6 md:grid-cols-2">
        <Card :title="basicRules.endgame.redJoker.title" class="border-nott-red/50">
          <div class="space-y-2 text-nott-white/80">
            <p class="italic">{{ basicRules.endgame.redJoker.effect }}</p>
            <div class="mt-4 pt-4 border-t border-nott-gray/30">
              <p><strong class="text-nott-red">Success:</strong> {{ basicRules.endgame.redJoker.success }}</p>
              <p><strong class="text-nott-red">Failure:</strong> {{ basicRules.endgame.redJoker.failure }}</p>
            </div>
          </div>
        </Card>
        <Card :title="basicRules.endgame.blackJoker.title">
          <div class="space-y-2 text-nott-white/80">
            <p class="italic">{{ basicRules.endgame.blackJoker.effect }}</p>
            <div class="mt-4 pt-4 border-t border-nott-gray/30">
              <p><strong class="text-nott-red">Success:</strong> {{ basicRules.endgame.blackJoker.success }}</p>
              <p><strong class="text-nott-red">Failure:</strong> {{ basicRules.endgame.blackJoker.failure }}</p>
            </div>
          </div>
        </Card>
      </div>
    </section>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Strikes -->
      <Card :title="basicRules.strikes.title">
        <ul class="list-disc list-inside space-y-2 mb-4 text-nott-white/90">
          <li v-for="trigger in basicRules.strikes.triggers" :key="trigger">
            {{ trigger }}
          </li>
        </ul>
        <p class="text-nott-red font-display uppercase text-sm">{{ basicRules.strikes.consequence }}</p>
      </Card>

      <!-- Genre Points -->
      <Card :title="basicRules.genrePoints.title">
        <p class="text-nott-white/90">{{ basicRules.genrePoints.description }}</p>
      </Card>
    </div>

    <!-- Character Rules -->
    <section>
      <h3 class="text-2xl font-display text-nott-white mb-4 border-l-4 border-nott-red pl-4">Character Rules</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <Card title="Creation">
          <ol class="list-decimal list-inside space-y-2 text-nott-white/80">
            <li v-for="step in characterRules.creationSteps" :key="step">{{ step }}</li>
          </ol>
        </Card>
        <Card title="Aptitudes">
          <p class="text-nott-white/80 mb-4">{{ characterRules.aptitudes.description }}</p>
          <ul class="space-y-2">
            <li v-for="apt in characterRules.aptitudes.list" :key="apt.name" class="flex items-center gap-2">
              <span class="text-nott-red font-display w-24">{{ apt.name }}</span>
              <span class="text-nott-white/60 text-sm">({{ apt.suit }}: {{ apt.description }})</span>
            </li>
          </ul>
        </Card>
      </div>
      <div class="mt-6">
        <h4 class="text-xl text-nott-white font-display mb-4">Archetypes</h4>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card v-for="arch in characterRules.archetypes" :key="arch.suit" :title="arch.suit + ' (' + arch.aptitude + ')'">
            <ul class="text-sm text-nott-white/60 space-y-1">
              <li v-for="ex in arch.examples" :key="ex">{{ ex }}</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>
