import './styles/main.scss';
import { initAutoPause } from './state/game-controller';
import { mountApp } from './ui/app';
import { initKeyboardShortcuts } from './ui/keyboard';

const root = document.querySelector<HTMLDivElement>('#app');

if (root) {
  mountApp(root);
  initAutoPause();
  initKeyboardShortcuts();
}
