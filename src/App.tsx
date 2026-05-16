import { useState, useEffect, useMemo } from 'react';
import type { GameData } from './types/game';
import { useModeSchedule } from './hooks/useModeSchedule';
import { useGameRotation } from './hooks/useGameRotation';
import ModeRenderer from './components/ModeRenderer';

export default function App() {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { mode, cycleMode } = useModeSchedule();
  const { current, phaseKey, next, prev } = useGameRotation(games, mode);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/games.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: GameData[]) => {
        setGames(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case 'ArrowUp':
          e.preventDefault();
          cycleMode(-1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          cycleMode(1);
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, cycleMode]);

  const modeProps = useMemo(() => {
    if (!games.length) {
      return {
        cinematicGame: null,
        galleryGames: [] as GameData[],
        spotlightData: null as { hero: GameData; thumbs: GameData[] } | null,
      };
    }
    return {
      cinematicGame: mode === 'cinematic' ? (current as GameData) : null,
      galleryGames: mode === 'gallery' ? (current as GameData[]) : [],
      spotlightData: mode === 'spotlight'
        ? (current as { hero: GameData; thumbs: GameData[] })
        : null,
    };
  }, [games, mode, current]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-4">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
        <p className="text-text-secondary text-base">Loading game library...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-4">
        <p className="text-text-secondary text-2xl">Unable to load game data</p>
        <p className="text-text-secondary text-sm">Check your connection and try again</p>
      </div>
    );
  }

  return (
    <ModeRenderer
      mode={mode}
      games={games}
      cinematicGame={modeProps.cinematicGame}
      galleryGames={modeProps.galleryGames}
      spotlightData={modeProps.spotlightData}
      phaseKey={phaseKey}
      onSkip={next}
    />
  );
}
