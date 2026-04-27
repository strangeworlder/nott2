# Phase 5: WebRTC Audio/Video

> **Goal**: 4-player audio/video connections working via raw WebRTC with Firebase signaling. Players can see and hear each other.  
> **Skills**: `multiplayer-game`  
> **Estimated Effort**: 3–4 sessions  
> **Depends on**: Phase 4 (Firebase RTDB for signaling)

---

## Deliverables

- [x] WebRTC signaling protocol via Firebase RTDB
- [x] Mesh network: 4 players = 6 peer connections
- [x] Camera + microphone stream acquisition
- [x] Video grid component (2×2 layout)
- [x] Mute/unmute audio + video toggle per player
- [x] ICE candidate exchange via Firebase
- [x] Connection state indicators (connecting, connected, failed)
- [ ] Graceful reconnection on peer disconnect
- [x] STUN server configuration (Google STUN for dev)
- [x] TURN server strategy documented (for production)

---

## 5.1 Network Topology: Full Mesh

With 4 players, a full mesh creates 6 peer-to-peer connections:

```
    P1 ──── P2
    │╲      ╱│
    │  ╲  ╱  │
    │   ╳    │
    │  ╱  ╲  │
    │╱      ╲│
    P3 ──── P4

Connections: P1↔P2, P1↔P3, P1↔P4, P2↔P3, P2↔P4, P3↔P4
```

Full mesh is appropriate here because:
- Only 4 peers (mesh scales poorly past 6–8)
- Each player needs to see/hear all others
- No media server needed (lower latency, no cost)

---

## 5.2 Signaling Protocol

### Firebase RTDB Structure

```
games/{roomCode}/signaling/
└── {callerId}_{calleeId}/        # Sorted pair: lower ID is caller
    ├── offer: {
    │   ├── type: 'offer'
    │   ├── sdp: string
    │   └── timestamp: number
    │   }
    ├── answer: {
    │   ├── type: 'answer'
    │   ├── sdp: string
    │   └── timestamp: number
    │   }
    └── candidates/
        └── {pushId}: {
            ├── candidate: string
            ├── sdpMid: string
            ├── sdpMLineIndex: number
            └── from: string          # Who sent this candidate
            }
```

### Connection Initiation Protocol

When a new player joins the room:

1. **New player** creates `RTCPeerConnection` for each existing player
2. Deterministic caller selection: player with lexicographically lower UID is always the **caller** (creates offer). This prevents race conditions where both sides might create offers.
3. **Caller** creates offer → writes to `signaling/{caller}_{callee}/offer`
4. **Callee** detects offer via `onValue` → creates answer → writes to `signaling/{caller}_{callee}/answer`
5. Both exchange ICE candidates via `signaling/{caller}_{callee}/candidates/`

### Renegotiation

If a peer connection fails or a player toggles video on/off:
1. Clear the signaling path
2. Re-initiate the handshake
3. Existing data channels survive if the underlying transport is re-established

---

## 5.3 Peer Manager (`peer-manager.ts`)

```typescript
class PeerManager {
  private peers: Map<string, RTCPeerConnection>;
  private localStream: MediaStream | null;
  private remoteStreams: Map<string, MediaStream>;

  constructor(
    private playerId: string,
    private roomCode: string,
    private config: RTCConfiguration,
  ) {}

  // === Lifecycle ===
  async initLocalMedia(audio: boolean, video: boolean): Promise<MediaStream>;
  async connectToPeer(remotePlayerId: string): Promise<void>;
  async disconnectFromPeer(remotePlayerId: string): Promise<void>;
  disconnectAll(): void;

  // === Media Controls ===
  toggleAudio(muted: boolean): void;
  toggleVideo(enabled: boolean): void;
  replaceVideoTrack(newTrack: MediaStreamTrack): void;

  // === Events ===
  onRemoteStream: (playerId: string, stream: MediaStream) => void;
  onPeerStateChange: (playerId: string, state: RTCPeerConnectionState) => void;
  onPeerDisconnected: (playerId: string) => void;
}
```

