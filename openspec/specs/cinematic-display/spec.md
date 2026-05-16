# Cinematic Display

## Purpose

Full-screen game poster display with Ken Burns effect, blurred background fill, and no-crop foreground.

## Requirements

### Requirement: Dual-layer display
The system SHALL render two image layers: a blurred+darkened background (`object-fit: cover`, `blur(30px) brightness(0.9)`) and a sharp foreground (`object-fit: contain`, no cropping).

#### Scenario: Layers rendered
- **WHEN** Cinematic mode is active
- **THEN** the background layer fills the screen with a blurred version of the current image
- **THEN** the foreground layer displays the full uncropped image centered via `object-fit: contain`

### Requirement: Ken Burns effect
The system SHALL apply a continuous CSS Ken Burns animation to the background layer only, with varying `transform-origin` across four animation variants.

#### Scenario: Ken Burns running
- **WHEN** a poster is displayed
- **THEN** the background image slowly scales and pans via CSS `@keyframes`
- **THEN** each new game picks a random animation variant with different origin point

### Requirement: Image preloading
The system SHALL use `useImagePreload` to wait for the current image to load before fading it in (4s timeout). A `Preloader` component at App level silently preloads the next game's images. For cinematic mode's random rotation, `nextRandomRef` pre-selects the target, so `peekNextUrls` returns that specific game's URLs for preloading.

#### Scenario: Seamless random transition
- **WHEN** displaying game A
- **THEN** `nextRandomRef` has pre-selected game B as the next random target
- **THEN** `peekNextUrls` exposes game B's URLs for the Preloader to download
- **WHEN** the 12s timer fires and advance jumps to game B
- **THEN** game B's preloaded image is instantly available for the 1.8s crossfade
- **THEN** a new random target (game C) is pre-selected and preloaded

### Requirement: Crossfade transition
The system SHALL transition between images using a 1.8s opacity crossfade via Motion's `AnimatePresence`.

### Requirement: Game metadata overlay
The system SHALL display game name, release year, and rating at the bottom, fading in after 300ms and fading out after 7s.

### Requirement: Cinematic visual effects
The system SHALL apply a vignette (radial-gradient darkening edges) and film grain (SVG noise pattern) as CSS `::after`/`::before` pseudo-elements above the image layers.

### Requirement: Image failure handling
When all images in the URL chain fail, the system SHALL skip to the next game via `onSkip` callback after a brief delay.
