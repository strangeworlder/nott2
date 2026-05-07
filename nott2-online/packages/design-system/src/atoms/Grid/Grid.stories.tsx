import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';

const meta = {
  title: 'Atoms/Grid',
  component: Grid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    columns: 4,
    gap: 'sm',
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const DummyBox = ({ label }: { label: string }) => (
  <div style={{ padding: '20px', background: '#2a2a2a', border: '1px solid #444', textAlign: 'center', borderRadius: '4px' }}>
    {label}
  </div>
);

export const Default: Story = {
  render: (args) => (
    <Grid {...args}>
      <DummyBox label="1" />
      <DummyBox label="2" />
      <DummyBox label="3" />
      <DummyBox label="4" />
      <DummyBox label="5" />
      <DummyBox label="6" />
      <DummyBox label="7" />
      <DummyBox label="8" />
    </Grid>
  ),
};

export const DenseGrid: Story = {
  args: {
    columns: 6,
    gap: 'xs',
  },
  render: Default.render,
};
