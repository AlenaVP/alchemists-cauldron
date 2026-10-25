import { brewPotion, pause, pourOutCauldron, startNewGame } from '../state/game-controller';
import { canBrew } from '../state/game-state';
import type { IGameState } from '../types/game';
import { openDialog } from './dialog-manager';
import { el, setText, type IComponent } from './dom';
import { createIcon } from './icons';

function createRoundButton(icon: 'book' | 'gear', label: string, className: string): HTMLButtonElement {
  return el('button', { className: `round-button ${className}`, attrs: { type: 'button' } }, [
    createIcon(icon),
    el('span', { className: 'round-button__label', text: label }),
  ]);
}

export function createControls(): IComponent {
  const mainLabel = el('span', { className: 'main-action__label' });
  const mainButton = el('button', { className: 'main-action', attrs: { type: 'button' } }, [mainLabel]);
  let mode: 'start' | 'brew' = 'start';

  mainButton.addEventListener('click', () => {
    if (mode === 'start') {
      startNewGame();
    } else {
      brewPotion();
    }
  });

  const pourOut = el('button', {
    className: 'pour-out',
    text: 'Pour Out',
    attrs: { type: 'button', title: 'Clear the cauldron for 10 seconds' },
  });
  pourOut.addEventListener('click', () => {
    pourOutCauldron();
  });

  const help = createRoundButton('book', 'Help', 'controls__help');
  help.addEventListener('click', () => {
    pause();
    openDialog('help');
  });

  const menu = createRoundButton('gear', 'Settings', 'controls__menu');
  menu.addEventListener('click', () => {
    openDialog('menu');
  });

  const element = el('footer', { className: 'controls' }, [
    help,
    el('div', { className: 'controls__center' }, [mainButton, pourOut]),
    menu,
  ]);

  function update(state: IGameState): void {
    mode = state.status === 'menu' || state.status === 'game-over' ? 'start' : 'brew';
    setText(mainLabel, mode === 'start' ? 'Start Game' : 'Brew');
    mainButton.classList.toggle('main-action--start', mode === 'start');
    mainButton.disabled = mode === 'brew' && !canBrew(state);
    pourOut.hidden = mode !== 'brew';
    pourOut.disabled = !canBrew(state);
    // The menu (and later the difficulty) is not available during a run
    menu.disabled = state.status === 'playing' || state.status === 'paused';
  }

  return { element, update };
}
