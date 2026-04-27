import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    // Vanilla Extract css.ts files export class names as strings at test time;
    // no actual CSS is generated, which is correct for unit testing.
    include: ['src/**/*.test.{ts,tsx}'],
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
});
