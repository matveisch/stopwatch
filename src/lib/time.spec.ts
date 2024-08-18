import { formatTime } from './time';

describe('formatTime', () => {
  test('formats 0 milliseconds correctly', () => {
    expect(formatTime(0)).toBe('00:00.0');
  });

  test('formats milliseconds correctly', () => {
    expect(formatTime(100)).toBe('00:00.1');
    expect(formatTime(550)).toBe('00:00.5');
    expect(formatTime(999)).toBe('00:00.9');
  });

  test('formats seconds correctly', () => {
    expect(formatTime(1000)).toBe('00:01.0');
    expect(formatTime(10000)).toBe('00:10.0');
    expect(formatTime(59999)).toBe('00:59.9');
  });

  test('formats minutes correctly', () => {
    expect(formatTime(60000)).toBe('01:00.0');
    expect(formatTime(120000)).toBe('02:00.0');
    expect(formatTime(3599999)).toBe('59:59.9');
  });

  test('formats hours correctly', () => {
    expect(formatTime(3600000)).toBe('60:00.0');
    expect(formatTime(7200000)).toBe('120:00.0');
  });

  test('handles complex times correctly', () => {
    expect(formatTime(3723456)).toBe('62:03.4');
    expect(formatTime(12345678)).toBe('205:45.6');
  });
});
