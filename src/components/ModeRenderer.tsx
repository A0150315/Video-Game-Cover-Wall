import { motion, AnimatePresence } from 'motion/react';
import type { GameData, DisplayMode } from '../types/game';
import CinematicMode from './CinematicMode';
import GalleryMode from './GalleryMode';
import SpotlightMode from './SpotlightMode';
import Preloader from './Preloader';

interface Props {
  mode: DisplayMode;
  games: GameData[];
  cinematicGame: GameData | null;
  galleryGames: GameData[];
  spotlightData: { hero: GameData; thumbs: GameData[] } | null;
  phaseKey: number;
  preloadUrls: string[];
  onSkip: () => void;
}

export default function ModeRenderer({ mode, cinematicGame, galleryGames, spotlightData, phaseKey, preloadUrls, onSkip }: Props) {
  return (
    <>
      <Preloader urls={preloadUrls} />
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {mode === 'cinematic' && <CinematicMode key={cinematicGame?.id ?? 'empty'} game={cinematicGame} onSkip={onSkip} />}
          {mode === 'gallery' && <GalleryMode games={galleryGames} phaseKey={phaseKey} />}
          {mode === 'spotlight' && <SpotlightMode data={spotlightData} phaseKey={phaseKey} />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
