import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerPanel } from './PlayerPanel';

describe('PlayerPanel', () => {
  it('renders phase name in header', () => {
    render(<PlayerPanel phase="resolution" />);
    expect(screen.getByText('Resolution')).toBeTruthy();
  });

  it('renders die selectors in resolution phase', () => {
    render(<PlayerPanel phase="resolution" />);
    expect(screen.getByText('Threat Die (d10)')).toBeTruthy();
    expect(screen.getByText('Effort Die (d4)')).toBeTruthy();
  });

  it('shows difficulty badge when provided', () => {
    const { container } = render(<PlayerPanel phase="resolution" difficulty={7} />);
    const badge = container.querySelector('[class*="difficultyBadge"]') ?? container.textContent;
    expect(String(badge)).toContain('7');
  });


  it('shows success banner when roll succeeds', () => {
    render(<PlayerPanel phase="resolution" rollMain={8} rollEffort={3} total={11} isSuccess={true} />);
    expect(screen.getByText(/SUCCESS/)).toBeTruthy();
  });

  it('shows failure banner when roll fails', () => {
    render(<PlayerPanel phase="resolution" rollMain={3} rollEffort={1} total={4} isSuccess={false} />);
    expect(screen.getByText(/FAILURE/)).toBeTruthy();
  });

  it('shows strikes to assign in fallout phase', () => {
    render(<PlayerPanel phase="fallout" strikesToAssign={2} />);
    expect(screen.getByText(/2 strikes to assign/)).toBeTruthy();
  });

  it('calls onNextPhase from generic view', () => {
    const fn = vi.fn();
    render(<PlayerPanel phase="scene-setup" onNextPhase={fn} />);
    fireEvent.click(screen.getByRole('button', { name: /Draw Card/i }));
    expect(fn).toHaveBeenCalledOnce();
  });
});
