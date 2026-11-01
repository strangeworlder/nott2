<script setup lang="ts">
/**
 * BasicRules
 *
 * Philosophical:
 * BasicRules is the survivor's field manual—a quick, scannable digest of the
 * core mechanics that govern life and death at the table. It presents the rules
 * not as a dense textbook, but as structured tactical cards that players can
 * consult at a glance without losing the tension of the night.
 *
 * Technical:
 * Displays core game mechanics (d13, Decks, State Updates, Scene Loop, Three Acts
 * & Finale, Strikes, Genre Points, and Rules Modules) loaded dynamically via
 * contentLoader.
 *
 * Props:
 * (None - uses useLivePlay and contentLoader directly)
 */

import { computed } from 'vue';
import { useLivePlay } from '../../composables/useLivePlay';
import { getRulesContent } from '../../utils/contentLoader';
import Card from '../Card.vue';
import List from '../List.vue';
import ListItem from '../ListItem.vue';
import Text from '../Text.vue';

const { selectedPlayset } = useLivePlay();
const basicRules = computed(() => getRulesContent(selectedPlayset.value).basicRules);
</script>

<template>
  <div class="space-y-8">
    <!-- The d13 -->
    <Card :title="basicRules.d13.title">
      <div class="space-y-2">
        <Text variant="lead">{{ basicRules.d13.description }}</Text>
        <Text variant="caption" color="red">{{ basicRules.d13.note }}</Text>
      </div>
    </Card>

    <!-- Deck Rules -->
    <section class="space-y-4">
      <Text variant="h3" border="left">{{ basicRules.deckRules.title }}</Text>
      <div class="grid gap-6 md:grid-cols-3">
        <Card :title="basicRules.deckRules.threat.title">
          <div class="space-y-3">
            <div>
              <Text variant="label" color="red">{{ basicRules.deckRules.setupLabel }}</Text>
              <Text variant="body" color="muted">{{ basicRules.deckRules.threat.setup }}</Text>
            </div>
            <Text variant="body">{{ basicRules.deckRules.threat.mechanic }}</Text>
          </div>
        </Card>
        <Card :title="basicRules.deckRules.reserves.title">
          <List>
            <ListItem v-for="pile in basicRules.deckRules.reserves.piles" :key="pile">
              <Text variant="body" as="span">{{ pile }}</Text>
            </ListItem>
          </List>
        </Card>
        <Card :title="basicRules.deckRules.trophy.title">
          <div class="space-y-3">
            <div>
              <Text variant="label" color="red">{{ basicRules.deckRules.setupLabel }}</Text>
              <Text variant="body" color="muted">{{ basicRules.deckRules.trophy.setup }}</Text>
            </div>
            <Text variant="body">{{ basicRules.deckRules.trophy.mechanic }}</Text>
          </div>
        </Card>
      </div>
    </section>

    <!-- Deck Updates -->
    <section class="space-y-4">
      <Text variant="h3" border="left">{{ basicRules.deckUpdates.title }}</Text>
      <Card :title="basicRules.deckUpdates.aces.title">
        <Text variant="body" color="muted">{{ basicRules.deckUpdates.aces.description }}</Text>
      </Card>
      <div class="grid gap-6 md:grid-cols-2">
        <Card :title="basicRules.deckUpdates.numberCards.title">
          <div class="space-y-4">
            <div class="space-y-1">
              <Text variant="label" color="red">{{ basicRules.deckUpdates.successLabel }}</Text>
              <Text variant="body" color="muted">{{ basicRules.deckUpdates.numberCards.success }}</Text>
            </div>
            <div class="space-y-1">
              <Text variant="label" color="red">{{ basicRules.deckUpdates.failureLabel }}</Text>
              <Text variant="body" color="muted">{{ basicRules.deckUpdates.numberCards.failure }}</Text>
            </div>
          </div>
        </Card>
        <Card :title="basicRules.deckUpdates.faceCards.title">
          <div class="space-y-4">
            <div class="space-y-1">
              <Text variant="label" color="red">{{ basicRules.deckUpdates.successLabel }}</Text>
              <Text variant="body" color="muted">{{ basicRules.deckUpdates.faceCards.success }}</Text>
            </div>
            <div class="space-y-1">
              <Text variant="label" color="red">{{ basicRules.deckUpdates.failureLabel }}</Text>
              <Text variant="body" color="muted">{{ basicRules.deckUpdates.faceCards.failure }}</Text>
            </div>
          </div>
        </Card>
      </div>
    </section>

    <!-- Game Loop -->
    <section class="space-y-4">
      <Text variant="h3" border="left">{{ basicRules.gameLoopTitle }}</Text>
      <div class="grid gap-4 md:grid-cols-2">
        <Card
          v-for="step in basicRules.gameLoop"
          :key="step.step"
          :title="step.step"
        >
          <Text variant="body" color="muted">{{ step.description }}</Text>
        </Card>
      </div>
    </section>

    <!-- Three Acts & Endgame -->
    <section class="space-y-4">
      <Text variant="h3" border="left">{{ basicRules.endgame.title }}</Text>
      <div class="grid gap-4 md:grid-cols-2">
        <Card
          v-for="act in basicRules.endgame.acts"
          :key="act.title"
          :title="act.title"
        >
          <Text variant="body" color="muted">{{ act.description }}</Text>
        </Card>
      </div>
      <div class="grid gap-6 md:grid-cols-2">
        <Card :title="basicRules.endgame.redJoker.title">
          <div class="space-y-3">
            <Text variant="caption" color="muted">{{ basicRules.endgame.redJoker.effect }}</Text>
            <div class="pt-3 border-t border-nott-gray/30 space-y-2">
              <div>
                <Text variant="label" color="red" as="span">{{ basicRules.deckUpdates.successLabel }}: </Text>
                <Text variant="body" as="span">{{ basicRules.endgame.redJoker.success }}</Text>
              </div>
              <div>
                <Text variant="label" color="red" as="span">{{ basicRules.deckUpdates.failureLabel }}: </Text>
                <Text variant="body" as="span">{{ basicRules.endgame.redJoker.failure }}</Text>
              </div>
            </div>
          </div>
        </Card>
        <Card :title="basicRules.endgame.blackJoker.title">
          <div class="space-y-3">
            <Text variant="caption" color="muted">{{ basicRules.endgame.blackJoker.effect }}</Text>
            <div class="pt-3 border-t border-nott-gray/30 space-y-2">
              <div>
                <Text variant="label" color="red" as="span">{{ basicRules.deckUpdates.successLabel }}: </Text>
                <Text variant="body" as="span">{{ basicRules.endgame.blackJoker.success }}</Text>
              </div>
              <div>
                <Text variant="label" color="red" as="span">{{ basicRules.deckUpdates.failureLabel }}: </Text>
                <Text variant="body" as="span">{{ basicRules.endgame.blackJoker.failure }}</Text>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>

    <!-- Strikes & Genre Points -->
    <div class="grid gap-6 md:grid-cols-2">
      <Card :title="basicRules.strikes.title">
        <div class="space-y-4">
          <List spacing="md">
            <ListItem v-for="trigger in basicRules.strikes.triggers" :key="trigger">
              <Text variant="body" as="span">{{ trigger }}</Text>
            </ListItem>
          </List>
          <Text variant="label" color="red">{{ basicRules.strikes.consequence }}</Text>
        </div>
      </Card>

      <Card :title="basicRules.genrePoints.title">
        <Text variant="body" color="muted">{{ basicRules.genrePoints.description }}</Text>
      </Card>
    </div>

    <!-- Optional Rules Modules -->
    <section class="space-y-4">
      <Text variant="h3" border="left">{{ basicRules.rulesModules.title }}</Text>
      <div class="grid gap-6 md:grid-cols-2">
        <Card
          v-for="mod in basicRules.rulesModules.modules"
          :key="mod.name"
          :title="mod.name"
        >
          <Text variant="body" color="muted">{{ mod.description }}</Text>
        </Card>
      </div>
    </section>
  </div>
</template>
