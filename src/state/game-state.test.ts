import { describe, expect, it } from 'vitest';
import { findRecipe } from '../data/recipes';
import type { IGameState } from '../types/game';
import { addIngredient, brew, createMenuState, createNewGame, pauseGame, resumeGame, setTimeLeft } from './game-state';

const firstOf = (): number => 0;

function playing(overrides: Partial<IGameState> = {}): IGameState {
  return { ...createNewGame('medium', firstOf), ...overrides };
}

describe('createMenuState', () => {
  it('shows an empty start screen', () => {
    const state = createMenuState();
    expect(state).toMatchObject({ status: 'menu', score: 0, timeLeft: 0, lives: 0 });
    expect(state.shelfStock).toEqual({});
  });
});

describe('createNewGame (Medium)', () => {
  it('uses the Medium rules: 150 s, 3 lives, 6 ingredients', () => {
    const state = createNewGame('medium', firstOf);
    expect(state.status).toBe('playing');
    expect(state.timeLeft).toBe(150_000);
    expect(state.lives).toBe(3);
    expect(Object.keys(state.shelfStock)).toHaveLength(6);
    expect(state.activeRecipe?.difficulty).toBe('medium');
  });
});

describe('addIngredient', () => {
  it('keeps the order and reduces the stock', () => {
    let state = playing({ shelfStock: { 'dragon-tears': 2, 'fairy-dust': 2 } });
    state = addIngredient(state, 'fairy-dust');
    state = addIngredient(state, 'dragon-tears');
    expect(state.cauldronIngredients.map((item) => item.id)).toEqual(['fairy-dust', 'dragon-tears']);
    expect(state.shelfStock).toEqual({ 'dragon-tears': 1, 'fairy-dust': 1 });
  });

  it('ignores an ingredient with 0 stock', () => {
    const state = playing({ shelfStock: { 'dragon-tears': 0 } });
    expect(addIngredient(state, 'dragon-tears')).toBe(state);
  });

  it('ignores adds when the cauldron is full (4 in Medium)', () => {
    let state = playing({ shelfStock: { 'dragon-tears': 10 } });
    for (let i = 0; i < 5; i += 1) {
      state = addIngredient(state, 'dragon-tears');
    }
    expect(state.cauldronIngredients).toHaveLength(4);
    expect(state.shelfStock['dragon-tears']).toBe(6);
  });

  it('ignores adds while paused', () => {
    const state = pauseGame(playing({ shelfStock: { 'dragon-tears': 2 } }));
    expect(addIngredient(state, 'dragon-tears')).toBe(state);
  });
});

describe('brew', () => {
  const moonMist = findRecipe('moon-mist') ?? null;

  it('on success adds score and time, clears the cauldron and keeps lives', () => {
    let state = playing({
      activeRecipe: moonMist,
      timeLeft: 100_000,
      shelfStock: { 'dragon-tears': 1, 'fairy-dust': 1, 'frost-lotus': 1 },
    });
    state = addIngredient(state, 'dragon-tears');
    state = addIngredient(state, 'fairy-dust');
    state = brew(state, firstOf);
    expect(state).toMatchObject({ score: 200, timeLeft: 110_000, lives: 3, lastBrew: 'success' });
    expect(state.cauldronIngredients).toEqual([]);
    expect(state.shelfStock).toEqual({ 'dragon-tears': 0, 'fairy-dust': 0, 'frost-lotus': 1 });
  });

  it('on failure takes a life and spends the ingredients', () => {
    let state = playing({ activeRecipe: moonMist, shelfStock: { 'frost-lotus': 2 } });
    state = addIngredient(state, 'frost-lotus');
    state = brew(state);
    expect(state).toMatchObject({ lives: 2, score: 0, lastBrew: 'failure' });
    expect(state.shelfStock).toEqual({ 'frost-lotus': 1 });
  });

  it('ends the game when the last life is lost', () => {
    let state = playing({ activeRecipe: moonMist, lives: 1, shelfStock: { 'frost-lotus': 2 } });
    state = brew(addIngredient(state, 'frost-lotus'));
    expect(state).toMatchObject({ status: 'game-over', gameOverReason: 'lives' });
  });

  it('ends the game when shelf and cauldron are both empty', () => {
    let state = playing({ activeRecipe: moonMist, shelfStock: { 'frost-lotus': 1 } });
    state = brew(addIngredient(state, 'frost-lotus'));
    expect(state).toMatchObject({ status: 'game-over', gameOverReason: 'ingredients' });
  });

  it('does nothing with an empty cauldron', () => {
    const state = playing();
    expect(brew(state)).toBe(state);
  });
});

describe('time and pause', () => {
  it('ends the game at 00:00', () => {
    expect(setTimeLeft(playing(), 0)).toMatchObject({
      status: 'game-over',
      gameOverReason: 'time',
    });
  });

  it('pauses and resumes the same game', () => {
    const state = playing();
    const paused = pauseGame(state);
    expect(paused.status).toBe('paused');
    expect(resumeGame(paused)).toEqual(state);
  });
});
