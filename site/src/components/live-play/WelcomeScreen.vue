<script setup lang="ts">
/**
 * WelcomeScreen
 *
 * Philosophical:
 * The WelcomeScreen is the threshold—the moment before the horror begins. It sets
 * the tone, provides context, and offers a last breath of normalcy before the
 * players are plunged into the Night. Its purpose is immersion: to make players
 * feel they are about to experience something special and dangerous.
 *
 * Technical:
 * A landing page component that displays game introduction and requirements.
 *
 * Props:
 * (None - uses content from contentLoader)
 *
 * Events:
 * - next: Emitted when the user starts the game.
 */

import { getWelcomeScreenContent } from '../../utils/contentLoader';
import ActionFooter from '../ActionFooter.vue';
import Card from '../Card.vue';
import Separator from '../defaults/Separator.vue';
import Icon from '../Icon.vue';
import Text from '../Text.vue';

defineEmits(['next']);

const content = getWelcomeScreenContent();
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center space-y-12 animate-fade-in py-8">
    
    <!-- Hero Section -->
    <div class="space-y-8">
        <Text variant="h2" color="red">
            {{ content.title }}
        </Text>
        <div class="space-y-6 max-w-3xl mx-auto">
            <Text 
                v-for="(paragraph, index) in content.intro" 
                :key="index"
                variant="lead" 
                :color="index === content.intro.length - 1 ? 'red' : 'white'"
                :class="{ 'block mt-4': index === content.intro.length - 1 }"
            >
                <span v-html="paragraph"></span>
            </Text>
        </div>
    </div>

    <!-- Info Grid -->
    <div class="w-full px-4 py-8">
      <Separator />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card 
            v-for="(item, index) in content.infoGrid" 
            :key="index"
            variant="ghost" 
            :interactive="false" 
            :center="true"
        >
            <div class="flex flex-col items-center justify-start space-y-3">
                <Icon :name="item.icon as unknown as IconName" size="32" color="red" />
                <div class="space-y-1">
                    <Text variant="label" color="muted">{{ item.label }}</Text>
                    <Text variant="body">
                        <span v-html="item.value"></span>
                    </Text>
                </div>
            </div>
        </Card>
      </div>
      <Separator />
    </div>

    <!-- Action -->
    <ActionFooter 
      :label="content.buttonText"
      @click="$emit('next')"
    />
  </div>
</template>
