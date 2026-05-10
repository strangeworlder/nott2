import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TabBar } from './TabBar';
import type { Tab } from './TabBar';

const TABS: Tab[] = [
  { id: 'create', label: 'Create Game' },
  { id: 'join',   label: 'Join Game' },
];

const TABS_WITH_ICONS: Tab[] = [
  { id: 'create', label: 'Create Game', icon: 'playing_cards' },
  { id: 'join',   label: 'Join Game',   icon: 'group' },
];

const THREE_TABS: Tab[] = [
  { id: 'setup',   label: 'Setup',   icon: 'assignment' },
  { id: 'play',    label: 'Play',    icon: 'casino' },
  { id: 'results', label: 'Results', icon: 'emoji_events' },
];

const meta = {
  title: 'Molecules/TabBar',
  component: TabBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { tabs: TABS, activeTab: 'create', onTabChange: () => {} },
};

export const SecondActive: Story = {
  args: { tabs: TABS, activeTab: 'join', onTabChange: () => {} },
};

export const WithIcons: Story = {
  args: { tabs: TABS_WITH_ICONS, activeTab: 'create', onTabChange: () => {} },
};

export const ThreeTabs: Story = {
  args: { tabs: THREE_TABS, activeTab: 'play', onTabChange: () => {} },
};

export const Interactive: Story = {
  args: { tabs: TABS_WITH_ICONS, activeTab: 'create', onTabChange: () => {} },
  render: () => {
    const [active, setActive] = useState('create');
    return (
      <div style={{ maxWidth: 480 }}>
        <TabBar tabs={TABS_WITH_ICONS} activeTab={active} onTabChange={setActive} />
        <div style={{
          marginTop: 16,
          padding: 24,
          color: '#6a6a6a',
          fontSize: '0.875rem',
          fontFamily: "'Inter', system-ui, sans-serif",
          border: '1px solid #2a2a2a',
          borderRadius: 4,
          background: '#141414',
        }}>
          Active tab: <span style={{ color: '#dc2626', fontWeight: 600 }}>{active}</span>
          <br />
          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
            Try Arrow keys, Home, and End for keyboard navigation.
          </span>
        </div>
      </div>
    );
  },
};

export const ThreeTabsInteractive: Story = {
  args: { tabs: THREE_TABS, activeTab: 'setup', onTabChange: () => {} },
  render: () => {
    const [active, setActive] = useState('setup');
    return (
      <div style={{ maxWidth: 600 }}>
        <TabBar tabs={THREE_TABS} activeTab={active} onTabChange={setActive} />
        <div style={{
          marginTop: 16,
          padding: 24,
          color: '#e8e8e8',
          fontSize: '0.875rem',
          fontFamily: "'Inter', system-ui, sans-serif",
          border: '1px solid #2a2a2a',
          borderRadius: 4,
          background: '#141414',
        }}>
          {active === 'setup' && 'Configure your game session — choose players, difficulty, and playset.'}
          {active === 'play' && 'Draw cards, face challenges, and survive the night.'}
          {active === 'results' && 'See who survived and review the final trophies.'}
        </div>
      </div>
    );
  },
};
