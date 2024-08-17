import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './ui/theme';
import { Stopwatch } from './features/stopwatch/view';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Stopwatch />
    </ThemeProvider>
  );
};

export default App;
