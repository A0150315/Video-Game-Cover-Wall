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
      className="flex-1 relative overflow-hidden bg-neutral-900 border-b border-white/5 last:border-b-0 cell-vignette"
      style={{ willChange: 'transform, opacity' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbs use heroes (horizontal), fallback to posters */}
      <GameImage
        primaryUrls={game.heroes.length ? game.heroes : game.posters}
        fallbackUrls={game.heroes.length ? game.posters : game.heroes}
        alt={game.name}
        className="w-full h-full"
        style={{ objectFit: 'contain' }}
        loading="lazy"
        onAllFailed={() => setFailed(true)}
      />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-sm font-medium truncate drop-shadow">{game.name}</p>
        <p className="text-text-secondary text-xs drop-shadow">{game.releaseYear} · {game.rating}</p>
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
  // Hero uses posters (vertical), fallback to heroes
  const heroSrcs = hero.posters.length ? hero.posters : hero.heroes;
  const heroFallbacks = hero.posters.length ? hero.heroes : hero.posters;

  return (
    <div className="absolute inset-0 flex">
      <div className="w-[65%] relative overflow-hidden bg-black cell-vignette">
        <AnimatePresence mode="wait">
          {heroHasImages && !heroFailed && (
            <motion.div
              key={phaseKey}
              className="absolute inset-0"
              style={{ willChange: 'transform, opacity' }}
              initial={{ x: 80, scale: 0.95, opacity: 0 }}
              animate={{ x: 0, scale: 1, opacity: 1 }}
              exit={{ x: -60, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* Blurred background fill */}
              <img
                src={heroSrcs[0]}
                alt=""
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: 'cover', filter: 'blur(30px) brightness(0.45)', willChange: 'filter' }}
              />
              {/* Foreground: contain + edge fade */}
              <GameImage
                primaryUrls={heroSrcs}
                fallbackUrls={heroFallbacks}
                alt={hero.name}
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: 'contain' }}
                onAllFailed={() => setHeroFailed(true)}
              />
              <div
                className="absolute bottom-0 left-0 right-0 p-12 z-10"
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
        <AnimatePresence>
          {thumbs.map((game) => (
            <ThumbItem key={game.id} game={game} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
