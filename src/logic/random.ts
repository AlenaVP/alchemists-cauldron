/** A function that returns a number in [0, 1), like Math.random. Injected for tests. */
export type RandomFn = () => number;

export function randomInt(min: number, max: number, random: RandomFn = Math.random): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

export function pickRandom<T>(items: readonly T[], random: RandomFn = Math.random): T {
  const item = items[randomInt(0, items.length - 1, random)];
  if (item === undefined) {
    throw new Error('pickRandom: the list is empty');
  }
  return item;
}
