# GitHub Pages Deploy

## Purpose

Static build and deploy via GitHub Actions, with separate data-update and deploy workflows.

## Requirements

### Requirement: Vite static build
The system SHALL produce a static build via `pnpm build` (tsc + vite) outputting to `dist/`. Tree-shaken Tailwind CSS and Motion library are included.

#### Scenario: Build succeeds
- **WHEN** `pnpm build` is executed
- **THEN** Vite compiles TypeScript and bundles React components
- **THEN** Tailwind CSS is processed and tree-shaken via `@tailwindcss/vite`
- **THEN** all output files are in `dist/` with correct relative paths

### Requirement: GitHub Pages deployment
The system SHALL deploy `dist/` to GitHub Pages on push to main using `actions/configure-pages` + `actions/deploy-pages`. Node.js 24 is opted in via `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true`.

### Requirement: Workflow separation
`update-data.yml` (cron daily + manual dispatch, `contents: write`) fetches data and pushes. `deploy.yml` (on push to main, `pages: write`) builds and deploys. Data changes trigger deploy via the push.

### Requirement: pnpm version
pnpm version is pinned via `packageManager` field in `package.json`. The `pnpm/action-setup` action reads it automatically without explicit `version` config.

### Requirement: Build optimization
Production JS bundle is approximately 106KB gzipped, CSS under 8KB gzipped, HTML under 1KB.
