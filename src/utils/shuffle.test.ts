import { describe, it, expect } from 'vitest';
import { shuffle } from './shuffle';

describe('shuffle', () => {
  it('returns a permutation without losing or adding items', () => {
    const input = Array.from({ length: 100 }, (_, i) => i);
    const out = shuffle(input);
    expect(out).toHaveLength(input.length);
    expect([...out].sort((a, b) => a - b)).toEqual(input);
  });

  it('does not mutate the input array', () => {
    const input = [1, 2, 3, 4, 5];
    shuffle(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});
