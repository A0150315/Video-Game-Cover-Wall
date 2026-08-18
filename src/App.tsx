import { useState, useEffect, useMemo } from 'react';
import type { GameData } from './types/game';
import { shuffle } from './utils/shuffle';
import CoverWallCanvas from './components/CoverWallCanvas';

export default function App() {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/games.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: GameData[]) => {
        setGames(shuffle(data));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const posters = useMemo(
    () =>
      games
        .map(g => g.posters[0])
        .filter((p): p is string => Boolean(p))
        .map(p => (p.startsWith('http') ? p : `${import.meta.env.BASE_URL}${p}`)),
    [games],
  );

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
    <>
      <CoverWallCanvas posters={posters} />
      <div className="vignette pointer-events-none absolute inset-0" />
      <div className="film-grain pointer-events-none absolute inset-0" />
    </>
  );
}
