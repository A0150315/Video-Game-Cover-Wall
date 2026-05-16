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

export function useGameRotation(games: GameData[], mode: DisplayMode) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const count = mode === 'gallery'
    ? GALLERY_COLS * GALLERY_ROWS
    : mode === 'spotlight'
      ? SPOTLIGHT_THUMB_COUNT + 1
      : 1;

  const maxIndex = Math.max(0, games.length - count);

  const current = mode === 'gallery'
    ? games.slice(index, index + count)
    : mode === 'spotlight'
      ? { hero: games[index], thumbs: games.slice(index + 1, index + 1 + SPOTLIGHT_THUMB_COUNT) }
      : games[index] ?? null;

  const advance = useCallback((dir: 1 | -1) => {
    setIndex(prev => {
      const next = prev + dir * (mode === 'gallery' ? count : 1);
      if (next > maxIndex) return 0;
      if (next < 0) return maxIndex;
      return next;
    });
  }, [maxIndex, count, mode]);

  const next = useCallback(() => advance(1), [advance]);
  const prev = useCallback(() => advance(-1), [advance]);

  useEffect(() => {
    const interval = INTERVALS[mode];
    timerRef.current = setInterval(() => advance(1), interval);
    return () => clearInterval(timerRef.current);
  }, [mode, advance]);

  useEffect(() => {
    setIndex(0);
  }, [mode]);

  return { current, index, next, prev };
}
