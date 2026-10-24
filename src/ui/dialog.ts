import { el } from './dom';

export interface IDialog {
  element: HTMLDialogElement;
  body: HTMLElement;
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
}

interface IDialogOptions {
  id: string;
  title: string;
  /** Closable dialogs get a × button and close on Esc. Game state dialogs are not closable. */
  closable: boolean;
  className?: string;
}

/** Custom in-app dialog on top of the native <dialog> element (no alert / confirm). */
export function createDialog(options: IDialogOptions): IDialog {
  const titleId = `${options.id}-title`;
  const body = el('div', { className: 'dialog__body' });
  const header = el('header', { className: 'dialog__header' }, [
    el('h2', { className: 'dialog__title', text: options.title, attrs: { id: titleId } }),
  ]);
  const element = el(
    'dialog',
    {
      className: `dialog ${options.className ?? ''}`.trim(),
      attrs: { 'aria-labelledby': titleId },
    },
    [el('div', { className: 'dialog__frame' }, [header, body])],
  );

  if (options.closable) {
    const closeButton = el('button', {
      className: 'dialog__close',
      text: '×',
      attrs: { type: 'button', 'aria-label': 'Close' },
    });
    closeButton.addEventListener('click', () => {
      element.close();
    });
    header.append(closeButton);
  } else {
    element.addEventListener('cancel', (event) => {
      event.preventDefault();
    });
  }

  document.body.append(element);

  return {
    element,
    body,
    open: () => {
      if (!element.open) element.showModal();
    },
    close: () => {
      if (element.open) element.close();
    },
    isOpen: () => element.open,
  };
}
