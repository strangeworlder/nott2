import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';

const meta = {
  title: 'Atoms/Stack',
  component: Stack,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ label }: { label: string }) => (
  <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', borderRadius: 4 }}>
    {label}
  </div>
);

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Stack>
      <Box label="Item A" />
      <Box label="Item B" />
      <Box label="Item C" />
    </Stack>
  ),
};

export const SmallGap: Story = {
  args: { children: null, gap: 'sm' },
  render: () => (
    <Stack gap="sm">
      <Box label="Tight A" />
      <Box label="Tight B" />
      <Box label="Tight C" />
    </Stack>
  ),
};

export const LargeGap: Story = {
  args: { children: null, gap: 'xl' },
  render: () => (
    <Stack gap="xl">
      <Box label="Spacious A" />
      <Box label="Spacious B" />
    </Stack>
  ),
};
