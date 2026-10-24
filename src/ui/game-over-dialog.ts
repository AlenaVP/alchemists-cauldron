import { exitToMenu, startNewGame } from '../state/game-controller';
import type { GameOverReason, IGameState } from '../types/game';
import { createDialog } from './dialog';
import { closeAllDialogs, registerDialog } from './dialog-manager';
import { el, setText } from './dom';

const REASONS: Record<GameOverReason, string> = {
  time: 'Time is up',
  lives: 'No lives left',
  ingredients: 'Out of ingredients',
};

export function createGameOverDialog(): void {
  const dialog = createDialog({
    id: 'game-over',
    title: 'Game Over',
    closable: false,
    className: 'dialog--game-over',
  });
  const reason = el('p', { className: 'dialog__reason' });
  const score = el('p', { className: 'dialog__score' });

  const playAgain = el('button', {
    className: 'button button--primary',
    text: 'Play again',
    attrs: { type: 'button' },
  });
  playAgain.addEventListener('click', () => {
    closeAllDialogs();
    startNewGame();
  });
  const menu = el('button', {
    className: 'button',
    text: 'Exit to Menu',
    attrs: { type: 'button' },
  });
  menu.addEventListener('click', () => {
    closeAllDialogs();
    exitToMenu();
  });

  dialog.body.append(
    reason,
    el('p', { className: 'dialog__label', text: 'Final score' }),
    score,
    el('div', { className: 'dialog__actions' }, [playAgain, menu]),
  );

  registerDialog('game-over', {
    dialog,
    update: (state: IGameState) => {
      setText(reason, state.gameOverReason ? REASONS[state.gameOverReason] : '');
      setText(score, String(state.score));
    },
  });
}
