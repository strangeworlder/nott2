import { createThemeContract, createTheme } from '@vanilla-extract/css';

/**
 * Theme Contract
 *
 * The single source of truth for all design tokens.
 * `vars` is the contract (a typed structure of empty strings).
 * `darkTheme` is the implementation — the Night of the Thirteenth default.
 *
 * Playsets can create alternative themes by calling createTheme(vars, { ...overrides })
 * without modifying this file.
 */
export const vars = createThemeContract({
  color: {
    background: null,
    surface: null,
    surfaceElevated: null,
    accent: null,
    accentBright: null,
    text: null,
    textMuted: null,
    success: null,
    successBright: null,
    warning: null,
    caution: null,
    cautionBright: null,
    border: null,
    borderSubtle: null,
    borderActive: null,
    gold: null,
    goldBright: null,
    diegeticSurface: null,
  },
  font: {
    display: null,
    body: null,
    mono: null,
  },
  fontSize: {
    hero: null,
    h1: null,
    h2: null,
    h3: null,
    lead: null,
    quote: null,
    bodyLg: null,
    body: null,
    label: null,
    small: null,
    micro: null,
    nano: null,
  },
  letterSpacing: {
    tight: null,
    normal: null,
    wide: null,
    wider: null,
    widest: null,
  },
  space: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    '2xl': null,
    '3xl': null,
  },
  radius: {
    sm: null,
    md: null,
    lg: null,
    full: null,
  },
  shadow: {
    glow: null,
    glowSubtle: null,
    glowIntense: null,
    glowGreen: null,
    glowGreenBright: null,
    glowGreenSubtle: null,
    beacon: null,
  },
  transition: {
    fast: null,
    normal: null,
    slow: null,
  },
});

export const darkTheme = createTheme(vars, {
  color: {
    background: '#0a0a0a',
    surface: '#141414',
    surfaceElevated: '#1a1a1a',
    accent: '#8a0000',
    accentBright: '#dc2626',
    text: '#e8e8e8',
    textMuted: '#6a6a6a',
    success: '#2d5a2d',
    successBright: '#4ade80',
    warning: '#fbbf24',
    caution: '#92400e',
    cautionBright: '#fb923c',
    border: '#2a2a2a',
    borderSubtle: 'rgba(255,255,255,0.12)',
    borderActive: '#8a0000',
    gold: 'rgb(180, 100, 40)',
    goldBright: 'rgb(220, 160, 60)',
    diegeticSurface: '#3a0505',
  },
  font: {
    display: "'Playfair Display', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    mono: 'monospace',
  },
  fontSize: {
    hero: 'clamp(3rem, 8vw, 6rem)',
    h1: 'clamp(2rem, 5vw, 3.5rem)',
    h2: 'clamp(1.5rem, 3vw, 2.5rem)',
    h3: '1.25rem',
    lead: 'clamp(1.125rem, 2vw, 1.25rem)',
    quote: 'clamp(1.25rem, 3vw, 1.5rem)',
    bodyLg: '1.125rem',
    body: '1rem',
    label: '0.875rem',
    small: '0.75rem',
    micro: '0.625rem',
    nano: '0.5rem',
  },
  letterSpacing: {
    tight: '0.04em',
    normal: '0.08em',
    wide: '0.12em',
    wider: '0.2em',
    widest: '0.35em',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  radius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    full: '9999px',
  },
  shadow: {
    glow: '0 0 20px rgba(138, 0, 0, 0.4)',
    glowSubtle: '0 0 10px rgba(138, 0, 0, 0.2)',
    glowIntense: '0 0 40px rgba(138, 0, 0, 0.6)',
    glowGreen: '0 0 20px rgba(45, 90, 45, 0.4)',
    glowGreenBright: '0 0 30px rgba(74, 222, 128, 0.4)',
    glowGreenSubtle: '0 0 8px rgba(74, 222, 128, 0.5)',
    beacon: '0 0 10px 3px rgba(180, 100, 40, 0.40), 0 0 30px 6px rgba(180, 60, 20, 0.20)',
  },
  transition: {
    fast: '150ms ease-out',
    normal: '200ms ease-out',
    slow: '400ms ease-out',
  },
});
