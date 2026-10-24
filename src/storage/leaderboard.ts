import { addEntry, parseEntries } from '../logic/leaderboard-rules';
import type { Difficulty, ILeaderboardEntry } from '../types/game';
import { readJson, removeKey, writeJson } from './safe-storage';

/** US 2.1: one Top-10 list per difficulty. */
const getKey = (difficulty: Difficulty): string => `alchemists-cauldron:leaderboard:${difficulty}`;

export function loadLeaderboard(difficulty: Difficulty): ILeaderboardEntry[] {
  return parseEntries(readJson(getKey(difficulty))).filter((entry) => entry.difficulty === difficulty);
}

export function saveResult(entry: ILeaderboardEntry): ILeaderboardEntry[] {
  const entries = addEntry(loadLeaderboard(entry.difficulty), entry);
  writeJson(getKey(entry.difficulty), entries);
  return entries;
}

export function clearLeaderboard(difficulty: Difficulty): void {
  removeKey(getKey(difficulty));
}
