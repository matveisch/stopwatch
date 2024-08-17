import { createDomain } from 'effector';

export const stopwatchDomain = createDomain('stopwatch');

export const startStopwatch = stopwatchDomain.createEvent();
export const stopStopwatch = stopwatchDomain.createEvent();
export const resetStopwatch = stopwatchDomain.createEvent();
export const tick = stopwatchDomain.createEvent();

export const $time = stopwatchDomain.createStore(0);
export const $isRunning = stopwatchDomain.createStore(false);