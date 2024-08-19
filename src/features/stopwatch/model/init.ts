import { createEffect, sample } from 'effector';
import {
  $isRunning,
  $results,
  $time,
  deleteResult,
  resetStopwatch,
  saveResult,
  saveState,
  startStopwatch,
  stopStopwatch,
  stopwatchDomain,
  triggerSaveResult,
} from './private';
import { tick, updateIsRunning, updateResults, updateTime } from './private';

$time
  // на каждом тике увеличиваем время на 100
  .on(tick, (state) => {
    return state + 100;
  })
  // сбрасываем время при вызове resetStopwatch
  .reset(resetStopwatch);

$isRunning
  .on(startStopwatch, () => {
    return true;
  })
  .on(stopStopwatch, () => {
    return false;
  })
  .on(resetStopwatch, () => {
    return false;
  });

$results
  .on(saveResult, (state, newResult) => [...state, newResult])
  .on(deleteResult, (state, index) => state.filter((_, i) => i !== index));

sample({
  clock: triggerSaveResult,
  source: $time,
  target: saveResult,
});

let intervalId: number | null = null;

const handleRunningChange = (isRunning: boolean) => {
  // создаем интервал при запуске
  if (isRunning && intervalId === null) {
    intervalId = window.setInterval(() => {
      tick();
    }, 100);
  } else if (!isRunning && intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const runningChangeEffect = stopwatchDomain.createEffect((isRunning: boolean) => {
  handleRunningChange(isRunning);
});

sample({
  clock: $isRunning,
  target: runningChangeEffect,
});

// Привязываем эти события к соответствующим сторам
$time.on(updateTime, (_, newTime) => newTime);
$isRunning.on(updateIsRunning, (_, newIsRunning) => newIsRunning);
$results.on(updateResults, (_, newResults) => newResults);

export const saveToLocalStorage = stopwatchDomain.createEffect(
  (state: { time: number; isRunning: boolean; results: number[]; savedAt: number }) => {
    localStorage.setItem('stopwatchState', JSON.stringify(state));
  }
);

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

// Сохранение состояния
sample({
  clock: saveState,
  source: {
    time: $time,
    isRunning: $isRunning,
    results: $results,
  },
  fn: (state) => ({
    ...state,
    savedAt: Date.now(),
  }),
  target: saveToLocalStorage,
});

// Обработка изменения видимости вкладки
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    saveState();
  } else if (document.visibilityState === 'visible') {
    loadFromLocalStorage();
  }
});

// Обработка закрытия вкладки
window.addEventListener('beforeunload', () => {
  saveState();
});

export const initializeApp = createEffect(() => {
  loadFromLocalStorage();
});
