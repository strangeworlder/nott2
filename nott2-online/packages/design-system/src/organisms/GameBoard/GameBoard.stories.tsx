import type { Meta, StoryObj } from '@storybook/react';
import { GameBoard } from './GameBoard';

const meta: Meta<typeof GameBoard> = {
  title: 'Organisms/GameBoard',
  component: GameBoard,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof GameBoard>;

const SAMPLE_CARDS = [
  { id: '7H', suit: 'Hearts' as const, rank: 7 as const },
  { id: 'KS', suit: 'Spades' as const, rank: 13 as const },
  { id: '3D', suit: 'Diamonds' as const, rank: 3 as const },
];

// ── Horizontal stories (legacy bar layout) ────────────────────────────────────

export const Empty: Story = {
  render: () => (
    <GameBoard>
      <GameBoard.DeckZone count={0} />
      <GameBoard.CardLine cards={[]} selectedId={null} onSelect={() => {}} />
      <GameBoard.TrophyZone />
      <GameBoard.PhaseInfo phase="scene-setup" act={1} />
    </GameBoard>
  ),
};

export const ActiveScene: Story = {
  render: () => (
    <GameBoard>
      <GameBoard.DeckZone count={18} onClick={() => {}} />
      <GameBoard.CardLine cards={SAMPLE_CARDS} selectedId="KS" onSelect={() => {}} />
      <GameBoard.TrophyZone topCard={{ suit: 'Hearts', rank: 5 }} count={3} />
      <GameBoard.PhaseInfo phase="resolution" act={2} />
    </GameBoard>
  ),
};

export const Endgame: Story = {
  render: () => (
    <GameBoard>
      <GameBoard.DeckZone count={3} onClick={() => {}} />
      <GameBoard.CardLine cards={SAMPLE_CARDS} selectedId={null} onSelect={() => {}} />
      <GameBoard.TrophyZone topCard={{ suit: 'Spades', rank: 13 }} count={7} />
      <GameBoard.PhaseInfo phase="fallout" act={3} isEndgame />
    </GameBoard>
  ),
};

export const RandomisedTrophy: Story = {
  render: () => (
    <GameBoard>
      <GameBoard.DeckZone count={12} />
      <GameBoard.CardLine cards={[]} selectedId={null} onSelect={() => {}} />
      <GameBoard.TrophyZone isRandomized />
      <GameBoard.PhaseInfo phase="act-setup" act={1} />
    </GameBoard>
  ),
};

// ── Vertical stories (sidebar layout — used in GameShell) ─────────────────────
// The vertical prop stacks zones as a column. PhaseInfo is omitted here
// because the Header carries act/phase when in sidebar mode.

export const VerticalSidebar: Story = {
  name: 'Vertical / Empty',
  decorators: [
    (Story) => (
      <div style={{ width: 220, height: 480, background: '#141414', border: '1px solid #2a2a2a' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <GameBoard vertical>
      <GameBoard.DeckZone count={0} />
      <GameBoard.CardLine cards={[]} selectedId={null} onSelect={() => {}} />
      <GameBoard.TrophyZone />
    </GameBoard>
  ),
};

export const VerticalSidebarActive: Story = {
  name: 'Vertical / Active Scene',
  decorators: [
    (Story) => (
      <div style={{ width: 220, height: 480, background: '#141414', border: '1px solid #2a2a2a' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <GameBoard vertical>
      <GameBoard.DeckZone count={12} />
      <GameBoard.CardLine cards={SAMPLE_CARDS} selectedId="KS" onSelect={() => {}} />
      <GameBoard.TrophyZone topCard={{ suit: 'Hearts', rank: 5 }} count={2} />
    </GameBoard>
  ),
};
