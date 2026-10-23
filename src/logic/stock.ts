import { INGREDIENTS } from '../data/ingredients';
import { STOCK_MAX, STOCK_MIN } from '../data/difficulty';
import type { IIngredient } from '../types/game';
import { randomInt, type RandomFn } from './random';

/** The first `shelfSize` ingredients of the ordered catalogue. */
export function getShelfIngredients(shelfSize: number): readonly IIngredient[] {
  return INGREDIENTS.slice(0, shelfSize);
}

/** Every ingredient gets its own random stock from 2 to 15. */
export function createStock(ingredients: readonly IIngredient[], random: RandomFn = Math.random): Record<string, number> {
  const stock: Record<string, number> = {};
  for (const ingredient of ingredients) {
    stock[ingredient.id] = randomInt(STOCK_MIN, STOCK_MAX, random);
  }
  return stock;
}

export function getStock(stock: Record<string, number>, id: string): number {
  return stock[id] ?? 0;
}

/** Returns a new stock object with one portion taken. */
export function takeFromStock(stock: Record<string, number>, id: string): Record<string, number> {
  return { ...stock, [id]: Math.max(0, getStock(stock, id) - 1) };
}

export function isShelfEmpty(stock: Record<string, number>): boolean {
  return Object.values(stock).every((portions) => portions <= 0);
}
