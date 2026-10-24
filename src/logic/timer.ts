const MS_IN_SECOND = 1000;

export function secondsToMs(seconds: number): number {
  return seconds * MS_IN_SECOND;
}

/** Remaining time from timestamps, never below 0. */
export function getTimeLeft(endTime: number, now: number): number {
  return Math.max(0, endTime - now);
}

/** 61 500 ms -> "01:02". Partial seconds round up, so 00:00 means the time is really over. */
export function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / MS_IN_SECOND);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Adds the brew bonus, but never above the cap (US 1.3: up to 120 s).
 * A success must never take time away, so when the time is already above
 * the cap it stays as it is.
 */
export function applyTimeBonus(timeLeft: number, bonusSeconds: number, capSeconds: number): number {
  const withBonus = Math.min(timeLeft + secondsToMs(bonusSeconds), secondsToMs(capSeconds));
  return Math.max(timeLeft, withBonus);
}
