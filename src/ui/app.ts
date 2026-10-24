import { getState, subscribe } from '../state/store';
import type { IGameState } from '../types/game';
import { createBars } from './bars';
import { createCauldron } from './cauldron';
import { createControls } from './controls';
import { syncDialogs } from './dialog-manager';
import { el, type IComponent } from './dom';
import { createGameOverDialog } from './game-over-dialog';
import { createHud } from './hud';
import { createLeaderboardDialog } from './leaderboard-dialog';
import { createPauseDialog } from './pause-dialog';
import { createRecipePanel } from './recipe-panel';
import { createShelf } from './shelf';

/** Builds the page once and re-renders every component on each state change. */
export function mountApp(root: HTMLElement): void {
  const hud = createHud();
  const shelf = createShelf();
  const cauldron = createCauldron();
  const recipe = createRecipePanel();
  const bars = createBars();
  const controls = createControls();

  const title = el('h1', { className: 'title', text: "Alchemist's Cauldron" });
  const board = el('main', { className: 'board' }, [shelf.element, cauldron.element, recipe.element, bars.element]);
  root.append(hud.element, title, board, controls.element);

  createPauseDialog();
  createGameOverDialog();
  createLeaderboardDialog();

  const components: IComponent[] = [hud, shelf, cauldron, recipe, bars, controls];
  const render = (state: IGameState): void => {
    components.forEach((component) => {
      component.update(state);
    });
    root.classList.toggle('is-paused', state.status === 'paused');
    syncDialogs(state);
  };

  subscribe(render);
  render(getState());
}
