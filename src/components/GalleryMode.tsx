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
            <motion.div
              key={`${game.id}-${i}`}
              className="relative overflow-hidden rounded-lg"
              style={{
                gridColumn: heroIndex === i ? 'span 2' : undefined,
                gridRow: heroIndex === i ? 'span 2' : undefined,
                zIndex: heroIndex === i ? 10 : 1,
              }}
              variants={itemVariants}
              transition={{
                duration: 0.5,
                ease: [0.22, 0.61, 0.36, 1],
                layout: { type: 'spring', stiffness: 200, damping: 24 },
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              layout
            >
              <GameImage
                primaryUrls={game.posters}
                fallbackUrls={game.heroes}
                alt={game.name}
                className="w-full h-full"
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
              <div
                className="absolute bottom-0 left-0 right-0 p-2"
                style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}
              >
                <p className="text-white text-xs font-medium truncate">{game.name}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
