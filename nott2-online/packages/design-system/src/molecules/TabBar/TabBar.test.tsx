import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabBar } from './TabBar';

const TABS = [
  { id: 'create', label: 'Create Game' },
  { id: 'join',   label: 'Join Game' },
];

describe('TabBar', () => {
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
});
