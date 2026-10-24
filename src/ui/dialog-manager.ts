import { getState } from '../state/store';
import type { IGameState } from '../types/game';
import type { IDialog } from './dialog';

export type DialogName = 'pause' | 'game-over' | 'help' | 'menu' | 'leaderboard' | 'confirm-clear';

interface IDialogView {
  dialog: IDialog;
  update?: (state: IGameState) => void;
}

/*
 * Only one dialog is visible at a time.
 * - "pause" and "game-over" follow the game status.
 * - The other dialogs are opened by the player and form a stack, so "Back"
 *   returns to the previous one (for example leaderboard -> game over).
 */
const views = new Map<DialogName, IDialogView>();
const stack: DialogName[] = [];

function getStatusDialog(state: IGameState): DialogName | null {
  if (state.status === 'paused') return 'pause';
  if (state.status === 'game-over') return 'game-over';
  return null;
}

export function syncDialogs(state: IGameState): void {
  const target = stack.at(-1) ?? getStatusDialog(state);
  views.forEach((view, name) => {
    if (name === target) {
      view.update?.(state);
      view.dialog.open();
    } else {
      view.dialog.close();
    }
  });
}

export function registerDialog(name: DialogName, view: IDialogView): void {
  views.set(name, view);
  // Closed by the player (× or Esc): go back to the previous dialog
  view.dialog.element.addEventListener('close', () => {
    if (stack.at(-1) === name) {
      stack.pop();
      syncDialogs(getState());
    }
  });
}

export function openDialog(name: DialogName): void {
  if (stack.at(-1) !== name) {
    stack.push(name);
  }
  syncDialogs(getState());
}

export function closeDialog(): void {
  stack.pop();
  syncDialogs(getState());
}

/** Starting or leaving a game closes everything the player opened. */
export function closeAllDialogs(): void {
  stack.length = 0;
  syncDialogs(getState());
}
