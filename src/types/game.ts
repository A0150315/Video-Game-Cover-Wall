export interface GameData {
  id: number;
  name: string;
  posterUrl: string;
  releaseYear: number;
  rating: number;
  platforms: string[];
  genres: string[];
}

export type DisplayMode = 'cinematic' | 'gallery' | 'spotlight';

export const MODE_DURATIONS: Record<DisplayMode, number> = {
  cinematic: 180_000,
  gallery: 75_000,
  spotlight: 45_000,
};

export const MODE_SEQUENCE: DisplayMode[] = ['cinematic', 'gallery', 'spotlight'];

export const GALLERY_COLS = 5;
export const GALLERY_ROWS = 3;
export const SPOTLIGHT_THUMB_COUNT = 5;
