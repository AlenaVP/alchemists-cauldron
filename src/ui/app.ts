import { getState, subscribe } from '../state/store';
import type { IGameState } from '../types/game';
import { createCauldron } from './cauldron';
import { createControls } from './controls';
import { el, type IComponent } from './dom';
import { createShelf } from './shelf';

/** Builds the page once and re-renders every component on each state change. */
export function mountApp(root: HTMLElement): void {
  const shelf = createShelf();
  const cauldron = createCauldron();
  const controls = createControls();

  const title = el('h1', { className: 'title', text: "Alchemist's Cauldron" });
  const board = el('main', { className: 'board' }, [shelf.element, cauldron.element]);
  root.append(title, board, controls.element);

  const components: IComponent[] = [shelf, cauldron, controls];
  const render = (state: IGameState): void => {
    components.forEach((component) => {
      component.update(state);
    });
  };

  subscribe(render);
  render(getState());
}
