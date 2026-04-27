import type { Meta, StoryObj } from '@storybook/react';
import { PhaseHeader } from './PhaseHeader';

const meta = {
  title: 'Atoms/PhaseHeader',
  component: PhaseHeader,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: { title: 'Scene Setup' },
} satisfies Meta<typeof PhaseHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  args: { title: 'Fallout' },
};

export const WithSubtitle: Story = {
  args: {
    title: 'Scene Setup',
    subtitle: 'Draw the first card from the Threat Deck.',
  },
};

export const WithStep: Story = {
  args: {
    title: 'Game Setup',
    subtitle: 'Name your characters and choose your rules modules.',
    step: { current: 1, total: 2 },
  },
};

export const AllPhases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PhaseHeader title="Game Setup" subtitle="Name your characters." step={{ current: 1, total: 2 }} />
      <PhaseHeader title="Scene Setup" subtitle="Draw a card and choose the Active Player." />
      <PhaseHeader title="Conversation & Stakes" subtitle="Frame the scene, define the sacrifice, and decide what you stand to lose." />
      <PhaseHeader title="The Roll" subtitle="Roll the d13 — d10 for luck, d4 for effort." />
      <PhaseHeader title="The Result" />
      <PhaseHeader title="Fallout" subtitle="Resolve deck changes, assign strikes, and award Genre Points." />
    </div>
  ),
};
