import { $isRunning, $results, $time, startStopwatch, stopwatchDomain } from './public';
import {
  $lastUpdateTimestamp,
  updateIsRunning,
  updateLastUpdateTimestamp,
  updateResults,
  updateTime,
} from './private';

export const saveToLocalStorage = stopwatchDomain.createEffect(() => {
  const state = {
    time: $time.getState(),
    isRunning: $isRunning.getState(),
    results: $results.getState(),
    lastUpdateTimestamp: $lastUpdateTimestamp.getState(),
  };
  localStorage.setItem('stopwatchState', JSON.stringify(state));
});

// Функция для обработки загруженных данных
export const processLoadedState = (
  savedState: string | null,
  currentTime: number
): { time: number; isRunning: boolean; results: number[]; lastUpdateTimestamp: number } | null => {
  if (!savedState) return null;

  const { time, isRunning, results, lastUpdateTimestamp } = JSON.parse(savedState);
  if (isRunning) {
    const elapsedTime = currentTime - lastUpdateTimestamp;
    return {
      time: time + elapsedTime,
      isRunning,
      results,
      lastUpdateTimestamp: currentTime,
    };
  }
  return { time, isRunning, results, lastUpdateTimestamp };
};

// Загрузка состояния из localStorage
export const loadFromLocalStorage = stopwatchDomain.createEffect(() => {
  const savedState = localStorage.getItem('stopwatchState');
  const processedState = processLoadedState(savedState, Date.now());

  if (processedState) {
    updateTime(processedState.time);
    updateIsRunning(processedState.isRunning);
    updateResults(processedState.results);
    updateLastUpdateTimestamp(processedState.lastUpdateTimestamp);
    if (processedState.isRunning) {
      startStopwatch();
    }
  }
});
