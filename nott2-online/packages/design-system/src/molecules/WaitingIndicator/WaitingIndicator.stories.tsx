import type { Meta, StoryObj } from '@storybook/react';
import { WaitingIndicator } from './WaitingIndicator';

const meta = {
  title: 'Molecules/WaitingIndicator',
  component: WaitingIndicator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { message: 'Waiting…' },
} satisfies Meta<typeof WaitingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WaitingForDraw: Story = { args: { message: 'Waiting for host to draw the first card…' } };
export const WaitingForHost: Story = { args: { message: 'Waiting for host to start the challenge…' } };
export const WaitingForAP: Story = { args: { message: 'Waiting for host to choose the Active Player…' } };
