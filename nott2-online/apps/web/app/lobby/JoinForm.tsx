/**
 * JoinForm — Player joins an existing multiplayer room.
 */

'use client';

import { useState } from 'react';
import { Card, Button, TextField } from '@nott2/design-system';
import { useGameStore } from '../../store/game-store';

export function JoinForm({ onJoined }: { onJoined: () => void }) {
  const { joinRoom, multiplayerError } = useGameStore() as any;
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!name.trim() || code.length < 4) return;
    setLoading(true);
    try { await joinRoom(code.toUpperCase().trim(), name.trim()); onJoined(); } finally { setLoading(false); }
  };

  return (
    <Card title="Join a Game">
      <div className="lobby-form">
        <TextField id="join-code" label="Room Code" value={code}
          onChange={v => setCode(v.toUpperCase().slice(0, 6))} placeholder="XXXXXX" maxLength={6} autoFocus />
        <TextField id="join-name" label="Your Name" value={name} onChange={setName}
          onKeyDown={e => e.key === 'Enter' && handleJoin()} placeholder="Enter your name"
          maxLength={24} error={multiplayerError || undefined} />
        <Button variant="primary" onClick={handleJoin} disabled={!name.trim() || code.length < 4 || loading}>
          {loading ? 'Joining…' : 'Join Game →'}
        </Button>
      </div>
    </Card>
  );
}
