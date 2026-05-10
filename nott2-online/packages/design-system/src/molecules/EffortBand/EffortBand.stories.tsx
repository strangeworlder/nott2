import type { Meta, StoryObj } from '@storybook/react';
import { EffortBand } from './EffortBand';

const meta = {
  title: 'Molecules/EffortBand',
  component: EffortBand,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof EffortBand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Controlled:     Story = { args: { level: 'controlled' } };
export const PushingIt:      Story = { args: { level: 'pushing-it' } };
export const Overexertion:   Story = { args: { level: 'overexertion' } };
export const BreakingPoint:  Story = { args: { level: 'breaking-point' } };
export const NoDescription:  Story = { args: { level: 'overexertion', showDescription: false } };

export const ActiveControlled:    Story = { args: { level: 'controlled', active: true } };
export const ActiveBreakingPoint: Story = { args: { level: 'breaking-point', active: true } };

export const AllLevels: Story = {
  args: { level: 'controlled' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <EffortBand level="controlled" />
      <EffortBand level="pushing-it" />
      <EffortBand level="overexertion" />
      <EffortBand level="breaking-point" />
    </div>
  ),
};

export const AllLevelsActive: Story = {
  args: { level: 'controlled' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <EffortBand level="controlled" active />
      <EffortBand level="pushing-it" active />
      <EffortBand level="overexertion" active />
      <EffortBand level="breaking-point" active />
    </div>
  ),
};
