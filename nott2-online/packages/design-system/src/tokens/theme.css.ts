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
    border: null,
    borderActive: null,
  },
  font: {
    display: null,
    body: null,
  },
  fontSize: {
    hero: null,
    h1: null,
    h2: null,
    h3: null,
    body: null,
    label: null,
    micro: null,
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
    glowIntense: null,
    glowGreen: null,
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
    border: '#2a2a2a',
    borderActive: '#8a0000',
  },
  font: {
    display: "'Playfair Display', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
  },
  fontSize: {
    hero: 'clamp(3rem, 8vw, 6rem)',
    h1: 'clamp(2rem, 5vw, 3.5rem)',
    h2: 'clamp(1.5rem, 3vw, 2.5rem)',
    h3: '1.25rem',
    body: '1rem',
    label: '0.875rem',
    micro: '0.625rem',
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
    glowIntense: '0 0 40px rgba(138, 0, 0, 0.6)',
    glowGreen: '0 0 20px rgba(45, 90, 45, 0.4)',
  },
  transition: {
    fast: '150ms ease-out',
    normal: '200ms ease-out',
    slow: '400ms ease-out',
  },
});
