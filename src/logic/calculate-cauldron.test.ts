import { describe, expect, it } from 'vitest';
import { findIngredient } from '../data/ingredients';
import type { IIngredient } from '../types/game';
import { calculateCauldron } from './calculate-cauldron';

const get = (id: string): IIngredient => {
  const ingredient = findIngredient(id);
  if (!ingredient) throw new Error(`Unknown ingredient ${id}`);
  return ingredient;
};

describe('calculateCauldron', () => {
  it('starts at 0 / 0 / 0', () => {
    expect(calculateCauldron([])).toEqual({ temperature: 0, density: 0, magicPower: 0 });
  });

  it('sums the README worked example', () => {
    const values = calculateCauldron([get('dragon-tears'), get('fairy-dust')]);
    expect(values).toEqual({ temperature: 37, density: 17, magicPower: 22 });
  });

  it('supports negative values', () => {
    const values = calculateCauldron([get('frost-lotus'), get('essence-of-the-void')]);
    expect(values).toEqual({ temperature: -38, density: -6, magicPower: 54 });
  });
});
