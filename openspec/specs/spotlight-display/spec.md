# Spotlight Display

## Purpose

Split layout: left 65% hero poster (vertical, no-crop) with blurred background, right 35% thumbnail list (horizontal banners).

## Requirements

### Requirement: Hero + sidebar layout
The system SHALL display a hero poster on the left (65%, using poster images with `object-fit: contain`) and thumbnail banners on the right (35%, using hero images, stacked vertically).

#### Scenario: Layout rendered
- **WHEN** Spotlight mode is active
- **THEN** left 65% shows a large poster with blurred background fill
- **THEN** right 35% shows up to 5 thumbnail banners stacked vertically
- **THEN** both use `cell-vignette` for edge darkening

### Requirement: Image preloading
The hero image SHALL be preloaded via `useImagePreload` before the slide-in animation. Thumbnails SHALL wait for at least 2 images to preload before displaying. The App-level `Preloader` silently caches the next batch.

#### Scenario: Smooth hero transition
- **WHEN** the hero changes
- **THEN** `useImagePreload` waits for the first available hero URL to load
- **THEN** the hero slides in with a 0.5s ease-out animation
- **THEN** no black flash or broken image is visible

### Requirement: Hero transition animation
The system SHALL animate hero changes with `x: 80 → 0`, `scale: 0.95 → 1`, `opacity: 0 → 1` over 0.5s using `will-change: transform, opacity` for GPU acceleration.

### Requirement: Thumbnail entrance
Thumbnails SHALL fade in with `opacity: 0 → 1` over 0.3s after batch preload completes. The thumbnail list re-renders on each phaseKey change.

### Requirement: Image failure handling
Hero with no usable images SHALL not render. Thumbnails with no usable images SHALL not render. Items where all images fail SHALL hide via `onAllFailed`.
