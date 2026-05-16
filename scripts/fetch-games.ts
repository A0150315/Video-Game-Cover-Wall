import { writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface IgdbGame {
  id: number;
  name: string;
  first_release_date?: number;
  total_rating?: number;
  total_rating_count?: number;
  genres?: { id: number; name: string }[];
  platforms?: { id: number; name: string }[];
  cover?: { url: string };
}

interface SgdbResult {
  success: boolean;
  data: { url: string; thumb: string }[];
}

interface GameOutput {
  id: number;
  name: string;
  posters: string[];
  heroes: string[];
  releaseYear: number;
  rating: number;
  platforms: string[];
  genres: string[];
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const STEAMGRIDDB_API_KEY = process.env.STEAMGRIDDB_API_KEY;

const IGDB_API = 'https://api.igdb.com/v4';
const SGDB_API = 'https://www.steamgriddb.com/api/v2';
const OUTPUT_PATH = resolve(import.meta.dirname, '../public/data/games.json');

const CLASSIC_QUERY = `
  fields name,first_release_date,total_rating,total_rating_count,genres.name,platforms.name,cover.url;
  where total_rating > 85 & total_rating_count > 200 & cover != null;
  sort total_rating desc;
  limit 150;
`;

const RECENT_QUERY = `
  fields name,first_release_date,total_rating,total_rating_count,genres.name,platforms.name,cover.url;
  where first_release_date > 1577836800 & total_rating > 75 & cover != null;
  sort total_rating desc;
  limit 100;
`;

const ANTICIPATED_QUERY = `
  fields name,first_release_date,total_rating,total_rating_count,genres.name,platforms.name,cover.url;
  where hypes > 40 & cover != null & total_rating = null;
  sort hypes desc;
  limit 40;
`;

// ---------------------------------------------------------------------------
// IGDB
// ---------------------------------------------------------------------------

async function getIgdbToken(): Promise<string> {
  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: IGDB_CLIENT_ID!,
      client_secret: IGDB_CLIENT_SECRET!,
      grant_type: 'client_credentials',
    }),
  });
  if (!res.ok) throw new Error(`IGDB auth failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function queryIgdb(token: string, query: string): Promise<IgdbGame[]> {
  const res = await fetch(`${IGDB_API}/games`, {
    method: 'POST',
    headers: {
      'Client-ID': IGDB_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body: query,
  });
  if (!res.ok) throw new Error(`IGDB query failed: ${res.status}`);
  return res.json() as Promise<IgdbGame[]>;
}

function igdbCoverUrl(game: IgdbGame): string {
  const raw = game.cover?.url ?? '';
  // Remove Cloudinary transformation to get original uploaded resolution
return raw.startsWith('//') ? `https:${raw.replace(/t_thumb\//, '')}` : raw;
}

// ---------------------------------------------------------------------------
// SteamGridDB
// ---------------------------------------------------------------------------

async function searchSgdbPosters(gameName: string): Promise<string[]> {
  const res = await fetch(
    `${SGDB_API}/search/autocomplete/${encodeURIComponent(gameName)}`,
    { headers: { Authorization: `Bearer ${STEAMGRIDDB_API_KEY}` } },
  );

  if (!res.ok) return [];
  const search = (await res.json()) as { data?: { id: number }[] };
  if (!search.data?.length) return [];

  const gameId = search.data[0].id;
  const gridsRes = await fetch(
    `${SGDB_API}/grids/game/${gameId}?styles=alternate&limit=8`,
    { headers: { Authorization: `Bearer ${STEAMGRIDDB_API_KEY}` } },
  );

  if (!gridsRes.ok) return [];
  const grids = (await gridsRes.json()) as SgdbResult;
  if (!grids.success || !grids.data.length) return [];
  return grids.data.map(g => g.url);
}

async function searchSgdbHeroes(gameName: string): Promise<string[]> {
  const res = await fetch(
    `${SGDB_API}/search/autocomplete/${encodeURIComponent(gameName)}`,
    { headers: { Authorization: `Bearer ${STEAMGRIDDB_API_KEY}` } },
  );

  if (!res.ok) return [];
  const search = (await res.json()) as { data?: { id: number }[] };
  if (!search.data?.length) return [];

  const gameId = search.data[0].id;
  const heroesRes = await fetch(
    `${SGDB_API}/heroes/game/${gameId}?limit=8`,
    { headers: { Authorization: `Bearer ${STEAMGRIDDB_API_KEY}` } },
  );

  if (!heroesRes.ok) return [];
  const heroes = (await heroesRes.json()) as SgdbResult;
  if (!heroes.success || !heroes.data.length) return [];
  return heroes.data.map(g => g.url);
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

function toOutput(game: IgdbGame, posters: string[], heroes: string[]): GameOutput {
  return {
    id: game.id,
    name: game.name,
    posters,
    heroes,
    releaseYear: game.first_release_date
      ? new Date(game.first_release_date * 1000).getFullYear()
      : 0,
    rating: Math.round(game.total_rating ?? 0),
    platforms: game.platforms?.map(p => p.name) ?? [],
    genres: game.genres?.map(g => g.name) ?? [],
  };
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function main() {
  if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET || !STEAMGRIDDB_API_KEY) {
    console.error('Missing required env vars: IGDB_CLIENT_ID, IGDB_CLIENT_SECRET, STEAMGRIDDB_API_KEY');
    process.exit(1);
  }

  // 1. IGDB auth
  console.log('Authenticating with IGDB...');
  const token = await getIgdbToken();

  // 2. Query classic + recent + anticipated games
  console.log('Fetching classic games...');
  const classics = await queryIgdb(token, CLASSIC_QUERY);
  console.log(`  Got ${classics.length} classic games`);

  console.log('Fetching recent popular games...');
  const recents = await queryIgdb(token, RECENT_QUERY);
  console.log(`  Got ${recents.length} recent games`);

  console.log('Fetching anticipated upcoming games...');
  const anticipated = await queryIgdb(token, ANTICIPATED_QUERY);
  console.log(`  Got ${anticipated.length} anticipated games`);

  // 3. Merge & deduplicate
  const seen = new Set<number>();
  const merged: IgdbGame[] = [];
  for (const g of [...classics, ...recents, ...anticipated]) {
    if (!seen.has(g.id)) {
      seen.add(g.id);
      merged.push(g);
    }
  }
  console.log(`${merged.length} unique games total`);

  // 4. Look up SteamGridDB posters + heroes
  const output: GameOutput[] = [];
  for (const game of merged) {
    const igdbFallback = [igdbCoverUrl(game)];
    let posters: string[] = [];
    let heroes: string[] = [];

    try {
      console.log(`  SteamGridDB: ${game.name}...`);
      const [sgdbPosters, sgdbHeroes] = await Promise.all([
        searchSgdbPosters(game.name),
        searchSgdbHeroes(game.name),
      ]);
      posters = sgdbPosters;
      heroes = sgdbHeroes;
      console.log(`    posters: ${sgdbPosters.length}  heroes: ${sgdbHeroes.length}`);
    } catch {
      console.log(`    → error, using IGDB fallback`);
    }

    if (!posters.length) posters = igdbFallback;
    output.push(toOutput(game, posters, heroes));
    await new Promise(r => setTimeout(r, 200));
  }

  // 5. Shuffle & write
  shuffle(output);
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\nDone! ${output.length} games written to ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error('Fetch failed:', err);
  console.log('Existing games.json preserved — no changes made.');
  process.exit(0);
});
