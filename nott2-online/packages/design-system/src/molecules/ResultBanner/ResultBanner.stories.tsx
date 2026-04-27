import type { Meta, StoryObj } from '@storybook/react';
import { ResultBanner } from './ResultBanner';

const meta = {
  title: 'Molecules/ResultBanner',
  component: ResultBanner,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof ResultBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = { args: { outcome: 'success', total: 9, difficulty: 7 } };
export const Failure: Story = { args: { outcome: 'failure', total: 5, difficulty: 8 } };
export const SuccessNoBreakdown: Story = { args: { outcome: 'success' } };
export const FailureNoBreakdown: Story = { args: { outcome: 'failure' } };

export const BothOutcomes: Story = {
  args: { outcome: 'success' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ResultBanner outcome="success" total={9} difficulty={7} />
      <ResultBanner outcome="failure" total={5} difficulty={8} />
    </div>
  ),
};
