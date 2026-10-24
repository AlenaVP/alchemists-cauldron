export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 15;

/** Letters (any alphabet), digits, space, "_" and "-". */
const ALLOWED = /^[\p{L}\p{N} _-]+$/u;

/** Trims the edges and collapses repeated spaces. */
export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

/** Returns an error message, or null when the name is valid. */
export function getNameError(rawName: string): string | null {
  const name = normalizeName(rawName);
  if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    return `Use ${String(NAME_MIN_LENGTH)}–${String(NAME_MAX_LENGTH)} characters.`;
  }
  if (!ALLOWED.test(name)) {
    return 'Use only letters, digits, space, "_" and "-".';
  }
  return null;
}

export function isValidPlayerName(name: string): boolean {
  return getNameError(name) === null;
}
