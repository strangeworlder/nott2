import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TabBar } from './TabBar';

const TABS = [
  { id: 'create', label: 'Create Game' },
  { id: 'join',   label: 'Join Game' },
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

export const Interactive: Story = {
  args: { tabs: TABS, activeTab: 'create', onTabChange: () => {} },
  render: () => {
    const [active, setActive] = useState('create');
    return (
      <div>
        <TabBar tabs={TABS} activeTab={active} onTabChange={setActive} />
        <div style={{ padding: 16, color: '#6a6a6a', fontSize: '0.875rem' }}>
          Active tab: {active}
        </div>
      </div>
    );
  },
};
