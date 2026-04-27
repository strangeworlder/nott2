/**
 * Media Manager (`media.ts`)
 *
 * Handles local camera/microphone acquisition and permission checking.
 * All getUserMedia calls go through here so the app has a single
 * consistent permission + error-handling strategy.
 *
 * Constraints:
 *   Audio: echoCancellation, noiseSuppression, autoGainControl (table-play friendly)
 *   Video: 640×480 ideal, capped at 1280×720, 24fps ideal (bandwidth-conscious)
 *
 * Fallback strategy:
 *   1. audio+video → if fails → audio-only → if fails → error
 *   The UI handles `camera: false` by showing an avatar placeholder.
 */

export type MediaPermission = 'granted' | 'denied' | 'prompt' | 'unsupported';

export interface MediaPermissionState {
  audio: MediaPermission;
  video: MediaPermission;
}

export interface MediaResult {
  stream: MediaStream;
  hasAudio: boolean;
  hasVideo: boolean;
}

// ── Default constraints ───────────────────────────────────────────────────────

const AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

const VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  width: { ideal: 640, max: 1280 },
  height: { ideal: 480, max: 720 },
  frameRate: { ideal: 24, max: 30 },
};

// ── Permission checking ───────────────────────────────────────────────────────

/**
 * Check current media permission state without triggering prompts.
 * Falls back gracefully if the Permissions API isn't available.
 */
export async function checkMediaPermissions(): Promise<MediaPermissionState> {
  if (!navigator.permissions) {
    return { audio: 'unsupported', video: 'unsupported' };
  }

  const check = async (name: PermissionName): Promise<MediaPermission> => {
    try {
      const status = await navigator.permissions.query({ name });
      return status.state as MediaPermission;
    } catch {
      return 'unsupported';
    }
  };

  const [audio, video] = await Promise.all([
    check('microphone' as PermissionName),
    check('camera' as PermissionName),
  ]);

  return { audio, video };
}

// ── Stream acquisition ────────────────────────────────────────────────────────

/**
 * Acquire local media with audio+video.
 * On failure, falls back to audio-only.
 * On audio failure, throws — user must take action.
 */
export async function getLocalMedia(
  constraints: { audio: boolean; video: boolean } = { audio: true, video: true },
): Promise<MediaResult> {
  // Try audio+video
  if (constraints.video) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: constraints.audio ? AUDIO_CONSTRAINTS : false,
        video: VIDEO_CONSTRAINTS,
      });
      return {
        stream,
        hasAudio: stream.getAudioTracks().length > 0,
        hasVideo: stream.getVideoTracks().length > 0,
      };
    } catch (e) {
      // Camera failed — try audio only
      const err = e as DOMException;
      if (
        err.name === 'NotFoundError' ||
        err.name === 'NotAllowedError' ||
        err.name === 'NotReadableError'
      ) {
        console.warn('[Media] Camera failed, falling back to audio-only:', err.message);
      } else {
        throw e;
      }
    }
  }

  // Audio only
  if (constraints.audio) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: AUDIO_CONSTRAINTS,
      video: false,
    });
    return { stream, hasAudio: true, hasVideo: false };
  }

  throw new Error('At least audio must be enabled for multiplayer voice.');
}

// ── Track control ─────────────────────────────────────────────────────────────

/** Mute/unmute all audio tracks on a stream */
export function setAudioMuted(stream: MediaStream, muted: boolean): void {
  stream.getAudioTracks().forEach(t => { t.enabled = !muted; });
}

/** Enable/disable all video tracks on a stream */
export function setVideoEnabled(stream: MediaStream, enabled: boolean): void {
  stream.getVideoTracks().forEach(t => { t.enabled = enabled; });
}

/** Permanently stop all tracks (free camera/mic hardware) */
export function stopStream(stream: MediaStream): void {
  stream.getTracks().forEach(t => t.stop());
}

// ── Device enumeration ────────────────────────────────────────────────────────

export interface MediaDeviceList {
  audioInputs: MediaDeviceInfo[];
  videoInputs: MediaDeviceInfo[];
  audioOutputs: MediaDeviceInfo[];
}

export async function enumerateDevices(): Promise<MediaDeviceList> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return {
    audioInputs:  devices.filter(d => d.kind === 'audioinput'),
    videoInputs:  devices.filter(d => d.kind === 'videoinput'),
    audioOutputs: devices.filter(d => d.kind === 'audiooutput'),
  };
}
