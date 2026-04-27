import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = { args: { act: 1, phase: 'scene-setup' } };
export const Act2: Story = { args: { act: 2, phase: 'resolution' } };
export const Act3: Story = { args: { act: 3, phase: 'fallout' } };
export const Finale: Story = { args: { act: 3, phase: 'fallout', isEndgame: true } };
export const WithRoomCode: Story = { args: { act: 1, phase: 'lobby', roomCode: 'HJ4N8R' } };
export const WithReset: Story = { args: { act: 1, phase: 'scene-setup', onReset: () => alert('Reset!') } };
export const FullFeatures: Story = { args: { act: 2, phase: 'resolution', roomCode: 'AB12CD', isEndgame: false, onReset: () => {} } };
