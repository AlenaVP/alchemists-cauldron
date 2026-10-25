import { REACTIONS } from '../data/reactions';
import type { IGameState } from '../types/game';
import { el, playAnimation, setText, type IComponent } from './dom';
import { createIcon } from './icons';

/* Static, trusted SVG markup of the cauldron itself. */
const CAULDRON_SVG = `
<svg class="cauldron__svg" viewBox="0 0 200 170" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="cauldron-liquid" cx="50%" cy="40%" r="60%">
      <stop offset="0" stop-color="#9dffd2"/><stop offset=".5" stop-color="#00d474"/><stop offset="1" stop-color="#046b3c"/>
    </radialGradient>
    <linearGradient id="cauldron-pot" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#1d2b24"/><stop offset="1" stop-color="#070d0a"/>
    </linearGradient>
  </defs>
  <path d="M60 138l-12 26h16l9-20zM140 138l12 26h-16l-9-20z" fill="#0d1813" stroke="#2b4134"/>
  <circle cx="30" cy="62" r="13" fill="none" stroke="#c9a85a" stroke-width="6"/>
  <circle cx="170" cy="62" r="13" fill="none" stroke="#c9a85a" stroke-width="6"/>
  <path d="M27 52Q29 152 100 154Q171 152 173 52Z" fill="url(#cauldron-pot)" stroke="#2b4134" stroke-width="2"/>
  <ellipse cx="100" cy="50" rx="75" ry="17" fill="#0d1813" stroke="#e6c875" stroke-width="5"/>
  <ellipse class="cauldron__liquid" cx="100" cy="51" rx="64" ry="11" fill="url(#cauldron-liquid)"/>
  <g class="cauldron__rune" fill="none" stroke-width="3">
    <circle cx="100" cy="102" r="22"/><path d="M100 86l16 26H84z"/><circle cx="100" cy="104" r="4"/>
  </g>
</svg>`;

function getStatusMessage(state: IGameState): string {
  switch (state.status) {
    case 'menu':
      return 'Press Start Game to light the fire';
    case 'paused':
      return 'Paused';
    case 'game-over':
      return 'The fire is out';
    case 'playing':
      break;
  }
  const reaction = REACTIONS.find((item) => item.id === state.lastReactionId);
  if (reaction) {
    // "Fairy Dust + Caustic Acid: Magic Power +50%" -> "Bubbling! Magic Power +50%"
    const effect = reaction.description.split(': ').at(-1) ?? '';
    return `Reaction — ${reaction.name}! ${effect}`;
  }
  if (state.lastBrew === 'success') return 'Potion brewed! A new recipe has arrived';
  if (state.lastBrew === 'failure') return 'Wrong mixture! You lost a life';
  if (state.cauldronIngredients.length === 0) return 'Add ingredients from the shelf';
  return 'Simmering…';
}

export function createCauldron(): IComponent {
  const visual = el('div', { className: 'cauldron__visual' });
  visual.innerHTML = CAULDRON_SVG;
  visual.append(
    ...Array.from({ length: 4 }, (_, index) => el('span', { className: `bubble bubble--${String(index + 1)}` })),
  );
  const status = el('p', { className: 'cauldron__status', attrs: { 'aria-live': 'polite' } });
  const contents = el('ol', {
    className: 'cauldron__contents',
    attrs: { 'aria-label': 'Cauldron contents' },
  });
  const element = el('section', { className: 'panel cauldron', attrs: { 'aria-label': 'Cauldron' } }, [
    visual,
    status,
    contents,
  ]);

  let renderedContents = '';
  let renderedEvent = 0;

  function update(state: IGameState): void {
    const isActive = state.status !== 'menu';
    element.classList.toggle('cauldron--cold', !isActive);
    element.classList.toggle('cauldron--success', state.lastBrew === 'success');
    element.classList.toggle('cauldron--failure', state.lastBrew === 'failure');
    setText(status, getStatusMessage(state));

    if (state.eventId !== renderedEvent) {
      renderedEvent = state.eventId;
      if (state.lastReactionId) playAnimation(element, 'fx-reaction');
    }

    const contentsKey = state.cauldronIngredients.map((ingredient) => ingredient.id).join(',');
    if (contentsKey !== renderedContents) {
      renderedContents = contentsKey;
      contents.replaceChildren(
        ...state.cauldronIngredients.map((ingredient) =>
          el('li', { className: 'cauldron__item' }, [
            createIcon(ingredient.icon, 'cauldron__item-icon'),
            el('span', { text: ingredient.name }),
          ]),
        ),
      );
    }
  }

  return { element, update };
}
