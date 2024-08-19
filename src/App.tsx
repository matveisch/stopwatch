import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './ui/theme';
import { Stopwatch } from './features/stopwatch/view/entries';
import { useUnit } from 'effector-react';
import { initializeApp } from './features/stopwatch/model/init.ts';

const App: React.FC = () => {
  const initialize = useUnit(initializeApp);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Stopwatch />
    </ThemeProvider>
  );
};

export default App;
