## ADDED Requirements

### Requirement: Scheduled data fetching
The system SHALL fetch game data via GitHub Actions on a daily cron schedule (UTC 3:00).

#### Scenario: Daily fetch executes successfully
- **WHEN** the scheduled cron triggers at 3:00 UTC
- **THEN** the fetch script queries IGDB API for classic and recent popular games
- **THEN** the fetch script queries SteamGridDB API for each game's poster URL
- **THEN** the resulting JSON is committed and pushed to the repository

### Requirement: IGDB game list retrieval
The system SHALL retrieve a combined list of classic games (rating > 85, rating count > 200) and recent popular games (released after 2020, rating > 80) from IGDB API.

#### Scenario: Classic games retrieved
- **WHEN** the script queries IGDB with rating filter > 85 and rating count > 200
- **THEN** the response contains game entries with id, name, release date, rating, genres, platforms, and cover image URL

#### Scenario: Recent popular games retrieved
- **WHEN** the script queries IGDB with release date > 2020 and rating > 80
- **THEN** the response contains recent game entries with the same fields

### Requirement: SteamGridDB poster lookup
The system SHALL query SteamGridDB API for each game in the IGDB list to obtain high-resolution poster/cover URLs.

#### Scenario: Poster found on SteamGridDB
- **WHEN** a game name is searched on SteamGridDB and results exist
- **THEN** the highest-resolution poster URL is selected and associated with that game

#### Scenario: Poster not found on SteamGridDB
- **WHEN** a game name is searched on SteamGridDB and no results exist
- **THEN** the IGDB cover image URL is used as a fallback

### Requirement: Data output
The system SHALL produce a `public/data/games.json` file containing the shuffled, deduplicated game list with all required fields.

#### Scenario: JSON output written
- **WHEN** the fetch script completes successfully
- **THEN** `public/data/games.json` contains an array of game objects with id, name, posterUrl, releaseYear, rating, platforms, and genres fields

### Requirement: API key security
All API keys and credentials SHALL be stored as GitHub Secrets and injected as environment variables during Actions execution.

#### Scenario: API keys not in source
- **WHEN** the source code is inspected
- **THEN** no API key or secret string is found in any committed file

### Requirement: Failure resilience
The system SHALL preserve existing data when API fetch fails.

#### Scenario: API fetch fails
- **WHEN** IGDB or SteamGridDB API returns an error or times out
- **THEN** the existing `games.json` remains unchanged
- **THEN** the Actions workflow completes with a warning, not an error
