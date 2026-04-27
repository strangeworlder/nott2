import type { Meta, StoryObj } from '@storybook/react';
import { PhasePanel } from './PhasePanel';
import { Card } from '../../molecules/Card/Card';
import { ActionFooter } from '../../molecules/ActionFooter/ActionFooter';

const meta = {
  title: 'Organisms/PhasePanel',
  component: PhasePanel,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof PhasePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SceneSetup: Story = {
  args: {
    title: 'Scene Setup',
    subtitle: 'Draw the first card from the Threat Deck.',
    children: null, // overridden by render
  },
  render: () => (
    <PhasePanel
      title="Scene Setup"
      subtitle="Draw the first card from the Threat Deck."
    >
      <Card title="Draw from Threat Deck">
        <p style={{ color: '#6a6a6a', fontSize: '0.875rem' }}>Card entry widget goes here.</p>
      </Card>
      <ActionFooter label="Challenge Selected Card →" onClick={() => {}} />
    </PhasePanel>
  ),
};

export const WithStep: Story = {
  args: {
    title: 'Game Setup',
    subtitle: 'Name your characters and choose your rules modules.',
    step: { current: 1, total: 2 },
    children: null,
  },
  render: () => (
    <PhasePanel
      title="Game Setup"
      subtitle="Name your characters and choose your rules modules."
      step={{ current: 1, total: 2 }}
    >
      <Card title="Character Names">
        <p style={{ color: '#6a6a6a', fontSize: '0.875rem' }}>Name inputs go here.</p>
      </Card>
      <ActionFooter label="Initialize Decks →" onClick={() => {}} />
    </PhasePanel>
  ),
};

export const Fallout: Story = {
  args: {
    title: 'Fallout',
    subtitle: 'Resolve deck changes, assign strikes, and award Genre Points before the next scene.',
    children: null,
  },
  render: () => (
    <PhasePanel title="Fallout" subtitle="Resolve deck changes, assign strikes, and award Genre Points before the next scene.">
      <Card title="Narrate the Outcome">
        <p style={{ color: '#6a6a6a', fontSize: '0.875rem' }}>The character overcame the challenge.</p>
      </Card>
      <ActionFooter label="Next Scene →" onClick={() => {}} />
    </PhasePanel>
  ),
};

