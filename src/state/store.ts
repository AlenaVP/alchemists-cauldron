import type { IGameState } from '../types/game';
import { createMenuState } from './game-state';

type Listener = (state: IGameState) => void;

/** One object with all current game data, plus subscribers that re-render on change. */
let currentState: IGameState = createMenuState();
const listeners = new Set<Listener>();

export function getState(): IGameState {
  return currentState;
}

export function setState(next: IGameState): void {
  if (next === currentState) {
    return;
  }
  currentState = next;
  listeners.forEach((listener) => {
    listener(currentState);
  });
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
