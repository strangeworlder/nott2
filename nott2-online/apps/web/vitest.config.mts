import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Exclude Playwright E2E specs — those are run via `npm run e2e`, not vitest
    exclude: [
      'e2e/**',
      'node_modules/**',
      '.next/**',
    ],
  },
});
