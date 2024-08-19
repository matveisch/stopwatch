import React from 'react';
import { useUnit } from 'effector-react';
import styled from 'styled-components';
import { ResultItemComponent } from '../parts';
import { $results, deleteResult } from '../../model/private';

const ResultsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: ${(props) => props.theme.spacing.medium} 0;
  width: 100%;
`;

export const Results: React.FC = () => {
  const [results, remove] = useUnit([$results, deleteResult]);

  return (
    <ResultsList>
      {results.map((result, index) => (
        <ResultItemComponent key={index} result={result} index={index} onDelete={remove} />
      ))}
    </ResultsList>
  );
};
