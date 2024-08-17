import React from 'react';
import { useUnit } from 'effector-react';
import { $time, $isRunning, startStopwatch, stopStopwatch, resetStopwatch } from '../../model';

const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
};

export const Stopwatch: React.FC = () => {
  const { time, isRunning, start, stop, reset } = useUnit({
    time: $time,
    isRunning: $isRunning,
    start: startStopwatch,
    stop: stopStopwatch,
    reset: resetStopwatch,
  });

  return (
    <div>
      <h2>Stopwatch</h2>
      <p>{formatTime(time)}</p>
      {!isRunning ? (
        <button onClick={() => start()}>Start</button>
      ) : (
        <button onClick={() => stop()}>Stop</button>
      )}
      <button onClick={() => reset()}>Reset</button>
    </div>
  );
};