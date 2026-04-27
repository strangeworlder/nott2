import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatPanel } from './ChatPanel';
import type { ChatMessage } from './ChatPanel';

const MESSAGES: ChatMessage[] = [
  { id: '1', type: 'chat', playerId: 'p1', playerName: 'Alice', text: 'Hello!', timestamp: 1 },
  { id: '2', type: 'system', text: 'Act 2 has begun.', timestamp: 2 },
  { id: '3', type: 'escalation', text: "Something's not right.", timestamp: 3 },
  { id: '4', type: 'genre-point', text: 'Alice earns a Genre Point.', timestamp: 4 },
];

describe('ChatPanel', () => {
  it('renders chat messages', () => {
    render(<ChatPanel messages={MESSAGES} currentPlayerId="p2" />);
    expect(screen.getByText('Hello!')).toBeTruthy();
  });

  it('renders system message', () => {
    render(<ChatPanel messages={MESSAGES} currentPlayerId="p2" />);
    expect(screen.getByText('Act 2 has begun.')).toBeTruthy();
  });

  it('renders escalation message with prefix', () => {
    render(<ChatPanel messages={MESSAGES} currentPlayerId="p2" />);
    expect(screen.getByText(/Something's not right/)).toBeTruthy();
  });

  it('calls onSend with input text', () => {
    const onSend = vi.fn();
    render(<ChatPanel messages={[]} onSend={onSend} currentPlayerId="p1" />);
    const input = screen.getByLabelText('Chat message');
    fireEvent.change(input, { target: { value: 'Hi there' } });
    fireEvent.click(screen.getByLabelText('Send message'));
    expect(onSend).toHaveBeenCalledWith('Hi there');
  });

  it('clears input after send', () => {
    const onSend = vi.fn();
    render(<ChatPanel messages={[]} onSend={onSend} currentPlayerId="p1" />);
    const input = screen.getByLabelText('Chat message') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.click(screen.getByLabelText('Send message'));
    expect(input.value).toBe('');
  });
});
