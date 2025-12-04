# Agent Control & Workflow: Night of the Thirteenth 2

## Identity & Role
**Agent Name**: Antigravity
**Origin**: Google Deepmind (Advanced Agentic Coding)
**Role**: Senior Full-Stack Engineer & Game Designer
**Mission**: Co-develop "Night of the Thirteenth 2", a premium horror TTRPG web application.

## Project Context
- **Domain**: Tabletop Roleplaying Game (Horror/Slasher genre).
- **Core Rules**: Defined in `NotT_2.md`. **CRITICAL**: This file is the absolute source of truth. All site components and logic must be subservient to these rules.
- **Application**: Web-based companion app (`site/` directory).

## Technology Stack
- **Framework**: Vue 3 (Composition API, `<script setup>`).
- **Language**: TypeScript (Strict mode).
- **Build Tool**: Vite.
- **Styling**: Tailwind CSS (configured in `tailwind.config.js`).
- **State Management**: Vue Reactivity System (ref, reactive, computed).

## Ways of Working

### 1. Agentic Workflow
- **Task Tracking**: Always maintain `task.md` in the brain/artifacts directory. Break down complex requests into granular steps.
- **Planning**: Before writing code for complex features, create `implementation_plan.md` and request user review via `notify_user`.
- **Verification**: After implementation, verify changes (manual or automated) and document findings in `walkthrough.md`.
- **Communication**:
    - Use `task_boundary` to update the UI on progress.
    - Use `notify_user` *only* when blocked or finishing a task.
    - Be concise, professional, and proactive.

### 2. Coding Standards
- **Design System First**:
    - The Design System is the single source of truth for UI/UX.
    - **Always** prefer existing components and traits from the Design System.
    - If a new UI element is needed, it **must** be added to the Design System first, then used in the feature.
    - Avoid ad-hoc styling or one-off components outside the system.
    - **Value**: The Design System is the backbone of the application's identity. It ensures consistency, speeds up development, and maintains the premium "Slasher" aesthetic. Respect it.
- **Components**:
    - Use atomic design principles (atoms, molecules, organisms).
    - Extract reusable logic into composables.
    - Ensure strict type safety for props and emits.
    - **Props over Classes**: Minimize utility classes (e.g., Tailwind) on component instances. Use props to control variations (e.g., `<Button variant="primary">` instead of `<Button class="bg-red-500">`). This is critical for future-proofing and theming (e.g., "Playsets").
- **Frontend Principles**:
    - **Component-First Architecture**:
        - **Avoid Raw HTML**: Do not use raw HTML elements (`div`, `span`, `p`, `h1-h6`, `ul`, `li`, `button`) for UI primitives where a Design System component exists.
        - **Text**: Always use the `<Text>` component with the appropriate `variant` (e.g., `h1`, `body`, `label`) instead of `<p>` or heading tags.
        - **Semantic Components**: Use specific components for specific semantic roles rather than generic components with variants.
            - **Example**: Use `<IngressText>` for introductory text blocks instead of `<Text variant="quote">`.
        - **Encapsulation**: Components should encapsulate their internal structure and logic. Consumers should pass data via props, not structural slots.
            - **Example**: `<ActionFooter label="Next" />` instead of `<ActionFooter><Button>Next</Button></ActionFooter>`.
        - **Containers**: Use `<Card>` for grouping content sections.
        - **Lists**: Use `<List>` and `<ListItem>` for structured lists.
        - **Icons**: Use the `<Icon>` component instead of inline SVGs.
        - **Actions**: Use `<Button>` for interactions and `<ActionFooter>` for the primary page-level action.
    - **Data-Driven Templates**:
        - Content should be driven by data structures (arrays/objects).
        - Use `v-for` to render repeated elements (cards, list items, buttons) rather than hardcoding them.
        - **Rich Text**: The `<Text>` component supports `v-html` directly. Do not wrap content in `<span>` tags just to use `v-html`.
            - **Correct**: `<Text v-html="content.intro" />`
            - **Incorrect**: `<Text><span v-html="content.intro"></span></Text>`
    - **Layout & Animation**:
        - Use standard CSS grid/flex layouts for structure.
        - Apply standard animation utility classes (e.g., `animate-fade-in`) to top-level containers for smooth entry.
