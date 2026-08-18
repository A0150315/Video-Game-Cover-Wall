# Cover Wall

## Purpose

WebGL（Three.js）渲染的无限 3D 游戏封面墙，作为应用唯一展示形态，面向电视待机屏保场景，零交互。

## Requirements

### Requirement: 3D wall layout
The system SHALL render two horizontal rows of vertical poster cards (aspect 2:3) arranged along a gentle arc (`z = -CURVE · x²`, per-card `rotationY` toward the camera), viewed by a perspective camera with a slight lateral offset. The scene SHALL use a near-black background with linear fog for depth fade.

### Requirement: Infinite drift
The system SHALL translate all cards horizontally at a constant speed (~0.5 world units/s) and wrap each card's x position modulo its row's total width, producing a seamless infinite loop. The bottom row SHALL be staggered by half a card pitch.

### Requirement: Randomized order
The system SHALL shuffle the fetched game list (Fisher-Yates) before building the wall, so the initial visible covers are random on every load.

### Requirement: Texture loading and fade-in
The system SHALL load poster textures cross-origin via `THREE.TextureLoader` (sRGB color space, anisotropy ≤ 4), showing a dark placeholder card until each texture arrives, then fading the card from opacity 0 to 1. Rows SHALL be filled by cyclically repeating posters when fewer than 16 distinct posters are available per row.

### Requirement: Resource safety on TV GPUs
The system SHALL clamp renderer pixel ratio to ≤ 1.5 and dispose all textures, materials, geometry, and the renderer on unmount (including React StrictMode double-mount).

### Requirement: No interaction
The system SHALL NOT register any keyboard or pointer handlers. The wall is a passive screensaver.

#### Scenario: Seamless loop
- **WHEN** a card drifts past the left edge of its row
- **THEN** it reappears at the right edge via modulo wrap with no visible jump

#### Scenario: Random start
- **WHEN** the app loads
- **THEN** the wall's game order differs from the source JSON order with overwhelming probability
