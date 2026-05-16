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
}

export default function ModeRenderer({ mode, games, cinematicGame, galleryGames, spotlightData }: Props) {
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
        {mode === 'cinematic' && <CinematicMode game={cinematicGame} />}
        {mode === 'gallery' && <GalleryMode games={galleryGames} />}
        {mode === 'spotlight' && <SpotlightMode data={spotlightData} />}
        {!games.length && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <p className="text-text-secondary text-xl">No games loaded</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
