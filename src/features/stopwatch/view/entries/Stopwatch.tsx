import React from 'react';
import { useUnit } from 'effector-react';
import { $time, $isRunning, $results, startStopwatch, stopStopwatch, resetStopwatch, saveResult, deleteResult } from '../../model';

const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 100); // Изменено здесь
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
};

export const Stopwatch: React.FC = () => {
  const { time, isRunning, results, start, stop, reset, save, remove } = useUnit({
    time: $time,
    isRunning: $isRunning,
    results: $results,
    start: startStopwatch,
    stop: stopStopwatch,
    reset: resetStopwatch,
    save: saveResult,
    remove: deleteResult,
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
      <button onClick={() => save()}>Save Result</button>
      
      <h3>Results:</h3>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            {formatTime(result)}
            <button onClick={() => remove(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};