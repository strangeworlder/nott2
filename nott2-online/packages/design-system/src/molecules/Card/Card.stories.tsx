import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Text } from '../../atoms/Text/Text';
import { Button } from '../../atoms/Button/Button';

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  tags: ['autodocs'],
  args: { children: 'Card content goes here.' },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};
export const WithTitle: Story = { args: { title: 'Section Title', children: 'Body content inside the card.' } };
export const Muted: Story = { args: { variant: 'muted', children: 'Muted card.' } };
export const Highlighted: Story = { args: { variant: 'highlighted', title: 'Active', children: 'Highlighted card.' } };
export const Success: Story = { args: { variant: 'success', title: 'Victory', children: 'You survived.' } };
export const Failure: Story = { args: { variant: 'failure', title: 'Defeat', children: 'All is lost.' } };
export const Instruction: Story = { args: { variant: 'instruction', children: 'Draw a card from the threat deck.' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Ghost card — transparent.' } };
export const Interactive: Story = { args: { variant: 'highlighted', interactive: true, title: 'Clickable', children: 'Hover for glow.' } };
export const NoPadding: Story = { args: { noPadding: true, children: <div style={{ padding: 8, background: '#333' }}>Custom padding content</div> } };

// ── Operational Step: complete ──────────────────────────────────────────

export const Complete: Story = {
  args: {
    title: 'Define the Sacrifice',
    complete: true,
    completionLabel: 'Sacrifice confirmed.',
    children: (
      <Text variant="caption" color="muted">
        "If you push yourself, what are you willing to sacrifice?"
      </Text>
    ),
  },
};

export const CompletePending: Story = {
  name: 'Complete — Before & After',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="Escalation — Something Not Right">
        <Text variant="caption" color="muted" style={{ marginBottom: 12 }}>
          Any non-active player can add a terrifying detail. Once per scene.
        </Text>
        <Button variant="secondary" size="sm">Use Escalation</Button>
      </Card>
      <Card title="Escalation — Something Not Right" complete completionLabel="Escalation used this scene.">
        <Text variant="caption" color="muted">
          Any non-active player can add a terrifying detail. Once per scene.
        </Text>
      </Card>
    </div>
  ),
};

// ── Collapsible ─────────────────────────────────────────────────────────

export const Collapsible: Story = {
  name: 'Collapsible — Expanded',
  args: {
    title: 'Rules Modules',
    collapsible: true,
    collapsed: false,
    children: (
      <Text variant="caption" color="muted">
        Classic Setup and Final Girl toggles would appear here.
      </Text>
    ),
  },
};

export const CollapsibleCollapsed: Story = {
  name: 'Collapsible — Collapsed',
  args: {
    title: 'Rules Modules',
    collapsible: true,
    collapsed: true,
    children: (
      <Text variant="caption" color="muted">
        This content is hidden.
      </Text>
    ),
  },
};

// ── Combined: complete + collapsible ────────────────────────────────────

export const CompleteAndCollapsible: Story = {
  name: 'Complete + Collapsible',
  args: {
    title: 'Assign Strikes',
    complete: true,
    completionLabel: 'All strikes assigned.',
    collapsible: true,
    collapsed: false,
    children: (
      <Text variant="caption" color="muted">
        Strike assignment controls remain visible for review.
      </Text>
    ),
  },
};

export const CompleteCollapsedAndCollapsed: Story = {
  name: 'Complete + Collapsed',
  args: {
    title: 'Assign Strikes',
    complete: true,
    completionLabel: 'All strikes assigned.',
    collapsible: true,
    collapsed: true,
    children: (
      <Text variant="caption" color="muted">
        This content is hidden but can be expanded.
      </Text>
    ),
  },
};
