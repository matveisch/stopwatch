import { processLoadedState } from './init';

describe('processLoadedState', () => {
  it('should return null when savedState is null', () => {
    const result = processLoadedState(null, 1000);
    expect(result).toBeNull();
  });

  it('should return the same state when isRunning is false', () => {
    const savedState = JSON.stringify({
      time: 5000,
      isRunning: false,
      results: [1000, 2000],
      savedAt: 900,
    });
    const result = processLoadedState(savedState, 1000);
    expect(result).toEqual({
      time: 5000,
      isRunning: false,
      results: [1000, 2000],
    });
  });

  it('should update time when isRunning is true', () => {
    const savedState = JSON.stringify({
      time: 5000,
      isRunning: true,
      results: [1000, 2000],
      savedAt: 900,
    });
    const currentTime = 1100;
    const result = processLoadedState(savedState, currentTime);
    expect(result).toEqual({
      time: 5200, // 5000 + (1100 - 900)
      isRunning: true,
      results: [1000, 2000],
    });
  });

  it('should handle empty results array', () => {
    const savedState = JSON.stringify({
      time: 3000,
      isRunning: true,
      results: [],
      savedAt: 2000,
    });
    const currentTime = 2500;
    const result = processLoadedState(savedState, currentTime);
    expect(result).toEqual({
      time: 3500,
      isRunning: true,
      results: [],
    });
  });

  it('should handle invalid JSON', () => {
    const savedState = 'invalid JSON';
    expect(() => processLoadedState(savedState, 1000)).toThrow();
  });

  it('should not change time when isRunning is false, even if currentTime is different', () => {
    const savedState = JSON.stringify({
      time: 5000,
      isRunning: false,
      results: [1000, 2000],
      savedAt: 900,
    });
    const currentTime = 2000;
    const result = processLoadedState(savedState, currentTime);
    expect(result).toEqual({
      time: 5000,
      isRunning: false,
      results: [1000, 2000],
    });
  });
});
