/**
 * CardDealContext — Provides the 3D card deal bridge to phase screens.
 *
 * Philosophical:
 * The 3D card deal overlay is a full-screen canvas that transcends individual
 * components. It lives at the GameShell level — alongside the TransitionOverlay
 * and other global layers — but the *target zones* (where cards land, where
 * they fly to) are owned by individual phase screen components. This context
 * bridges that gap: phase screens register their refs, and the bridge hook
 * uses them to compute world-space landing areas.
 *
 * Technical:
 * - `registerTableRef` / `registerDeckRef` / `registerTrophyRef`: called by
 *   phase screen components (SceneSetupScreen) to set target elements.
 * - `CardOverlayPortal`: the 3D canvas, rendered once at GameShell level.
 * - Refs are stored as MutableRefObjects so the bridge hook stays stable.
 */

'use client';

import React, {
  createContext, useContext, useRef, useCallback, useMemo,
  type ReactNode, type MutableRefObject,
} from 'react';

// ── Context shape ────────────────────────────────────────────────────────────

interface CardDealContextValue {
  /** Ref to the target zone where cards land (the "Visible Threat Cards" area) */
  tableRef: MutableRefObject<HTMLElement | null>;
  /** Ref to the deck zone (source of card spawns) */
  deckRef: MutableRefObject<HTMLElement | null>;
  /** Ref to the trophy zone (fly-to-target destination) */
  trophyRef: MutableRefObject<HTMLElement | null>;

  /** Register the table target element (called by phase screens) */
  registerTableRef: (el: HTMLElement | null) => void;
  /** Register the deck source element */
  registerDeckRef: (el: HTMLElement | null) => void;
  /** Register the trophy destination element */
  registerTrophyRef: (el: HTMLElement | null) => void;
}

const CardDealContext = createContext<CardDealContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function CardDealProvider({ children }: { children: ReactNode }) {
  const tableRef  = useRef<HTMLElement | null>(null);
  const deckRef   = useRef<HTMLElement | null>(null);
  const trophyRef = useRef<HTMLElement | null>(null);

  const registerTableRef  = useCallback((el: HTMLElement | null) => { tableRef.current = el; }, []);
  const registerDeckRef   = useCallback((el: HTMLElement | null) => { deckRef.current = el; }, []);
  const registerTrophyRef = useCallback((el: HTMLElement | null) => { trophyRef.current = el; }, []);

  const value = useMemo<CardDealContextValue>(() => ({
    tableRef, deckRef, trophyRef,
    registerTableRef, registerDeckRef, registerTrophyRef,
  }), [registerTableRef, registerDeckRef, registerTrophyRef]);

  return (
    <CardDealContext.Provider value={value}>
      {children}
    </CardDealContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useCardDealContext() {
  const ctx = useContext(CardDealContext);
  if (!ctx) throw new Error('useCardDealContext must be used within <CardDealProvider>');
  return ctx;
}
