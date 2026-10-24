import { startNewGame } from '../state/game-controller';
import { createDialog } from './dialog';
import { closeAllDialogs, registerDialog } from './dialog-manager';
import { el } from './dom';
import { showLeaderboard } from './leaderboard-dialog';

/** Settings / Menu panel: actions outside the run itself. */
export function createMenuDialog(): void {
  const dialog = createDialog({ id: 'menu', title: 'Menu', closable: true });

  const newGame = el('button', {
    className: 'button button--primary',
    text: 'New Game',
    attrs: { type: 'button' },
  });
  newGame.addEventListener('click', () => {
    closeAllDialogs();
    startNewGame();
  });
  const leaderboard = el('button', {
    className: 'button',
    text: 'Leaderboard',
    attrs: { type: 'button' },
  });
  leaderboard.addEventListener('click', () => {
    showLeaderboard();
  });

  dialog.body.append(el('div', { className: 'dialog__actions dialog__actions--column' }, [newGame, leaderboard]));
  registerDialog('menu', { dialog });
}
