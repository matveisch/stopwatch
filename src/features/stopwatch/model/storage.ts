import { $isRunning, $results, $time, startStopwatch, stopwatchDomain } from './public';
import { updateIsRunning, updateResults, updateTime } from './private';

export const saveToLocalStorage = stopwatchDomain.createEffect(() => {
  const state = {
    time: $time.getState(),
    isRunning: $isRunning.getState(),
    results: $results.getState(),
    savedAt: Date.now(),
  };
  localStorage.setItem('stopwatchState', JSON.stringify(state));
});

// Функция для обработки загруженных данных
export const processLoadedState = (
  savedState: string | null,
  currentTime: number
): { time: number; isRunning: boolean; results: number[] } | null => {
  if (!savedState) return null;

  const { time, isRunning, results, savedAt } = JSON.parse(savedState);
  if (isRunning) {
    const elapsedTime = currentTime - savedAt;
    return {
      time: time + elapsedTime,
      isRunning,
      results,
    };
  }
  return { time, isRunning, results };
};

// Загрузка состояния из localStorage
export const loadFromLocalStorage = stopwatchDomain.createEffect(() => {
  const savedState = localStorage.getItem('stopwatchState');
  const processedState = processLoadedState(savedState, Date.now());

  if (processedState) {
    updateTime(processedState.time);
    updateIsRunning(processedState.isRunning);
    updateResults(processedState.results);

    if (processedState.isRunning) {
      startStopwatch();
    }
  }
});
