import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from './SegmentedControl';

const meta = {
  title: 'Atoms/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const aptitudeOptions = [
  { value: -1, label: '−1 Effort' },
  { value: 0, label: 'No Change' },
  { value: 1, label: '+1 Effort' },
];

export const Default: Story = {
  args: {
    options: aptitudeOptions,
    value: 0,
    onChange: () => {},
  },
};

export const WithSelection: Story = {
  args: {
    options: aptitudeOptions,
    value: -1,
    onChange: () => {},
  },
};

export const WithDisabled: Story = {
  args: {
    options: [
      { value: -1, label: '−1 Effort', disabled: true },
      { value: 0, label: 'No Change' },
      { value: 1, label: '+1 Effort' },
    ],
    value: 0,
    onChange: () => {},
  },
};

export const TwoOptions: Story = {
  args: {
    options: [
      { value: 'auto', label: 'Auto-Deal' },
      { value: 'manual', label: 'Manual Entry' },
    ],
    value: 'auto',
    onChange: () => {},
  },
};

export const AllStates: Story = {
  args: {
    options: aptitudeOptions,
    value: 0,
    onChange: () => {},
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
      <SegmentedControl
        options={aptitudeOptions}
        value={0}
        onChange={() => {}}
      />
      <SegmentedControl
        options={aptitudeOptions}
        value={-1}
        onChange={() => {}}
      />
      <SegmentedControl
        options={[
          { value: -1, label: '−1 Effort', disabled: true },
          { value: 0, label: 'No Change' },
          { value: 1, label: '+1 Effort' },
        ]}
        value={0}
        onChange={() => {}}
      />
    </div>
  ),
};
