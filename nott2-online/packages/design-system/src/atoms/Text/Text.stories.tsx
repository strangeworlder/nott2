import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta = {
  title: 'Atoms/Text',
  component: Text,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: { children: 'Night of the Thirteenth' },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hero: Story = { args: { variant: 'hero', color: 'red', glow: true } };
export const H1: Story = { args: { variant: 'h1' } };
export const H2: Story = { args: { variant: 'h2' } };
export const H3: Story = { args: { variant: 'h3' } };
export const Lead: Story = { args: { variant: 'lead', children: 'You are not heroes. You are survivors, if you are lucky.' } };
export const Body: Story = { args: { variant: 'body', children: 'The Killer draws near. Roll the d13 and hold your breath.' } };
export const Label: Story = { args: { variant: 'label', color: 'muted' } };
export const Caption: Story = { args: { variant: 'caption', color: 'muted', children: 'Act III, Phase 6: The Final Hunt' } };
export const Quote: Story = { args: { variant: 'quote', border: 'left', children: 'Those who run together, survive together — and those who don\'t, don\'t.' } };
export const Micro: Story = { args: { variant: 'micro', color: 'muted', children: 'Trophy Pile' } };

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Text variant="h3" color="white">White — Default</Text>
      <Text variant="h3" color="red">Red — Accent</Text>
      <Text variant="h3" color="muted">Muted — Secondary</Text>
      <Text variant="h3" color="success">Success — Survival</Text>
    </div>
  ),
};

export const GlowStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Text variant="h2" color="red" glow>The Killer is Here</Text>
      <Text variant="h2" color="success" glow>You Survived</Text>
    </div>
  ),
};
