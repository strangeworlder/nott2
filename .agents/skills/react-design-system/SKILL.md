---
name: react-design-system
description: Enforces atomic design system component usage over raw HTML elements in React frontends. Use this skill whenever building, editing, or reviewing React UI code — including creating new components, pages, layouts, forms, or any JSX/TSX template work. Triggers on any React frontend task involving UI rendering, component creation, styling, or layout. If the task touches JSX or TSX, this skill applies.
---

# React Design System — Component-First Architecture

## Why This Matters

A design system is the immune system of a UI codebase. Every raw `<div>`, `<span>`, or `<button>` is a tiny fracture in consistency — one that compounds over time into visual drift, accessibility gaps, and maintenance debt. When every piece of UI flows through purpose-built components, the entire application speaks with one voice: consistent spacing, predictable typography, coherent interaction patterns, and a single place to update when the design evolves.

This skill exists to make component-first thinking the default — not an afterthought.

## Core Principle

> **Never reach for a raw HTML element when a design system component exists that serves the same semantic purpose.**

This applies to all React code: pages, layouts, features, modals, forms, and nested sub-components. Assume a design system component exists for common UI primitives. Check the project's component library before writing raw HTML.

---

## The Atomic Design Hierarchy

Components are organized into layers of increasing complexity:

| Layer | Purpose | Examples |
|---|---|---|
| **Atoms** | Smallest indivisible UI elements | `<Text>`, `<Button>`, `<Icon>`, `<Input>`, `<Badge>` |
| **Molecules** | Small groups of atoms working together | `<FormField>` (label + input + error), `<SearchBar>`, `<MenuItem>` |
| **Organisms** | Distinct sections of UI composed of molecules | `<Header>`, `<Card>`, `<DataTable>`, `<Modal>` |
| **Templates** | Page-level layout structures | `<PageLayout>`, `<SidebarLayout>`, `<DashboardGrid>` |

Build upward. Prefer composing existing atoms and molecules into new organisms over creating monolithic components from scratch.

---

## HTML-to-Component Mapping

When you encounter a need for any of these HTML elements, use the design system equivalent instead:

### Typography
| Instead of… | Use… | Why |
|---|---|---|
| `<h1>` – `<h6>` | `<Text variant="h1">` … `<Text variant="h6">` | Centralizes font sizing, weight, line-height, and color |
| `<p>` | `<Text variant="body">` or `<Text>` | Consistent paragraph spacing and font |
| `<span>` (for styled text) | `<Text variant="label">`, `<Text variant="caption">`, etc. | Prevents ad-hoc inline styling |
| `<strong>`, `<em>` | `<Text weight="bold">`, `<Text style="italic">` or use props | Keeps emphasis within the type system |

### Interactive Elements
| Instead of… | Use… | Why |
|---|---|---|
| `<button>` | `<Button variant="primary">` | Consistent sizing, states (hover, focus, disabled, loading), and accessibility |
| `<a>` | `<Link>` or `<Button variant="link">` | Uniform link styling and routing integration |
| `<input>`, `<textarea>`, `<select>` | `<Input>`, `<TextArea>`, `<Select>` | Built-in validation states, labels, and error handling |

### Layout & Structure
| Instead of… | Use… | Why |
|---|---|---|
| `<div>` (as a content group) | `<Card>`, `<Box>`, `<Stack>`, `<Section>` | Semantic grouping with consistent padding and elevation |
| `<div>` (for flex/grid layouts) | `<Stack>`, `<Grid>`, `<Flex>` | Abstracted layout primitives with standardized gap/alignment props |
| `<ul>`, `<ol>`, `<li>` | `<List>`, `<ListItem>` | Consistent list styling, spacing, and bullet/number treatment |
| `<nav>` | `<Navigation>` or `<NavBar>` | Unified navigation patterns |

### Feedback & Overlays
| Instead of… | Use… | Why |
|---|---|---|
| Custom div-based modals | `<Modal>`, `<Dialog>` | Focus trapping, backdrop handling, accessibility |
| Custom div-based tooltips | `<Tooltip>` | Consistent positioning, delay, and content styling |
| Inline error/success text | `<Alert>`, `<Toast>`, `<Banner>` | Standardized feedback patterns with icons and dismissibility |

### Media & Icons
| Instead of… | Use… | Why |
|---|---|---|
| Inline `<svg>` | `<Icon name="...">` | Centralized icon registry, consistent sizing |
| Raw `<img>` | `<Image>` or `<Avatar>` | Loading states, fallbacks, aspect ratio control |

---

## Rules of Engagement

### 1. Check Before You Create

