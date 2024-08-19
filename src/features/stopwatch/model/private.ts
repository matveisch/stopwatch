import { stopwatchDomain } from './public';

export const tick = stopwatchDomain.createEvent();

export const updateTime = stopwatchDomain.createEvent<number>();
export const updateResults = stopwatchDomain.createEvent<number[]>();
export const updateIsRunning = stopwatchDomain.createEvent<boolean>();
