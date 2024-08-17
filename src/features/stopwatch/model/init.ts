import { sample } from 'effector';
import { 
  $time, $isRunning, $results,
  startStopwatch, stopStopwatch, resetStopwatch,
  saveResult, deleteResult
} from './public';
import { 
  tick, loadState, saveState,
  updateTime, updateResults, updateIsRunning
} from './private';

$time.on(tick, (state) => state + 100);
$time.reset(resetStopwatch);

$isRunning
  .on(startStopwatch, () => true)
  .on(stopStopwatch, () => false)
  .reset(resetStopwatch);

$results
  .on(saveResult, (state) => [...state, $time.getState()])
  .on(deleteResult, (state, index) => state.filter((_, i) => i !== index));

sample({
  clock: startStopwatch,
  target: tick
});

// Логика для запуска/остановки интервала
let intervalId: number | null = null;

sample({
  clock: $isRunning,
  fn: (isRunning) => {
    if (isRunning && !intervalId) {
      intervalId = window.setInterval(() => tick(), 100);
    } else if (!isRunning && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
});

// Логика для сохранения состояния в localStorage
sample({
  clock: [saveResult, deleteResult, stopStopwatch, resetStopwatch],
  source: { time: $time, results: $results, isRunning: $isRunning },
  target: saveState,
});

saveState.watch(state => {
  localStorage.setItem('stopwatchState', JSON.stringify(state));
});

// Логика для загрузки состояния из localStorage
loadState.watch(() => {
  const savedState = localStorage.getItem('stopwatchState');
  if (savedState) {
    const { time, results, isRunning } = JSON.parse(savedState);
    updateTime(time);
    updateResults(results);
    updateIsRunning(isRunning);
    if (isRunning) {
      startStopwatch();
    }
  }
});

// Загрузка состояния при инициализации
loadState();

// Обработка закрытия/открытия вкладки
window.addEventListener('beforeunload', () => {
  saveState();
});

window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    saveState();
  } else {
    loadState();
  }
});

// Обработка прошедшего времени при возвращении на вкладку
let lastTimestamp: number | null = null;

sample({
  clock: [startStopwatch, stopStopwatch],
  fn: () => {
    lastTimestamp = Date.now();
  },
});

sample({
  clock: loadState,
  source: $isRunning,
  fn: (isRunning) => {
    if (isRunning && lastTimestamp !== null) {
      const currentTimestamp = Date.now();
      const elapsedTime = currentTimestamp - lastTimestamp;
      updateTime($time.getState() + elapsedTime);
      lastTimestamp = currentTimestamp;
    }
  },
});