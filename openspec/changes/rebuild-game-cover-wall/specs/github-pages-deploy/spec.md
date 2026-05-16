## ADDED Requirements

### Requirement: Vite static build
The system SHALL produce a static build via `pnpm build` that outputs all assets to the `dist/` directory.

#### Scenario: Build succeeds
- **WHEN** `pnpm build` is executed
- **THEN** Vite compiles TypeScript and bundles React components
- **THEN** Tailwind CSS is processed and tree-shaken
- **THEN** all output files are placed in `dist/` with correct relative paths

### Requirement: GitHub Pages deployment
The system SHALL deploy the `dist/` directory to GitHub Pages via GitHub Actions on every push to main.

#### Scenario: Deploy on push
- **WHEN** code is pushed to the `main` branch
- **THEN** the deploy workflow builds the project
- **THEN** the `dist/` directory is uploaded as a Pages artifact
- **THEN** GitHub Pages serves the site at the configured URL

### Requirement: Data update workflow separation
The data fetch workflow SHALL run independently from the deploy workflow.

#### Scenario: Data update triggers deploy
- **WHEN** the data fetch workflow completes and pushes updated `games.json` to main
- **THEN** the deploy workflow is triggered by the push
- **THEN** the site rebuilds with fresh game data

### Requirement: Build optimization
The build output SHALL be optimized for minimal size and fast loading on TV browsers.

#### Scenario: Production build metrics
- **WHEN** a production build completes
- **THEN** the total JS bundle is under 100KB gzipped
- **THEN** CSS is under 20KB gzipped
- **THEN** the HTML entry point loads in under 1 second on a typical connection
