import { sample } from 'effector';
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
} from './public';
import { loadFromLocalStorage, saveToLocalStorage } from './storage';
import {
  $lastUpdateTimestamp,
  tick,
  updateIsRunning,
  updateLastUpdateTimestamp,
  updateResults,
  updateTime,
} from './private';

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
  .on(saveResult, (state) => [...state, $time.getState()])
  .on(deleteResult, (state, index) => state.filter((_, i) => i !== index));

let intervalId: number | null = null;

const handleRunningChange = (isRunning: boolean) => {
  // создаем интервал при запуске
  if (isRunning && !intervalId) {
    intervalId = window.setInterval(() => {
      tick();
    }, 100);
    // сбрасываем интервал при остановке
  } else if (!isRunning && intervalId) {
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

// Обновляем временную метку при каждом тике
$lastUpdateTimestamp.on(tick, () => Date.now());
$lastUpdateTimestamp.on(updateLastUpdateTimestamp, (_, timestamp) => timestamp);

// Загрузка состояния при инициализации
loadFromLocalStorage();

// Обработка закрытия вкладки
window.addEventListener('beforeunload', () => {
  saveToLocalStorage();
});

// Обработка изменения видимости вкладки
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    saveToLocalStorage();
  } else if (document.visibilityState === 'visible') {
    loadFromLocalStorage();
  }
});
