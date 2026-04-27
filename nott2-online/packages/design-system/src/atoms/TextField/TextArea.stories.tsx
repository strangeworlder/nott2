import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './TextArea';

const meta = {
  title: 'Atoms/TextArea',
  component: TextArea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { value: '', onChange: () => {} },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Static stories ─────────────────────────────────────────────────────────── */

export const Default: Story = {
  args: { placeholder: 'Write something…' },
};

export const WithLabel: Story = {
  args: { label: 'Backstory', placeholder: 'Tell us about your character…' },
};

export const WithHelperText: Story = {
  args: {
    label: 'Scene Description',
    placeholder: 'Describe what the players see…',
    helperText: 'Markdown formatting is supported',
  },
};

export const WithError: Story = {
  args: {
    label: 'Notes',
    value: 'x',
    error: 'Must be at least 10 characters',
  },
};

export const Required: Story = {
  args: { label: 'Session Notes', placeholder: 'Required…', required: true },
};

export const WithCharCount: Story = {
  args: {
    label: 'Character Quote',
    placeholder: 'A memorable line…',
    maxLength: 140,
    value: 'The house at the end of the road has been watching us since we arrived.',
  },
};

export const Ghost: Story = {
  args: { variant: 'ghost', placeholder: 'Ghost variant — borderless until focused' },
};

export const Disabled: Story = {
  args: { label: 'Locked', value: 'This content is locked', disabled: true },
};

export const NoResize: Story = {
  args: { label: 'Fixed Height', placeholder: 'Cannot resize', resize: 'none', rows: 3 },
};

export const TallRows: Story = {
  args: { label: 'Journal Entry', placeholder: 'Plenty of room…', rows: 10 },
};

/* ── Interactive story ──────────────────────────────────────────────────────── */

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextArea
        label="Character Backstory"
        placeholder="Born in the shadow of Mount Dread…"
        helperText="This will be shared with the GM"
        value={value}
        onChange={setValue}
        maxLength={500}
        rows={6}
      />
    );
  },
};

/* ── All states ─────────────────────────────────────────────────────────────── */

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <TextArea value="" onChange={() => {}} label="Default" placeholder="Default state" />
      <TextArea value="" onChange={() => {}} label="Ghost" variant="ghost" placeholder="Ghost variant" />
      <TextArea value="" onChange={() => {}} label="With Error" error="Something went wrong" />
      <TextArea value="" onChange={() => {}} label="Required" required placeholder="Required" />
      <TextArea value="Locked text" onChange={() => {}} label="Disabled" disabled />
      <TextArea value="Near the limit now" onChange={() => {}} label="Char Count" maxLength={25} />
    </div>
  ),
};
