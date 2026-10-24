import { qualifiesForLeaderboard } from '../logic/leaderboard-rules';
import { getNameError, NAME_MAX_LENGTH, normalizeName } from '../logic/player-name';
import { exitToMenu, startNewGame } from '../state/game-controller';
import { loadLeaderboard, saveResult } from '../storage/leaderboard';
import type { GameOverReason, IGameState } from '../types/game';
import { createDialog } from './dialog';
import { closeAllDialogs, registerDialog } from './dialog-manager';
import { el, setText } from './dom';
import { showLeaderboard } from './leaderboard-dialog';

const REASONS: Record<GameOverReason, string> = {
  time: 'Time is up',
  lives: 'No lives left',
  ingredients: 'Out of ingredients',
};

export function createGameOverDialog(): void {
  const dialog = createDialog({
    id: 'game-over',
    title: 'Game Over',
    closable: false,
    className: 'dialog--game-over',
  });
  const reason = el('p', { className: 'dialog__reason' });
  const score = el('p', { className: 'dialog__score' });

  const input = el('input', {
    className: 'input',
    attrs: {
      id: 'player-name',
      name: 'player-name',
      maxlength: String(NAME_MAX_LENGTH),
      autocomplete: 'nickname',
    },
  });
  const error = el('p', { className: 'form__error', attrs: { 'aria-live': 'polite' } });
  const form = el('form', { className: 'form', attrs: { novalidate: '' } }, [
    el('label', {
      className: 'form__label',
      text: 'New record! Enter your name (2–15 characters)',
      attrs: { for: 'player-name' },
    }),
    input,
    error,
    el('button', {
      className: 'button button--primary',
      text: 'Save score',
      attrs: { type: 'submit' },
    }),
  ]);

  let currentState: IGameState | null = null;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = getNameError(input.value);
    setText(error, message ?? '');
    input.setAttribute('aria-invalid', String(message !== null));
    if (message !== null || !currentState) return;
    const date = Date.now();
    saveResult({
      name: normalizeName(input.value),
      score: currentState.score,
      date,
      difficulty: currentState.difficulty,
    });
    form.hidden = true;
    showLeaderboard(currentState.difficulty, date);
  });

  const leaderboard = el('button', {
    className: 'button',
    text: 'Leaderboard',
    attrs: { type: 'button' },
  });
  leaderboard.addEventListener('click', () => {
    if (currentState) showLeaderboard(currentState.difficulty);
  });

  const playAgain = el('button', {
    className: 'button button--primary',
    text: 'Play again',
    attrs: { type: 'button' },
  });
  playAgain.addEventListener('click', () => {
    closeAllDialogs();
    startNewGame();
  });
  const menu = el('button', {
    className: 'button',
    text: 'Exit to Menu',
    attrs: { type: 'button' },
  });
  menu.addEventListener('click', () => {
    closeAllDialogs();
    exitToMenu();
  });

  dialog.body.append(
    reason,
    el('p', { className: 'dialog__label', text: 'Final score' }),
    score,
    form,
    el('div', { className: 'dialog__actions' }, [playAgain, leaderboard, menu]),
  );

  registerDialog('game-over', {
    dialog,
    update: (state: IGameState) => {
      // A new game over (not a return from the leaderboard): reset the form
      if (state !== currentState) {
        currentState = state;
        form.hidden = !qualifiesForLeaderboard(loadLeaderboard(state.difficulty), state.score);
        input.value = '';
        setText(error, '');
      }
      setText(reason, state.gameOverReason ? REASONS[state.gameOverReason] : '');
      setText(score, String(state.score));
    },
  });
}
