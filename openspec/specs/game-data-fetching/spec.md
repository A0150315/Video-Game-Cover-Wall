# Game Data Fetching

## Purpose

Automated daily data pipeline: IGDB API → game list → SteamGridDB API → high-res images → `games.json`.

## Requirements

### Requirement: Scheduled data fetching
The system SHALL fetch game data via GitHub Actions on a daily cron schedule (UTC 3:00), with `contents: write` permission for pushing results.

#### Scenario: Daily fetch executes successfully
- **WHEN** the scheduled cron triggers at 3:00 UTC
- **THEN** the fetch script queries IGDB API for classic, recent, and anticipated games
- **THEN** the fetch script queries SteamGridDB API for each game's posters (up to 8) and heroes (up to 8)
- **THEN** the resulting JSON is committed and pushed to the repository
- **THEN** the deploy workflow is triggered by the push

### Requirement: IGDB game list retrieval
The system SHALL retrieve games from three categories: classics (rating>85, reviews>500, 150 games), recent (post-2020, rating>75, reviews>50, 100 games), and anticipated (hypes>50, unreleased, 40 games).

#### Scenario: Multi-category games retrieved
- **WHEN** the script queries IGDB with category-specific filters
- **THEN** the response contains game entries with id, name, release date, rating, genres, platforms, and cover image URL
- **THEN** results are deduplicated across categories

### Requirement: SteamGridDB multi-image lookup
The system SHALL query SteamGridDB for multiple posters (`/grids`) and heroes (`/heroes`) per game, taking up to 8 of each for image variety.

#### Scenario: Images found on SteamGridDB
- **WHEN** a game name is searched on SteamGridDB
- **THEN** up to 8 poster URLs and 8 hero URLs are collected
- **THEN** the highest-voted images are prioritized

#### Scenario: Images not found on SteamGridDB
- **WHEN** SteamGridDB returns no results for a game
- **THEN** the IGDB cover image URL (original resolution) is used as the sole poster
- **THEN** heroes array remains empty

### Requirement: Data output
The system SHALL produce a `public/data/games.json` file with shuffled game objects containing `posters` and `heroes` arrays. Games with zero images are filtered out.

#### Scenario: JSON output written
- **WHEN** the fetch script completes
- **THEN** `games.json` contains shuffled game objects with id, name, posters[], heroes[], releaseYear, rating, platforms, and genres

### Requirement: API key security
All API keys SHALL be stored as GitHub Secrets (`IGDB_CLIENT_ID`, `IGDB_CLIENT_SECRET`, `STEAMGRIDDB_API_KEY`) and injected as environment variables during Actions execution. The `.env` file is gitignored; local dev uses `pnpm fetch-games:local`.

### Requirement: Failure resilience
When API fetch fails, existing `games.json` is preserved unchanged and the workflow exits gracefully.
