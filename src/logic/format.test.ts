import { describe, expect, it } from 'vitest';
import { formatDate, formatSigned, formatValue } from './format';

describe('formatSigned', () => {
  it('adds + to positives and − to negatives', () => {
    expect(formatSigned(25)).toBe('+25');
    expect(formatSigned(-18)).toBe('\u221218');
    expect(formatSigned(0)).toBe('0');
  });
});

describe('formatValue', () => {
  it('rounds and keeps the minus sign', () => {
    expect(formatValue(37.4)).toBe('37');
    expect(formatValue(-6)).toBe('\u22126');
  });
});

describe('formatDate', () => {
  it('uses DD.MM.YYYY HH:MM', () => {
    expect(formatDate(new Date(2026, 9, 3, 9, 5).getTime())).toBe('03.10.2026 09:05');
  });
});
