import { sample } from 'effector';
import { 
  $time, 
  $isRunning, 
  $results,
  startStopwatch, 
  stopStopwatch, 
  resetStopwatch, 
  tick,
  saveResult,
  deleteResult,
  stopwatchDomain
} from './public';

$time
  .on(tick, (state) => {
    const newState = state + 100;
    console.log('Tick', newState);
    return newState;
  })
  .reset(resetStopwatch);

$isRunning
  .on(startStopwatch, () => {
    console.log('Start');
    return true;
  })
  .on(stopStopwatch, () => {
    console.log('Stop');
    return false;
  })
  .on(resetStopwatch, () => {
    console.log('Reset');
    return false;
  });

$results
  .on(saveResult, (state) => [...state, $time.getState()])
  .on(deleteResult, (state, index) => state.filter((_, i) => i !== index));

let intervalId: number | null = null;

const handleRunningChange = (isRunning: boolean) => {
  console.log('isRunning changed', isRunning);
  if (isRunning && !intervalId) {
    console.log('Creating interval');
    intervalId = window.setInterval(() => {
      console.log('Interval tick');
      tick();
    }, 100);
  } else if (!isRunning && intervalId) {
    console.log('Clearing interval');
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

// Создаем новые события для обновления состояния
const updateTime = stopwatchDomain.createEvent<number>();
const updateIsRunning = stopwatchDomain.createEvent<boolean>();
const updateResults = stopwatchDomain.createEvent<number[]>();

// Привязываем эти события к соответствующим сторам
$time.on(updateTime, (_, newTime) => newTime);
$isRunning.on(updateIsRunning, (_, newIsRunning) => newIsRunning);
$results.on(updateResults, (_, newResults) => newResults);

// Создаем новое хранилище для временной метки последнего обновления
const $lastUpdateTimestamp = stopwatchDomain.createStore(Date.now());

// Создаем событие для обновления временной метки
const updateLastUpdateTimestamp = stopwatchDomain.createEvent<number>();

// Обновляем временную метку при каждом тике
$lastUpdateTimestamp.on(tick, () => Date.now());
$lastUpdateTimestamp.on(updateLastUpdateTimestamp, (_, timestamp) => timestamp);

// Сохранение состояния в localStorage
const saveToLocalStorage = stopwatchDomain.createEffect(() => {
  const state = {
    time: $time.getState(),
    isRunning: $isRunning.getState(),
    results: $results.getState(),
    lastUpdateTimestamp: $lastUpdateTimestamp.getState(),
  };
  localStorage.setItem('stopwatchState', JSON.stringify(state));
});

// Загрузка состояния из localStorage
const loadFromLocalStorage = stopwatchDomain.createEffect(() => {
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

// Сохранение состояния при изменении
sample({
  clock: [$time, $isRunning, $results],
  target: saveToLocalStorage,
});

// Загрузка состояния при инициализации
loadFromLocalStorage();

// Обработка закрытия/открытия вкладки
window.addEventListener('beforeunload', () => {
  saveToLocalStorage();
});

window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    loadFromLocalStorage();
  }
});

console.log('Stopwatch model initialized');

// Обновляем обработчик изменения видимости вкладки
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    saveToLocalStorage();
  } else {
    loadFromLocalStorage();
  }
});