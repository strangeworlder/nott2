<script setup lang="ts">
import Card from '../Card.vue'
import Text from '../Text.vue'
import Button from '../Button.vue'
import ActionFooter from '../ActionFooter.vue'
import List from '../List.vue'
import ListItem from '../ListItem.vue'

defineProps<{
  act: number
}>()

const emit = defineEmits<{
  (e: 'next'): void
}>()
</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in">
    <div class="mb-6 text-center">
      <Text variant="h2" color="red" class="mb-2" align="center">
        <span v-if="act === 1">Act 1</span>
        <span v-else-if="act === 2">Act 2</span>
        <span v-else>Act 3</span>
      </Text>
      <Text variant="quote" align="center" color="muted">
        <span v-if="act === 1">
          The horror starts small, but it will escalate. This is not a story of heroes, but that of victims and the occasional survivor. 
          <Text as="span" color="red">Prepare</Text> yourself for a night of horror.
        </span>
        <span v-else-if="act === 2">
          You have now faced the killer. This means that the horror will now escalate. The shadows lengthen, and every choice could be your last.
          <Text as="span" color="red">Gird your loins</Text> for the horrors to come. The night has only begun.
        </span>
        <span v-else>
          This is it. <Text as="span" color="red">The final confrontation</Text>. There is no running anymore.
          The end begins now.
        </span>
      </Text>
    </div>

    <!-- Act 1 Content -->
    <div v-if="act === 1">
        <div class="grid gap-6 md:grid-cols-2 mb-12">
            <Card title="Build the Decks">
                <Text variant="body" color="muted" class="mb-4">Manually build the decks:</Text>
                <List variant="none" as="ol" spacing="lg">
                <ListItem class="flex items-start gap-2">
                    <Text variant="label" color="red">1.</Text>
                    <Text variant="body" as="span">
                        <strong>Number Reserves:</strong> Shuffle 5s. Repeat with 6s, 7s, 
                        8s, 9s, 10s. Stack them face-down so that 5s are on top and 10s on the bottom.
                    </Text>
                </ListItem>
                <ListItem class="flex items-start gap-2">
                    <Text variant="label" color="red">2.</Text>
                    <Text variant="body" as="span">
                        <strong>Face Reserves:</strong> Shuffle Jacks. Repeat with Queens and Kings. 
                        Put them each in their own pile face-down.
                    </Text>
                </ListItem>
                <ListItem class="flex items-start gap-2">
                    <Text variant="label" color="red">3.</Text>
                    <Text variant="body" as="span">
                        <strong>Threat Deck:</strong> Shuffle 2s, 3s and 4s and top card of the Jacks reserve pile together. 
                        Place facedown to form the Threat Deck. Shuffle 4 Aces and place them on top of the deck face up.
                    </Text>
                </ListItem>
                <ListItem class="flex items-start gap-2">
                    <Text variant="label" color="red">4.</Text>
                    <Text variant="body" as="span">
                        <strong>Trophy Pile:</strong> Draw from the bottom of the Number Reserves. 
                        This is a 10. Place it face up to form the Trophy Pile.</Text>
                </ListItem>
                </List>
            </Card>
            <Card title="Create Characters">
                <List variant="none" as="ol" spacing="lg">
                <ListItem class="flex items-start gap-2">
                    <Text variant="label" color="red">1.</Text>
                    <Text variant="body">Choose a Name and Archetype.</Text>
                </ListItem>
                <ListItem class="flex items-start gap-2">
                    <Text variant="label" color="red">2.</Text>
                    <Text variant="body">Answer: "Why are you here?"</Text>
                </ListItem>
                <ListItem class="flex items-start gap-2">
                    <Text variant="label" color="red">3.</Text>
                    <Text variant="body">Select an Aptitude (Power, Resolve, Intellect, Finesse).</Text>
                </ListItem>
                </List>
                <Text variant="body" color="muted" class="mt-8">
                    <strong>Optional:</strong> You can create the characters on the fly by choosing the order
                    in which you play out the first four scenes and let the four Aces determine your Apitudes.
                </Text>
            </Card>
        </div>
        <Card title="The Introduction">
            <Text variant="body" color="muted" class="mb-4">The first act will establish the player characters and hint at the Killer.</Text>
            <List variant="none" as="ol" spacing="lg">
            <ListItem class="flex items-start gap-2">
                <Text variant="label" color="red">1.</Text>
                <Text variant="body"><strong>Establishing Shots:</strong> The aces are there to showcase the player characters' aptitudes. 
                    The character with matching aptitude will be the one to act with each of them.
                    It is impossible to fail the test and since they are aimed at your own Aptitudes, the worst effort that can happen is overexertion. 
                </Text>
            </ListItem>
            <ListItem class="flex items-start gap-2">
                <Text variant="label" color="red">2.</Text>
                <Text variant="body">
                    <strong>First tests:</strong> After the Aces, you will draw and lay out two cards on the table 
                    from the top of the Threat Deck. These are the two possible scenes for you to tackle.
                </Text>
            </ListItem>
            <ListItem class="flex items-start gap-2">
                <Text variant="label" color="red">3.</Text>
                <Text variant="body">
                    <strong>The Killer Strikes:</strong> Once you draw a Face card (Jack in the case of Act 1) from the the Threat Deck, 
                    you cannot draw more cards from it as long as the Jack is on the table. If there was a card there, you can deal 
                    with that first and leave the Jack on the table so the next player will have to deal with it. The difficulty of 
                    the test is the current top of the Trophy Pile plus 1 (or, +1 for Jacks, +2 for Queens, +3 for Kings).
                    Once you've had this first confrontation with the Killer, Act 2 will begin.
                </Text>
            </ListItem>
            </List>
        </Card>
    </div>
    <!-- Act 2 Content -->
    <div v-else-if="act === 2" class="max-w-2xl mx-auto mb-12">
      <Card title="The Horror Escalates">
        <Text variant="body" color="muted" class="mb-4">The Killer is now actively hunting you.</Text>
        <List variant="none" as="ol" spacing="lg">
          <ListItem class="flex items-start gap-2">
            <Text variant="label" color="red">1.</Text>
            <Text variant="body"><strong>Face Cards:</strong> Face cards represent the Killer's direct intervention. They are harder to defeat.</Text>
          </ListItem>
          <ListItem class="flex items-start gap-2">
            <Text variant="label" color="red">2.</Text>
            <Text variant="body">
                <strong>Weaknesses:</strong> You are looking for 4 different weaknesses of the killer. 
                These are represented by you defeating a face card from each of the four suits. 
                Once you've done it, Act 3 will begin.
            </Text>
          </ListItem>
          <ListItem class="flex items-start gap-2">
            <Text variant="label" color="red">3.</Text>
            <Text variant="body"><strong>Progression:</strong> Find 4 Weaknesses to trigger the Finale.</Text>
          </ListItem>
        </List>
      </Card>
    </div>

    <!-- Act 3 Content -->
    <div v-else class="max-w-2xl mx-auto mb-12">
      <Card title="Prepare for the End">
        <List variant="none" as="ol" spacing="lg">
          <ListItem class="flex items-start gap-2">
            <Text variant="label" color="red">1.</Text>
            <Text variant="body"><strong>Remove Number Cards:</strong> Take all Number Cards out of the Threat Deck.</Text>
          </ListItem>
          <ListItem class="flex items-start gap-2">
            <Text variant="label" color="red">2.</Text>
            <Text variant="body"><strong>Add Jokers:</strong> Shuffle both the Red and Black Jokers into the remaining Face Cards.</Text>
          </ListItem>
          <ListItem class="flex items-start gap-2">
            <Text variant="label" color="red">3.</Text>
            <Text variant="body"><strong>The Goal:</strong> Survive until the Red Joker appears, then defeat it to win.</Text>
          </ListItem>
        </List>
      </Card>
    </div>

    <!-- Action Footer -->
    <ActionFooter>
      <Button 
        size="xl"
        variant="primary" 
        @click="$emit('next')"
      >
        <span v-if="act === 1">Start the Night</span>
        <span v-else-if="act === 2">Continue the Nightmare</span>
        <span v-else>Start the Finale</span>
        →
      </Button>
    </ActionFooter>
  </div>
</template>
