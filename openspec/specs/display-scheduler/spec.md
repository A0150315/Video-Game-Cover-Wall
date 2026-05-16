# Display Scheduler

## Purpose

Mode rotation (Cinematic→Gallery→Spotlight), game rotation, random starting positions, and manual keyboard control.

## Requirements

### Requirement: Mode rotation schedule
The system SHALL cycle through three modes: Cinematic (180s) → Gallery (75s) → Spotlight (45s) → loop. Mode switching uses `AnimatePresence` with 0.5s opacity crossfade.

### Requirement: Game rotation within modes
The system SHALL advance at mode-specific intervals: Cinematic 12s (1 game, random jump), Gallery 25s (15-game batch, sequential), Spotlight 8s (hero + 5 thumbs, sequential). A random starting index is chosen on mount and on each mode switch.

#### Scenario: Cinematic random rotation
- **WHEN** Cinematic mode is active and the 12s interval fires
- **THEN** the system jumps to a pre-selected random target game (not sequential)
- **THEN** a new random target is pre-selected for the next jump
- **THEN** `peekNextUrls` exposes the pre-selected target's URLs for preloading

#### Scenario: Gallery and Spotlight sequential rotation
- **WHEN** Gallery or Spotlight mode is active
- **THEN** the system advances sequentially by batch size
- **THEN** `peekNextUrls` exposes the next sequential batch's URLs for preloading

### Requirement: Manual control via remote
The system SHALL respond to arrow keys: Left/Right for prev/next game, Up/Down for prev/next mode.

### Requirement: Single source of truth
All timing SHALL be driven by hooks (`useModeSchedule`, `useGameRotation`). Components are purely presentational and react to prop changes; they do not manage their own rotation timers.
