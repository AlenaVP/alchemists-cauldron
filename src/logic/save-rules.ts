import { DIFFICULTY_SETTINGS, STOCK_MAX, TIME_BONUS_CAP } from '../data/difficulty';
import { findIngredient } from '../data/ingredients';
import { findRecipe } from '../data/recipes';
import type { Difficulty, IGameState, IIngredient } from '../types/game';
import { getShelfIngredients } from './stock';
import { secondsToMs } from './timer';

/** Fields stored in localStorage (US 2.2). */
export interface ISavedGame {
  version: 1;
  difficulty: Difficulty;
  score: number;
  timeLeft: number;
  lives: number;
  activeRecipe: { id: string };
  cauldronIngredients: { id: string }[];
  shelfStock: Record<string, number>;
  status: 'playing' | 'paused';
}

export function toSavedGame(state: IGameState): ISavedGame | null {
  if ((state.status !== 'playing' && state.status !== 'paused') || !state.activeRecipe) {
    return null;
  }
  return {
    version: 1,
    difficulty: state.difficulty,
    score: state.score,
    timeLeft: state.timeLeft,
    lives: state.lives,
    activeRecipe: state.activeRecipe,
    cauldronIngredients: state.cauldronIngredients,
    shelfStock: state.shelfStock,
    status: state.status,
  };
}

const isRecord = (data: unknown): data is Record<string, unknown> =>
  typeof data === 'object' && data !== null && !Array.isArray(data);

const isDifficulty = (value: unknown): value is Difficulty => value === 'easy' || value === 'medium' || value === 'hard';

const isIntegerBetween = (value: unknown, min: number, max: number): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;

const getId = (value: unknown): string | null => (isRecord(value) && typeof value.id === 'string' ? value.id : null);

/**
 * Validates unknown data from localStorage and rebuilds a game state from it.
 * Recipes and ingredients are taken from the game tables by id, so edited
 * numbers in the save cannot change the rules. Returns null for anything invalid.
 * A restored game always opens paused (US 2.2).
 */
export function parseSavedGame(data: unknown): IGameState | null {
  if (!isRecord(data) || data.version !== 1 || !isDifficulty(data.difficulty)) {
    return null;
  }
  const { difficulty } = data;
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const maxTime = secondsToMs(Math.max(settings.startTime, TIME_BONUS_CAP));

  if (data.status !== 'playing' && data.status !== 'paused') return null;
  if (!isIntegerBetween(data.score, 0, Number.MAX_SAFE_INTEGER)) return null;
  if (typeof data.timeLeft !== 'number' || !(data.timeLeft > 0 && data.timeLeft <= maxTime)) return null;
  if (!isIntegerBetween(data.lives, 1, settings.lives)) return null;

  const recipeId = getId(data.activeRecipe);
  const recipe = recipeId === null ? undefined : findRecipe(recipeId);
  if (recipe?.difficulty !== difficulty) return null;

  const shelfIds = getShelfIngredients(settings.shelfSize).map((ingredient) => ingredient.id);
  if (!Array.isArray(data.cauldronIngredients) || data.cauldronIngredients.length > settings.maxCauldronIngredients) {
    return null;
  }
  const cauldron: IIngredient[] = [];
  for (const item of data.cauldronIngredients as unknown[]) {
    const id = getId(item);
    const ingredient = id === null ? undefined : findIngredient(id);
    if (!ingredient || !shelfIds.includes(ingredient.id)) return null;
    cauldron.push(ingredient);
  }

  const rawStock = data.shelfStock;
  if (!isRecord(rawStock) || Object.keys(rawStock).length !== shelfIds.length) return null;
  const shelfStock: Record<string, number> = {};
  for (const id of shelfIds) {
    const portions = rawStock[id];
    if (!isIntegerBetween(portions, 0, STOCK_MAX)) return null;
    shelfStock[id] = portions;
  }

  return {
    status: 'paused',
    difficulty,
    score: data.score,
    timeLeft: data.timeLeft,
    lives: data.lives,
    activeRecipe: recipe,
    cauldronIngredients: cauldron,
    shelfStock,
    lastBrew: null,
    gameOverReason: null,
    lastReactionId: null,
    eventId: 0,
  };
}
