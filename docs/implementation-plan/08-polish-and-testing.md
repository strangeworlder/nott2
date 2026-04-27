# Phase 8: Polish & Testing

> **Goal**: Production-ready quality. E2E tests, performance, accessibility, edge case handling, deployment readiness.  
> **Skills**: `webapp-testing`, `playwright-best-practices`, `vercel-react-best-practices`  
> **Estimated Effort**: 2–3 sessions  
> **Depends on**: Phase 7 (fully assembled game)

---

## Deliverables

- [ ] Playwright E2E test suite — multi-browser game session
- [ ] Performance profiling and optimization
- [ ] Accessibility audit (keyboard nav, screen reader, color contrast)
- [ ] Error handling — connection drops, invalid state, network failures
- [ ] Reconnection robustness — player drops and rejoins mid-game
- [ ] TURN server configured for production NAT traversal
- [ ] Loading states and skeleton screens
- [ ] Mobile/tablet responsive polish
- [ ] SEO metadata for public pages
- [ ] Production build verification
- [ ] Deployment configuration (Vercel or Firebase Hosting)

---

## 8.1 E2E Testing (Playwright)

### Test Scenarios

| Test | Description | Browsers |
|------|-------------|----------|
| **Solo demo** | Play through a complete game in demo mode | Chrome |
| **Room lifecycle** | Create room → join → leave → rejoin | Chrome × 2 |
| **Full game (2-tab)** | Host + 1 client play through a complete game | Chrome × 2 |
| **4-player game** | Full 4-player game with all phases | Chrome × 4 |
| **Reconnection** | Player disconnects mid-scene → reconnects → state intact | Chrome × 2 |
| **Invalid actions** | Client tries host-only actions → rejected | Chrome × 2 |
| **Chat + escalation** | Chat messages sync, "Something's Not Right" works once | Chrome × 2 |

### Multi-Browser Setup

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    { name: 'player-1', use: { storageState: '.state/player1.json' } },
    { name: 'player-2', use: { storageState: '.state/player2.json' } },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
});
```

---

## 8.2 Performance

### Targets

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Bundle size (initial) | < 200KB gzipped | `next build` analysis |
| State sync latency | < 100ms | Manual measurement |
| Video frame rate | 24fps stable | DevTools |

### Optimization Checklist

- [ ] `react-ttrpg-dice` lazy-loaded with `next/dynamic`
- [ ] Video grid uses `requestAnimationFrame` for stream updates (not React state)
- [ ] Zustand selectors subscribe to minimal state slices
- [ ] Firebase listener cleanup on unmount
- [ ] Image assets optimized (next/image where applicable)
- [ ] Font preloading via `next/font`
- [ ] No unnecessary re-renders during dice animations

---

## 8.3 Accessibility

- [ ] All interactive elements keyboard-accessible
- [ ] Focus management during phase transitions
- [ ] ARIA labels on game board elements
- [ ] Color contrast meets WCAG AA (test red-on-black carefully)
- [ ] Screen reader announces phase changes, dice results, game events
- [ ] Reduced motion preference respected (disable animations)
- [ ] Video grid: alt text for when video is off

---

## 8.4 Error Handling

| Scenario | Handling |
|----------|---------|
| Firebase connection lost | Show banner, auto-retry, queue actions |
| WebRTC peer failed | Show indicator, auto-reconnect attempt |
| Camera/mic denied | Graceful fallback to audio-only or text-only |
| Room not found | Clear error message, back to lobby |
| Room full (5th player) | "Room is full" message |
| Host disconnects | Pause game, attempt host transfer or wait |
| Invalid game state | Log error, show debug info, offer reset |

---

## 8.5 Production Deployment

### Option A: Vercel

- Next.js native hosting
- Zero config deployment
- Edge functions for API routes (future)
- Good free tier

### Option B: Firebase Hosting + Cloud Functions

- Co-located with RTDB
- Cloud Functions for signaling server (future)
- Custom domain support

### TURN Server

For production WebRTC:
```typescript
// Add to ICE servers
{
  urls: 'turn:turn.example.com:443?transport=tcp',
  username: process.env.NEXT_PUBLIC_TURN_USERNAME,
  credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
}
```

---

## Verification

- [ ] All Playwright tests pass
- [ ] Lighthouse score ≥ 90 for landing page
- [ ] Bundle size within targets
- [ ] Keyboard-only game completion possible
- [ ] Production build succeeds (`npm run build`)
- [ ] Deployed to staging environment
- [ ] Real 4-player test session completed successfully
- [ ] WebRTC works across different networks (not just localhost)
