import { describe, expect, it } from 'vitest';
import { createStock, getShelfIngredients, isShelfEmpty, takeFromStock } from './stock';

describe('getShelfIngredients', () => {
  it('takes the first ingredients in catalogue order', () => {
    const shelf = getShelfIngredients(6);
    expect(shelf).toHaveLength(6);
    expect(shelf[0]?.name).toBe('Dragon Tears');
    expect(shelf[5]?.name).toBe('Essence of the Void');
  });
});

describe('createStock', () => {
  it('gives every ingredient a stock from 2 to 15', () => {
    const shelf = getShelfIngredients(6);
    expect(Object.values(createStock(shelf, () => 0))).toEqual([2, 2, 2, 2, 2, 2]);
    expect(Object.values(createStock(shelf, () => 0.9999))).toEqual([15, 15, 15, 15, 15, 15]);
  });
});

describe('takeFromStock', () => {
  it('reduces the stock by 1 without mutating the original', () => {
    const stock = { a: 2 };
    expect(takeFromStock(stock, 'a')).toEqual({ a: 1 });
    expect(stock).toEqual({ a: 2 });
  });

  it('never goes below 0', () => {
    expect(takeFromStock({ a: 0 }, 'a')).toEqual({ a: 0 });
  });
});

describe('isShelfEmpty', () => {
  it('is true only when every stock is 0', () => {
    expect(isShelfEmpty({ a: 0, b: 0 })).toBe(true);
    expect(isShelfEmpty({ a: 0, b: 1 })).toBe(false);
  });
});
