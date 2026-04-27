/**
 * @nott2/multiplayer — Public API
 *
 * Firebase-backed multiplayer + WebRTC layer for Night of the Thirteenth 2.
 * Depends on @nott2/game-engine for types and validation.
 *
 * Modules:
 *   firebase      — App singleton, initFirebase(), getDb(), getFirebaseAuth()
 *   auth          — Anonymous auth, ensureAuth(), subscribeToAuth()
 *   lobby         — Room CRUD, createRoom(), joinRoom(), leaveRoom()
 *   sync          — State sync, pushState(), subscribeToGameState(), action queue
 *   presence      — Player presence, registerPresence(), isPlayerOnline()
 *   serialization — GameState ↔ Firebase-safe object conversion
 *   signaling     — WebRTC offer/answer/ICE exchange via Firebase RTDB
 *   media         — getUserMedia, permission checking, track control
 *   peer-manager  — RTCPeerConnection mesh management (PeerManager class)
 */

// Firebase init
export { initFirebase, getDb, getFirebaseAuth } from './firebase';
export type { FirebaseConfig } from './firebase';

// Auth
export { ensureAuth, subscribeToAuth, getCurrentUser } from './auth';
export type { AuthState } from './auth';

// Lobby
export {
  generateRoomCode,
  createRoom,
  joinRoom,
  leaveRoom,
  setRoomStatus,
  subscribeToPlayers,
  subscribeToRoomMeta,
} from './lobby';
export type { RoomStatus, RoomMeta, RoomPlayer, RoomSnapshot } from './lobby';

// State sync
export {
  pushState,
  subscribeToGameState,
  sendAction,
  subscribeToActionQueue,
  removeAction,
} from './sync';
export type { ActionQueueCallbacks } from './sync';

// Presence
export {
  registerPresence,
  isPlayerOnline,
  subscribeToPlayerPresence,
  STALE_THRESHOLD_MS,
} from './presence';

// Serialization
export { serializeGameState, deserializeGameState } from './serialization';
export type { SerializedGameState } from './serialization';

// WebRTC Signaling
export {
  getChannelKey,
  isCaller,
  writeOffer,
  writeAnswer,
  subscribeToOffer,
  subscribeToAnswer,
  writeCandidate,
  subscribeToCandidates,
  clearSignalingChannel,
  clearAllSignaling,
} from './signaling';
export type { SignalingOffer, SignalingAnswer, SignalingCandidate } from './signaling';

// Media
export {
  checkMediaPermissions,
  getLocalMedia,
  setAudioMuted,
  setVideoEnabled,
  stopStream,
  enumerateDevices,
} from './media';
export type { MediaPermission, MediaPermissionState, MediaResult, MediaDeviceList } from './media';

// PeerManager
export { PeerManager, DEFAULT_RTC_CONFIG } from './peer-manager';
export type { PeerManagerOptions, PeerStateCallback, RemoteStreamCallback, PeerDisconnectedCallback } from './peer-manager';
