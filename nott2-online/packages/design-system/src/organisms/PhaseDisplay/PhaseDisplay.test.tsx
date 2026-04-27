import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PhaseDisplay } from './PhaseDisplay';

describe('PhaseDisplay', () => {
  it('renders default title for known phase', () => {
    render(<PhaseDisplay phase="welcome" />);
    expect(screen.getByText('Night of the Thirteenth')).toBeTruthy();
  });

  it('renders custom title override', () => {
    render(<PhaseDisplay phase="welcome" title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeTruthy();
  });

  it('renders subtitle', () => {
    render(<PhaseDisplay phase="game-setup" />);
    expect(screen.getByText(/Name your characters/)).toBeTruthy();
  });

  it('renders custom subtitle override', () => {
    render(<PhaseDisplay phase="welcome" subtitle="Custom sub" />);
    expect(screen.getByText('Custom sub')).toBeTruthy();
  });

  it('renders body when provided', () => {
    render(<PhaseDisplay phase="act-setup" body="The second act begins in darkness." />);
    expect(screen.getByText('The second act begins in darkness.')).toBeTruthy();
  });

  it('renders children in slot', () => {
    render(<PhaseDisplay phase="scene-setup"><button>Go</button></PhaseDisplay>);
    expect(screen.getByRole('button', { name: 'Go' })).toBeTruthy();
  });

  it('renders title as h1', () => {
    const { container } = render(<PhaseDisplay phase="welcome" />);
    expect(container.querySelector('h1')).toBeTruthy();
  });
});
