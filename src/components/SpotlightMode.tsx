import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { GameData } from '../types/game';

interface SpotlightData {
  hero: GameData;
  thumbs: GameData[];
}

export default function SpotlightMode({ data }: { data: SpotlightData | null }) {
  const [hero, setHero] = useState<GameData | null>(null);
  const [thumbs, setThumbs] = useState<GameData[]>([]);
  const [direction, setDirection] = useState(1);

  const rotate = useCallback(() => {
    if (!data) return;
    setDirection(prev => prev * -1);
    setThumbs(prev => {
      const next = [...prev.slice(1), prev[0]];
      return next;
    });
    setHero(prev => {
      return thumbs[0] ?? prev;
    });
  }, [data, thumbs]);

  useEffect(() => {
    if (!data) return;
    setHero(data.hero);
    setThumbs(data.thumbs);
  }, [data]);

  useEffect(() => {
    const timer = setInterval(rotate, 6000);
    return () => clearInterval(timer);
  }, [rotate]);

  if (!hero) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <p className="text-text-secondary text-xl">No game data</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex">
      <div className="w-[65%] relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={hero.id}
            className="absolute inset-0"
            custom={direction}
            initial={{ x: direction * 120, scale: 0.9, opacity: 0 }}
            animate={{ x: 0, scale: 1, opacity: 1 }}
            exit={{ x: direction * -80, scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          >
            <img
              src={hero.posterUrl}
              alt={hero.name}
              className="w-full h-full"
              style={{ objectFit: 'cover' }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 p-12"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}
            >
              <h2 className="text-3xl font-bold text-white mb-1">{hero.name}</h2>
              <p className="text-text-secondary text-base">
                {hero.releaseYear} · {hero.rating} · {hero.platforms.slice(0, 2).join(', ')}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-[35%] flex flex-col bg-black/60 backdrop-blur-sm">
        <AnimatePresence mode="popLayout">
          {thumbs.map((game, i) => (
            <motion.div
              key={`${game.id}-${i}`}
              className="flex-1 relative overflow-hidden border-b border-white/5 last:border-b-0"
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <img
                src={game.posterUrl}
                alt={game.name}
                className="w-full h-full"
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-medium truncate">{game.name}</p>
                <p className="text-text-secondary text-xs">{game.releaseYear} · {game.rating}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
