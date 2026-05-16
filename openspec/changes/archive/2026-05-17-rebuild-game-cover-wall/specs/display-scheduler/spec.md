## ADDED Requirements

### Requirement: Mode rotation schedule
The system SHALL automatically cycle through three display modes with the following time allocation: Cinematic mode 60%, Gallery mode 25%, Spotlight mode 15%.

#### Scenario: Mode transitions over time
- **WHEN** the application starts
- **THEN** it begins in Cinematic mode
- **THEN** after approximately 3 minutes, it transitions to Gallery mode
- **THEN** after approximately 1.25 minutes, it transitions to Spotlight mode
- **THEN** after approximately 45 seconds, it cycles back to Cinematic mode

### Requirement: Smooth mode transitions
The system SHALL use Framer Motion's AnimatePresence to animate mode changes.

#### Scenario: Mode switch animation
- **WHEN** the mode scheduler triggers a mode change
- **THEN** the current mode component exits with an opacity-fade animation
- **THEN** the next mode component enters with an opacity-fade animation
- **THEN** the transition completes within 1 second

### Requirement: Manual control via remote
The system SHALL respond to keyboard arrow key events for manual game navigation.

#### Scenario: Right arrow pressed
- **WHEN** the user presses the Right arrow key on the remote
- **THEN** the current mode advances to the next game (or next batch in Gallery mode)

#### Scenario: Left arrow pressed
- **WHEN** the user presses the Left arrow key on the remote
- **THEN** the current mode goes back to the previous game

#### Scenario: Up/Down arrow pressed
- **WHEN** the user presses the Up or Down arrow key
- **THEN** the display mode cycles to the next or previous mode immediately
