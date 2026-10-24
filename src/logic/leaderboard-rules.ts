import type { Difficulty, ILeaderboardEntry } from '../types/game';
import { isValidPlayerName } from './player-name';

export const LEADERBOARD_SIZE = 10;

const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];

/** Higher score first. Equal scores: the earlier result stays higher. */
export function sortEntries(entries: readonly ILeaderboardEntry[]): ILeaderboardEntry[] {
  return [...entries].sort((a, b) => b.score - a.score || a.date - b.date);
}

export function qualifiesForLeaderboard(entries: readonly ILeaderboardEntry[], score: number): boolean {
  if (score <= 0) return false;
  if (entries.length < LEADERBOARD_SIZE) return true;
  const last = sortEntries(entries).at(-1);
  // A new result with the same score as the 10th place would rank below it
  return last === undefined || score > last.score;
}

export function addEntry(entries: readonly ILeaderboardEntry[], entry: ILeaderboardEntry): ILeaderboardEntry[] {
  return sortEntries([...entries, entry]).slice(0, LEADERBOARD_SIZE);
}

const isRecord = (data: unknown): data is Record<string, unknown> => typeof data === 'object' && data !== null;

/** Validates one entry loaded from localStorage. */
export function isValidEntry(data: unknown): data is ILeaderboardEntry {
  if (!isRecord(data)) return false;
  const { name, score, date, difficulty } = data;
  return (
    typeof name === 'string' &&
    isValidPlayerName(name) &&
    typeof score === 'number' &&
    Number.isInteger(score) &&
    score > 0 &&
    typeof date === 'number' &&
    Number.isFinite(date) &&
    typeof difficulty === 'string' &&
    DIFFICULTIES.some((item) => item === difficulty)
  );
}

/** Keeps only valid entries, so broken data never reaches the UI. */
export function parseEntries(data: unknown): ILeaderboardEntry[] {
  if (!Array.isArray(data)) return [];
  return sortEntries(data.filter(isValidEntry)).slice(0, LEADERBOARD_SIZE);
}