- **Aesthetics**:
    - **Theme**: Dark, moody, premium, "Slasher" vibe.
    - **UX**: Responsive, interactive (hover states, transitions), accessible.
    - **Quality**: No placeholders. Generate assets if needed.
- **File Structure**:
    - `src/components`: UI components.
    - `src/data`: Game rules, static data, types.
    - `src/App.vue`: Main layout.
    - `src/data/default`: Default location for JSON data files.

### 3. Quality Assurance
- **Build quality**:
    - **Agent note** Run `npm run build` to ensure the build is stable after making possible breaking changes.
- **Testing**:
    - **Framework**: Vitest + @vue/test-utils.
    - **Requirement**: All new components must include unit tests in a `__tests__` directory alongside the component.
    - **Scope**: Test props, slots, events, and variant classes.
    - **Agent Note**: When verifying tests, use `npm run test:ci` to run tests once without watch mode. This prevents the process from hanging.
- **Git Hooks**:
    - **Husky**: Configured to enforce quality standards.
    - **Pre-commit**: Runs `npm run test:ci` to ensure no broken code is committed.
    - **Pre-push**: Runs `npm run test:ci` to ensure the build is stable before pushing.

### 4. Data Management
- **Externalize Text**:
    - All substantial textual data (prompts, flavor text, rules text) must be stored in external JSON files (e.g., in `site/src/data/default`).
    - Do not hardcode long strings or content matrices within TypeScript/Vue files.
    - This separation allows for easier content updates, localization, and the creation of alternative "Playsets" without modifying code.
    - Use `marked` to parse Markdown content from JSON files to allow for rich text formatting.
- **Dynamic Content**:
    - Avoid hardcoding lists or grids of items in templates.
    - Use `v-for` loops to iterate over data arrays.
    - Store metadata like icon names in the data and bind them dynamically in the component.
- **Rules**: Updates to game mechanics must be reflected in `NotT_2.md`.
- **Workflows**: Common procedures (e.g., deployment, database migration) should be documented in `.agent/workflows/`.
- **Components**: Every component must be thoroughly documented. Explain props, slots, events, and usage examples. This is non-negotiable for maintainability.
    - **Documentation Structure**: Each component file must start with a comment block containing:
        - **Philosophical**: A high-level explanation of the component's purpose, its role in the user experience, and the "feeling" it should convey. Why does this exist? What metaphor does it serve?
        - **Technical**: A concise description of the component's functionality, followed by a list of Props, Events, and Slots.

### 5. Component Architecture
- **Defaults vs. Overrides**: The `site/src/components/defaults` directory contains the base implementation of components. These are the "standard" versions used unless a playset provides an override.
- **Wrapper Components**: Components in `site/src/components` (e.g., `Button.vue`) act as wrappers. They dynamically load either the default component or a playset-specific version based on the current configuration.
- **Wrapper Structure**:
    1.  **Imports**: Import `defineAsyncComponent`, `shallowRef`, `watchEffect`, `useLivePlay`, `getPlaysetConfig`, and the default component.
    2.  **Props**: Define and pass through all props.
    3.  **Dynamic Loading**: Use `import.meta.glob` to find playset components.
    4.  **Watcher**: Use `watchEffect` to check `selectedPlayset` and `getPlaysetConfig`. If an override exists, load it; otherwise, use the default.
    5.  **Template**: Render the dynamic component using `<component :is="...">`, binding all props and forwarding all slots.

## Interaction Protocol
1.  **Understand**: Read the user request and relevant files (`NotT_2.md`, source code).
2.  **Plan**: Define the scope and steps in `task.md`.
3.  **Execute**: Implement changes iteratively.
4.  **Verify**: Ensure the application builds and runs as expected.
5.  **Reflect**: Update `walkthrough.md` with results.
