import { $isRunning, $results, $time, startStopwatch, stopwatchDomain } from "./public";
import {
  $lastUpdateTimestamp,
  updateIsRunning,
  updateLastUpdateTimestamp,
  updateResults,
  updateTime
} from "./private";

export const saveToLocalStorage = stopwatchDomain.createEffect(() => {
  const state = {
    time: $time.getState(),
    isRunning: $isRunning.getState(),
    results: $results.getState(),
    lastUpdateTimestamp: $lastUpdateTimestamp.getState(),
  };
  localStorage.setItem('stopwatchState', JSON.stringify(state));
});

// Загрузка состояния из localStorage
export const loadFromLocalStorage = stopwatchDomain.createEffect(() => {
  const savedState = localStorage.getItem('stopwatchState');
  if (savedState) {
    const { time, isRunning, results, lastUpdateTimestamp } = JSON.parse(savedState);

    if (isRunning) {
      const currentTimestamp = Date.now();
      const elapsedTime = currentTimestamp - lastUpdateTimestamp;
      const newTime = time + elapsedTime;
      updateTime(newTime);
      updateLastUpdateTimestamp(currentTimestamp);
    } else {
      updateTime(time);
      updateLastUpdateTimestamp(lastUpdateTimestamp);
    }

    updateIsRunning(isRunning);
    updateResults(results);

    if (isRunning) {
      startStopwatch();
    }
  }
});
