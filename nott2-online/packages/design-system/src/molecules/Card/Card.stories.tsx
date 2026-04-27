import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  tags: ['autodocs'],
  args: { children: 'Card content goes here.' },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};
export const WithTitle: Story = { args: { title: 'Section Title', children: 'Body content inside the card.' } };
export const Muted: Story = { args: { variant: 'muted', children: 'Muted card.' } };
export const Highlighted: Story = { args: { variant: 'highlighted', title: 'Active', children: 'Highlighted card.' } };
export const Success: Story = { args: { variant: 'success', title: 'Victory', children: 'You survived.' } };
export const Failure: Story = { args: { variant: 'failure', title: 'Defeat', children: 'All is lost.' } };
export const Instruction: Story = { args: { variant: 'instruction', children: 'Draw a card from the threat deck.' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Ghost card — transparent.' } };
export const Interactive: Story = { args: { variant: 'highlighted', interactive: true, title: 'Clickable', children: 'Hover for glow.' } };
export const NoPadding: Story = { args: { noPadding: true, children: <div style={{ padding: 8, background: '#333' }}>Custom padding content</div> } };
