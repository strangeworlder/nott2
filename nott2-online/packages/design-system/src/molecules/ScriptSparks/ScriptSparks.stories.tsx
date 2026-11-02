import type { Meta, StoryObj } from '@storybook/react';
import { ScriptSparks } from './ScriptSparks';

const SAMPLE_ACTIVE_WORDS = [
  'Meat',
  'Wound',
  'Electronics',
  'Clanking',
  'Leverage',
  'Paranoia',
  'Alibi',
  'Splinter',
  'Barricade',
  'Padlock',
  'Fusebox',
  'Crowbar',
  'Threshold',
  'Shiver',
  'Trapdoor',
  'Deadbolt',
  'Signal',
  'Baggage',
];

const SAMPLE_CAMERA_WORDS = [
  'Dripping',
  'Copper',
  'Flicker',
  'Rot',
  'Echo',
  'Shadow',
  'Humid',
  'Scraping',
  'Silence',
  'Ozone',
  'Draft',
  'Mildew',
  'Buzzing',
  'Rusted',
  'Condensation',
  'Kerosene',
  'Soot',
  'Frost',
];

const SAMPLE_QUESTIONS = [
  'What does it look like?',
  'What does it smell like?',
  'How close is the Killer?',
  'Is it pitch black?',
  'How dark is it?',
];

const meta = {
  title: 'Molecules/ScriptSparks',
  component: ScriptSparks,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof ScriptSparks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  args: {
    words: SAMPLE_ACTIVE_WORDS,
    triggerLabel: 'Need a Spark? — 9 Scene Words',
  },
};

export const ActivePlayerWords: Story = {
  args: {
    words: SAMPLE_ACTIVE_WORDS,
    triggerLabel: 'Need a Spark? — 9 Scene Words',
    defaultOpen: true,
  },
};

export const CameraCrewSensoryAndQuestions: Story = {
  args: {
    words: SAMPLE_CAMERA_WORDS,
    questions: SAMPLE_QUESTIONS,
    triggerLabel: 'Need a Spark? — 9 Sensory Words & Camera Questions',
    trayHint: '9 sensory & atmospheric words (grab one or two):',
    questionsLabel: 'Focus the Camera (ask the Active Player):',
    defaultOpen: true,
  },
};
