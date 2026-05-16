# Gallery Display

## Purpose

Grid layout (5×3) with staggered entrance, random hero enlargement via CSS scale, and per-cell blurred backgrounds.

## Requirements

### Requirement: Grid layout
The system SHALL display game posters in a 5-column × 3-row CSS Grid filling the viewport, with `object-fit: contain` and a `cell-vignette` overlay per cell.

#### Scenario: Grid displayed
- **WHEN** Gallery mode is active
- **THEN** 15 game posters are arranged in a 5×3 grid
- **THEN** each cell has a blurred background image and a contain-fit foreground
- **THEN** a radial-gradient vignette darkens cell edges

### Requirement: Batch preloading
The system SHALL preload at least 3 images of the new batch before starting the entrance animation, with a 3s timeout fallback. The App-level `Preloader` silently caches the next batch's images.

#### Scenario: Batch transition is smooth
- **WHEN** the gallery timer triggers a new batch
- **THEN** the previous batch exits with fade-out
- **THEN** the system waits for the first 3 images of the new batch to load
- **THEN** the new batch enters with staggered animation

### Requirement: Staggered entrance animation
The system SHALL animate grid items from `scale(0.8) + opacity(0)` to `scale(1) + opacity(1)` with `staggerChildren: 0.05s` using Motion.

### Requirement: Random hero enlargement
The system SHALL randomly select one item to visually enlarge via `transform: scale(1.25)` (CSS transform, not grid span) 3.5s after entrance, without affecting grid layout.

### Requirement: Image failure hiding
Grid cells with no usable images (empty `posters` and `heroes`) SHALL not render. Cells where all images fail to load SHALL hide entirely via `onAllFailed` callback.
