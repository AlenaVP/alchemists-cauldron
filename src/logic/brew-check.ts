import type { CauldronValues, IRecipe, IRecipeRange } from '../types/game';
import { PARAMETER_KEYS } from './calculate-cauldron';

export function isInRange(value: number, range: IRecipeRange, tolerance = 0): boolean {
  return value >= range.min - tolerance && value <= range.max + tolerance;
}

/** A brew succeeds when every parameter is inside its range expanded by the tolerance. */
export function checkBrew(values: CauldronValues, recipe: IRecipe, tolerance: number): boolean {
  return PARAMETER_KEYS.every((key) => isInRange(values[key], recipe[key], tolerance));
}
