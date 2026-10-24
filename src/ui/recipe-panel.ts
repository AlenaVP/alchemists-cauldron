import { formatValue } from '../logic/format';
import { getSettings, isCauldronFull } from '../state/game-state';
import type { IGameState, IRecipeRange, ParameterKey } from '../types/game';
import { el, setText, type IComponent } from './dom';
import { createIcon, type UiIconName } from './icons';

const ROWS: readonly { key: ParameterKey; label: string; icon: UiIconName; modifier: string }[] = [
  { key: 'temperature', label: 'Temperature', icon: 'thermometer', modifier: 'temp' },
  { key: 'density', label: 'Density', icon: 'density', modifier: 'density' },
  { key: 'magicPower', label: 'Magic Power', icon: 'magic', modifier: 'magic' },
];

const formatRange = (range: IRecipeRange): string => `${formatValue(range.min)} .. ${formatValue(range.max)}`;

export function createRecipePanel(): IComponent {
  const name = el('h2', { className: 'recipe__name' });
  const counter = el('p', { className: 'recipe__counter' });
  const dots = el('span', { className: 'recipe__dots', attrs: { 'aria-hidden': 'true' } });
  const ranges = new Map<ParameterKey, HTMLElement>();

  const rows = ROWS.map(({ key, label, icon, modifier }) => {
    const value = el('dd', { className: 'recipe__range' });
    ranges.set(key, value);
    return el('div', { className: `recipe__row recipe__row--${modifier}` }, [
      el('dt', {}, [createIcon(icon), label]),
      value,
    ]);
  });

  const element = el('aside', { className: 'recipe', attrs: { 'aria-label': 'Current recipe' } }, [
    el('p', { className: 'recipe__eyebrow', text: 'Current recipe' }),
    name,
    createIcon('flask', 'recipe__flask'),
    el('div', { className: 'recipe__counter-box' }, [counter, dots]),
    el('dl', { className: 'recipe__targets' }, rows),
  ]);

  let renderedDots = '';

  function update(state: IGameState): void {
    const recipe = state.activeRecipe;
    const max = getSettings(state).maxCauldronIngredients;
    const added = state.cauldronIngredients.length;

    setText(name, recipe ? recipe.name : 'No recipe yet');
    setText(counter, `Ingredients: ${String(added)} / ${String(max)}`);
    element.classList.toggle('recipe--full', state.status !== 'menu' && isCauldronFull(state));

    const dotsKey = `${String(added)}/${String(max)}`;
    if (dotsKey !== renderedDots) {
      renderedDots = dotsKey;
      dots.replaceChildren(
        ...Array.from({ length: max }, (_, index) =>
          el('span', {
            className: index < added ? 'recipe__dot recipe__dot--filled' : 'recipe__dot',
          }),
        ),
      );
    }

    ranges.forEach((value, key) => {
      setText(value, recipe ? formatRange(recipe[key]) : '— .. —');
    });
  }

  return { element, update };
}
