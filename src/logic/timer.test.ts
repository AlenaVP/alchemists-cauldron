import { describe, expect, it } from 'vitest';
import { applyTimeBonus, formatTime, getTimeLeft } from './timer';

describe('formatTime', () => {
  it('formats as MM:SS', () => {
    expect(formatTime(150_000)).toBe('02:30');
    expect(formatTime(0)).toBe('00:00');
  });

  it('rounds partial seconds up', () => {
    expect(formatTime(61_500)).toBe('01:02');
    expect(formatTime(1)).toBe('00:01');
  });
});

describe('getTimeLeft', () => {
  it('is calculated from timestamps and never negative', () => {
    expect(getTimeLeft(10_000, 4_000)).toBe(6_000);
    expect(getTimeLeft(10_000, 12_000)).toBe(0);
  });
});

describe('applyTimeBonus', () => {
  it('adds the bonus', () => {
    expect(applyTimeBonus(100_000, 10, 120)).toBe(110_000);
  });

  it('stops at the cap', () => {
    expect(applyTimeBonus(115_000, 10, 120)).toBe(120_000);
  });

  it('never takes time away above the cap', () => {
    expect(applyTimeBonus(145_000, 10, 120)).toBe(145_000);
  });
});
