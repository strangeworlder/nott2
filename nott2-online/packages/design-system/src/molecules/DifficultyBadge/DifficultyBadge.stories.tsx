import type { Meta, StoryObj } from '@storybook/react';
import { DifficultyBadge } from './DifficultyBadge';

const meta = {
  title: 'Molecules/DifficultyBadge',
  component: DifficultyBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof DifficultyBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NumberCard:  Story = { args: { value: 7, breakdown: 'Number card rank = 7' } };
export const FaceCard:    Story = { args: { value: 12, breakdown: 'Trophy (10) + 2 = 12' } };
export const Joker:       Story = { args: { value: 9, breakdown: 'Trophy (9) + 0 = 9' } };
export const NumberOnly:  Story = { args: { value: 5 } };
