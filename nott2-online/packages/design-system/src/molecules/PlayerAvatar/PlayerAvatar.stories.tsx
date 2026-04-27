import type { Meta, StoryObj } from '@storybook/react';
import { PlayerAvatar } from './PlayerAvatar';

const meta: Meta<typeof PlayerAvatar> = {
  title: 'Molecules/PlayerAvatar',
  component: PlayerAvatar,
  tags: ['autodocs'],
  args: { name: 'Alice', suitSymbol: '♠', characterName: 'The Jock', isConnected: true },
};
export default meta;
type Story = StoryObj<typeof PlayerAvatar>;

export const Default: Story = {};
export const Hearts: Story = { args: { name: 'Bob', suitSymbol: '♥', characterName: 'The Final Girl' } };
export const Clubs: Story = { args: { name: 'Carol', suitSymbol: '♣', characterName: 'The Nerd' } };
export const Diamonds: Story = { args: { name: 'Dave', suitSymbol: '♦', characterName: 'The Rebel' } };
export const ActivePlayer: Story = { args: { isActivePlayer: true } };
export const Offline: Story = { args: { isConnected: false } };
export const SmallSize: Story = { args: { size: 'sm' } };
export const LargeSize: Story = { args: { size: 'lg' } };
export const ActiveAndLarge: Story = { args: { size: 'lg', isActivePlayer: true } };
