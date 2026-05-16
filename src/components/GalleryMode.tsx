import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { GameData } from '../types/game';
import { GALLERY_COLS, GALLERY_ROWS } from '../types/game';

const GRID_SIZE = GALLERY_COLS * GALLERY_ROWS;

const containerVariants = {
  enter: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariants = {
  enter: { scale: 1, opacity: 1 },
  exit: { scale: 0.85, opacity: 0 },
};

export default function GalleryMode({ games }: { games: GameData[] }) {
  const [batchIndex, setBatchIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<'enter' | 'hero' | 'exit'>('enter');

  const displayGames = useMemo(() => {
    return games.slice(batchIndex * GRID_SIZE, (batchIndex + 1) * GRID_SIZE);
  }, [games, batchIndex]);

  useEffect(() => {
    setPhase('enter');
    setHeroIndex(null);

    const heroTimer = setTimeout(() => {
      const idx = Math.floor(Math.random() * displayGames.length);
      setHeroIndex(idx);
      setPhase('hero');
    }, 3000);

    const batchTimer = setTimeout(() => {
      setPhase('exit');
    }, 20_000);

    return () => { clearTimeout(heroTimer); clearTimeout(batchTimer); };
  }, [batchIndex, displayGames.length]);

  useEffect(() => {
    if (phase === 'exit') {
      const t = setTimeout(() => {
        setBatchIndex(prev => prev + 1);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={batchIndex}
          className="grid gap-3 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${GALLERY_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GALLERY_ROWS}, 1fr)`,
          }}
          variants={containerVariants}
          initial="exit"
          animate={phase === 'exit' ? 'exit' : 'enter'}
        >
          {displayGames.map((game, i) => (
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
              <img
                src={game.posterUrl}
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
