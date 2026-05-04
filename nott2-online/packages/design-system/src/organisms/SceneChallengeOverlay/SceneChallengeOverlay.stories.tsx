import type { Meta, StoryObj } from '@storybook/react';
import { SceneChallengeOverlay } from './SceneChallengeOverlay';

const meta: Meta<typeof SceneChallengeOverlay> = {
  title: 'Organisms/SceneChallengeOverlay',
  component: SceneChallengeOverlay,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: '100vw', height: '80vh', background: '#0a0a0a' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SceneChallengeOverlay>;

const baseArgs = {
  visible: true,
  onDismiss: () => {},
  onExited: () => {},
};

export const Spades: Story = {
  args: {
    ...baseArgs,
    prompt: 'A heavy door slams shut behind you. What mechanism locks it?',
    suitTheme: 'Power (Physical threat)',
    suitIcon: 'shield',
    difficulty: 5,
    difficultyBreakdown: 'Number card rank = 5',
    imageSrc: '/textures/scenes/spades.png',
    isFaceCard: false,
    isJoker: false,
    jumpScare: false,
  },
};

export const Hearts: Story = {
  args: {
    ...baseArgs,
    prompt: "The lights flicker. What shadow moves when it shouldn't?",
    suitTheme: 'Resolve (Fear/Paranoia)',
    suitIcon: 'favorite',
    difficulty: 3,
    difficultyBreakdown: 'Number card rank = 3',
    imageSrc: '/textures/scenes/hearts.png',
    jumpScare: false,
  },
};

export const Clubs: Story = {
  args: {
    ...baseArgs,
    prompt: 'You find a note. What cryptic warning does it give?',
    suitTheme: 'Intellect (The Truth)',
    suitIcon: 'psychology',
    difficulty: 7,
    imageSrc: '/textures/scenes/clubs.png',
    jumpScare: false,
  },
};

export const Diamonds: Story = {
  args: {
    ...baseArgs,
    prompt: 'You trip over something. What noise echoes too loudly?',
    suitTheme: 'Finesse (Mistakes/Social)',
    suitIcon: 'diamond',
    difficulty: 2,
    imageSrc: '/textures/scenes/diamonds.png',
    jumpScare: false,
  },
};

export const FaceCard: Story = {
  args: {
    ...baseArgs,
    prompt: 'What is the first thing you notice about their silhouette?',
    suitTheme: 'Power (Physical threat)',
    suitIcon: 'shield',
    difficulty: 8,
    difficultyBreakdown: 'Trophy (7) + 1 = 8',
    imageSrc: '/textures/scenes/spades.png',
    isFaceCard: true,
    isJoker: false,
    jumpScare: false,
  },
};

export const JumpScare: Story = {
  args: {
    ...baseArgs,
    prompt: 'What is the first thing you notice about their silhouette?',
    suitTheme: 'Power (Physical threat)',
    suitIcon: 'shield',
    difficulty: 8,
    difficultyBreakdown: 'Trophy (7) + 1 = 8',
    imageSrc: '/textures/scenes/spades.png',
    isFaceCard: true,
    isJoker: false,
    jumpScare: true,
  },
};

export const JokerJumpScare: Story = {
  args: {
    ...baseArgs,
    prompt: 'THE FINAL TEST. The Killer has you dead to rights. How do you escape death?',
    suitTheme: 'The Finale',
    suitIcon: 'warning',
    difficulty: 9,
    imageSrc: '/textures/scenes/spades.png',
    isFaceCard: false,
    isJoker: true,
    jumpScare: true,
  },
};
