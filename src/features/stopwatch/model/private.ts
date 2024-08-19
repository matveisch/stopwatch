import { createDomain } from 'effector';

export const stopwatchDomain = createDomain('stopwatch');

export const tick = stopwatchDomain.createEvent();

export const startStopwatch = stopwatchDomain.createEvent();
export const stopStopwatch = stopwatchDomain.createEvent();
export const resetStopwatch = stopwatchDomain.createEvent();
export const saveResult = stopwatchDomain.createEvent<number>();
export const triggerSaveResult = stopwatchDomain.createEvent();
export const deleteResult = stopwatchDomain.createEvent<number>();
export const saveState = stopwatchDomain.createEvent();

export const updateTime = stopwatchDomain.createEvent<number>();
export const updateResults = stopwatchDomain.createEvent<number[]>();
export const updateIsRunning = stopwatchDomain.createEvent<boolean>();

export const $time = stopwatchDomain.createStore(0);
export const $isRunning = stopwatchDomain.createStore(false);
export const $results = stopwatchDomain.createStore<number[]>([]);
