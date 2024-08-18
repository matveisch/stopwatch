import React from 'react';
import styled from 'styled-components';
import { StopwatchDisplay } from '../containers/StopwatchDisplay';
import { StopwatchControls } from '../containers/StopwatchControls';
import { Results } from '../containers/ResultsList';

const StopwatchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.spacing.large};
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
`;

export const Stopwatch: React.FC = () => {
  return (
    <StopwatchContainer>
      <StopwatchDisplay />
      <StopwatchControls />
      <Results />
    </StopwatchContainer>
  );
};
