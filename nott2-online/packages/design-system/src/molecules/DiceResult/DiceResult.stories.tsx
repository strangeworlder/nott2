import type { Meta, StoryObj } from '@storybook/react';
import { DiceResult } from './DiceResult';
import { DifficultyBadge } from '../DifficultyBadge/DifficultyBadge';
import { EffortBand } from '../EffortBand/EffortBand';

const meta = {
  title: 'Molecules/DiceResult',
  component: DiceResult,
  parameters: { layout: 'padded', backgrounds: { default: 'dark' } },
  tags: ['autodocs'],
} satisfies Meta<typeof DiceResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = { args: { d10: 7, d4: 3 } };

export const WithAptitudeBoost: Story = {
  args: { d10: 7, d4: 3, modifier: { value: 1, label: 'Aptitude' }, originalD4: 2 },
};

export const WithAptitudeReduce: Story = {
  args: { d10: 5, d4: 3, modifier: { value: -1, label: 'Aptitude' }, originalD4: 4 },
};

export const WithGenrePointReroll: Story = {
  args: { d10: 8, d4: 2, d10Modified: true, originalD10: 3 },
};

export const FullyModified: Story = {
  args: {
    d10: 8, d4: 3,
    d10Modified: true, originalD10: 5,
    modifier: { value: 1, label: 'Aptitude' }, originalD4: 2,
  },
};

export const BreakingPoint: Story = { args: { d10: 9, d4: 4 } };
export const LowRoll: Story = { args: { d10: 0, d4: 1 } };

export const InContext: Story = {
  args: { d10: 7, d4: 3 },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
      <DifficultyBadge value={8} breakdown="Trophy (5) + 3 = 8" />
      <DiceResult d10={7} d4={3} />
      <EffortBand level="pushing-it" active />
    </div>
  ),
};

export const InContextModified: Story = {
  args: { d10: 8, d4: 3 },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
      <DifficultyBadge value={8} breakdown="Trophy (5) + 3 = 8" />
      <DiceResult
        d10={8} d4={3}
        d10Modified originalD10={5}
        modifier={{ value: -1, label: 'Aptitude' }} originalD4={4}
      />
      <EffortBand level="overexertion" active />
    </div>
  ),
};
