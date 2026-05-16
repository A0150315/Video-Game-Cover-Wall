import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { GameData } from '../types/game';

const KB_CLASSES = ['ken-burns-1', 'ken-burns-2', 'ken-burns-3', 'ken-burns-4'];

interface Props {
  game: GameData | null;
  onSkip?: () => void;
}

function shuffle(arr: string[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CinematicMode({ game, onSkip }: Props) {
  const [imgFailed, setImgFailed] = useState(0);
  const [metaVisible, setMetaVisible] = useState(false);
  const skippedRef = useRef(false);

  const kbClass = useMemo(() => KB_CLASSES[Math.floor(Math.random() * KB_CLASSES.length)], []);
  const urlChain = useMemo(() => {
    if (!game) return [];
    return [...shuffle(game.heroes), ...shuffle(game.posters)];
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setMetaVisible(true), 600);
    const t2 = setTimeout(() => setMetaVisible(false), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const allExhausted = imgFailed >= urlChain.length && urlChain.length > 0;
  useEffect(() => {
    if (allExhausted && !skippedRef.current && onSkip) {
      skippedRef.current = true;
      const t = setTimeout(onSkip, 300);
      return () => clearTimeout(t);
    }
  }, [allExhausted, onSkip]);

  if (!game) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <p className="text-text-secondary text-xl">No game data</p>
      </div>
    );
  }

  const imgSrc = urlChain[imgFailed];

  return (
    <div className="absolute inset-0 vignette film-grain overflow-hidden bg-black">
      <AnimatePresence>
        {!allExhausted && imgSrc && (
          <motion.div key={imgFailed} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.8, ease: 'easeInOut' }}>
            {/* Background: blurred + darkened + Ken Burns */}
            <img
              src={imgSrc}
              alt=""
              className={`absolute inset-0 w-full h-full ${kbClass}`}
              style={{ objectFit: 'cover', filter: 'blur(60px) brightness(0.25)' }}
            />
            {/* Foreground: full image, no crop */}
            <img
              src={imgSrc}
              alt={game.name}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: 'contain' }}
              onError={() => setImgFailed(prev => prev + 1)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {metaVisible && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-10 p-16"
            style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">{game.name}</h1>
            <div className="flex items-center gap-4 text-text-secondary text-lg">
              <span>{game.releaseYear}</span>
              <span className="text-accent text-xl font-bold">{game.rating}</span>
              <span>{game.genres.slice(0, 3).join(' · ')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
