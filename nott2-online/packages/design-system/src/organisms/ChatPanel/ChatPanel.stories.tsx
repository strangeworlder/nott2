import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ChatPanel } from './ChatPanel';
import type { ChatMessage } from './ChatPanel';

const meta: Meta<typeof ChatPanel> = {
  title: 'Organisms/ChatPanel',
  component: ChatPanel,
  tags: ['autodocs'],
  decorators: [Story => <div style={{ height: 450, display: 'flex' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof ChatPanel>;

const MESSAGES: ChatMessage[] = [
  { id: '1', type: 'system',       text: 'Act 1 begins.', timestamp: 1 },
  { id: '2', type: 'chat',         playerId: 'p1', playerName: 'Alice', text: 'Did you hear that?', timestamp: 2 },
  { id: '3', type: 'chat',         playerId: 'p2', playerName: 'Bob',   text: "It's nothing. Probably.", timestamp: 3 },
  { id: '4', type: 'escalation',   text: "Something's Not Right — Bob acts.", timestamp: 4 },
  { id: '5', type: 'genre-point',  text: 'Alice earns a Genre Point.', timestamp: 5 },
  { id: '6', type: 'chat',         playerId: 'p1', playerName: 'Alice', text: 'I told you so.', timestamp: 6 },
  { id: '7', type: 'system',       text: '♠ The Jock draws 7♥.', timestamp: 7 },
];

function InteractiveChatPanel() {
  const [msgs, setMsgs] = useState<ChatMessage[]>(MESSAGES);
  return (
    <ChatPanel
      messages={msgs}
      currentPlayerId="p1"
      onSend={text => setMsgs(m => [
        ...m,
        { id: String(Date.now()), type: 'chat', playerId: 'p1', playerName: 'Alice', text, timestamp: Date.now() },
      ])}
    />
  );
}

export const Interactive: Story = { render: () => <InteractiveChatPanel /> };
export const Empty: Story = { args: { messages: [], currentPlayerId: 'p1', onSend: () => {} } };
export const ReadOnly: Story = { args: { messages: MESSAGES, currentPlayerId: 'p1' } };
export const OwnMessages: Story = { args: { messages: MESSAGES, currentPlayerId: 'p2', onSend: () => {} } };
