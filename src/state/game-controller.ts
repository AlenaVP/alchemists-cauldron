import { getTimeLeft } from '../logic/timer';
import type { Difficulty } from '../types/game';
import { addIngredient, brew, createMenuState, createNewGame, pauseGame, resumeGame, setTimeLeft } from './game-state';
import { getState, setState } from './store';

/*
 * Connects the pure rules with the browser: the timer loop and page visibility.
 * The UI calls only these actions and never changes the state directly.
 */

/** Timestamp when the time runs out. Exists only while the game is running. */
let endTime: number | null = null;
let frameId: number | null = null;

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
  setState(createNewGame(difficulty ?? getState().difficulty));
  startTimer();
}

export function addToCauldron(id: string): void {
  setState(addIngredient(getState(), id));
}

export function brewPotion(): void {
  setState(brew(getState()));
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
  setState(pauseGame(getState()));
}

export function resume(): void {
  if (getState().status !== 'paused') {
    return;
  }
  setState(resumeGame(getState()));
  startTimer();
}

export function exitToMenu(): void {
  stopTimer();
  setState(createMenuState(getState().difficulty));
}

/** US 1.5: pause automatically when the tab becomes hidden. */
export function initAutoPause(): void {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      pause();
    }
  });
}
