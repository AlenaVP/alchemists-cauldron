import { getShelfIngredients } from '../logic/stock';
import { addToCauldron, brewPotion, pause, pourOutCauldron } from '../state/game-controller';
import { getSettings } from '../state/game-state';
import { getState } from '../state/store';

/** Small explicit key map. Enter and Space stay native on focused buttons. */
const ACTIONS: Readonly<Record<string, () => void>> = {
  b: brewPotion,
  o: pourOutCauldron,
  p: pause,
  escape: pause,
};

function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

/**
 * US 3.6: one keyboard handler, gated by the game state. Shortcuts work only
 * during an active run with no dialog open; on the start, pause and game over
 * screens the browser keeps its normal keyboard behaviour.
 */
export function initKeyboardShortcuts(): void {
  document.addEventListener('keydown', (event) => {
    const state = getState();
    if (state.status !== 'playing') return;
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (isTyping(event.target) || document.querySelector('dialog[open]')) return;

    const key = event.key.toLowerCase();
    const slot = Number.parseInt(key, 10);
    if (slot >= 1 && slot <= 9) {
      const ingredient = getShelfIngredients(getSettings(state).shelfSize)[slot - 1];
      if (ingredient) {
        event.preventDefault();
        addToCauldron(ingredient.id);
      }
      return;
    }

    const action = ACTIONS[key];
    if (action) {
      event.preventDefault();
      action();
    }
  });
}
