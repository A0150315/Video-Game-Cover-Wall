import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { GameData } from '../types/game';
import GameImage from './GameImage';

interface SpotlightData {
  hero: GameData;
  thumbs: GameData[];
}

function ThumbItem({ game }: { game: GameData }) {
  const [failed, setFailed] = useState(false);

  if (!game.posters.length && !game.heroes.length) return null;
  if (failed) return null;

  return (
    <motion.div
      key={game.id}
      className="flex-1 relative overflow-hidden border-b border-white/5 last:border-b-0"
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <GameImage
        primaryUrls={game.posters}
        fallbackUrls={game.heroes}
        alt={game.name}
        className="w-full h-full"
        style={{ objectFit: 'cover' }}
        loading="lazy"
        onAllFailed={() => setFailed(true)}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-sm font-medium truncate">{game.name}</p>
        <p className="text-text-secondary text-xs">{game.releaseYear} · {game.rating}</p>
      </div>
    </motion.div>
  );
}

interface Props {
  data: SpotlightData | null;
  phaseKey: number;
}

export default function SpotlightMode({ data, phaseKey }: Props) {
  const [heroFailed, setHeroFailed] = useState(false);

  if (!data) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <p className="text-text-secondary text-xl">No game data</p>
      </div>
    );
  }

  const { hero, thumbs } = data;
  const heroHasImages = hero.posters.length > 0 || hero.heroes.length > 0;

  return (
    <div className="absolute inset-0 flex">
      <div className="w-[65%] relative overflow-hidden">
        <AnimatePresence mode="wait">
          {heroHasImages && !heroFailed && (
            <motion.div
              key={phaseKey}
              className="absolute inset-0"
              initial={{ x: 120, scale: 0.9, opacity: 0 }}
              animate={{ x: 0, scale: 1, opacity: 1 }}
              exit={{ x: -80, scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            >
              <GameImage
                primaryUrls={hero.heroes.length ? hero.heroes : hero.posters}
                fallbackUrls={hero.heroes.length ? hero.posters : hero.heroes}
                alt={hero.name}
                className="w-full h-full"
                style={{ objectFit: 'cover' }}
                onAllFailed={() => setHeroFailed(true)}
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
          )}
        </AnimatePresence>
      </div>

      <div className="w-[35%] flex flex-col bg-black/60 backdrop-blur-sm">
        <AnimatePresence mode="popLayout">
          {thumbs.map((game) => (
            <ThumbItem key={game.id} game={game} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
