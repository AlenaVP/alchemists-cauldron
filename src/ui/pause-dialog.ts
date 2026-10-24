import { exitToMenu, resume } from '../state/game-controller';
import { createDialog } from './dialog';
import { closeAllDialogs, registerDialog } from './dialog-manager';
import { el } from './dom';

export function createPauseDialog(): void {
  const dialog = createDialog({ id: 'pause', title: 'Game Paused', closable: false });

  const resumeButton = el('button', {
    className: 'button button--primary',
    text: 'Resume',
    attrs: { type: 'button' },
  });
  resumeButton.addEventListener('click', () => {
    resume();
  });
  const exitButton = el('button', {
    className: 'button',
    text: 'Exit to Menu',
    attrs: { type: 'button' },
  });
  exitButton.addEventListener('click', () => {
    closeAllDialogs();
    exitToMenu();
  });

  dialog.body.append(
    el('p', {
      className: 'dialog__text',
      text: 'The timer is stopped. The cauldron will wait for you.',
    }),
    el('div', { className: 'dialog__actions dialog__actions--column' }, [resumeButton, exitButton]),
  );

  registerDialog('pause', { dialog });
}
