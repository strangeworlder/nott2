import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import type { IconName } from './Icon';

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { name: 'spades', size: 32 },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Custom SVG Suit Icons ───────────────────────────────────────────────────

export const Spades: Story = { args: { name: 'spades', color: 'white' } };
export const Hearts: Story = { args: { name: 'hearts', color: 'red' } };
export const Diamonds: Story = { args: { name: 'diamonds', color: 'red' } };
export const Clubs: Story = { args: { name: 'clubs', color: 'white' } };

export const SuitRow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Icon name="spades" size={40} color="white" />
      <Icon name="hearts" size={40} color="red" />
      <Icon name="diamonds" size={40} color="red" />
      <Icon name="clubs" size={40} color="white" />
    </div>
  ),
};

// ── Material Symbol Icons ───────────────────────────────────────────────────

export const Schedule: Story = { args: { name: 'schedule', color: 'muted' } };
export const Warning: Story = { args: { name: 'warning', color: 'red' } };
export const Casino: Story = { args: { name: 'casino', color: 'white' } };
export const Bolt: Story = { args: { name: 'bolt', color: 'red' } };
export const TheaterComedy: Story = { args: { name: 'theater_comedy', color: 'muted' } };

// ── All Icons Gallery ───────────────────────────────────────────────────────

const CUSTOM_ICONS: IconName[] = ['spades', 'hearts', 'diamonds', 'clubs', 'strike_filled', 'strike_empty', 'strike_dead'];

const MATERIAL_ICONS: IconName[] = [
  'schedule', 'chevron_right', 'chevron_left', 'expand_more', 'refresh',
  'group', 'person', 'check', 'close', 'warning', 'bolt', 'auto_awesome',
  'star', 'target', 'air', 'local_fire_department', 'dangerous',
  'casino', 'emoji_events', 'theater_comedy', 'skull',
  'movie', 'mic', 'mic_off', 'videocam', 'videocam_off',
  'description', 'assignment', 'settings', 'shuffle', 'delete', 'playing_cards',
  'check_circle', 'arrow_downward', 'key', 'military_tech', 'input', 'person_raised_hand',
  'crown', 'swords', 'deployed_code', 'lock', 'link_off', 'group_off', 'error_outline', 'login',
  'expand_less',
];

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 11, color: '#6a6a6a', fontFamily: 'monospace', marginBottom: 8 }}>
          Custom SVG (Card Suits)
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {CUSTOM_ICONS.map(name => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Icon name={name} size={24} color="muted" />
              <span style={{ fontSize: 9, color: '#6a6a6a', fontFamily: 'monospace' }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#6a6a6a', fontFamily: 'monospace', marginBottom: 8 }}>
          Material Symbols Rounded
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {MATERIAL_ICONS.map(name => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Icon name={name} size={24} color="muted" />
              <span style={{ fontSize: 9, color: '#6a6a6a', fontFamily: 'monospace' }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
