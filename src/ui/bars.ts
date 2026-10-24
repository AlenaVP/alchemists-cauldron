import { isInRange } from '../logic/brew-check';
import { formatValue } from '../logic/format';
import { getCauldronValues, getSettings } from '../state/game-state';
import type { IGameState, IRecipeRange, ParameterKey } from '../types/game';
import { el, setStyleVar, setText, type IComponent } from './dom';
import { createIcon, type UiIconName } from './icons';

interface IGaugeConfig {
  key: ParameterKey;
  label: string;
  icon: UiIconName;
  modifier: string;
  /** Visible part of the scale. Bars with negative values have 0 in the center. */
  scale: IRecipeRange;
}

const GAUGES: readonly IGaugeConfig[] = [
  {
    key: 'temperature',
    label: 'Temperature',
    icon: 'thermometer',
    modifier: 'temp',
    scale: { min: -100, max: 100 },
  },
  {
    key: 'density',
    label: 'Density',
    icon: 'density',
    modifier: 'density',
    scale: { min: -80, max: 80 },
  },
  {
    key: 'magicPower',
    label: 'Magic Power',
    icon: 'magic',
    modifier: 'magic',
    scale: { min: 0, max: 100 },
  },
];

/** Position of a value on the scale in percent, clamped to the visible part. */
function toPercent(value: number, scale: IRecipeRange): number {
  const percent = ((value - scale.min) / (scale.max - scale.min)) * 100;
  return Math.min(100, Math.max(0, percent));
}

const pct = (value: number): string => `${value.toFixed(2)}%`;

function createGauge(config: IGaugeConfig): {
  element: HTMLElement;
  update: (state: IGameState) => void;
} {
  const { scale } = config;
  const current = el('b', { className: 'gauge__value' });
  const target = el('span', { className: 'gauge__target' });
  const track = el(
    'div',
    {
      className: 'gauge__track',
      attrs: {
        role: 'meter',
        'aria-label': config.label,
        'aria-valuemin': String(scale.min),
        'aria-valuemax': String(scale.max),
      },
    },
    [
      el('span', { className: 'gauge__tolerance' }),
      el('span', { className: 'gauge__zone' }),
      scale.min < 0 ? el('span', { className: 'gauge__zero' }) : null,
      el('span', { className: 'gauge__fill' }),
      el('span', { className: 'gauge__marker' }),
    ],
  );
  setStyleVar(track, '--zero', pct(toPercent(0, scale)));

  const element = el('div', { className: `gauge gauge--${config.modifier}` }, [
    el('div', { className: 'gauge__head' }, [
      el('span', { className: 'gauge__label' }, [createIcon(config.icon), config.label]),
      el('span', { className: 'gauge__current' }, ['Current: ', current]),
    ]),
    track,
    el('div', { className: 'gauge__scale' }, [
      el('span', { text: formatValue(scale.min) }),
      target,
      el('span', { text: formatValue(scale.max) }),
    ]),
  ]);

  function update(state: IGameState): void {
    const value = getCauldronValues(state)[config.key];
    const valuePercent = toPercent(value, scale);
    const zeroPercent = toPercent(0, scale);
    const range = state.activeRecipe?.[config.key] ?? null;

    setText(current, formatValue(value));
    track.setAttribute('aria-valuenow', String(Math.round(value)));
    setStyleVar(track, '--marker', pct(valuePercent));
    setStyleVar(track, '--fill-from', pct(Math.min(zeroPercent, valuePercent)));
    setStyleVar(track, '--fill-to', pct(Math.max(zeroPercent, valuePercent)));

    element.classList.toggle('gauge--no-target', range === null);
    element.classList.toggle('gauge--in-range', range !== null && isInRange(value, range));
    if (range === null) {
      setText(target, 'Target —');
      return;
    }
    const { tolerance } = getSettings(state);
    setText(target, `Target ${formatValue(range.min)}..${formatValue(range.max)}`);
    setStyleVar(track, '--zone-from', pct(toPercent(range.min, scale)));
    setStyleVar(track, '--zone-to', pct(toPercent(range.max, scale)));
    setStyleVar(track, '--tol-from', pct(toPercent(range.min - tolerance, scale)));
    setStyleVar(track, '--tol-to', pct(toPercent(range.max + tolerance, scale)));
  }

  return { element, update };
}

export function createBars(): IComponent {
  const gauges = GAUGES.map(createGauge);
  const element = el(
    'section',
    { className: 'panel gauges', attrs: { 'aria-label': 'Cauldron parameters' } },
    gauges.map((gauge) => gauge.element),
  );

  return {
    element,
    update: (state) => {
      gauges.forEach((gauge) => {
        gauge.update(state);
      });
    },
  };
}
