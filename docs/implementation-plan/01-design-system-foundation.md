# Phase 1: Design System Foundation

> **Goal**: Design tokens defined, core atoms built, Storybook running with dark theme, Vanilla Extract fully configured.  
> **Skills**: `frontend-design`, `web-design-guidelines`, `vercel-composition-patterns`, `storybook-story-writing`  
> **Estimated Effort**: 2–3 sessions  
> **Depends on**: Phase 0

---

## Deliverables

- [x] Vanilla Extract configured in both Storybook and Next.js
- [x] Design tokens: colors, typography, spacing, radius, shadows, animations
- [x] Theme contract + dark theme (the only theme)
- [x] Playset token override system (future-proofed)
- [x] 6 atom components with stories and tests
- [x] Storybook 8 running with custom dark manager theme
- [x] `npm run storybook:dev` works from workspace root

---

## 1.1 Vanilla Extract Setup

### In `packages/design-system`:

```bash
npm install @vanilla-extract/css @vanilla-extract/recipes @vanilla-extract/sprinkles
npm install -D @vanilla-extract/vite-plugin
```

### In `apps/web`:

```bash
npm install -D @vanilla-extract/next-plugin
```

`next.config.ts`:
```typescript
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
const withVanillaExtract = createVanillaExtractPlugin();

export default withVanillaExtract({
  transpilePackages: ['@nott2/design-system'],
});
```

### In Storybook (`.storybook/main.ts`):

Use `@vanilla-extract/vite-plugin` with Storybook's Vite builder.

---

## 1.2 Design Tokens

All tokens live in `packages/design-system/src/tokens/`.

### Colors (`colors.css.ts`)

Ported from the existing design system but defined as Vanilla Extract theme contract:

| Token | Default Value | Purpose |
|-------|--------------|---------|
| `color.background` | `#0a0a0a` | Deep black — page background |
| `color.surface` | `#141414` | Slightly lighter — card backgrounds |
| `color.surfaceElevated` | `#1a1a1a` | Hover/active surfaces |
| `color.accent` | `#8a0000` | Blood red — primary accent, danger, the Killer |
| `color.accentBright` | `#dc2626` | Brighter red — interactive highlights |
| `color.text` | `#e8e8e8` | Off-white — primary text |
| `color.textMuted` | `#6a6a6a` | Gray — secondary text, borders |
| `color.success` | `#2d5a2d` | Sickly green — survival, success states |
| `color.border` | `#2a2a2a` | Subtle borders |
| `color.borderActive` | `#8a0000` | Red borders on active elements |

### Typography (`typography.css.ts`)

| Token | Value | Usage |
|-------|-------|-------|
| `font.display` | `'Playfair Display', serif` | Headlines, labels, buttons — uppercase, tracked |
| `font.body` | `'Inter', sans-serif` | Body text — readable, relaxed |
| `fontSize.hero` | `clamp(3rem, 8vw, 6rem)` | Hero titles |
| `fontSize.h1` | `clamp(2rem, 5vw, 3.5rem)` | Page headings |
| `fontSize.h2` | `clamp(1.5rem, 3vw, 2.5rem)` | Section headings |
| `fontSize.h3` | `1.25rem` | Sub-headings |
| `fontSize.body` | `1rem` | Body text |
| `fontSize.label` | `0.875rem` | Labels, captions |
| `fontSize.micro` | `0.625rem` | Tiny text |

### Spacing (`spacing.css.ts`)

4px base scale: `xs(4)`, `sm(8)`, `md(16)`, `lg(24)`, `xl(32)`, `2xl(48)`, `3xl(64)`.

### Animations (`animations.css.ts`)

| Animation | Duration | Use |
|-----------|----------|-----|
| `fadeIn` | `0.3s ease-out` | Page/component entry |
| `slideUp` | `0.4s ease-out` | Card reveals, modals |
| `pulse` | `2s infinite` | Warning states, active threats |
| `glowPulse` | `3s infinite` | Subtle glow breathing |
| `shake` | `0.5s` | Strike received, error states |

### Shadows/Glows

| Token | Value | Use |
|-------|-------|-----|
| `shadow.glow` | `0 0 20px rgba(138,0,0,0.4)` | Red glow on interactive elements |
| `shadow.glowIntense` | `0 0 40px rgba(138,0,0,0.6)` | Highlighted cards, active threats |
| `shadow.glowGreen` | `0 0 20px rgba(45,90,45,0.4)` | Success states |

