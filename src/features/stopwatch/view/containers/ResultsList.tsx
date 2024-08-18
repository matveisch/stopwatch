import React, { useCallback, memo } from 'react';
import { useUnit } from 'effector-react';
import styled from 'styled-components';
import { $results, deleteResult } from '../../model';
import { formatTime } from '../../../../lib/time';
import { Button } from '../parts/Button';

const ResultItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.small};
  border-bottom: 1px solid ${(props) => props.theme.colors.secondary};
`;

const ResultsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: ${(props) => props.theme.spacing.medium} 0;
  width: 100%;
`;

const ResultItemComponent: React.FC<{
  result: number;
  index: number;
  onDelete: (index: number) => void;
}> = memo(({ result, index, onDelete }) => (
  <ResultItem>
    <span>{formatTime(result)}</span>
    <Button onClick={() => onDelete(index)}>Delete</Button>
  </ResultItem>
));

export const Results: React.FC = () => {
  const [results, remove] = useUnit([$results, deleteResult]);

  const handleDelete = useCallback((index: number) => remove(index), [remove]);

  return (
    <ResultsList>
      {results.map((result, index) => (
        <ResultItemComponent key={index} result={result} index={index} onDelete={handleDelete} />
      ))}
    </ResultsList>
  );
};
