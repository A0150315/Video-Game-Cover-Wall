import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { GameData } from '../types/game';
import GameImage from './GameImage';

const containerVariants = {
  enter: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariants = {
  enter: { scale: 1, opacity: 1 },
  exit: { scale: 0.85, opacity: 0 },
};

function GalleryItem({ game, i, heroIndex }: { game: GameData; i: number; heroIndex: number | null }) {
  const [failed, setFailed] = useState(false);
  const isHero = heroIndex === i;

  if (!game.posters.length && !game.heroes.length) return null;
  if (failed) return null;

  const bgSrc = game.posters[0] || game.heroes[0] || '';

  return (
    <motion.div
      className="relative rounded-lg overflow-hidden cell-vignette"
      style={{ zIndex: isHero ? 10 : 1 }}
      variants={itemVariants}
      transition={{
        duration: 0.5,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      whileHover={undefined}
    >
      {/* Blurred background fill */}
      {bgSrc && (
        <img src={bgSrc} alt="" className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'cover', filter: 'blur(20px) brightness(0.35)', willChange: 'filter' }} />
      )}
      <motion.div
        className="w-full h-full relative"
        animate={{ scale: isHero ? 1.25 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      >
        <GameImage
          primaryUrls={game.posters}
          fallbackUrls={game.heroes}
          alt={game.name}
          className="w-full h-full"
          style={{ objectFit: 'contain' }}
          loading="lazy"
          onAllFailed={() => setFailed(true)}
        />
      </motion.div>
      <div
        className="absolute bottom-0 left-0 right-0 p-2 z-10"
        style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}
      >
        <p className="text-white text-xs font-medium truncate">{game.name}</p>
      </div>
    </motion.div>
  );
}

interface Props {
  games: GameData[];
  phaseKey: number;
}

export default function GalleryMode({ games, phaseKey }: Props) {
  const [heroIndex, setHeroIndex] = useState<number | null>(null);

  useEffect(() => {
    setHeroIndex(null);
    const t = setTimeout(() => {
      if (games.length > 0) {
        setHeroIndex(Math.floor(Math.random() * games.length));
      }
    }, 3500);
    return () => clearTimeout(t);
  }, [phaseKey, games.length]);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={phaseKey}
          className="grid gap-3 w-full h-full"
          style={{ gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(3, 1fr)' }}
          variants={containerVariants}
          initial="exit"
          animate="enter"
          exit="exit"
        >
          {games.map((game, i) => (
            <GalleryItem key={`${game.id}-${i}`} game={game} i={i} heroIndex={heroIndex} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
