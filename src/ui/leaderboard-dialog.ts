import { DIFFICULTY_SETTINGS } from '../data/difficulty';
import { formatDate } from '../logic/format';
import { clearLeaderboard, loadLeaderboard } from '../storage/leaderboard';
import type { Difficulty, ILeaderboardEntry } from '../types/game';
import { createDialog } from './dialog';
import { closeDialog, openDialog, registerDialog } from './dialog-manager';
import { el, setText } from './dom';

const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];

/** The list that is shown, and the result to highlight after saving a name. */
let shownDifficulty: Difficulty = 'medium';
let highlightDate: number | null = null;

export function showLeaderboard(difficulty: Difficulty, highlight: number | null = null): void {
  shownDifficulty = difficulty;
  highlightDate = highlight;
  openDialog('leaderboard');
}

function createRow(entry: ILeaderboardEntry, index: number): HTMLTableRowElement {
  const row = el('tr', {}, [
    el('td', { className: 'leaderboard__rank', text: String(index + 1) }),
    el('td', { className: 'leaderboard__name', text: entry.name }),
    el('td', { className: 'leaderboard__score', text: String(entry.score) }),
    el('td', {
      className: 'leaderboard__difficulty',
      text: DIFFICULTY_SETTINGS[entry.difficulty].label,
    }),
    el('td', { className: 'leaderboard__date', text: formatDate(entry.date) }),
  ]);
  row.classList.toggle('leaderboard__row--new', entry.date === highlightDate);
  return row;
}

function createConfirmDialog(): void {
  const dialog = createDialog({ id: 'confirm-clear', title: 'Clear Leaderboard?', closable: true });
  const text = el('p', { className: 'dialog__text' });
  const confirm = el('button', {
    className: 'button button--danger',
    text: 'Clear',
    attrs: { type: 'button' },
  });
  confirm.addEventListener('click', () => {
    clearLeaderboard(shownDifficulty);
    closeDialog();
  });
  const cancel = el('button', { className: 'button', text: 'Cancel', attrs: { type: 'button' } });
  cancel.addEventListener('click', () => {
    closeDialog();
  });
  dialog.body.append(text, el('div', { className: 'dialog__actions' }, [cancel, confirm]));
  registerDialog('confirm-clear', {
    dialog,
    update: () => {
      const label = DIFFICULTY_SETTINGS[shownDifficulty].label;
      setText(text, `All ${label} results will be deleted. This cannot be undone.`);
    },
  });
}

export function createLeaderboardDialog(): void {
  const dialog = createDialog({
    id: 'leaderboard',
    title: 'Top Alchemists',
    closable: true,
    className: 'dialog--wide',
  });

  const tabs = DIFFICULTIES.map((difficulty) => {
    const tab = el('button', {
      className: 'leaderboard__tab',
      text: DIFFICULTY_SETTINGS[difficulty].label,
      attrs: { type: 'button', 'aria-pressed': 'false', 'data-difficulty': difficulty },
    });
    tab.addEventListener('click', () => {
      shownDifficulty = difficulty;
      render();
    });
    return tab;
  });

  const rows = el('tbody');
  const empty = el('p', { className: 'dialog__text', text: 'No results yet. Brew some potions!' });
  const table = el('div', { className: 'leaderboard__scroll' }, [
    el('table', { className: 'leaderboard' }, [
      el('thead', {}, [
        el(
          'tr',
          {},
          ['Rank', 'Name', 'Score', 'Difficulty', 'Date'].map((title) => el('th', { text: title, attrs: { scope: 'col' } })),
        ),
      ]),
      rows,
    ]),
  ]);

  const clear = el('button', {
    className: 'button button--danger',
    text: 'Clear Leaderboard',
    attrs: { type: 'button' },
  });
  clear.addEventListener('click', () => {
    openDialog('confirm-clear');
  });
  const back = el('button', { className: 'button', text: 'Back', attrs: { type: 'button' } });
  back.addEventListener('click', () => {
    closeDialog();
  });

  dialog.body.append(
    el('div', { className: 'leaderboard__tabs', attrs: { role: 'group', 'aria-label': 'Difficulty' } }, tabs),
    table,
    empty,
    el('div', { className: 'dialog__actions' }, [clear, back]),
  );

  function render(): void {
    tabs.forEach((tab) => {
      tab.setAttribute('aria-pressed', String(tab.dataset.difficulty === shownDifficulty));
    });
    const entries = loadLeaderboard(shownDifficulty);
    rows.replaceChildren(...entries.map(createRow));
    table.hidden = entries.length === 0;
    empty.hidden = entries.length > 0;
    clear.disabled = entries.length === 0;
  }

  registerDialog('leaderboard', { dialog, update: render });
  createConfirmDialog();
}
