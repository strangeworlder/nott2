import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const meta = {
  title: 'Atoms/TextField',
  component: TextField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { value: '', onChange: () => {} },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Static stories ─────────────────────────────────────────────────────────── */

export const Default: Story = {
  args: { placeholder: 'Enter your name…' },
};

export const WithLabel: Story = {
  args: { label: 'Character Name', placeholder: 'e.g. Dana Winslow' },
};

export const WithHelperText: Story = {
  args: {
    label: 'Room Code',
    placeholder: '6-digit code',
    helperText: 'Ask your GM for the room code',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    value: 'not-an-email',
    error: 'Please enter a valid email address',
  },
};

export const Required: Story = {
  args: { label: 'Display Name', placeholder: 'Required field', required: true },
};

export const WithCharCount: Story = {
  args: {
    label: 'Tagline',
    placeholder: 'Short and punchy…',
    maxLength: 40,
    value: 'The night is young',
  },
};

export const Ghost: Story = {
  args: { variant: 'ghost', placeholder: 'Ghost variant — minimal chrome' },
};

export const Disabled: Story = {
  args: { label: 'Locked Field', value: 'Cannot edit', disabled: true },
};

export const Small: Story = {
  args: { size: 'sm', placeholder: 'Small' },
};

export const Large: Story = {
  args: { size: 'lg', placeholder: 'Large' },
};

/* ── Interactive story ──────────────────────────────────────────────────────── */

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextField
        label="Character Name"
        placeholder="Type something…"
        helperText="This will be visible to other players"
        value={value}
        onChange={setValue}
        maxLength={30}
      />
    );
  },
};

/* ── All sizes ──────────────────────────────────────────────────────────────── */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <TextField
          key={size}
          size={size}
          value=""
          onChange={() => {}}
          placeholder={`Size: ${size}`}
          label={size.toUpperCase()}
        />
      ))}
    </div>
  ),
};

/* ── All states ─────────────────────────────────────────────────────────────── */

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <TextField value="" onChange={() => {}} label="Default" placeholder="Default state" />
      <TextField value="" onChange={() => {}} label="Ghost" variant="ghost" placeholder="Ghost variant" />
      <TextField value="" onChange={() => {}} label="With Error" error="Something went wrong" />
      <TextField value="" onChange={() => {}} label="Required" required placeholder="Required" />
      <TextField value="Locked" onChange={() => {}} label="Disabled" disabled />
      <TextField value="Almost full" onChange={() => {}} label="Char Count" maxLength={15} />
    </div>
  ),
};
