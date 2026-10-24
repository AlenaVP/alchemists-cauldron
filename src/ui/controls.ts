import { brewPotion, startNewGame } from '../state/game-controller';
import { canBrew } from '../state/game-state';
import type { IGameState } from '../types/game';
import { el, setText, type IComponent } from './dom';

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

  const element = el('footer', { className: 'controls' }, [mainButton]);

  function update(state: IGameState): void {
    mode = state.status === 'menu' || state.status === 'game-over' ? 'start' : 'brew';
    setText(mainLabel, mode === 'start' ? 'Start Game' : 'Brew');
    mainButton.classList.toggle('main-action--start', mode === 'start');
    mainButton.disabled = mode === 'brew' && !canBrew(state);
  }

  return { element, update };
}
