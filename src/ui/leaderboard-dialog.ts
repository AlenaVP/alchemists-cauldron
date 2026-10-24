import { formatDate } from '../logic/format';
import { clearLeaderboard, loadLeaderboard } from '../storage/leaderboard';
import type { ILeaderboardEntry } from '../types/game';
import { createDialog } from './dialog';
import { closeDialog, openDialog, registerDialog } from './dialog-manager';
import { el } from './dom';

/** Date of the result to highlight after saving a name. */
let highlightDate: number | null = null;

export function showLeaderboard(highlight: number | null = null): void {
  highlightDate = highlight;
  openDialog('leaderboard');
}

function createRow(entry: ILeaderboardEntry, index: number): HTMLTableRowElement {
  const row = el('tr', {}, [
    el('td', { className: 'leaderboard__rank', text: String(index + 1) }),
    el('td', { className: 'leaderboard__name', text: entry.name }),
    el('td', { className: 'leaderboard__score', text: String(entry.score) }),
    el('td', { className: 'leaderboard__date', text: formatDate(entry.date) }),
  ]);
  row.classList.toggle('leaderboard__row--new', entry.date === highlightDate);
  return row;
}

function createConfirmDialog(): void {
  const dialog = createDialog({ id: 'confirm-clear', title: 'Clear Leaderboard?', closable: true });
  const confirm = el('button', {
    className: 'button button--danger',
    text: 'Clear',
    attrs: { type: 'button' },
  });
  confirm.addEventListener('click', () => {
    clearLeaderboard();
    closeDialog();
  });
  const cancel = el('button', { className: 'button', text: 'Cancel', attrs: { type: 'button' } });
  cancel.addEventListener('click', () => {
    closeDialog();
  });
  dialog.body.append(
    el('p', {
      className: 'dialog__text',
      text: 'All saved results will be deleted. This cannot be undone.',
    }),
    el('div', { className: 'dialog__actions' }, [cancel, confirm]),
  );
  registerDialog('confirm-clear', { dialog });
}

export function createLeaderboardDialog(): void {
  const dialog = createDialog({
    id: 'leaderboard',
    title: 'Top Alchemists',
    closable: true,
    className: 'dialog--wide',
  });
  const rows = el('tbody');
  const empty = el('p', { className: 'dialog__text', text: 'No results yet. Brew some potions!' });
  const table = el('div', { className: 'leaderboard__scroll' }, [
    el('table', { className: 'leaderboard' }, [
      el('thead', {}, [
        el('tr', {}, [
          el('th', { text: 'Rank', attrs: { scope: 'col' } }),
          el('th', { text: 'Name', attrs: { scope: 'col' } }),
          el('th', { text: 'Score', attrs: { scope: 'col' } }),
          el('th', { text: 'Date', attrs: { scope: 'col' } }),
        ]),
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

  dialog.body.append(table, empty, el('div', { className: 'dialog__actions' }, [clear, back]));

  registerDialog('leaderboard', {
    dialog,
    update: () => {
      const entries = loadLeaderboard();
      rows.replaceChildren(...entries.map(createRow));
      table.hidden = entries.length === 0;
      empty.hidden = entries.length > 0;
      clear.disabled = entries.length === 0;
    },
  });
  createConfirmDialog();
}
