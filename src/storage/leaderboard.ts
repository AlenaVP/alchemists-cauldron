import { addEntry, parseEntries } from '../logic/leaderboard-rules';
import type { ILeaderboardEntry } from '../types/game';
import { readJson, removeKey, writeJson } from './safe-storage';

const LEADERBOARD_KEY = 'alchemists-cauldron:leaderboard';

export function loadLeaderboard(): ILeaderboardEntry[] {
  return parseEntries(readJson(LEADERBOARD_KEY));
}

export function saveResult(entry: ILeaderboardEntry): ILeaderboardEntry[] {
  const entries = addEntry(loadLeaderboard(), entry);
  writeJson(LEADERBOARD_KEY, entries);
  return entries;
}

export function clearLeaderboard(): void {
  removeKey(LEADERBOARD_KEY);
}
