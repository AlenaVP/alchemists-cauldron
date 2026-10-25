import { getSettings, isCauldronFull } from '../state/game-state';
import { addToCauldron } from '../state/game-controller';
import { formatSigned } from '../logic/format';
import { getShelfIngredients, getStock } from '../logic/stock';
import type { IGameState, IIngredient } from '../types/game';
import { el, setText, type IComponent } from './dom';
import { createIcon } from './icons';

export const DRAG_TYPE = 'text/plain';

interface ICard {
  button: HTMLButtonElement;
  stock: HTMLElement;
  ingredient: IIngredient;
}

/** Level 3: the numbers live in a tooltip, the card shows only icon, name and stock. */
function createTooltip(ingredient: IIngredient): HTMLElement {
  const row = (label: string, value: number, modifier: string): HTMLElement =>
    el('span', { className: `tooltip__row tooltip__row--${modifier}` }, [
      el('span', { text: label }),
      el('b', { text: formatSigned(value) }),
    ]);
  return el('span', { className: 'tooltip', attrs: { id: `tooltip-${ingredient.id}`, role: 'tooltip' } }, [
    el('span', { className: 'tooltip__title', text: ingredient.name }),
    row('Temperature', ingredient.temperature, 'temp'),
    row('Density', ingredient.density, 'density'),
    row('Magic Power', ingredient.magicPower, 'magic'),
  ]);
}

const TOOLTIP_WIDTH = 230;
const TOOLTIP_HEIGHT = 150;

/** Opens the tooltip to the left / upward near the screen edges (US 3.2). */
function placeTooltip(button: HTMLElement): void {
  const rect = button.getBoundingClientRect();
  const roomRight = window.innerWidth - rect.right;
  const fitsSide = roomRight >= TOOLTIP_WIDTH || rect.left >= TOOLTIP_WIDTH;
  button.classList.toggle('ingredient--tip-below', !fitsSide);
  button.classList.toggle('ingredient--tip-left', fitsSide && roomRight < TOOLTIP_WIDTH);
  button.classList.toggle('ingredient--tip-up', window.innerHeight - rect.top < TOOLTIP_HEIGHT + rect.height);
}

function createCard(ingredient: IIngredient, index: number): { slot: HTMLLIElement; card: ICard } {
  const stock = el('span', { className: 'ingredient__stock' });
  const button = el('button', { className: 'ingredient', attrs: { type: 'button', 'data-id': ingredient.id } }, [
    createIcon(ingredient.icon, 'ingredient__icon'),
    el('span', { className: 'ingredient__name', text: ingredient.name }),
    stock,
    el('kbd', {
      className: 'kbd ingredient__key',
      text: String(index + 1),
      attrs: { 'aria-hidden': 'true' },
    }),
    createTooltip(ingredient),
  ]);
  button.setAttribute('aria-describedby', `tooltip-${ingredient.id}`);
  button.addEventListener('click', () => {
    addToCauldron(ingredient.id);
  });
  button.addEventListener('mouseenter', () => {
    placeTooltip(button);
  });
  button.addEventListener('focus', () => {
    placeTooltip(button);
  });
  button.addEventListener('dragstart', (event) => {
    event.dataTransfer?.setData(DRAG_TYPE, ingredient.id);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy';
  });
  return {
    slot: el('li', { className: 'shelf__slot' }, [button]),
    card: { button, stock, ingredient },
  };
}

export function createShelf(): IComponent {
  const grid = el('ul', { className: 'shelf__grid' });
  const element = el('section', { className: 'panel shelf', attrs: { 'aria-labelledby': 'shelf-title' } }, [
    el('header', { className: 'panel__header' }, [
      el('h2', {
        className: 'panel__title',
        text: 'Ingredients shelf',
        attrs: { id: 'shelf-title' },
      }),
      el('p', { className: 'panel__hint', text: 'Tap to add' }),
    ]),
    grid,
  ]);

  const cards: ICard[] = [];
  let builtFor = '';

  function build(state: IGameState): void {
    const { shelfSize } = getSettings(state);
    cards.length = 0;
    if (state.status === 'menu') {
      const placeholders = Array.from({ length: shelfSize }, () =>
        el('li', {
          className: 'shelf__slot shelf__slot--placeholder',
          attrs: { 'aria-hidden': 'true' },
        }),
      );
      grid.replaceChildren(...placeholders);
      return;
    }
    const slots = getShelfIngredients(shelfSize).map((ingredient, index) => {
      const { slot, card } = createCard(ingredient, index);
      cards.push(card);
      return slot;
    });
    grid.replaceChildren(...slots);
  }

  function update(state: IGameState): void {
    const key = `${String(state.status === 'menu')}-${state.difficulty}`;
    if (key !== builtFor) {
      build(state);
      builtFor = key;
    }
    const isFull = state.status !== 'menu' && isCauldronFull(state);
    element.classList.toggle('shelf--blocked', isFull);

    cards.forEach(({ button, stock, ingredient }) => {
      const portions = getStock(state.shelfStock, ingredient.id);
      const isEmpty = portions <= 0;
      button.disabled = state.status !== 'playing' || isFull || isEmpty;
      button.draggable = !button.disabled;
      button.classList.toggle('ingredient--empty', isEmpty);
      setText(stock, String(portions));
      button.setAttribute('aria-label', `${ingredient.name}, ${String(portions)} left`);
    });
  }

  return { element, update };
}
