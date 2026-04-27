import type { Meta, StoryObj } from '@storybook/react';
import { PhaseDisplay } from './PhaseDisplay';
import { ActionFooter } from '../../molecules/ActionFooter/ActionFooter';

const meta: Meta<typeof PhaseDisplay> = {
  title: 'Organisms/PhaseDisplay',
  component: PhaseDisplay,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PhaseDisplay>;

export const Welcome: Story = { args: { phase: 'welcome' } };
export const GameSetup: Story = { args: { phase: 'game-setup' } };
export const ActSetup: Story = { args: { phase: 'act-setup' } };
export const SceneSetup: Story = { args: { phase: 'scene-setup' } };
export const ConversationStakes: Story = { args: { phase: 'conversation-stakes' } };
export const Resolution: Story = { args: { phase: 'resolution' } };
export const Fallout: Story = { args: { phase: 'fallout' } };
export const Win: Story = { args: { phase: 'win' } };
export const Lose: Story = { args: { phase: 'lose' } };
export const WithBody: Story = {
  args: {
    phase: 'act-setup',
    body: 'The second act begins. Four weaknesses have been found. The killer is close.',
  },
};
export const WithAction: Story = {
  render: () => (
    <PhaseDisplay phase="welcome">
      <ActionFooter label="Begin the Night" onClick={() => {}} />
    </PhaseDisplay>
  ),
};
export const CustomContent: Story = {
  args: {
    phase: 'act-setup',
    title: 'Act 2 — The Hunt',
    subtitle: 'Two of you are already marked.',
    body: 'The killer knows the house. Now they are hunting.',
  },
};
