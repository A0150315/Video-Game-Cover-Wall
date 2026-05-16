import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CinematicMode from './CinematicMode';
import type { GameData } from '../types/game';

vi.mock('../hooks/useImagePreload', () => ({
  useImagePreload: () => ({ loaded: true, imgFailed: 0 }),
}));

const mockGame: GameData = {
  id: 1,
  name: 'Test Game',
  posters: ['https://example.com/poster.jpg'],
  heroes: [],
  releaseYear: 2024,
  rating: 95,
  platforms: ['PC', 'PlayStation 5'],
  genres: ['Action', 'RPG'],
};

describe('CinematicMode', () => {
  it('shows placeholder when game is null', () => {
    render(<CinematicMode game={null} />);
    expect(screen.getByText('No game data')).toBeInTheDocument();
  });

  it('renders game name after metadata appears', async () => {
    render(<CinematicMode game={mockGame} />);
    const name = await screen.findByText('Test Game', {}, { timeout: 2000 });
    expect(name).toBeInTheDocument();
  });

  it('renders game rating', async () => {
    render(<CinematicMode game={mockGame} />);
    const rating = await screen.findByText('95', {}, { timeout: 2000 });
    expect(rating).toBeInTheDocument();
  });

  it('applies vignette and film-grain classes', () => {
    const { container } = render(<CinematicMode game={mockGame} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('vignette');
    expect(root.className).toContain('film-grain');
  });
});