Before writing any JSX, scan the project's component library (typically `src/components/` or a `ui/` directory). The component you need likely already exists. If you're unsure, search for it before creating a raw HTML solution.

### 2. Props Over Utility Classes

Control component appearance through props, not by layering CSS utility classes onto component instances.

```tsx
// ✅ Correct — behavior controlled through the component's API
<Button variant="primary" size="lg" disabled={isLoading}>
  Submit
</Button>

// ❌ Avoid — bypasses the design system with ad-hoc overrides
<Button className="bg-red-500 text-lg px-8 opacity-50 pointer-events-none">
  Submit
</Button>
```

The component's props are its contract. Utility class overrides break that contract and create visual inconsistency.

### 3. Data-Driven Templates

Render repeated UI from data structures, not by copy-pasting JSX blocks.

```tsx
// ✅ Correct — content is data, rendering is a loop
const features = [
  { icon: "shield", title: "Secure", desc: "End-to-end encryption" },
  { icon: "zap",    title: "Fast",   desc: "Sub-100ms responses" },
];

{features.map(f => (
  <Card key={f.title}>
    <Icon name={f.icon} />
    <Text variant="h3">{f.title}</Text>
    <Text>{f.desc}</Text>
  </Card>
))}

// ❌ Avoid — hardcoded repetition
<div className="card">
  <svg>...</svg>
  <h3>Secure</h3>
  <p>End-to-end encryption</p>
</div>
<div className="card">
  <svg>...</svg>
  <h3>Fast</h3>
  <p>Sub-100ms responses</p>
</div>
```

### 4. Compose, Don't Monolith

When building a new component, assemble it from existing atoms and molecules rather than writing a flat tree of raw HTML. The internal structure of a component should look like a design system composition, not a soup of `<div>`s.

```tsx
// ✅ Correct — composed from design system primitives
function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <Stack direction="row" gap="md" align="center">
        <Avatar src={user.avatar} fallback={user.initials} />
        <Stack gap="xs">
          <Text variant="h4">{user.name}</Text>
          <Text variant="caption" color="muted">{user.role}</Text>
        </Stack>
      </Stack>
    </Card>
  );
}

// ❌ Avoid — raw HTML with inline styles
function UserCard({ user }: { user: User }) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={user.avatar} style={{ borderRadius: '50%', width: 40 }} />
        <div>
          <h4 style={{ margin: 0 }}>{user.name}</h4>
          <span style={{ color: '#888', fontSize: 12 }}>{user.role}</span>
        </div>
      </div>
    </div>
  );
}
```

### 5. When Raw HTML Is Acceptable

Raw HTML is not categorically banned. It is appropriate in these specific cases:

- **Inside design system component implementations**: The atoms themselves necessarily contain raw HTML. A `<Button>` internally renders a `<button>`. This is expected.
- **Semantic HTML with no design system equivalent**: Elements like `<main>`, `<article>`, `<aside>`, `<header>`, `<footer>`, `<section>` for document-level semantics are fine when no layout component wraps them.
- **Third-party integration boundaries**: When embedding content from external libraries (maps, rich text editors, video players), raw HTML at the integration seam is expected.
- **Plain `<div>` as a non-semantic wrapper**: A `<div>` used solely as a structural wrapper (e.g., for a CSS grid cell or a `ref` target) with no visual styling is acceptable — but if it carries visual properties (padding, background, border), it should be a `<Box>` or `<Card>`.

### 6. Escalate Missing Components

If the design system lacks a component you need, **do not silently fall back to raw HTML**. Instead:

1. Flag the gap explicitly: *"The design system doesn't have a `<Stepper>` component. Should I create one?"*
2. If instructed to create it, add it to the design system first (`src/components/ui/` or equivalent), then consume it in the feature.
3. Document the new component with its props, variants, and usage examples.

This keeps the design system growing intentionally rather than being bypassed piecemeal.

---

## Quick Self-Check

Before submitting any React UI code, verify:

- [ ] No raw `<h1>`–`<h6>`, `<p>`, `<span>` for text — use `<Text>` with variants
- [ ] No raw `<button>` — use `<Button>` with variant props
- [ ] No raw `<input>`, `<select>`, `<textarea>` — use form components
- [ ] No raw `<ul>`/`<li>` — use `<List>` / `<ListItem>`
- [ ] No inline SVGs — use `<Icon>`
- [ ] No styled `<div>`s doing the job of `<Card>`, `<Stack>`, `<Box>`, or `<Grid>`
- [ ] Repeated elements use `.map()` over data arrays, not copy-pasted JSX
- [ ] Component appearance is controlled via props, not utility class overrides
- [ ] Any new UI primitive was added to the design system, not built ad-hoc
