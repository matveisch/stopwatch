import React from 'react';
import { useUnit } from 'effector-react';
import { $isRunning, startStopwatch, stopStopwatch, resetStopwatch, saveResult } from '../../model';
import { Button } from '../parts/Button';

export const StopwatchControls: React.FC = () => {
  const { isRunning, start, stop, reset, save } = useUnit({
    isRunning: $isRunning,
    start: startStopwatch,
    stop: stopStopwatch,
    reset: resetStopwatch,
    save: saveResult,
  });

  return (
    <div>
      {!isRunning ? <Button onClick={start}>Start</Button> : <Button onClick={stop}>Stop</Button>}
      <Button onClick={reset}>Reset</Button>
      <Button onClick={save}>Save Result</Button>
    </div>
  );
};
