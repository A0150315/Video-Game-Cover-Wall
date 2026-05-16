## ADDED Requirements

### Requirement: Grid layout
The system SHALL display game posters in an adaptive grid layout that fills the viewport.

#### Scenario: Grid displayed
- **WHEN** Gallery mode is active
- **THEN** game posters are arranged in a grid (default 5 columns, 3 rows, configurable)
- **THEN** the grid is centered in the viewport with equal spacing between items
- **THEN** each poster maintains its aspect ratio using `object-fit: cover`

### Requirement: Staggered entrance animation
The system SHALL animate grid items entering the screen with staggered delays using Framer Motion.

#### Scenario: Grid items stagger in
- **WHEN** Gallery mode activates or a new batch of games loads
- **THEN** each grid item animates from scale(0.8) + opacity(0) to scale(1) + opacity(1)
- **THEN** each item's animation delay increases sequentially (staggerChildren: 0.05s)

### Requirement: Random hero enlargement
The system SHALL randomly select one grid item to temporarily enlarge as a "hero" before transitioning to the next batch.

#### Scenario: Hero item enlarges
- **WHEN** all grid items have finished entering
- **THEN** after a delay, one random item scales up to span 2 columns and 2 rows
- **THEN** surrounding items reflow around the hero item

### Requirement: Batch transition
The system SHALL transition to a new batch of games when the display timer expires.

#### Scenario: New batch loads
- **WHEN** the gallery display timer expires
- **THEN** all current grid items fade out
- **THEN** a new batch of games with staggered entrance replaces them
