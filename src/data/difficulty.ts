import type { Difficulty, IDifficultySettings } from '../types/game';

/** Single source of numbers: the difficulty table from the task README. */
export const DIFFICULTY_SETTINGS: Readonly<Record<Difficulty, IDifficultySettings>> = {
  easy: {
    label: 'Easy',
    shelfSize: 4,
    maxCauldronIngredients: 4,
    startTime: 180,
    tolerance: 12,
    lives: 5,
    scorePerBrew: 100,
    timeBonus: 15,
    reactionCount: 0,
  },
  medium: {
    label: 'Medium',
    shelfSize: 6,
    maxCauldronIngredients: 4,
    startTime: 150,
    tolerance: 8,
    lives: 3,
    scorePerBrew: 200,
    timeBonus: 10,
    reactionCount: 2,
  },
  hard: {
    label: 'Hard',
    shelfSize: 8,
    maxCauldronIngredients: 5,
    startTime: 150,
    tolerance: 5,
    lives: 3,
    scorePerBrew: 300,
    timeBonus: 5,
    reactionCount: 3,
  },
};

/** Level 1 always plays with the Medium rules. */
export const DEFAULT_DIFFICULTY: Difficulty = 'medium';

/** US 1.3: a brew bonus adds time only up to this limit (seconds). */
export const TIME_BONUS_CAP = 150;

/** US 1.4: below this many seconds the timer turns red. */
export const LOW_TIME_THRESHOLD = 15;

/** US 3.4: Pour Out costs this many seconds. */
export const POUR_OUT_PENALTY = 10;

export const STOCK_MIN = 2;
export const STOCK_MAX = 15;
