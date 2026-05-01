import type { Meta, StoryObj } from '@storybook/react';
import { ActBreakOverlay } from './ActBreakOverlay';

const meta: Meta<typeof ActBreakOverlay> = {
  title: 'Organisms/ActBreakOverlay',
  component: ActBreakOverlay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-screen act transition overlay rendered as a portal at z-index 15000. Announces a new act with a cinematic VHS title-card aesthetic.',
      },
    },
  },
  args: {
    visible: true,
    onDismiss: () => {},
    onExited: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ActBreakOverlay>;

export const Prologue: Story = {
  name: 'Prologue — Begin the Night',
  args: { act: 'prologue' },
};

export const ActOne: Story = {
  name: 'Act I — The Setup',
  args: { act: 1 },
};

export const ActTwo: Story = {
  name: 'Act II — The Horror Story',
  args: { act: 2 },
};

export const ActThree: Story = {
  name: 'Act III — The Climax',
  args: { act: 3 },
};

export const Finale: Story = {
  name: 'The Finale',
  args: { act: 'finale' },
};
