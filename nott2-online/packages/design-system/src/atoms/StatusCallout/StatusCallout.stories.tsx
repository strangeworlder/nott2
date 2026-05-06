import type { Meta, StoryObj } from '@storybook/react';
import { StatusCallout } from './StatusCallout';

const meta = {
  title: 'Atoms/StatusCallout',
  component: StatusCallout,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: { children: 'Something important happened.' },
} satisfies Meta<typeof StatusCallout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story      = { args: { variant: 'info',      icon: 'movie',           children: 'Round progress: 2 of 4 have acted this round.' } };
export const Warning: Story   = { args: { variant: 'warning',   icon: 'warning',         children: 'Escalation used this scene.' } };
export const Danger: Story    = { args: { variant: 'danger',    icon: 'bolt',            children: 'Breaking Point — this earns a Strike regardless of outcome.' } };
export const Success: Story   = { args: { variant: 'success',   icon: 'auto_awesome',    children: 'Aptitude applied — Effort modified from 4 to 3.' } };
export const Highlight: Story = { args: { variant: 'highlight', icon: 'person_raised_hand', children: 'Spades must rise to the challenge — the Ace of Spades demands it.' } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <StatusCallout variant="info"      icon="movie"             >Round progress: 2 of 4 have acted this round.</StatusCallout>
      <StatusCallout variant="warning"   icon="warning"           >Escalation used this scene.</StatusCallout>
      <StatusCallout variant="danger"    icon="bolt"              >Breaking Point — this earns a Strike regardless of outcome.</StatusCallout>
      <StatusCallout variant="success"   icon="auto_awesome"      >Aptitude applied — Effort modified from 4 to 3.</StatusCallout>
      <StatusCallout variant="highlight" icon="person_raised_hand" >Alex must rise to the challenge — the Ace of Spades demands it.</StatusCallout>
    </div>
  ),
};
