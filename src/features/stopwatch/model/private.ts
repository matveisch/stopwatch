import { stopwatchDomain } from './public';

export const tick = stopwatchDomain.createEvent();
export const loadState = stopwatchDomain.createEvent();
export const saveState = stopwatchDomain.createEvent();

export const updateTime = stopwatchDomain.createEvent<number>();
export const updateResults = stopwatchDomain.createEvent<number[]>();
export const updateIsRunning = stopwatchDomain.createEvent<boolean>();

// Создаем событие для обновления временной метки
export const updateLastUpdateTimestamp = stopwatchDomain.createEvent<number>();
// Создаем новое хранилище для временной метки последнего обновления
export const $lastUpdateTimestamp = stopwatchDomain.createStore(Date.now());
