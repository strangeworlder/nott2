<script setup lang="ts">
import Button from '../Button.vue'
import Card from '../Card.vue'
import Text from '../Text.vue'
import Toggle from '../Toggle.vue'
import Badge from '../Badge.vue'
import DieSelector from '../DieSelector.vue'
import PlayingCard from '../PlayingCard.vue'
import Checkbox from '../Checkbox.vue'
import SelectionButton from '../SelectionButton.vue'
import List from '../List.vue'
import ListItem from '../ListItem.vue'
import Navigation from '../Navigation.vue'
import NavButton from '../NavButton.vue'
import ScenePrompt from '../live-play/ScenePrompt.vue'
import ProcessStep from '../ProcessStep.vue'
import Icon from '../Icon.vue'
</script>

<template>
  <div class="space-y-12">
    <!-- Typography -->
    <section class="space-y-4">
      <h2 class="text-3xl font-display text-nott-white border-b border-nott-gray pb-2">Typography</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <p class="text-nott-gray mb-2">Display Font (Oswald)</p>
          <div class="text-nott-white font-display space-y-2">
            <p class="text-4xl">The Killer Is Watching</p>
            <p class="text-2xl">Don't Split The Party</p>
            <p class="text-xl">Something's not right...</p>
          </div>
        </div>
        <div>
          <p class="text-nott-gray mb-2">Body Font (Courier Prime)</p>
          <div class="text-nott-white space-y-2">
            <p>The old house stood silent on the hill. Too silent.</p>
            <p class="italic">"Did you hear that?" she whispered.</p>
            <p class="font-bold">EFFORT: THE TWIST</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Colors -->
    <section class="space-y-4">
      <h2 class="text-3xl font-display text-nott-white border-b border-nott-gray pb-2">Color Palette</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="space-y-2">
          <div class="h-24 bg-nott-black border border-nott-gray"></div>
          <p class="text-nott-white">Nott Black <span class="text-nott-gray text-sm">#0a0a0a</span></p>
        </div>
        <div class="space-y-2">
          <div class="h-24 bg-nott-red"></div>
          <p class="text-nott-white">Nott Red <span class="text-nott-gray text-sm">#8a0000</span></p>
        </div>
        <div class="space-y-2">
          <div class="h-24 bg-nott-white"></div>
          <p class="text-nott-white">Nott White <span class="text-nott-gray text-sm">#f0f0f0</span></p>
        </div>
        <div class="space-y-2">
          <div class="h-24 bg-nott-gray"></div>
          <p class="text-nott-white">Nott Gray <span class="text-nott-gray text-sm">#2a2a2a</span></p>
        </div>
        <div class="space-y-2">
          <div class="h-24 bg-nott-green"></div>
          <p class="text-nott-white">Nott Green <span class="text-nott-gray text-sm">#22c55e</span></p>
        </div>
      </div>
    </section>

    <!-- Icons -->
    <section class="space-y-4">
        <h2 class="text-3xl font-display text-nott-white border-b border-nott-gray pb-2">Icons</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="flex flex-col items-center gap-2 p-4 border border-nott-gray rounded bg-nott-white/5">
                <Icon name="clock" size="48" color="red" />
                <Text variant="label" color="muted">Duration</Text>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 border border-nott-gray rounded bg-nott-white/5">
                <Icon name="users" size="48" color="red" />
                <Text variant="label" color="muted">Players</Text>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 border border-nott-gray rounded bg-nott-white/5">
                <Icon name="supplies" size="48" color="red" />
                <Text variant="label" color="muted">Supplies</Text>
            </div>
        </div>
    </section>

    <!-- Components -->
    <section class="space-y-4">
      <h2 class="text-3xl font-display text-nott-white border-b border-nott-gray pb-2">Components</h2>
      
      <div class="grid md:grid-cols-2 gap-8">
        <div class="space-y-4">
          <h3 class="text-xl text-nott-white font-display">Buttons</h3>
          <div class="flex flex-wrap gap-4">
            <Button>Primary Action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="debug">Debug</Button>
          </div>
          <div class="flex flex-wrap gap-4">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
          <div class="flex gap-4">
            <Button disabled>Disabled</Button>
            <Button block>Block Width</Button>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-xl text-nott-white font-display">Cards</h3>
          <Card title="Threat Card">
            <p class="text-nott-white mb-4">You hear a noise upstairs. It sounds like heavy boots dragging across the floorboards.</p>
            <Button size="sm" block>Investigate</Button>
          </Card>
          <Card title="Muted Card" variant="muted">
            <p class="text-nott-white">This card is muted.</p>
          </Card>
          <Card title="Highlighted Card" variant="highlighted">
            <p class="text-nott-white">This card is highlighted.</p>
          </Card>
          <Card title="Success Card" variant="success">
            <p class="text-nott-white">This card indicates success.</p>
          </Card>
          <Card title="Failure Card" variant="failure">
            <p class="text-nott-white">This card indicates failure.</p>
          </Card>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-8 mt-8">
        <div class="space-y-4">
          <Text variant="h3">Text & Typography</Text>
          <div class="space-y-2 border border-nott-gray p-4 rounded bg-nott-white/5">
            <Text variant="hero">Hero Text</Text>
            <Text variant="h1">Heading 1</Text>
            <Text variant="h2">Heading 2</Text>
            <Text variant="h3">Heading 3</Text>
            <Text variant="lead">Lead text for introductions.</Text>
            <Text variant="body">Body text. The quick brown fox jumps over the lazy dog.</Text>
            <Text variant="label">Label Text</Text>
            <Text variant="caption">Caption text</Text>
            <Text variant="quote">"This is a dramatic quote."</Text>
          </div>
        </div>

        <div class="space-y-4">
          <Text variant="h3">Interactive Elements</Text>
          <div class="space-y-4 border border-nott-gray p-4 rounded bg-nott-white/5">
            <div class="flex gap-4 items-center">
              <Toggle :modelValue="true" />
              <Toggle :modelValue="false" />
            </div>
            <div class="flex gap-4 items-center">
              <Checkbox :modelValue="true" label="Checked" />
              <Checkbox :modelValue="false" label="Unchecked" />
            </div>
            <div class="flex gap-4 items-center flex-wrap">
              <Badge>Default</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="red">Red</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="danger">Danger</Badge>
            </div>
            <div class="flex gap-4 items-center flex-wrap">
              <SelectionButton :selected="false">Option</SelectionButton>
              <SelectionButton :selected="true">Selected</SelectionButton>
              <SelectionButton variant="square" :selected="false">A</SelectionButton>
              <SelectionButton variant="square" :selected="true" color="red">A</SelectionButton>
            </div>
          </div>
        </div>
      </div>

    </section>

    <section class="space-y-4">
      <h2 class="text-3xl font-display text-nott-white border-b border-nott-gray pb-2">Game Elements</h2>
      
      <div class="grid md:grid-cols-2 gap-8">
        <div class="space-y-4">
          <Text variant="h3">Playing Cards</Text>
          <div class="flex gap-4 flex-wrap">
            <PlayingCard suit="Spades" :rank="1" />
            <PlayingCard suit="Hearts" :rank="12" />
          </div>
        </div>

        <div class="space-y-4">
          <Text variant="h3">Selectable Cards (Interaction)</Text>
          <div class="flex gap-4 flex-wrap">
            <!-- Unselected -->
            <div class="relative cursor-pointer hover:scale-105 transition-transform">
                <PlayingCard suit="Clubs" :rank="10" />
            </div>
            <!-- Selected -->
            <div class="relative cursor-pointer hover:scale-105 transition-transform">
                <PlayingCard suit="Diamonds" :rank="7" selected />
                <div class="absolute -bottom-8 left-0 right-0 text-center">
                    <Text variant="label" color="red">SELECTED</Text>
                </div>
            </div>
            <!-- Disabled -->
            <div class="relative opacity-50 cursor-not-allowed">
                <PlayingCard suit="Spades" :rank="2" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-8 mt-8">
        <div class="space-y-4">
          <Text variant="h3">Dice Selectors</Text>
          <div class="space-y-4">
            <DieSelector :sides="4" :modelValue="1" label="d4" color="red" />
            <DieSelector :sides="10" :modelValue="5" label="d10" />
          </div>
        </div>

        <div class="space-y-4">
            <Text variant="h3">Status & Guidance</Text>
            <div class="space-y-4 border border-nott-gray p-4 rounded bg-nott-white/5">
                <!-- Guidance Text Examples -->
                <div>
                    <Text variant="label" color="muted" class="mb-2">Guidance Text</Text>
                    <div class="space-y-2">
                        <Text variant="body" color="muted">Draw cards to populate the table...</Text>
                        <Text variant="body" color="red" class="font-bold animate-pulse">Select a card to reveal the challenge</Text>
                        <Text variant="body" color="muted">Challenge selected.</Text>
                    </div>
                </div>

                <!-- Warnings -->
                <div>
                    <Text variant="label" color="muted" class="mb-2">Warnings</Text>
                    <div class="text-center border border-nott-red/30 bg-nott-red/10 p-4 rounded">
                        <Text variant="caption" color="red" class="font-bold">FACE CARD ACTIVE</Text>
                        <Text variant="caption" color="muted">You cannot draw another card while a Face Card is on the table.</Text>
                    </div>
                </div>
            </div>
        </div>
          </div>
    </section>


    <!-- Lists -->
    <section class="space-y-4">
      <h2 class="text-3xl font-display text-nott-white border-b border-nott-gray pb-2">Lists</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="space-y-4">
          <Text variant="h3">Unordered List</Text>
          <List>
            <ListItem>First item</ListItem>
            <ListItem>Second item</ListItem>
            <ListItem>Third item</ListItem>
          </List>
        </div>
        <div class="space-y-4">
          <Text variant="h3">Ordered List</Text>
          <List as="ol">
            <ListItem>Step one</ListItem>
            <ListItem>Step two</ListItem>
            <ListItem>Step three</ListItem>
          </List>
        </div>
        <div class="space-y-4">
          <Text variant="h3">Colors & Spacing</Text>
          <List color="red" spacing="md">
            <ListItem>Red item 1</ListItem>
            <ListItem>Red item 2</ListItem>
            <ListItem>Red item 3</ListItem>
          </List>
        </div>
      </div>
    </section>

    <!-- Navigation & Layout -->
    <section class="space-y-4">
      <h2 class="text-3xl font-display text-nott-white border-b border-nott-gray pb-2">Navigation & Layout</h2>
      <div class="space-y-4">
        <Text variant="h3">Navigation Bar</Text>
        <div class="border border-nott-gray p-4 rounded bg-nott-black">
          <Navigation>
            <NavButton :active="true">Active</NavButton>
            <NavButton :active="false">Inactive</NavButton>
            <NavButton>Hover Me</NavButton>
          </Navigation>
        </div>
      </div>
    </section>

    <!-- Scene Prompt -->
    <section class="space-y-4">
      <h2 class="text-3xl font-display text-nott-white border-b border-nott-gray pb-2">Scene Prompt</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="space-y-4">
            <Text variant="h3">Default Prompt</Text>
            <ScenePrompt prompt="The killer is hiding in the closet." />
        </div>
        <div class="space-y-4">
            <Text variant="h3">Custom Label</Text>
            <ScenePrompt prompt="What do you do?" label="THE QUESTION" />
        </div>
      </div>
    </section>

    <!-- Process Steps -->
    <section class="space-y-4">
      <h2 class="text-3xl font-display text-nott-white border-b border-nott-gray pb-2">Process Steps</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="space-y-4">
            <Text variant="h3">Success Variant</Text>
            <div class="space-y-6 relative">
                <div class="absolute left-[15px] top-2 bottom-2 w-0.5 bg-nott-gray/30"></div>
                <ProcessStep step="1" variant="success" title="Step One">
                    <Text variant="body">This is a success step.</Text>
                </ProcessStep>
                <ProcessStep step="2" variant="success" title="Step Two">
                    <Text variant="body">Another success step.</Text>
                </ProcessStep>
            </div>
        </div>
        <div class="space-y-4">
            <Text variant="h3">Failure Variant</Text>
            <div class="space-y-6 relative">
                <div class="absolute left-[15px] top-2 bottom-2 w-0.5 bg-nott-gray/30"></div>
                <ProcessStep step="!" variant="failure" title="Critical Failure">
                    <Text variant="body">Something went wrong.</Text>
                </ProcessStep>
                <ProcessStep step="2" variant="failure" title="Consequences">
                    <Text variant="body">Bad things happen.</Text>
                </ProcessStep>
            </div>
        </div>
      </div>
    </section>
  </div>
</template>
