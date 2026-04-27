/**
 * ChatPanel (Organism)
 *
 * Philosophical:
 * The chat panel is the player's voice at the table — both for casual
 * conversation and for narrating the horror unfolding. System messages
 * are the game's own voice: impersonal, inevitable. Escalation messages
 * carry special weight.
 *
 * Technical:
 * Scrollable message list with a text input. Supports four message types
 * with distinct visual treatments. Own messages right-align.
 *
 * Props:
 * - messages: Array of ChatMessage.
 * - onSend: Called with the text string when the user submits.
 * - currentPlayerId: Used to identify "own" messages for right-alignment.
 */

'use client';
import React, { useState, useRef, useEffect } from 'react';
import * as styles from './ChatPanel.css';

export type MessageType = 'chat' | 'system' | 'escalation' | 'genre-point';

export interface ChatMessage {
  id: string;
  type: MessageType;
  playerId?: string;
  playerName?: string;
  text: string;
  timestamp: number;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend?: (text: string) => void;
  currentPlayerId?: string;
  id?: string;
}

function MessageBubble({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  if (message.type === 'system') {
    return <div className={styles.systemMessage}>{message.text}</div>;
  }
  if (message.type === 'escalation') {
    return <div className={styles.escalationMessage}>⚠ {message.text}</div>;
  }
  if (message.type === 'genre-point') {
    return <div className={styles.genrePointMessage}>★ {message.text}</div>;
  }
  return (
    <div className={`${styles.chatBubble} ${isOwn ? styles.ownBubble : ''}`}>
      {!isOwn && <span className={styles.bubbleSender}>{message.playerName}</span>}
      <span className={styles.bubbleText}>{message.text}</span>
    </div>
  );
}

export function ChatPanel({ messages, onSend, currentPlayerId, id }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !onSend) return;
    onSend(text);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div id={id} className={styles.chatPanel}>
      <div className={styles.messageList} ref={scrollRef} role="log" aria-live="polite">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.playerId === currentPlayerId}
          />
        ))}
      </div>
      {onSend && (
        <div className={styles.inputRow}>
          <input
            className={styles.chatInput}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something…"
            aria-label="Chat message"
          />
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Send message"
          >
            ↵
          </button>
        </div>
      )}
    </div>
  );
}
