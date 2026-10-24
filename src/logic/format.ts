const MINUS = '\u2212';

/** 25 -> "+25", -18 -> "−18" (typographic minus), 0 -> "0". */
export function formatSigned(value: number): string {
  if (value > 0) return `+${value}`;
  if (value < 0) return `${MINUS}${Math.abs(value)}`;
  return '0';
}

/** Rounds to an integer and formats like formatSigned, but without "+" for positives. */
export function formatValue(value: number): string {
  const rounded = Math.round(value);
  return rounded < 0 ? `${MINUS}${Math.abs(rounded)}` : String(rounded);
}

const pad = (value: number): string => String(value).padStart(2, '0');

/** Timestamp -> "DD.MM.YYYY HH:MM" in local time. */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const day = `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
  return `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
