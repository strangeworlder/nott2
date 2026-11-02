import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SceneDossier } from './SceneDossier';
import { ScriptSparks } from '../ScriptSparks/ScriptSparks';
import { Button } from '../../atoms/Button/Button';
import { Row } from '../../atoms/Row/Row';

const DIRECTOR_WORDS = [
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
];

const CAMERA_WORDS = [
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
];

const CAMERA_QUESTIONS = [
  'What does it look like?',
  'What does it smell like?',
  'How close is the Killer?',
  'Is it pitch black?',
  'How dark is it?',
];

const meta = {
  title: 'Molecules/SceneDossier',
  component: SceneDossier,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof SceneDossier>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ScriptBeat: Story = {
  args: {
    mode: 'script',
    suitIcon: 'spades',
    suitTheme: 'Power (Physical threat)',
    activeCharacterName: 'Alex (Spades)',
    activeCharacterSuit: 'spades',
    difficulty: 6,
    difficultyBreakdown: 'Number card rank = 6',
    directorPrompt:
      'Something cold and vice-like snatches your ankle from the shadows below. How do you wrench yourself free, and what bruising mark does it leave on your skin?',
    cameraPrompt:
      'What did they kick loose in the struggle, and what sound retreats into the dark afterward?',
    directorSparks: (
      <ScriptSparks
        words={DIRECTOR_WORDS}
        triggerLabel="Need a Spark? — 9 Director Words"
      />
    ),
    cameraSparks: (
      <ScriptSparks
        words={CAMERA_WORDS}
        questions={CAMERA_QUESTIONS}
        triggerLabel="Need a Spark? — 9 Sensory Words & Camera Questions"
      />
    ),
    onEscalate: () => {},
  },
};

export const EscalatedStakesBeat: Story = {
  args: {
    mode: 'stakes',
    suitIcon: 'spades',
    suitTheme: 'Power (Physical threat)',
    activeCharacterName: 'Alex (Spades)',
    activeCharacterSuit: 'spades',
    difficulty: 6,
    difficultyBreakdown: 'Number card rank = 6',
    escalated: true,
    stakesQuestion:
      'If you end up pushing yourself to reach your goal, what are you willing to risk?',
    stakesGuidance:
      'Act 2 Stakes — The hunt is on: agree on a genuine, painful loss—a bleeding wound, a destroyed escape route, or leaving someone exposed.',
    stakesSparks: (
      <ScriptSparks
        words={DIRECTOR_WORDS}
        triggerLabel="Need a Spark? — 9 Sacrifice Words"
      />
    ),
    onBackToScene: () => {},
  },
};

export const AftermathLedgerBeat: Story = {
  args: {
    mode: 'aftermath',
    suitIcon: 'spades',
    suitTheme: 'Power (Physical threat)',
    activeCharacterName: 'Alex (Spades)',
    activeCharacterSuit: 'spades',
    difficulty: 6,
    fateItems: [
      {
        icon: 'emoji_events',
        text: '6 of Spades placed on the Trophy Pile (New Face Card base difficulty: 6).',
        tone: 'success',
      },
      {
        icon: 'input',
        text: 'Next card drawn from the Number Reserve → added to bottom of the Threat Deck.',
        tone: 'info',
      },
      {
        icon: 'bolt',
        text: 'Breaking Point (d4 = 4) — the Active Player earns a Strike.',
        tone: 'danger',
      },
    ],
    strikesSlot: (
      <Row gap="sm" align="center" wrap>
        <Button variant="primary" size="sm">
          Alex (Spades): 1 → 2 / 3
        </Button>
      </Row>
    ),
    genrePointSlot: (
      <Row gap="xs" wrap>
        <Button variant="secondary" size="sm">
          To Alex
        </Button>
        <Button variant="secondary" size="sm">
          To Sam
        </Button>
      </Row>
    ),
    onBackToScene: () => {},
    backLabel: 'Back to Narration',
  },
};
