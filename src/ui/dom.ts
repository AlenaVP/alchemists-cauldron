import type { IGameState } from '../types/game';

type Child = Node | string | null | false;

interface IElementOptions {
  className?: string;
  text?: string;
  attrs?: Record<string, string>;
}

/** Small helper to create an element with a class, text, attributes and children. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: IElementOptions = {},
  children: Child[] = [],
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (options.className) element.className = options.className;
  if (options.text !== undefined) element.textContent = options.text;
  Object.entries(options.attrs ?? {}).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
  children.forEach((child) => {
    if (child !== null && child !== false) element.append(child);
  });
  return element;
}

/** Writes text only when it changed, so frequent renders stay cheap. */
export function setText(element: Element, text: string): void {
  if (element.textContent !== text) {
    element.textContent = text;
  }
}

export function setStyleVar(element: HTMLElement, name: string, value: string): void {
  if (element.style.getPropertyValue(name) !== value) {
    element.style.setProperty(name, value);
  }
}

/** Every UI part creates its element once and then updates it from the state. */
export interface IComponent {
  element: HTMLElement;
  update: (state: IGameState) => void;
}

/**
 * Restarts a CSS animation class. The class is removed when the named CSS
 * animation ends (it may run on a child or a pseudo-element).
 * Timing lives in CSS: no setTimeout or setInterval for visual effects.
 */
export function playAnimation(element: HTMLElement, className: string, animationName: string): void {
  element.classList.remove(className);
  element.getBoundingClientRect();
  element.classList.add(className);
  const onEnd = (event: AnimationEvent): void => {
    if (event.animationName !== animationName) return;
    element.classList.remove(className);
    element.removeEventListener('animationend', onEnd);
  };
  element.addEventListener('animationend', onEnd);
}
