/**
 * CreateForm — Host creates a new multiplayer room.
 * Handles Discord SSO gating and anonymous fallback.
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, Button, TextField, Icon, Text } from '@nott2/design-system';
import { useGameStore } from '../../store/game-store';

export function CreateForm({ onCreated }: { onCreated: () => void }) {
  const { createRoom, multiplayerError } = useGameStore() as any;
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const [session, setSession] = useState<any>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.ok ? r.json() : null)
      .then(data => { setSession(data?.user?.discordId ? data : null); setSessionChecked(true); })
      .catch(() => { setSessionChecked(true); });

    fetch('/api/auth/providers')
      .then(r => r.ok ? r.json() : null)
      .then(providers => { if (providers?.discord) setAuthRequired(true); })
      .catch(() => {});
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try { await createRoom(name.trim()); onCreated(); } finally { setLoading(false); }
  };

  if (!sessionChecked) {
    return (
      <Card title="Create a Game">
        <div className="lobby-form">
          <Text variant="caption" color="muted" align="center">Checking authentication…</Text>
        </div>
      </Card>
    );
  }

  if (authRequired && !session) {
    return (
      <Card title="Create a Game">
        <div className="lobby-form" style={{ gap: 16 }}>
          <Text variant="body" color="muted">
            To host a game, you need to verify your subscription by signing in with Discord.
          </Text>
          <Button variant="primary" onClick={() => window.location.href = '/auth/signin'}>
            <Icon name="login" size={20} /> Sign in with Discord
          </Button>
          <Text variant="caption" color="muted" align="center">
            Players joining a game don't need to sign in — use the "Join Game" tab.
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Create a Game">
      <div className="lobby-form">
        {session && (
          <div style={{
            padding: '8px 12px', borderRadius: 6, marginBottom: 8,
            background: 'rgba(88, 101, 242, 0.08)', border: '1px solid rgba(88, 101, 242, 0.2)',
            fontSize: '0.8rem', color: 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon name="check_circle" size={16} />
            Signed in as <strong style={{ color: 'var(--color-text)' }}>{session.user.discordName ?? session.user.name}</strong>
          </div>
        )}
        <TextField id="create-name" label="Your Name" value={name} onChange={setName}
          onKeyDown={e => e.key === 'Enter' && handleCreate()} placeholder="Enter your name"
          maxLength={24} autoFocus error={multiplayerError || undefined}
          helperText="A 6-character room code will be generated. Share it with your players." />
        <Button variant="primary" onClick={handleCreate} disabled={!name.trim() || loading}>
          {loading ? 'Creating…' : 'Create Game →'}
        </Button>
      </div>
    </Card>
  );
}
