import { getTimeLeft } from '../logic/timer';
import { clearSave, loadGame, saveGame } from '../storage/save';
import type { Difficulty, IGameState } from '../types/game';
import { addIngredient, brew, createMenuState, createNewGame, pauseGame, resumeGame, setTimeLeft } from './game-state';
import { getState, setState } from './store';

/*
 * Connects the pure rules with the browser: the timer loop and page visibility.
 * The UI calls only these actions and never changes the state directly.
 */

/** Timestamp when the time runs out. Exists only while the game is running. */
let endTime: number | null = null;
let frameId: number | null = null;

/** US 2.2: every action that matters goes through here, so it is saved at once. */
function commit(next: IGameState): void {
  setState(next);
  saveGame(next);
}

function stopTimer(): void {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
  }
  frameId = null;
  endTime = null;
}

function tick(): void {
  if (endTime === null) {
    return;
  }
  setState(setTimeLeft(getState(), getTimeLeft(endTime, Date.now())));
  if (getState().status === 'playing') {
    frameId = requestAnimationFrame(tick);
  } else {
    stopTimer();
    clearSave();
  }
}

function startTimer(): void {
  stopTimer();
  endTime = Date.now() + getState().timeLeft;
  frameId = requestAnimationFrame(tick);
}

/** The time left changed outside the timer (bonus, penalty): move the end timestamp. */
function syncEndTime(): void {
  if (endTime !== null) {
    endTime = Date.now() + getState().timeLeft;
  }
}

export function startNewGame(difficulty?: Difficulty): void {
  commit(createNewGame(difficulty ?? getState().difficulty));
  startTimer();
}

export function addToCauldron(id: string): void {
  commit(addIngredient(getState(), id));
  // A reaction can take time or end the game
  if (getState().status === 'playing') {
    syncEndTime();
  } else {
    stopTimer();
  }
}

export function brewPotion(): void {
  commit(brew(getState()));
  if (getState().status === 'playing') {
    syncEndTime();
  } else {
    stopTimer();
  }
}

export function pause(): void {
  if (getState().status !== 'playing') {
    return;
  }
  stopTimer();
  commit(pauseGame(getState()));
}

export function resume(): void {
  if (getState().status !== 'paused') {
    return;
  }
  commit(resumeGame(getState()));
  startTimer();
}

/** US 2.1: the difficulty can be changed only on the start screen. */
export function selectDifficulty(difficulty: Difficulty): void {
  if (getState().status === 'menu') {
    setState(createMenuState(difficulty));
  }
}

export function exitToMenu(): void {
  stopTimer();
  clearSave();
  setState(createMenuState(getState().difficulty));
}

export function hasSavedGame(): boolean {
  return loadGame() !== null;
}

/** US 2.2: restore the saved game in paused state; the saved stock is not re-rolled. */
export function continueGame(): boolean {
  const saved = loadGame();
  if (!saved) return false;
  stopTimer();
  setState(saved);
  return true;
}

/** US 1.5: pause automatically when the tab becomes hidden. */
export function initAutoPause(): void {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      pause();
    }
  });
  window.addEventListener('pagehide', () => {
    if (endTime !== null) {
      setState(setTimeLeft(getState(), getTimeLeft(endTime, Date.now())));
    }
    const { status } = getState();
    if (status === 'playing' || status === 'paused') {
      saveGame(getState());
    }
  });
}
