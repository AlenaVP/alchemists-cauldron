import { LOW_TIME_THRESHOLD } from '../data/difficulty';
import { formatTime, secondsToMs } from '../logic/timer';
import { getSettings } from '../state/game-state';
import type { IGameState } from '../types/game';
import { el, setStyleVar, setText, type IComponent } from './dom';
import { createIcon } from './icons';

export function createHud(): IComponent {
  const score = el('b', { className: 'hud__value' });
  const time = el('b', { className: 'hud__value' });
  const timeBar = el('span', { className: 'hud__time-bar' });
  const hearts = el('span', { className: 'hud__hearts' });
  const livesLabel = el('span', { className: 'visually-hidden' });

  const timer = el('div', { className: 'hud__pill hud__timer', attrs: { role: 'timer' } }, [
    createIcon('clock'),
    el('span', { className: 'hud__label', text: 'Time' }),
    time,
  ]);

  const element = el('header', { className: 'hud' }, [
    el('div', { className: 'hud__pill hud__score' }, [
      createIcon('star'),
      el('span', { className: 'hud__label', text: 'Score' }),
      score,
    ]),
    el('div', { className: 'hud__center' }, [
      el('div', { className: 'hud__timer-row' }, [timer]),
      el('span', { className: 'hud__time-track', attrs: { 'aria-hidden': 'true' } }, [timeBar]),
    ]),
    el('div', { className: 'hud__pill hud__lives' }, [
      el('span', { className: 'hud__label', text: 'Lives' }),
      hearts,
      livesLabel,
    ]),
  ]);

  let renderedLives = '';

  function update(state: IGameState): void {
    const settings = getSettings(state);
    const isRunning = state.status !== 'menu';

    setText(score, String(state.score));
    setText(time, formatTime(state.timeLeft));

    const share = isRunning ? state.timeLeft / secondsToMs(settings.startTime) : 0;
    setStyleVar(timeBar, '--share', String(Math.min(1, share)));
    const isLow =
      (state.status === 'playing' || state.status === 'paused') && state.timeLeft < secondsToMs(LOW_TIME_THRESHOLD);
    element.classList.toggle('hud--low-time', isLow);

    // Start screen: no life icons yet. During play: lost lives are dimmed.
    const livesKey = isRunning ? `${String(state.lives)}/${String(settings.lives)}` : '';
    if (livesKey !== renderedLives) {
      renderedLives = livesKey;
      const total = isRunning ? settings.lives : 0;
      hearts.replaceChildren(
        ...Array.from({ length: total }, (_, index) =>
          createIcon('heart', index < state.lives ? 'hud__heart' : 'hud__heart hud__heart--lost'),
        ),
      );
      setText(livesLabel, isRunning ? `${String(state.lives)} of ${String(total)}` : 'none');
    }
  }

  return { element, update };
}
