## ADDED Requirements

### Requirement: Full-screen poster display
The system SHALL display a single game poster in full-screen mode covering the entire viewport.

#### Scenario: Poster fills screen
- **WHEN** Cinematic mode is active
- **THEN** a single game poster image fills the entire viewport with no visible borders
- **THEN** the image uses `object-fit: cover` or equivalent to maintain aspect ratio

### Requirement: Ken Burns effect
The system SHALL apply a continuous slow Ken Burns zoom-and-pan effect to the displayed poster using CSS animations.

#### Scenario: Ken Burns animation running
- **WHEN** a poster is displayed in Cinematic mode
- **THEN** the poster slowly scales from 1.0 to 1.08 and translates by a random small offset over the display duration
- **THEN** the animation direction changes for each new poster

### Requirement: Crossfade transition
The system SHALL transition between posters using a smooth crossfade.

#### Scenario: Poster transitions
- **WHEN** the display timer triggers a new poster
- **THEN** the current poster fades out over 1.5-2 seconds
- **THEN** the next poster fades in simultaneously

### Requirement: Game metadata overlay
The system SHALL briefly display the game title, release year, and rating as a text overlay that fades in and out.

#### Scenario: Metadata shown
- **WHEN** a new poster appears in Cinematic mode
- **THEN** the game name, release year, and Metacritic-style rating appear near the bottom of the screen
- **THEN** the text overlay fades in within 1 second and fades out after 5 seconds

### Requirement: Cinematic visual effects
The system SHALL apply a vignette effect and optional film grain overlay to enhance the cinematic feel.

#### Scenario: Vignette applied
- **WHEN** Cinematic mode is active
- **THEN** a radial-gradient vignette darkens the edges of the screen
- **THEN** an optional subtle film grain or noise pattern is visible as a CSS overlay
