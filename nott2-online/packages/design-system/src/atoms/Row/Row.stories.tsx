import type { Meta, StoryObj } from '@storybook/react';
import { Row } from './Row';

const meta = {
  title: 'Atoms/Row',
  component: Row,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj<typeof meta>;

const Chip = ({ label }: { label: string }) => (
  <div style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', borderRadius: 4 }}>
    {label}
  </div>
);

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Row>
      <Chip label="♠ Spades" />
      <Chip label="♥ Hearts" />
      <Chip label="♣ Clubs" />
      <Chip label="♦ Diamonds" />
    </Row>
  ),
};

export const Centered: Story = {
  args: { children: null, justify: 'center', gap: 'md' },
  render: () => (
    <Row justify="center" gap="md">
      <Chip label="A" />
      <Chip label="B" />
      <Chip label="C" />
    </Row>
  ),
};

export const SpaceBetween: Story = {
  args: { children: null, justify: 'between' },
  render: () => (
    <Row justify="between">
      <Chip label="Left" />
      <Chip label="Right" />
    </Row>
  ),
};

export const Wrapped: Story = {
  args: { children: null, wrap: true, gap: 'sm' },
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <Row wrap gap="sm">
        {['A','B','C','D','E','F','G','H'].map(l => <Chip key={l} label={l} />)}
      </Row>
    </div>
  ),
};
