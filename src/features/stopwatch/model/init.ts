import { sample } from 'effector';
import { 
  $time, 
  $isRunning, 
  startStopwatch, 
  stopStopwatch, 
  resetStopwatch, 
  tick,
  stopwatchDomain // добавьте этот импорт
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

console.log('Stopwatch model initialized');