import { createEffect, sample } from 'effector';
import {
  $isRunning,
  $results,
  $time,
  deleteResult,
  resetStopwatch,
  saveResult,
  startStopwatch,
  stopStopwatch,
  stopwatchDomain,
  triggerSaveResult,
} from './private';
import { loadFromLocalStorage, saveToLocalStorage } from './storage';
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

// Обработка изменения видимости вкладки
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    saveToLocalStorage();
  } else if (document.visibilityState === 'visible') {
    loadFromLocalStorage();
  }
});

// Обработка закрытия вкладки
window.addEventListener('beforeunload', () => {
  saveToLocalStorage();
});

export const initializeApp = createEffect(() => {
  loadFromLocalStorage();
});
