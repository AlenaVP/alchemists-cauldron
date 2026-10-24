import { describe, expect, it } from 'vitest';
import { pickRandom, randomInt } from './random';

describe('randomInt', () => {
  it('returns the lower bound for random() = 0', () => {
    expect(randomInt(2, 15, () => 0)).toBe(2);
  });

  it('returns the upper bound for random() close to 1', () => {
    expect(randomInt(2, 15, () => 0.9999)).toBe(15);
  });
});

describe('pickRandom', () => {
  it('picks an item by the random value', () => {
    expect(pickRandom(['a', 'b', 'c'], () => 0.5)).toBe('b');
  });

  it('throws on an empty list', () => {
    expect(() => pickRandom([])).toThrow();
  });
});
