import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

const meta = {
  title: 'Atoms/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { value: false, onChange: () => {} },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonOff: Story = { args: { variant: 'button', value: false, labelOn: 'Enabled', labelOff: 'Disabled' } };
export const ButtonOn: Story = { args: { variant: 'button', value: true, labelOn: 'Enabled', labelOff: 'Disabled' } };
export const SwitchOff: Story = { args: { variant: 'switch', value: false, labelOn: 'On', labelOff: 'Off' } };
export const SwitchOn: Story = { args: { variant: 'switch', value: true, labelOn: 'On', labelOff: 'Off' } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
      <Toggle value={false} onChange={() => {}} variant="button" labelOn="Enabled" labelOff="Disabled" />
      <Toggle value={true} onChange={() => {}} variant="button" labelOn="Enabled" labelOff="Disabled" />
      <Toggle value={false} onChange={() => {}} variant="switch" labelOn="Classic Mode" labelOff="Classic Mode" />
      <Toggle value={true} onChange={() => {}} variant="switch" labelOn="Classic Mode" labelOff="Classic Mode" />
    </div>
  ),
};
