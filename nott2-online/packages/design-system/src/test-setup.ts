import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock Vanilla Extract css.ts modules — in the test environment, VE doesn't
// run through its Vite plugin, so .css.ts files need to return stub values.
// Components use className strings; testing behavior doesn't require real CSS.
vi.mock('@vanilla-extract/css', () => ({
  createThemeContract: () => new Proxy({}, { get: () => 'var(--ve-mock)' }),
  createTheme: () => 'dark-theme',
  style: () => 'mock-style',
  keyframes: () => 'mock-keyframe',
  globalStyle: () => undefined,
}));

vi.mock('@vanilla-extract/recipes', () => ({
  recipe: () => () => 'mock-recipe',
}));
