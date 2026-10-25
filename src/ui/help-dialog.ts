import { getReactions } from '../logic/reactions';
import { getSettings } from '../state/game-state';
import type { IGameState } from '../types/game';
import { createDialog } from './dialog';
import { closeDialog, registerDialog } from './dialog-manager';
import { el, setText } from './dom';

/** Rules use the numbers of the current difficulty, so they always match the game. */
function getRules(state: IGameState): string[] {
  const settings = getSettings(state);
  return [
    'Read the recipe: it has a name and 3 target ranges — Temperature, Density and Magic Power.',
    `Click ingredients on the shelf. Each one adds its 3 numbers to the cauldron (some are negative). The cauldron holds up to ${String(settings.maxCauldronIngredients)} ingredients.`,
    'Watch the bars: the green zone is the target, the gold marker is the current value.',
    `Press Brew. Every value may miss its range by up to ±${String(settings.tolerance)}. A correct potion gives +${String(settings.scorePerBrew)} points and +${String(settings.timeBonus)} s, a wrong one costs 1 life.`,
    'Stock is limited and brewed ingredients are spent. The game ends when the time, the lives or the ingredients run out.',
  ];
}

export function createHelpDialog(): void {
  const dialog = createDialog({
    id: 'help',
    title: 'How to Play',
    closable: true,
    className: 'dialog--wide',
  });
  const list = el('ol', { className: 'rules' });
  const reactionsTitle = el('h3', { className: 'dialog__label' });
  const reactions = el('ul', { className: 'reactions' });
  const done = el('button', {
    className: 'button button--primary',
    text: 'Got it',
    attrs: { type: 'button' },
  });
  done.addEventListener('click', () => {
    closeDialog();
  });

  dialog.body.append(
    list,
    reactionsTitle,
    reactions,
    el('p', {
      className: 'dialog__text',
      text: 'Pause any time with the pause button next to the timer.',
    }),
    done,
  );

  registerDialog('help', {
    dialog,
    update: (state) => {
      list.replaceChildren(...getRules(state).map((rule) => el('li', { className: 'rules__item', text: rule })));
      const active = getReactions(state.difficulty);
      const label = getSettings(state).label;
      setText(reactionsTitle, active.length ? `Reactions on ${label}` : `No reactions on ${label}`);
      reactions.replaceChildren(
        ...active.map((reaction) =>
          el('li', { className: 'reactions__item' }, [el('b', { text: reaction.name }), ` — ${reaction.description}`]),
        ),
      );
    },
  });
}
