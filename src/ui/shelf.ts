import { getSettings, isCauldronFull } from '../state/game-state';
import { addToCauldron } from '../state/game-controller';
import { formatSigned } from '../logic/format';
import { getShelfIngredients, getStock } from '../logic/stock';
import type { IGameState, IIngredient } from '../types/game';
import { el, setText, type IComponent } from './dom';
import { createIcon } from './icons';

interface ICard {
  button: HTMLButtonElement;
  stock: HTMLElement;
  ingredient: IIngredient;
}

function createStatChip(label: string, value: number, modifier: string): HTMLElement {
  return el('span', {
    className: `chip chip--${modifier}`,
    text: `${label} ${formatSigned(value)}`,
  });
}

function createCard(ingredient: IIngredient): { slot: HTMLLIElement; card: ICard } {
  const stock = el('span', { className: 'ingredient__stock' });
  const button = el('button', { className: 'ingredient', attrs: { type: 'button', 'data-id': ingredient.id } }, [
    createIcon(ingredient.icon, 'ingredient__icon'),
    el('span', { className: 'ingredient__name', text: ingredient.name }),
    el('span', { className: 'ingredient__stats' }, [
      createStatChip('T', ingredient.temperature, 'temp'),
      createStatChip('D', ingredient.density, 'density'),
      createStatChip('MP', ingredient.magicPower, 'magic'),
    ]),
    stock,
  ]);
  button.addEventListener('click', () => {
    addToCauldron(ingredient.id);
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
      // Start screen: the shelf is empty, only the slots are visible
      const placeholders = Array.from({ length: shelfSize }, () =>
        el('li', {
          className: 'shelf__slot shelf__slot--placeholder',
          attrs: { 'aria-hidden': 'true' },
        }),
      );
      grid.replaceChildren(...placeholders);
      return;
    }
    const slots = getShelfIngredients(shelfSize).map((ingredient) => {
      const { slot, card } = createCard(ingredient);
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
      button.classList.toggle('ingredient--empty', isEmpty);
      setText(stock, String(portions));
      button.setAttribute('aria-label', `${ingredient.name}, ${String(portions)} left`);
    });
  }

  return { element, update };
}
