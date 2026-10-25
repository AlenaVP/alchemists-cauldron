import { describe, expect, it } from 'vitest';
import { addIngredient, createNewGame } from '../state/game-state';
import { parseSavedGame, toSavedGame } from './save-rules';

const game = addIngredient(
  createNewGame('hard', () => 0.5),
  'dragon-tears',
);
const saved = (): Record<string, unknown> => JSON.parse(JSON.stringify(toSavedGame(game))) as Record<string, unknown>;

describe('save round trip', () => {
  it('restores the same game, opened as paused', () => {
    const restored = parseSavedGame(saved());
    expect(restored).toEqual({ ...game, status: 'paused', lastBrew: null });
  });

  it('does not save a finished game or the menu', () => {
    expect(toSavedGame({ ...game, status: 'game-over' })).toBeNull();
    expect(toSavedGame({ ...game, status: 'menu' })).toBeNull();
  });
});

describe('parseSavedGame never crashes on broken data', () => {
  it.each([
    ['null', null],
    ['a string', 'oops'],
    ['an array', []],
    ['an empty object', {}],
  ])('rejects %s', (_, data) => {
    expect(parseSavedGame(data)).toBeNull();
  });

  it.each([
    ['unknown difficulty', { difficulty: 'insane' }],
    ['finished status', { status: 'game-over' }],
    ['negative time', { timeLeft: -5 }],
    ['too many lives', { lives: 9 }],
    ['unknown recipe', { activeRecipe: { id: 'love-potion' } }],
    ['recipe of another difficulty', { activeRecipe: { id: 'moon-mist' } }],
    ['unknown ingredient', { cauldronIngredients: [{ id: 'unicorn-hair' }] }],
    ['stock out of range', { shelfStock: { ...game.shelfStock, 'dragon-tears': 99 } }],
    ['missing stock entry', { shelfStock: { 'dragon-tears': 3 } }],
  ])('rejects %s', (_, patch) => {
    expect(parseSavedGame({ ...saved(), ...patch })).toBeNull();
  });
});
