# Phase 0: Monorepo Scaffold

> **Goal**: Turborepo running with Next.js app and three empty packages. Everything builds and dev-serves.  
> **Skills**: `next-best-practices`  
> **Estimated Effort**: 1 session

---

## Deliverables

- [x] Turborepo workspace initialized at `nott2-online/`
- [x] `apps/web` — Next.js 15 app with App Router
- [x] `packages/design-system` — empty package with TS, exports configured
- [x] `packages/game-engine` — empty package with TS, exports configured
- [x] `packages/multiplayer` — empty package with TS, exports configured
- [x] All packages importable from `apps/web`
- [x] `turbo.json` with `build`, `dev`, `test`, `lint` pipelines
- [x] Shared `tsconfig.base.json`
- [x] Vitest configured in all packages
- [x] `.gitignore`, `.nvmrc`, `.editorconfig` in place
- [x] `npm run dev` starts the Next.js dev server
- [x] `npm run build` completes without errors across all packages

---

## Detailed Steps

### 0.1 Initialize Turborepo

```bash
npx -y create-turbo@latest ./nott2-online --example basic
```

Or manual setup:

```
nott2-online/
├── apps/
│   └── web/
├── packages/
│   ├── design-system/
│   ├── game-engine/
│   └── multiplayer/
├── turbo.json
├── package.json
└── tsconfig.base.json
```

Root `package.json`:
```json
{
  "name": "nott2-online",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "~5.5.0"
  }
}
```

### 0.2 Initialize Next.js App

```bash
cd apps/web
npx -y create-next-app@latest ./ --typescript --app --no-tailwind --no-eslint --no-src-dir --import-alias "@/*"
```

Key `next.config.ts` settings:
- `transpilePackages: ['@nott2/design-system', '@nott2/game-engine', '@nott2/multiplayer']`
- Vanilla Extract plugin (added in Phase 1)

### 0.3 Configure Packages

Each package follows the same structure:

```
packages/{name}/
├── src/
│   └── index.ts          # Public API barrel
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

Package naming convention: `@nott2/{name}`

```json
{
  "name": "@nott2/game-engine",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

### 0.4 Turbo Pipeline

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "test:ci": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "storybook:dev": {
      "cache": false,
      "persistent": true
    },
    "storybook:build": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"]
    }
  }
}
```

### 0.5 Shared TypeScript Config

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}
```

---

## Verification

```bash
# Everything builds
npm run build

# Dev server starts
npm run dev

# Tests pass (will be trivial at this stage)
npm run test

# Can import packages in the app
# apps/web/app/page.tsx:
# import { } from '@nott2/game-engine';  // no errors
```

---

## Notes

- **No Tailwind** — Vanilla Extract will be configured in Phase 1
- **No Firebase** — configured in Phase 4
- **No Storybook** — configured in Phase 1
- Next.js App Router with `app/` directory (not `src/app/`)
- Node.js version pinned in `.nvmrc` (v20 LTS)
