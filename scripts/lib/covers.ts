import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { writeFile, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const COVERS_DIR = resolve(import.meta.dirname, '../../public/data/covers');
const LOCAL_PREFIX = 'data/covers/';
const CONCURRENCY = 6;
const COVER_WIDTH = 512;
const JPEG_QUALITY = 80;

export interface GameLike {
  id: number;
  name: string;
  posters: string[];
}

type Verdict = 'keep' | 'dup' | 'failed';

async function downloadCover(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function contentHash(jpeg: Buffer): Promise<string> {
  const raw = await sharp(jpeg)
    .resize(16, 24, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer();
  return createHash('md5').update(raw).digest('hex');
}

async function processOne(game: GameLike, seen: Set<string>): Promise<Verdict> {
  const url = game.posters[0];
  if (!url) return 'failed';

  const dest = resolve(COVERS_DIR, `${game.id}.jpg`);
  let jpeg: Buffer;

  if (url.startsWith(LOCAL_PREFIX)) {
    if (!existsSync(dest)) return 'failed';
    jpeg = readFileSync(dest);
  } else if (existsSync(dest)) {
    jpeg = readFileSync(dest);
  } else {
    const raw = await downloadCover(url);
    jpeg = await sharp(raw)
      .resize({ width: COVER_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY })
      .toBuffer();
    await writeFile(dest, jpeg);
  }

  const hash = await contentHash(jpeg);
  if (seen.has(hash)) return 'dup';
  seen.add(hash);
  game.posters = [`${LOCAL_PREFIX}${game.id}.jpg`];
  return 'keep';
}

export async function localizePosters(games: GameLike[]): Promise<GameLike[]> {
  mkdirSync(COVERS_DIR, { recursive: true });
  const seen = new Set<string>();
  const kept: GameLike[] = [];
  let dups = 0;
  let failed = 0;

  for (let i = 0; i < games.length; i += CONCURRENCY) {
    const batch = games.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(batch.map(g => processOne(g, seen)));
    for (let j = 0; j < batch.length; j++) {
      const r = results[j];
      const verdict: Verdict = r.status === 'fulfilled' ? r.value : 'failed';
      if (verdict === 'keep') kept.push(batch[j]);
      else if (verdict === 'dup') {
        dups++;
        console.log(`    dup removed: ${batch[j].name}`);
      } else {
        failed++;
        console.log(`    failed removed: ${batch[j].name}`);
      }
    }
  }

  const referenced = new Set(kept.map(g => `${g.id}.jpg`));
  let swept = 0;
  for (const f of readdirSync(COVERS_DIR)) {
    if (!referenced.has(f)) {
      await unlink(resolve(COVERS_DIR, f));
      swept++;
    }
  }

  console.log(`  Covers: ${kept.length} kept, ${dups} duplicates removed, ${failed} failures removed, ${swept} orphan files swept`);
  return kept;
}
