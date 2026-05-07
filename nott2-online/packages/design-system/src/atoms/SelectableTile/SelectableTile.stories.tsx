import type { Meta, StoryObj } from '@storybook/react';
import { SelectableTile } from './SelectableTile';
import { Grid } from '../Grid/Grid';
import { useState } from 'react';

const meta = {
  title: 'Atoms/SelectableTile',
  component: SelectableTile,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    children: '1',
    selected: false,
    variant: 'default',
    disabled: false,
  },
} satisfies Meta<typeof SelectableTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SelectedGreen: Story = {
  args: {
    selected: true,
    variant: 'default',
  },
};

export const SelectedRed: Story = {
  args: {
    selected: true,
    variant: 'danger',
  },
};

export const SelectedNeutral: Story = {
  args: {
    selected: true,
    variant: 'neutral',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'X',
  },
};

export const InteractiveGrid: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<number | null>(null);
    return (
      <Grid columns={5} gap="xs">
        {Array.from({ length: 10 }, (_, i) => (
          <SelectableTile
            key={i}
            selected={selected === i}
            variant="danger"
            onClick={() => setSelected(i)}
            style={{ width: '42px', height: '42px' }}
          >
            {i}
          </SelectableTile>
        ))}
      </Grid>
    );
  },
};
