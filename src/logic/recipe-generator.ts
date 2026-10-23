import { RECIPES } from '../data/recipes';
import type { Difficulty, IRecipe } from '../types/game';
import { pickRandom, type RandomFn } from './random';

export function getRecipesByDifficulty(difficulty: Difficulty): readonly IRecipe[] {
  return RECIPES.filter((recipe) => recipe.difficulty === difficulty);
}

export function pickRecipe(difficulty: Difficulty, random: RandomFn = Math.random): IRecipe {
  return pickRandom(getRecipesByDifficulty(difficulty), random);
}
