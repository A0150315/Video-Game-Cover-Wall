## ADDED Requirements

### Requirement: Hero + sidebar layout
The system SHALL display a split layout with a large hero poster on the left (~65% width) and a vertical thumbnail list on the right (~35% width).

#### Scenario: Spotlight layout rendered
- **WHEN** Spotlight mode is active
- **THEN** the left 65% of the viewport shows a large game poster
- **THEN** the right 35% shows 4-5 smaller thumbnail posters stacked vertically
- **THEN** the hero poster displays the game title and platform info

### Requirement: Hero transition
The system SHALL transition the hero poster with a dramatic animation when changing games.

#### Scenario: Hero changes
- **WHEN** the hero game timer expires
- **THEN** the current hero poster animates out (slide + scale)
- **THEN** the next thumbnail becomes the new hero with a matching entrance animation
- **THEN** a new thumbnail fills the vacated slot in the sidebar

### Requirement: Thumbnail auto-scroll
The system SHALL automatically scroll the thumbnail list upward at a regular interval.

#### Scenario: Thumbnails scroll
- **WHEN** Spotlight mode is active and the thumbnail timer expires
- **THEN** the thumbnail list animates upward by one position
- **THEN** a new game thumbnail appears at the bottom of the list