### ICE Configuration

```typescript
const rtcConfig: RTCConfiguration = {
  iceServers: [
    // Free STUN servers (dev + most NAT types)
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
};
```

> [!WARNING]
> **STUN-only limitation**: ~85% of connections work with STUN alone. Players behind symmetric NATs (some corporate networks, mobile carriers) will fail to connect. For production, a TURN relay server is needed.
>
> **TURN options for later**:
> - Metered.ca — Free 500GB/month, just add credentials
> - Twilio TURN — $0.0004/min, extremely reliable
> - Self-hosted coturn on a $5/month VPS

---

## 5.4 Media Manager (`media.ts`)

```typescript
async function getLocalMedia(constraints?: MediaStreamConstraints): Promise<MediaStream> {
  const defaults: MediaStreamConstraints = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: {
      width: { ideal: 640, max: 1280 },
      height: { ideal: 480, max: 720 },
      frameRate: { ideal: 24, max: 30 },
    },
  };
  return navigator.mediaDevices.getUserMedia({ ...defaults, ...constraints });
}
```

### Permission Handling

```typescript
// Check and request permissions gracefully
async function checkMediaPermissions(): Promise<{
  audio: 'granted' | 'denied' | 'prompt';
  video: 'granted' | 'denied' | 'prompt';
}>;
```

The UI should:
1. Explain why camera/mic are needed ("See and hear your friends!")
2. Show permission prompt
3. Handle denial gracefully — audio-only fallback, or text-only mode
4. Remember preference in localStorage

---

## 5.5 Video Grid Component

2×2 grid showing all 4 players:

```
┌──────────────┬──────────────┐
│  Player 1    │  Player 2    │
│  [video]     │  [video]     │
│  ♠ The Jock  │  ♥ The Final │
│  🎤 🎥       │  🎤 📷      │
├──────────────┼──────────────┤
│  Player 3    │  Player 4    │
│  [video]     │  [video]     │
│  ♣ The Nerd  │  ♦ The Rebel │
│  🔇 🎥       │  🎤 🎥      │
└──────────────┴──────────────┘
```

Each cell shows:
- Video feed (or avatar placeholder if camera off)
- Player name + character
- Mute/camera indicators
- Connection status indicator (green dot / red dot / spinning)
- "Active Player" highlight (red glow border when it's their turn)
- Strike count overlay

### Local Player View

The local player's video is mirrored (CSS `transform: scaleX(-1)`) as is standard for self-view.

---

## 5.6 Zustand WebRTC Slice

```typescript
interface WebRTCSlice {
  localStream: MediaStream | null;
  remoteStreams: Record<string, MediaStream>;  // playerId → stream
  peerStates: Record<string, RTCPeerConnectionState>;
  audioMuted: boolean;
  videoEnabled: boolean;

  // Actions
  initMedia: () => Promise<void>;
  toggleAudio: () => void;
  toggleVideo: () => void;
  connectToPeers: (playerIds: string[]) => Promise<void>;
  disconnectAll: () => void;
}
```

---

## 5.7 Cleanup

When a player leaves or the game ends:

1. Stop all local media tracks (`track.stop()`)
2. Close all peer connections (`pc.close()`)
3. Remove signaling data from Firebase
4. Clear remote streams from Zustand

Firebase `onDisconnect()` handlers clean up signaling data automatically if a player crashes.

---

## Verification

- [ ] Local video preview works (camera permission granted)
- [ ] 2 tabs can see each other's video
- [ ] 3 tabs can all see each other
- [ ] 4 tabs — full mesh, all video feeds visible
- [ ] Audio works — can hear other tabs (test with speakers + headphones)
- [ ] Mute audio — other players stop hearing
- [ ] Disable video — shows placeholder
- [ ] Player disconnects — video feed removed, indicator shows offline
- [ ] Player reconnects — video feed re-established
- [ ] Works on same machine (localhost, multiple tabs)
- [ ] Works across machines on same LAN
- [ ] Connection state indicators accurate
