import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PlayerPanel } from './PlayerPanel';

const meta: Meta<typeof PlayerPanel> = {
  title: 'Organisms/PlayerPanel',
  component: PlayerPanel,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PlayerPanel>;

function ResolutionInteractive() {
  const [d10, setD10] = useState<number | null>(null);
  const [d4, setD4]   = useState<number | null>(null);
  const total = d10 != null && d4 != null ? d10 + d4 : null;
  const isSuccess = total != null ? total >= 7 : null;
  return (
    <PlayerPanel
      phase="resolution"
      difficulty={7}
      rollMain={d10}
      rollEffort={d4}
      total={total}
      isSuccess={isSuccess}
      onRollDice={(newD10, newD4) => { setD10(newD10); setD4(newD4); }}
      onNextPhase={() => alert('Apply Fallout!')}
    />
  );
}

export const SceneSetup: Story = { args: { phase: 'scene-setup', onNextPhase: () => {} } };
export const ConversationStakes: Story = { args: { phase: 'conversation-stakes', onNextPhase: () => {} } };
export const Resolution: Story = { render: () => <ResolutionInteractive /> };
export const ResolutionSuccess: Story = { args: { phase: 'resolution', difficulty: 7, rollMain: 8, rollEffort: 3, total: 11, isSuccess: true } };
export const ResolutionFailure: Story = { args: { phase: 'resolution', difficulty: 7, rollMain: 3, rollEffort: 1, total: 4, isSuccess: false } };
export const Fallout: Story = { args: { phase: 'fallout', strikesToAssign: 2, onNextPhase: () => {} } };
export const FalloutClean: Story = { args: { phase: 'fallout', strikesToAssign: 0, onNextPhase: () => {} } };
