import React from 'react';
import { useUnit } from 'effector-react';
import styled from 'styled-components';
import { $results, deleteResult } from '../../model';
import { formatTime } from '../../../../lib/time';
import { Button } from '../parts/Button';

const ResultItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${props => props.theme.spacing.small};
    border-bottom: 1px solid ${props => props.theme.colors.secondary};
`;

const ResultsList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: ${props => props.theme.spacing.medium} 0;
    width: 100%;
`;

export const Results: React.FC = () => {
  const [results, remove] = useUnit([$results, deleteResult]);

  return (
    <ResultsList>
      {results.map((result, index) => (
        <ResultItem key={index}>
          <span>{formatTime(result)}</span>
          <Button onClick={() => remove(index)}>Delete</Button>
        </ResultItem>
      ))}
    </ResultsList>
  );
};
