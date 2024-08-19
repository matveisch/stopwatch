import React from 'react';
import { useUnit } from 'effector-react';
import { $time } from '../../model/private';
import { Display } from '../parts';
import { formatTime } from '../../../../lib/time';

export const StopwatchDisplay: React.FC = () => {
  const time = useUnit($time);
  return <Display>{formatTime(time)}</Display>;
};
