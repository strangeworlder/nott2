<script setup lang="ts">
import Text from '../Text.vue'
import Button from '../Button.vue'
import Icon from '../Icon.vue'
import Card from '../Card.vue'
import { getWelcomeScreenContent } from '../../utils/contentLoader'

defineEmits(['next'])

const content = getWelcomeScreenContent()
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4 border-t border-b border-nott-gray/30 py-8">
        <Card 
            v-for="(item, index) in content.infoGrid" 
            :key="index"
            variant="ghost" 
            :interactive="false" 
            :center="true"
        >
            <div class="flex flex-col items-center justify-start space-y-3">
                <Icon :name="item.icon as any" size="32" color="red" />
                <div class="space-y-1">
                    <Text variant="label" color="muted">{{ item.label }}</Text>
                    <Text variant="body">
                        <span v-html="item.value"></span>
                    </Text>
                </div>
            </div>
        </Card>
    </div>

    <!-- Action -->
    <div class="pt-8 animate-pulse-slow">
        <Button variant="primary" size="xl" @click="$emit('next')">
            {{ content.buttonText }}
        </Button>
    </div>
  </div>
</template>
