# Cover Wall

## Purpose

WebGL（Three.js）渲染的无限 3D 游戏封面墙，作为应用唯一展示形态，面向电视待机屏保场景，零交互。

## Requirements

### Requirement: Sphere layout
The system SHALL distribute all poster cards (aspect 2:3) on a sphere across 2 equatorial bands, split evenly; the sphere radius derives from the band card count so cards tile the full 360° ring without overlap. Each card is tangent to the surface with its normal pointing outward. The sphere group SHALL rotate around its Y axis at constant angular speed with no axial tilt; the front hemisphere is the visible sliding window. Cards facing away are naturally hidden by back-face culling. The scene SHALL use a near-black animated ink-wash shader background with per-load random palette, plus fog to soften the limb.

### Requirement: Infinite rotation
The system SHALL rotate the sphere continuously; each latitude band forms a closed 360° ring of covers, so every poster passes through the visible window in an endless loop with no wrap-around discontinuity.

### Requirement: Randomized, deduplicated order
The system SHALL shuffle the fetched game list (Fisher-Yates) before building the wall. The data pipeline SHALL deduplicate games whose cover images are visually identical (content hash), so the same cover never appears twice on the wall.

### Requirement: Localized covers
The system SHALL store cover images locally under `public/data/covers/` (re-encoded 512px-wide JPEG) and reference them via relative paths in `games.json`, avoiding cross-origin texture restrictions and CDN hotlink throttling. Games whose cover cannot be localized SHALL be removed from `games.json`.

### Requirement: Texture loading and fade-in
The system SHALL load poster textures via `THREE.TextureLoader` (sRGB color space, anisotropy ≤ 4), showing a dark placeholder card until each texture arrives, then fading the card from opacity 0 to 1. Rows SHALL be filled by cyclically repeating posters when fewer than 16 distinct posters are available per row.

### Requirement: Resource safety on TV GPUs
The system SHALL clamp renderer pixel ratio to ≤ 1.5 and dispose all textures, materials, geometry, shaders, and the renderer on unmount (including React StrictMode double-mount).

### Requirement: No interaction
The system SHALL NOT register any keyboard or pointer handlers. The wall is a passive screensaver.

#### Scenario: Seamless loop
- **WHEN** a card drifts past the end of its row's arc
- **THEN** it reappears at the opposite side via modulo wrap with no visible jump

#### Scenario: Random start
- **WHEN** the app loads
- **THEN** the wall's game order differs from the source JSON order with overwhelming probability

#### Scenario: Duplicate cover removal
- **WHEN** two IGDB entries resolve to the same cover image
- **THEN** only the first is kept in `games.json`
