import { DEFAULT_DIFFICULTY, DIFFICULTY_SETTINGS, TIME_BONUS_CAP } from '../data/difficulty';
import { findIngredient } from '../data/ingredients';
import { checkBrew } from '../logic/brew-check';
import { calculateCauldron } from '../logic/calculate-cauldron';
import type { RandomFn } from '../logic/random';
import { pickRecipe } from '../logic/recipe-generator';
import { createStock, getShelfIngredients, getStock, isShelfEmpty, takeFromStock } from '../logic/stock';
import { applyTimeBonus, secondsToMs } from '../logic/timer';
import type { CauldronValues, Difficulty, GameOverReason, IDifficultySettings, IGameState } from '../types/game';

/*
 * Pure state transitions: every function takes a state and returns a new one.
 * No DOM, no timers, no storage here, so all rules can be unit tested.
 */

export function getSettings(state: IGameState): IDifficultySettings {
  return DIFFICULTY_SETTINGS[state.difficulty];
}

/** Start screen: empty shelf and cauldron, score and time 0, no lives. */
export function createMenuState(difficulty: Difficulty = DEFAULT_DIFFICULTY): IGameState {
  return {
    status: 'menu',
    difficulty,
    score: 0,
    timeLeft: 0,
    lives: 0,
    activeRecipe: null,
    cauldronIngredients: [],
    shelfStock: {},
    lastBrew: null,
    gameOverReason: null,
  };
}

export function createNewGame(difficulty: Difficulty = DEFAULT_DIFFICULTY, random: RandomFn = Math.random): IGameState {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  return {
    ...createMenuState(difficulty),
    status: 'playing',
    timeLeft: secondsToMs(settings.startTime),
    lives: settings.lives,
    activeRecipe: pickRecipe(difficulty, random),
    shelfStock: createStock(getShelfIngredients(settings.shelfSize), random),
  };
}

/** Current Temperature / Density / Magic Power of the cauldron. */
export function getCauldronValues(state: IGameState): CauldronValues {
  return calculateCauldron(state.cauldronIngredients);
}

export function isCauldronFull(state: IGameState): boolean {
  return state.cauldronIngredients.length >= getSettings(state).maxCauldronIngredients;
}

export function canAddIngredient(state: IGameState, id: string): boolean {
  return state.status === 'playing' && !isCauldronFull(state) && getStock(state.shelfStock, id) > 0;
}

export function addIngredient(state: IGameState, id: string): IGameState {
  const ingredient = findIngredient(id);
  if (!ingredient || !canAddIngredient(state, id)) {
    return state;
  }
  return {
    ...state,
    cauldronIngredients: [...state.cauldronIngredients, ingredient],
    shelfStock: takeFromStock(state.shelfStock, id),
    lastBrew: null,
  };
}

export function canBrew(state: IGameState): boolean {
  return state.status === 'playing' && state.cauldronIngredients.length > 0;
}

export function endGame(state: IGameState, reason: GameOverReason): IGameState {
  return { ...state, status: 'game-over', gameOverReason: reason };
}

/** Ends the game when lives or ingredients run out; otherwise returns the same state. */
export function checkGameOver(state: IGameState): IGameState {
  if (state.status !== 'playing') {
    return state;
  }
  if (state.lives <= 0) {
    return endGame(state, 'lives');
  }
  if (state.timeLeft <= 0) {
    return endGame(state, 'time');
  }
  if (state.cauldronIngredients.length === 0 && isShelfEmpty(state.shelfStock)) {
    return endGame(state, 'ingredients');
  }
  return state;
}

export function brew(state: IGameState, random: RandomFn = Math.random): IGameState {
  if (!canBrew(state) || !state.activeRecipe) {
    return state;
  }
  const settings = getSettings(state);
  const values = getCauldronValues(state);
  const isSuccess = checkBrew(values, state.activeRecipe, settings.tolerance);

  const next: IGameState = isSuccess
    ? {
        ...state,
        score: state.score + settings.scorePerBrew,
        timeLeft: applyTimeBonus(state.timeLeft, settings.timeBonus, TIME_BONUS_CAP),
        activeRecipe: pickRecipe(state.difficulty, random),
        cauldronIngredients: [],
        lastBrew: 'success',
      }
    : {
        ...state,
        lives: state.lives - 1,
        cauldronIngredients: [],
        lastBrew: 'failure',
      };

  return checkGameOver(next);
}

export function setTimeLeft(state: IGameState, timeLeft: number): IGameState {
  if (state.status !== 'playing') {
    return state;
  }
  return checkGameOver({ ...state, timeLeft: Math.max(0, timeLeft) });
}

export function pauseGame(state: IGameState): IGameState {
  return state.status === 'playing' ? { ...state, status: 'paused' } : state;
}

export function resumeGame(state: IGameState): IGameState {
  return state.status === 'paused' ? { ...state, status: 'playing' } : state;
}
