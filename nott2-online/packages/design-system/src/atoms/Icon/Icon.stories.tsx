import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { name: 'spades', size: 32 },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spades: Story = { args: { name: 'spades', color: 'white' } };
export const Hearts: Story = { args: { name: 'hearts', color: 'red' } };
export const Diamonds: Story = { args: { name: 'diamonds', color: 'red' } };
export const Clubs: Story = { args: { name: 'clubs', color: 'white' } };
export const Skull: Story = { args: { name: 'skull', color: 'muted' } };
export const Clock: Story = { args: { name: 'clock', color: 'muted' } };

export const SuitRow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Icon name="spades" size={40} color="white" />
      <Icon name="hearts" size={40} color="red" />
      <Icon name="diamonds" size={40} color="red" />
      <Icon name="clubs" size={40} color="white" />
    </div>
  ),
};

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
      {(['spades','hearts','diamonds','clubs','clock','users','skull','star','check','x','chevron-right','chevron-left','chevron-down','refresh'] as const).map(name => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Icon name={name} size={24} color="muted" />
          <span style={{ fontSize: 9, color: '#6a6a6a', fontFamily: 'monospace' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
};
