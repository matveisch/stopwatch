import React from 'react';
import { useUnit } from 'effector-react';
import { $time } from '../../model';
import { Display } from '../parts/Display';
import { formatTime } from '../../../../lib/time';

export const StopwatchDisplay: React.FC = () => {
  const time = useUnit($time);
  return <Display>{formatTime(time)}</Display>;
};
