import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DieSelector } from './DieSelector';

const meta: Meta<typeof DieSelector> = {
  title: 'Molecules/DieSelector',
  component: DieSelector,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof DieSelector>;

// Interactive wrapper so selection state is preserved
function D4Wrapper() {
  const [value, setValue] = useState<number | null>(null);
  return <DieSelector sides={4} value={value} onChange={setValue} label="Effort Die (d4)" color="white" />;
}

function D10Wrapper() {
  const [value, setValue] = useState<number | null>(null);
  return <DieSelector sides={10} value={value} onChange={setValue} label="Threat Die (d10)" color="red" />;
}

export const D4: Story = { render: () => <D4Wrapper /> };
export const D10: Story = { render: () => <D10Wrapper /> };
export const D4Preselected: Story = { args: { sides: 4, value: 3, onChange: () => {}, label: 'd4', color: 'white' } };
export const D10Preselected: Story = { args: { sides: 10, value: 7, onChange: () => {}, label: 'd10', color: 'red' } };
