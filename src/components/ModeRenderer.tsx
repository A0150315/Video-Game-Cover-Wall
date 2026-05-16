import { motion, AnimatePresence } from 'motion/react';
import type { GameData, DisplayMode } from '../types/game';
import CinematicMode from './CinematicMode';
import GalleryMode from './GalleryMode';
import SpotlightMode from './SpotlightMode';

interface Props {
  mode: DisplayMode;
  games: GameData[];
  cinematicGame: GameData | null;
  galleryGames: GameData[];
  spotlightData: { hero: GameData; thumbs: GameData[] } | null;
  phaseKey: number;
  onSkip: () => void;
}

export default function ModeRenderer({ mode, cinematicGame, galleryGames, spotlightData, phaseKey, onSkip }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {mode === 'cinematic' && <CinematicMode game={cinematicGame} onSkip={onSkip} />}
        {mode === 'gallery' && <GalleryMode games={galleryGames} phaseKey={phaseKey} />}
        {mode === 'spotlight' && <SpotlightMode data={spotlightData} phaseKey={phaseKey} />}
      </motion.div>
    </AnimatePresence>
  );
}
