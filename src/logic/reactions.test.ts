import { describe, expect, it } from 'vitest';
import { DIFFICULTY_SETTINGS } from '../data/difficulty';
import { findIngredient } from '../data/ingredients';
import { REACTIONS } from '../data/reactions';
import type { Difficulty, IIngredient } from '../types/game';
import { applyReactions, getFiredReactions, getReactions } from './reactions';

const get = (id: string): IIngredient => {
  const ingredient = findIngredient(id);
  if (!ingredient) throw new Error(`Unknown ingredient ${id}`);
  return ingredient;
};

describe('reaction sets', () => {
  it('has the full table of 15 reactions', () => {
    expect(REACTIONS).toHaveLength(15);
  });

  it.each<Difficulty>(['easy', 'medium', 'hard'])('%s uses the configured number of reactions', (difficulty) => {
    expect(getReactions(difficulty)).toHaveLength(DIFFICULTY_SETTINGS[difficulty].reactionCount);
  });
});

describe('applyReactions', () => {
  const medium = getReactions('medium');

  it('keeps plain sums without an active reaction', () => {
    expect(applyReactions([get('dragon-tears'), get('fairy-dust')], medium)).toEqual({
      temperature: 37,
      density: 17,
      magicPower: 22,
    });
  });

  it('Bubbling: Magic Power +50%', () => {
    expect(applyReactions([get('fairy-dust'), get('caustic-acid')], medium).magicPower).toBe(51);
  });

  it('Solar Frost: Temperature 0, Density +20%', () => {
    expect(applyReactions([get('dragon-tears'), get('frost-lotus')], medium)).toMatchObject({
      temperature: 0,
      density: 14,
    });
  });

  it('Easy has no reactions', () => {
    expect(applyReactions([get('fairy-dust'), get('caustic-acid')], getReactions('easy')).magicPower).toBe(34);
  });
});

describe('getFiredReactions', () => {
  const medium = getReactions('medium');
  const pair = [get('fairy-dust'), get('caustic-acid')];

  it('fires when the combination becomes active', () => {
    expect(getFiredReactions([get('fairy-dust')], pair, medium).map((r) => r.id)).toEqual(['bubbling']);
  });

  it('does not fire again while the combination stays active', () => {
    expect(getFiredReactions(pair, [...pair, get('mandrake-root')], medium)).toEqual([]);
  });
});
