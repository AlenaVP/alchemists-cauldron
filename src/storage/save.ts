import { parseSavedGame, toSavedGame } from '../logic/save-rules';
import type { IGameState } from '../types/game';
import { readJson, removeKey, writeJson } from './safe-storage';

const SAVE_KEY = 'alchemists-cauldron:save';

/** Saves an unfinished game; anything else removes the save. */
export function saveGame(state: IGameState): void {
  const saved = toSavedGame(state);
  if (saved) {
    writeJson(SAVE_KEY, saved);
  } else {
    clearSave();
  }
}

/** Returns a valid unfinished game or null. A broken save is deleted. */
export function loadGame(): IGameState | null {
  const data = readJson(SAVE_KEY);
  if (data === null) return null;
  const state = parseSavedGame(data);
  if (!state) clearSave();
  return state;
}

export function clearSave(): void {
  removeKey(SAVE_KEY);
}
