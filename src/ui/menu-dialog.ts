import { DIFFICULTY_SETTINGS } from '../data/difficulty';
import { selectDifficulty, startNewGame } from '../state/game-controller';
import type { Difficulty, IDifficultySettings, IGameState } from '../types/game';
import { createDialog } from './dialog';
import { closeAllDialogs, registerDialog } from './dialog-manager';
import { el } from './dom';
import { showLeaderboard } from './leaderboard-dialog';

const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];

/** Short button text built from the same settings object the game uses. */
function describe(settings: IDifficultySettings): string {
  return `${String(settings.shelfSize)} ingredients · ${String(settings.startTime)} s · ±${String(settings.tolerance)} · ${String(settings.lives)} lives`;
}

/** Settings / Menu panel: actions outside the run itself. */
export function createMenuDialog(): void {
  const dialog = createDialog({ id: 'menu', title: 'Settings', closable: true });

  const difficultyButtons = DIFFICULTIES.map((difficulty) => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const button = el(
      'button',
      {
        className: 'difficulty__option',
        attrs: { type: 'button', 'aria-pressed': 'false', 'data-difficulty': difficulty },
      },
      [
        el('span', { className: 'difficulty__name', text: settings.label }),
        el('span', { className: 'difficulty__details', text: describe(settings) }),
      ],
    );
    button.addEventListener('click', () => {
      selectDifficulty(difficulty);
    });
    return button;
  });

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

  dialog.body.append(
    el('fieldset', { className: 'difficulty' }, [
      el('legend', { className: 'dialog__label', text: 'Select difficulty' }),
      el('div', { className: 'difficulty__options' }, difficultyButtons),
    ]),
    el('div', { className: 'dialog__actions dialog__actions--column' }, [newGame, leaderboard]),
  );

  registerDialog('menu', {
    dialog,
    update: (state: IGameState) => {
      difficultyButtons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.difficulty === state.difficulty));
      });
    },
  });
}
