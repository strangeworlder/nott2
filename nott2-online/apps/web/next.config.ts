import path from 'path';
import type { NextConfig } from 'next';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  transpilePackages: [
    '@nott2/design-system',
    '@nott2/game-engine',
    '@nott2/multiplayer',
    'react-ttrpg-dice',
    '@react-three/fiber',
    '@react-three/rapier',
  ],
  // firebase-admin uses Node.js-only APIs — must NOT be bundled into client/Edge.
  serverExternalPackages: ['firebase-admin'],
  // Point to the nott2-online monorepo root (not the outer project root)
  // to prevent Next.js from picking up the wrong lockfile.
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default withVanillaExtract(nextConfig);
