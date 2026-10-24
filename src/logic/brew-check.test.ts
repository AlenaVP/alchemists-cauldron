import { describe, expect, it } from 'vitest';
import { findRecipe } from '../data/recipes';
import { checkBrew, isInRange } from './brew-check';
import { getRecipesByDifficulty, pickRecipe } from './recipe-generator';

describe('isInRange', () => {
  it('expands the range by the tolerance (README: 32..42 ±8 = 24..50)', () => {
    const range = { min: 32, max: 42 };
    expect(isInRange(24, range, 8)).toBe(true);
    expect(isInRange(50, range, 8)).toBe(true);
    expect(isInRange(23, range, 8)).toBe(false);
    expect(isInRange(51, range, 8)).toBe(false);
  });
});

describe('checkBrew', () => {
  const moonMist = findRecipe('moon-mist');

  it('accepts the README worked example', () => {
    if (!moonMist) throw new Error('Moon Mist is missing');
    expect(checkBrew({ temperature: 37, density: 17, magicPower: 22 }, moonMist, 8)).toBe(true);
  });

  it('fails when one parameter is outside', () => {
    if (!moonMist) throw new Error('Moon Mist is missing');
    expect(checkBrew({ temperature: 37, density: 31, magicPower: 22 }, moonMist, 8)).toBe(false);
  });
});

describe('recipe picker', () => {
  it('has 6 / 7 / 7 recipes per difficulty', () => {
    expect(getRecipesByDifficulty('easy')).toHaveLength(6);
    expect(getRecipesByDifficulty('medium')).toHaveLength(7);
    expect(getRecipesByDifficulty('hard')).toHaveLength(7);
  });

  it('picks only recipes of the given difficulty', () => {
    expect(pickRecipe('medium', () => 0).difficulty).toBe('medium');
    expect(pickRecipe('hard', () => 0.999).difficulty).toBe('hard');
  });
});
