import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: 'Act I' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: 'default' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Red: Story = { args: { variant: 'red', children: 'Killer' } };
export const Success: Story = { args: { variant: 'success', children: 'Survived' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Danger' } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="red">Killer</Badge>
      <Badge variant="success">Survived</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
};