---

## 1.3 Theme Contract

```typescript
// tokens/theme.css.ts
import { createThemeContract, createTheme } from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    background: '', surface: '', surfaceElevated: '',
    accent: '', accentBright: '',
    text: '', textMuted: '',
    success: '', border: '', borderActive: '',
  },
  font: { display: '', body: '' },
  fontSize: { hero: '', h1: '', h2: '', h3: '', body: '', label: '', micro: '' },
  space: { xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '' },
  radius: { sm: '', md: '', lg: '', full: '' },
  shadow: { glow: '', glowIntense: '', glowGreen: '' },
  transition: { fast: '', normal: '', slow: '' },
});

export const darkTheme = createTheme(vars, { /* values from tables above */ });
```

### Playset Override System

Future playsets can create alternate themes:

```typescript
export const summerCampTheme = createTheme(vars, {
  ...darkThemeValues,
  color: {
    ...darkThemeValues.color,
    accent: '#4a0e0e',        // Darker, more muted red
    success: '#2E8B57',       // Brighter green
  },
  font: {
    display: "'Creepster', cursive",
    body: "'Inter', sans-serif",
  },
});
```

---

## 1.4 Atom Components

Each atom follows this file structure:

```
atoms/Text/
├── Text.tsx                # Component
├── Text.css.ts             # Vanilla Extract styles (recipe)
├── Text.stories.tsx        # Storybook CSF3 story
└── Text.test.tsx           # Vitest + RTL test
```

### Atoms to Build

| Component | Variants | Props | Ported From |
|-----------|----------|-------|-------------|
| **Text** | `hero`, `h1`, `h2`, `h3`, `lead`, `body`, `label`, `caption`, `quote`, `micro` | `variant`, `color`, `glow`, `align`, `as` | Existing `Text.vue` |
| **Button** | `primary`, `secondary`, `ghost`, `debug` | `variant`, `size`, `disabled`, `block` | Existing `Button.vue` |
| **Icon** | — | `name`, `size`, `color` | Existing `Icon.vue` |
| **Badge** | `default`, `outline`, `red`, `success`, `danger` | `variant` | Existing `Badge.vue` |
| **Toggle** | `button`, `switch` | `value`, `onChange`, `labelOn`, `labelOff`, `variant` | Existing `Toggle.vue` |
| **Separator** | — | — | Existing `Separator.vue` |

### Component Pattern

Following `vercel-composition-patterns` — props for variants, no boolean prop proliferation:

```typescript
// atoms/Button/Button.tsx
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { buttonRecipe } from './Button.css';

type ButtonProps = RecipeVariants<typeof buttonRecipe> & {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({ variant, size, disabled, children, onClick }: ButtonProps) {
  return (
    <button
      className={buttonRecipe({ variant, size })}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Story Pattern (CSF3)

Following `storybook-story-writing` skill:

```typescript
// atoms/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: 'Click Me', variant: 'primary', size: 'md' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Disabled: Story = { args: { disabled: true } };
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <Button key={size} {...args} size={size}>{size}</Button>
      ))}
    </div>
  ),
};
```

---

## 1.5 Storybook Configuration

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react-vite',
  viteFinal: (config) => {
    config.plugins?.push(vanillaExtractPlugin());
    return config;
  },
};

export default config;
```

Dark theme for the Storybook manager:

```typescript
// .storybook/manager.ts
import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'Night of the Thirteenth',
    brandUrl: '/',
    appBg: '#0a0a0a',
    appContentBg: '#141414',
    barBg: '#0a0a0a',
    colorPrimary: '#8a0000',
    colorSecondary: '#dc2626',
  }),
});
```

---

## 1.6 Google Fonts

Load via `next/font` in `apps/web`:

```typescript
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
```

For Storybook, load from Google Fonts CDN in `preview-head.html`.

---

## Verification

- [x] `npm run storybook:dev` launches with dark theme
- [x] All 6 atoms render with all variants in Storybook
- [x] All atom tests pass (`npm run test` in design-system package)
- [x] `npm run storybook:build` compiles without errors
- [x] Importing `@nott2/design-system` in `apps/web` works
- [x] `Button` renders correctly in a Next.js page
- [x] Theme tokens applied correctly (colors, fonts, spacing)
