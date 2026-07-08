# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                # ng serve, dev server at http://localhost:4200/
npm run build            # ng build (production by default)
npm run watch            # ng build --watch --configuration development
npm test                 # ng test (Vitest runner)
```

To run a single test file, pass it directly to the Angular test builder, e.g.:
```bash
ng test --include='**/sidebar.component.spec.ts'
```

There is no lint script configured. Formatting is via Prettier (`.prettierrc`: single quotes, 100 print width, `angular` parser for `*.html`).

## Architecture

Angular 21, standalone components (no NgModules), signals-based `input()`/`output()` APIs, and Tailwind CSS v4. There is no backend integration yet — every page owns its own mock data as component fields (see `vehicles-page.component.ts`, `dashboard-home.component.ts`, etc.). When adding real data, this is the layer that will need HTTP services.

### Routing & layouts (`src/app/app.routes.ts`)

Two parallel route trees share the flat `path: ''`, distinguished by which layout wraps them:
- `AuthLayoutComponent` (`core/layouts/auth-layout`) wraps `login` and `register`.
- `DashboardLayoutComponent` (`core/layouts/dashboard-layout`) wraps `dashboard`, `clients`, `operations`, `vehicles`, and renders `SidebarComponent` + `TopbarComponent` around a `RouterOutlet`.

All feature pages are lazy-loaded via `loadComponent`. Follow this pattern for new routes rather than eagerly importing pages.

### Directory layout

```
src/app/
  core/           # layouts (auth-layout, dashboard-layout) and shared domain models
  features/       # one folder per route/domain (auth, clients, dashboard, operations, vehicles)
    <feature>/pages/...       # routed page components
    <feature>/components/...  # feature-local, non-routed components
  shared/
    ui/           # generic, style-only primitives (button, input, select, checkbox, chip, badge, logo)
    components/   # composite reusable widgets (data-table, pagination, drawer, sidebar, topbar, metric-card)
```

New feature-specific components go under `features/<feature>/components`; anything reused across features belongs in `shared/`. Prefer `shared/ui` for a single styled element and `shared/components` for something that composes multiple elements or has behavior (pagination, table, drawer).

### Component conventions

- All components are `standalone: true` with an explicit `imports` array (usually including `CommonModule`).
- Inputs/outputs use the signal APIs: `input()`, `input.required<T>()`, `output<T>()` — not the `@Input()`/`@Output()` decorators.
- Simple components (most of `shared/ui`) use an inline `template`; pages and larger components use `templateUrl` with a sibling `.html` file. Follow whichever style the existing file in that folder uses.
- Templates use the modern control-flow syntax (`@if`, `@else`, `@for` with `track`, `@switch`/`@case`), not `*ngIf`/`*ngFor`.
- Conditional classes are composed with `computed()` + `[ngClass]` returning a class-map object (see `ButtonComponent`), not string concatenation.
- `DataTableComponent` (`shared/components/data-table`) accepts an `@ContentChild('bodyTpl') TemplateRef` for custom cell rendering — pass a `<ng-template #bodyTpl let-row let-col="col">` when a feature needs custom cell content instead of the default `row[col.field]` text.
- Reactive forms (`ReactiveFormsModule`, `FormBuilder`) are used for auth pages (login/register); template-driven (`FormsModule`, `ngModel`) is used for simple filters (e.g. vehicles search).

### Styling

Tailwind v4 is configured via CSS-first `@theme` in `src/styles.css` (no `tailwind.config.js`). All color utilities (`bg-surface`, `text-text-primary`, `border-border-base`, `bg-accent`, `bg-glass-bg`, etc.) map to CSS custom properties defined for dark mode under `:root` and light mode under `.light` — never hardcode hex colors in components, use the existing semantic tokens. Reusable style patterns (`.card`, `.btn-primary`, `.badge-glass`, `.table-dark`, `.glass`, `.input-base`) are defined in `@layer components` in `styles.css`.

## Project Goal

This project already has a defined architecture.
The objective is not to redesign it, but to complete the missing features while maintaining consistency with the existing implementation.
Always prioritize consistency over introducing new patterns.

## Working Rules

Before implementing any feature:
1. Analyze the existing project.
2. Find the most similar feature already implemented.
3. Follow the same architecture and coding style.
4. Reuse existing components, services, models and utilities whenever possible.
5. Ask for clarification instead of making assumptions.

## Architecture Rules

When creating new functionality:
Follow the existing folder structure.
Follow the existing naming conventions.
Keep business logic inside services.
Keep UI components as reusable as possible.
Avoid duplicate code.

Do not introduce new architectural patterns unless explicitly requested.

## Reuse Policy

Always search before creating.
Priority:
1. shared/ui
2. shared/components
3. Existing feature components
4. Existing services
5. Existing models
6. Create new files only if no suitable implementation exists.

## Implementation Workflow

Before writing code:

Explain your implementation plan.
Mention which files will be created or modified.
Explain why.
After implementation:
- Summarize all changes.
- Mention any assumptions made.

## Current Development Stage

Some parts of the application are already implemented.
When implementing new modules:
- Analyze similar existing modules first.
- Match their structure and style.
- Do not refactor unrelated code.

## Constraints

Unless explicitly requested, do not:
- Change the project architecture.
- Rename folders or files.
- Move files.
- Install new libraries.
- Update dependencies.
- Modify Angular configuration.
- Modify Tailwind configuration.

## Communication

If project information is missing:
Do not guess.
Instead:
- Ask questions.
- Explain the available options.
- Wait for confirmation before implementing.

## Collaboration Mode

Work as a senior Angular developer collaborating with the existing team.
Implement features incrementally.
Prefer:
Analysis → Plan → Models → Services → Components → Templates → Review
instead of generating large amounts of code at once.

## Architecture Consistency

The repository already contains the project's architectural direction.
Before creating new files or folders:
- Inspect the current project structure.
- Follow existing patterns.
- If the implementation differs from the intended architecture, ask before refactoring.