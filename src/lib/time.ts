export const formatTime = (timeInMs: number): string => {
  const minutes = Math.floor(timeInMs / 60000);
  const seconds = Math.floor((timeInMs % 60000) / 1000);
  const milliseconds = Math.floor((timeInMs % 1000) / 100);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
};