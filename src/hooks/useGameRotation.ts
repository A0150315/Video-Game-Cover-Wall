import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameData, DisplayMode } from '../types/game';
import { GALLERY_COLS, GALLERY_ROWS, SPOTLIGHT_THUMB_COUNT } from '../types/game';

const CINEMATIC_INTERVAL = 12_000;
const GALLERY_INTERVAL = 25_000;
const SPOTLIGHT_INTERVAL = 8_000;

const INTERVALS: Record<DisplayMode, number> = {
  cinematic: CINEMATIC_INTERVAL,
  gallery: GALLERY_INTERVAL,
  spotlight: SPOTLIGHT_INTERVAL,
};

const GALLERY_BATCH = GALLERY_COLS * GALLERY_ROWS;
const SPOTLIGHT_BATCH = 1 + SPOTLIGHT_THUMB_COUNT;

export function useGameRotation(games: GameData[], mode: DisplayMode) {
  const getRandomIndex = () => {
    const step = mode === 'gallery' ? GALLERY_BATCH : mode === 'spotlight' ? SPOTLIGHT_BATCH : 1;
    const max = Math.max(0, games.length - step);
    return max > 0 ? Math.floor(Math.random() * (max + 1)) : 0;
  };

  const [index, setIndex] = useState(getRandomIndex);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const count = mode === 'gallery' ? GALLERY_BATCH : mode === 'spotlight' ? SPOTLIGHT_BATCH : 1;
  const maxIndex = Math.max(0, games.length - count);
  const phaseKey = mode === 'gallery' ? Math.floor(index / GALLERY_BATCH) : index;

  const current = mode === 'gallery'
    ? games.slice(index, index + count)
    : mode === 'spotlight'
      ? { hero: games[index], thumbs: games.slice(index + 1, index + count) }
      : games[index] ?? null;

  const advance = useCallback((dir: 1 | -1) => {
    setIndex(prev => {
      const step = mode === 'gallery' ? GALLERY_BATCH : 1;
      const next = prev + dir * step;
      if (next > maxIndex) return 0;
      if (next < 0) return maxIndex;
      return next;
    });
  }, [maxIndex, mode]);

  const next = useCallback(() => advance(1), [advance]);
  const prev = useCallback(() => advance(-1), [advance]);

  useEffect(() => {
    timerRef.current = setInterval(() => advance(1), INTERVALS[mode]);
    return () => clearInterval(timerRef.current);
  }, [mode, advance]);

  useEffect(() => { setIndex(getRandomIndex()); }, [mode]);

  return { current, phaseKey, next, prev };
}
