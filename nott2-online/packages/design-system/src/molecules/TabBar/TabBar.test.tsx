import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabBar } from './TabBar';
import type { Tab } from './TabBar';

const TABS: Tab[] = [
  { id: 'create', label: 'Create Game' },
  { id: 'join',   label: 'Join Game' },
];

const TABS_WITH_ICONS: Tab[] = [
  { id: 'create', label: 'Create Game', icon: 'playing_cards' },
  { id: 'join',   label: 'Join Game',   icon: 'group' },
];

const THREE_TABS: Tab[] = [
  { id: 'one',   label: 'One' },
  { id: 'two',   label: 'Two' },
  { id: 'three', label: 'Three' },
];

describe('TabBar', () => {
  /* ── Core rendering ──────────────────────────────────────────────── */

  it('renders all tabs', () => {
    render(<TabBar tabs={TABS} activeTab="create" onTabChange={() => {}} />);
    expect(screen.getByText('Create Game')).toBeTruthy();
    expect(screen.getByText('Join Game')).toBeTruthy();
  });

  it('marks active tab as aria-selected', () => {
    render(<TabBar tabs={TABS} activeTab="join" onTabChange={() => {}} />);
    const joinBtn = screen.getByText('Join Game');
    expect(joinBtn.getAttribute('aria-selected')).toBe('true');
    const createBtn = screen.getByText('Create Game');
    expect(createBtn.getAttribute('aria-selected')).toBe('false');
  });

  it('calls onTabChange when a tab is clicked', () => {
    const handler = vi.fn();
    render(<TabBar tabs={TABS} activeTab="create" onTabChange={handler} />);
    fireEvent.click(screen.getByText('Join Game'));
    expect(handler).toHaveBeenCalledWith('join');
  });

  it('has role="tablist"', () => {
    render(<TabBar tabs={TABS} activeTab="create" onTabChange={() => {}} />);
    expect(screen.getByRole('tablist')).toBeTruthy();
  });

  /* ── tabIndex management ─────────────────────────────────────────── */

  it('sets tabIndex=0 on active tab and tabIndex=-1 on inactive tabs', () => {
    render(<TabBar tabs={TABS} activeTab="create" onTabChange={() => {}} />);
    const createBtn = screen.getByText('Create Game');
    const joinBtn = screen.getByText('Join Game');
    expect(createBtn.getAttribute('tabindex')).toBe('0');
    expect(joinBtn.getAttribute('tabindex')).toBe('-1');
  });

  /* ── Keyboard navigation ─────────────────────────────────────────── */

  it('moves to next tab on ArrowRight', () => {
    const handler = vi.fn();
    render(<TabBar tabs={TABS} activeTab="create" onTabChange={handler} />);
    const createBtn = screen.getByText('Create Game');
    fireEvent.keyDown(createBtn, { key: 'ArrowRight' });
    expect(handler).toHaveBeenCalledWith('join');
  });

  it('wraps to first tab when ArrowRight on last tab', () => {
    const handler = vi.fn();
    render(<TabBar tabs={TABS} activeTab="join" onTabChange={handler} />);
    const joinBtn = screen.getByText('Join Game');
    fireEvent.keyDown(joinBtn, { key: 'ArrowRight' });
    expect(handler).toHaveBeenCalledWith('create');
  });

  it('moves to previous tab on ArrowLeft', () => {
    const handler = vi.fn();
    render(<TabBar tabs={TABS} activeTab="join" onTabChange={handler} />);
    const joinBtn = screen.getByText('Join Game');
    fireEvent.keyDown(joinBtn, { key: 'ArrowLeft' });
    expect(handler).toHaveBeenCalledWith('create');
  });

  it('wraps to last tab when ArrowLeft on first tab', () => {
    const handler = vi.fn();
    render(<TabBar tabs={TABS} activeTab="create" onTabChange={handler} />);
    const createBtn = screen.getByText('Create Game');
    fireEvent.keyDown(createBtn, { key: 'ArrowLeft' });
    expect(handler).toHaveBeenCalledWith('join');
  });

  it('moves to first tab on Home', () => {
    const handler = vi.fn();
    render(<TabBar tabs={THREE_TABS} activeTab="three" onTabChange={handler} />);
    const threeBtn = screen.getByText('Three');
    fireEvent.keyDown(threeBtn, { key: 'Home' });
    expect(handler).toHaveBeenCalledWith('one');
  });

  it('moves to last tab on End', () => {
    const handler = vi.fn();
    render(<TabBar tabs={THREE_TABS} activeTab="one" onTabChange={handler} />);
    const oneBtn = screen.getByText('One');
    fireEvent.keyDown(oneBtn, { key: 'End' });
    expect(handler).toHaveBeenCalledWith('three');
  });

  /* ── Icon support ────────────────────────────────────────────────── */

  it('renders Icon atoms when icon prop is provided', () => {
    const { container } = render(
      <TabBar tabs={TABS_WITH_ICONS} activeTab="create" onTabChange={() => {}} />,
    );
    // The Icon atom renders <span> elements with aria-hidden="true" for material icons
    const icons = container.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBe(2);
  });

  it('does not render icons when not provided', () => {
    const { container } = render(
      <TabBar tabs={TABS} activeTab="create" onTabChange={() => {}} />,
    );
    const icons = container.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBe(0);
  });
});
