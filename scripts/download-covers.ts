import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { localizePosters } from './lib/covers';

const JSON_PATH = resolve(import.meta.dirname, '../public/data/games.json');

async function main() {
  const games = JSON.parse(readFileSync(JSON_PATH, 'utf-8'));
  console.log(`Localizing covers for ${games.length} games...`);
  const kept = await localizePosters(games);
  writeFileSync(JSON_PATH, JSON.stringify(kept, null, 2), 'utf-8');
  console.log(`games.json updated: ${kept.length} games remain.`);
}

main().catch(err => {
  console.error('Download failed:', err);
  process.exit(1);
});
