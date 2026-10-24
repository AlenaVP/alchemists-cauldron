import { describe, expect, it } from 'vitest';
import type { ILeaderboardEntry } from '../types/game';
import { addEntry, parseEntries, qualifiesForLeaderboard, sortEntries } from './leaderboard-rules';
import { getNameError } from './player-name';

const entry = (score: number, date: number, name = 'Alena'): ILeaderboardEntry => ({
  name,
  score,
  date,
  difficulty: 'medium',
});

const full = Array.from({ length: 10 }, (_, index) => entry(1000 - index * 100, index));

describe('sortEntries', () => {
  it('sorts by score, then the earlier result first', () => {
    const sorted = sortEntries([entry(200, 5, 'Late'), entry(400, 9), entry(200, 1, 'Early')]);
    expect(sorted.map((item) => item.name)).toEqual(['Alena', 'Early', 'Late']);
  });
});

describe('qualifiesForLeaderboard', () => {
  it('accepts any positive score while the list is not full', () => {
    expect(qualifiesForLeaderboard([], 100)).toBe(true);
    expect(qualifiesForLeaderboard([], 0)).toBe(false);
  });

  it('needs more than the 10th place when the list is full', () => {
    expect(qualifiesForLeaderboard(full, 100)).toBe(false);
    expect(qualifiesForLeaderboard(full, 150)).toBe(true);
  });
});

describe('addEntry', () => {
  it('keeps only the Top-10', () => {
    const result = addEntry(full, entry(550, 99, 'New'));
    expect(result).toHaveLength(10);
    expect(result[5]?.name).toBe('New');
    expect(result.at(-1)?.score).toBe(200);
  });
});

describe('parseEntries', () => {
  it('never throws on broken data', () => {
    expect(parseEntries(null)).toEqual([]);
    expect(parseEntries('oops')).toEqual([]);
    expect(parseEntries([{ name: 1 }, entry(300, 1), { ...entry(200, 2), name: '<script>' }])).toEqual([entry(300, 1)]);
  });
});

describe('player name', () => {
  it('accepts 2–15 letters, digits, space, _ and -', () => {
    expect(getNameError('Al')).toBeNull();
    expect(getNameError('Алена_2026-x')).toBeNull();
    expect(getNameError('  Magus   Prime ')).toBeNull();
  });

  it('rejects too short, too long and other characters', () => {
    expect(getNameError('A')).not.toBeNull();
    expect(getNameError('A'.repeat(16))).not.toBeNull();
    expect(getNameError('Hi!')).not.toBeNull();
  });
});
