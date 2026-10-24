import type { IconName } from '../types/game';

export type UiIconName =
  'heart' | 'clock' | 'pause' | 'book' | 'gear' | 'star' | 'trophy' | 'thermometer' | 'density' | 'magic';

/* Static, trusted SVG markup only (no user data), 24 × 24 view box. */
const PATHS: Record<IconName | UiIconName, string> = {
  drop: '<path d="M12 2.7c-3.6 4.6-6.5 8.4-6.5 11.8a6.5 6.5 0 0 0 13 0c0-3.4-2.9-7.2-6.5-11.8z" fill="currentColor"/>',
  sparkle:
    '<path d="M11 2l2.1 6.4 6.4 2.1-6.4 2.1L11 19l-2.1-6.4-6.4-2.1 6.4-2.1z" fill="currentColor"/><path d="M19 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="currentColor"/>',
  snowflake:
    '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7"/><path d="M9 4l3 3 3-3M9 20l3-3 3 3"/></g>',
  leaf: '<path d="M5 20C4 11 10 4 20 4c0 10-6 16-15 16z" fill="currentColor"/><path d="M5 20l9-9" stroke="rgb(0 0 0 / 45%)" stroke-width="1.6" stroke-linecap="round"/>',
  flask:
    '<path d="M9 2.5h6M10 2.5v6.2L4.6 18.2A2.2 2.2 0 0 0 6.5 21.5h11a2.2 2.2 0 0 0 1.9-3.3L14 8.7V2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7.2 15h9.6l2 3.4a1 1 0 0 1-.9 1.6H6.1a1 1 0 0 1-.9-1.6z" fill="currentColor"/>',
  moon: '<path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1z" fill="currentColor"/>',
  flame:
    '<path d="M12 2.5c.8 3.6 5.8 5.6 5.8 11.3a5.8 5.8 0 0 1-11.6 0c0-2.8 1.5-4.6 2.8-5.6.1 1.9.9 3.1 2.1 3.4-.4-3.6.1-6.4.9-9.1z" fill="currentColor"/>',
  toad: '<path d="M3 16.5C3 11.8 7 8.5 12 8.5s9 3.3 9 8c0 2.8-4 4.5-9 4.5s-9-1.7-9-4.5z" fill="currentColor"/><circle cx="8" cy="8.5" r="2.6" fill="currentColor"/><circle cx="16" cy="8.5" r="2.6" fill="currentColor"/><circle cx="8" cy="8.3" r="1" fill="#050807"/><circle cx="16" cy="8.3" r="1" fill="#050807"/>',
  heart:
    '<path d="M12 21s-7.5-4.6-9.5-9.3C1 8.1 3.3 4.5 6.9 4.5c2 0 3.6 1.1 5.1 3 1.5-1.9 3.1-3 5.1-3 3.6 0 5.9 3.6 4.4 7.2C19.5 16.4 12 21 12 21z" fill="currentColor"/>',
  clock:
    '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  pause:
    '<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>',
  book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5zM4 19.5A1.5 1.5 0 0 0 5.5 21H19v-3M8 7h7M8 10.5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  gear: '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="6.3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  star: '<path d="M12 1.5l2.6 7.9 7.9 2.6-7.9 2.6L12 22.5l-2.6-7.9L1.5 12l7.9-2.6z" fill="currentColor"/>',
  trophy:
    '<path d="M7 3h10v5a5 5 0 0 1-10 0z" fill="currentColor"/><path d="M7 5H3.5v1.5A3.5 3.5 0 0 0 7 10M17 5h3.5v1.5A3.5 3.5 0 0 1 17 10M12 13v4M8 21h8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  thermometer:
    '<path d="M10 4a2 2 0 0 1 4 0v9.3a4 4 0 1 1-4 0z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="16.5" r="2" fill="currentColor"/>',
  density:
    '<path d="M12 3.2c-3.4 4.4-6 7.9-6 11.1a6 6 0 0 0 12 0c0-3.2-2.6-6.7-6-11.1z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  magic:
    '<path d="M12 3l2.4 5.6 6.1.6-4.6 4 1.4 6-5.3-3.2-5.3 3.2 1.4-6-4.6-4 6.1-.6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
};

export function createIcon(name: IconName | UiIconName, className = ''): HTMLSpanElement {
  const wrapper = document.createElement('span');
  wrapper.className = `icon icon--${name} ${className}`.trim();
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.innerHTML = `<svg viewBox="0 0 24 24" focusable="false">${PATHS[name]}</svg>`;
  return wrapper;
}
