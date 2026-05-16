import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { GameData } from '../types/game';

const KB_CLASSES = ['ken-burns-1', 'ken-burns-2', 'ken-burns-3', 'ken-burns-4'];

interface Props {
  game: GameData | null;
  onSkip?: () => void;
}

export default function CinematicMode({ game, onSkip }: Props) {
  const [visible, setVisible] = useState(false);
  const [metaVisible, setMetaVisible] = useState(false);
  const [imgFailed, setImgFailed] = useState(0);
  const [urlChain, setUrlChain] = useState<string[]>([]);
  const kbClass = useMemo(() => KB_CLASSES[Math.floor(Math.random() * KB_CLASSES.length)], [game?.id]);
  const skippedRef = useRef(false);

  useEffect(() => {
    setVisible(false);
    setMetaVisible(false);
    setImgFailed(0);
    skippedRef.current = false;

    const shuffle = (arr: string[]) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    if (game) {
      setUrlChain([...shuffle(game.heroes), ...shuffle(game.posters)]);
    }

    const t1 = setTimeout(() => { setVisible(true); setMetaVisible(true); }, 600);
    const t2 = setTimeout(() => setMetaVisible(false), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [game?.id]);

  // When all images fail, skip to next game
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
    <div className="absolute inset-0 vignette film-grain overflow-hidden">
      <AnimatePresence>
        {visible && !allExhausted && imgSrc && (
          <motion.img
            key={`${game.id}-${imgFailed}`}
            src={imgSrc}
            alt={game.name}
            className={`absolute inset-0 w-full h-full ${kbClass}`}
            style={{ objectFit: 'cover', willChange: 'transform' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            onError={() => setImgFailed(prev => prev + 1)}
          />
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
